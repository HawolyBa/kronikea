import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Form, Input, Select, Radio, Divider, Spin, Alert, Popconfirm, Tooltip } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/query'
import { BsFillInfoCircleFill } from 'react-icons/bs'

import { useAuth } from '../../../database/auth'
import { useGetUserCharactersQuery } from '../../../database/reducers/characters'
import { useDeleteStoryMutation, useEditStoryMutation, useGetStoryOnlyQuery } from '../../../database/reducers/stories'
import { CATEGORIES, LANGUAGES, COPYRIGHTS, STATUS } from '../../../utils/constants'

import UploadImage from '../../../components/common/UploadImage'
import Button from '../../../components/common/Button'
import { capitalize } from '../../../utils/helpers'


const { Option } = Select;

const EditStory = () => {

  const auth = useAuth()
  const { t } = useTranslation();
  const { push, query, locale } = useRouter()
  const [form] = Form.useForm();
  const { data: characters } = useGetUserCharactersQuery({ id: auth?.user?.uid, type: "newStory" } ?? skipToken, { refetchOnMountOrArgChange: true });
  const { data, isLoading, error } = useGetStoryOnlyQuery(query.id ?? skipToken);
  const [message, setMessage] = React.useState('')
  const [banner, setBanner] = React.useState('')
  const [changed, setChanged] = React.useState(false)
  const [editStory] = useEditStoryMutation()
  const [deleteStory] = useDeleteStoryMutation()
  const isSending = React.useRef(false);
  const updated = React.useRef(false);

  const onFinish = async values => {
    if (auth.user.emailVerified) {
      isSending.current = true;
      await editStory({
        id: query.id, data: {
          ...values,
          authorId: data?.story?.authorId,
          banner: typeof form.getFieldValue('banner') === null ? '' : form.getFieldValue('banner'),
        }
      }).unwrap()
        .then((res) => {
          setChanged(false)
          setMessage(res.message)
          updated.current = true
          isSending.current = false;
        })
        .catch(err => {
          isSending.current = false;
          updated.current = false
        })
    }
  }

  const options = []

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = values => {

  }
  const onFieldsChange = values => {
    setChanged(true)
    setMessage('')
    updated.current = false
  }

  const triggerDelete = () => {
    deleteStory(query.id)
      .unwrap()
      .then(res => {
        if (res.message) {
          push(`/profile`)
        }
      }).catch(err => {
        console.log(err)
      })
  }


  React.useEffect(() => {
    if (banner) setChanged(true)
  }, [banner])

  React.useEffect(() => {
    if (!isLoading && data?.story) {
      form.resetFields()
      form.setFieldValue({ banner: data?.story?.banner })
    }
  }, [data?.story, isLoading])

  React.useEffect(() => {
    if ((!auth.isLoading && !auth.user) || (!auth.isLoading && !isLoading && auth.user && auth.user.uid !== data?.story?.authorId)) {
      push('/unauthorized')
    }
  }, [auth, data, isLoading])

  React.useEffect(() => {
    if (!isLoading && error === 'Story not found') {
      push('/404')
    }
  }, [error])

  const labelInfo = <>
    <b>{`${t('common:all-rights-reserved')}`}</b>: {`${t('common:all-rights-reserved-text')}`}<br />
    <b>{`${t('common:creative-commons')}`}</b>: {`${t('common:creative-commons-text')}`}<br />
    <b>{`${t('common:public-domain')}`}</b>: {`${t('common:public-domain-text')}`}<br />
    <b>{`${t('common:copyleft')}`}</b>: {`${t('common:copyleft-text')}
    `}</>


  const alphaCat = CATEGORIES.sort((a, b) => a.value.localeCompare(b.value, locale))

  return (
    <>
      <Head>
        <title>{t('form:edit-story').charAt(0).toUpperCase() + t('form:edit-story').slice(1)} - Kronikea</title>
      </Head>
      <div className="add__story custom__form p-4 w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
          <Spin spinning={isSending.current || error || auth.isLoading || isLoading || (!auth.isLoading && !auth.user) || (!auth.isLoading && !isLoading && auth.user && auth.user.uid !== data?.story?.authorId)}>
            <h2 className='text-2xl text-center tracking-widest uppercase mb-6'>{t('form:edit-story')}</h2>
            <p className='text-center text-base my-5 capitalize'>{t('common:story')}: <Link className='underline' href={`/story/${data?.story?.id}`}>{data?.story?.title}</Link></p>
            <Form name="editStory"
              layout='vertical'
              form={form}
              onFieldsChange={onFieldsChange}
              onValuesChange={onValuesChange}
              style={{ maxWidth: "100%" }}
              initialValues={{
                status: data?.story?.status,
                title: data?.story?.title,
                categories: data?.story?.categories,
                summary: data?.story?.summary,
                language: data?.story?.language,
                copyright: data?.story?.copyright,
                mainCharacters: data?.story?.mainCharacters,
                banner: data?.story?.banner,
                mature: data?.story?.mature,
                public: data?.story?.public,
                tags: data?.story?.tags,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <div className="md:flex">
                <div className="md:w-2/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:title'))}
                    name="title"
                    rules={[{ required: true, message: t('form:error-title') }, { max: 65 },]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/3 w-full">
                  <Form.Item
                    label={capitalize(t('form:categories'))}
                    name="categories"
                    rules={[{
                      required: true, message: t('form:error-categories')
                    }, {
                      max: 2,
                      type: "array",
                      message: t('form:error-categories-len'),
                    }]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Please select"
                    >
                      {alphaCat.map(c => (
                        <Option key={c.value} value={c.value} label={c.value}>
                          {capitalize(t(`common:${c.value}`))}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className=''>
                <Form.Item name="summary" label={capitalize(t('form:summary'))} rules={[{ required: true, message: t('form:error-summary') }, { max: 440, message: t('form:error-description') }]}>
                  <Input.TextArea />
                </Form.Item>
              </div>
              <div className="md:flex">
                <div className="md:w-1/4 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:language'))}
                    name="language"
                    rules={[{ required: true, message: t('form:error-language') }]}
                  >
                    <Select
                      showSearch
                      options={LANGUAGES.map(l => ({
                        value: l.value,
                        label: l.name,
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </div>
                <div className="md:w-1/4 w-full md:mr-3">
                  <Form.Item
                    name="copyright"
                    label={<>Copyright <Tooltip placement='bottom' title={labelInfo}>
                      <span className='ml-2'><BsFillInfoCircleFill /></span>
                    </Tooltip></>}
                    rules={[
                      {
                        required: true,
                        message: t('form:error-copyright'),
                      },
                    ]}
                  >
                    <Select>
                      {COPYRIGHTS.map((copy) => (
                        <Option value={copy.value} key={copy.value}>
                          {t(`common:${copy.value.split(' ').join('-')}`)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="md:w-2/4 w-full">
                  <Form.Item
                    name="mainCharacters"
                    label={capitalize(t('story:main'))}
                    rules={[
                      {
                        max: 4,
                        message: t('form:error-main'),
                        type: "array",
                      },
                    ]}
                  >
                    <Select mode="multiple"
                      allowClear>
                      {characters?.map((chara) => (
                        <Option value={chara.id} key={chara.id}>
                          {`${chara.firstname} ${chara.lastname}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className='md:flex'>
                <div className='md:w-1/4 md:mr-3 w-full'>
                  <Form.Item name="status" label={capitalize(t('form:status'))} rules={[
                    {
                      required: true,
                      message: t('form:error-status'),
                    },
                  ]}>
                    <Select>
                      {STATUS.map((s) => (
                        <Option value={s.value} key={s.value}>
                          {t(`common:${s.value.split(' ').join('-')}`)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='md:w-3/4 w-full'>
                  <Form.Item rules={[{ type: 'array', max: 5, message: t('form:error-likes') }
                  ]} name="tags" label="Tags">
                    <Select
                      mode="tags"
                      style={{
                        width: '100%',
                      }}
                      placeholder={t('form:press-enter')}
                      options={options}
                    />
                  </Form.Item>
                </div>
              </div>
              <div>
                <Form.Item label={capitalize(t('form:add-image'))}>
                  <UploadImage
                    setImage={setBanner}
                    name="banner"
                    image={data?.story?.banner}
                    t={t}
                    shape="rect"
                    type="picture-card"
                    aspect={300 / 450}
                    form={form}
                  />
                </Form.Item>
              </div>
              <Divider className="dark:border-stone-700" />
              <div className="md:flex">
                <div className="md:w-1/4 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('common:explicit'))}
                    name="mature"
                  >
                    <Radio.Group name="mature">
                      <Radio value={false}>{t('common:no')}</Radio>
                      <Radio value={true}>{t('common:yes')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div className="md:w-1/4 w-full">
                  <Form.Item
                    label={capitalize(t('form:visibility'))}
                    name="public"
                  >
                    <Radio.Group buttonStyle="solid" name="public">
                      <Radio value={true}>{capitalize(t('form:public'))}</Radio>
                      <Radio value={false}>{capitalize(t('form:private'))}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>

              {!isSending.current && updated.current && <Alert message={message} type='success' />}
              <div className="flex md:justify-between md:flex-row flex-col mt-3">
                <div className='order-2 md:order-1'>
                  <Popconfirm
                    title={t('form:delete-story')}
                    description={t('form:delete-story-confirm')}
                    onConfirm={triggerDelete}
                    okText={t('common:yes')}
                    cancelText={t('common:no')}
                  >
                    <>
                      <Button type="button" textColor="text-red-500">
                        {t('form:delete')}
                      </Button>
                    </>
                  </Popconfirm>
                </div>
                <div className='md:order-2 order-1 mb-3 md:mb-0'>
                  <Button disabled={!changed} color="bg-primary" type="submit">
                    {t('form:save-changes')}
                  </Button>
                </div>
              </div>
            </Form>
          </Spin>
        </div >
      </div >
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "story", "common"]))
    }
  }
}

export const getStaticPaths = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default EditStory