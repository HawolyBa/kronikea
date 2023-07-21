import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Form, Input, Select, Radio, Divider, Spin, Tooltip, Alert } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/query'
import { BsFillInfoCircleFill } from 'react-icons/bs'

import { useAuth } from '../../database/auth'
import { useGetUserCharactersQuery } from '../../database/reducers/characters'
import { useAddStoryMutation } from '../../database/reducers/stories'
import { CATEGORIES, LANGUAGES, COPYRIGHTS } from '../../utils/constants'
import { capitalize } from '../../utils/helpers'

import UploadImage from '../../components/common/UploadImage'
import Button from '../../components/common/Button'

const { Option } = Select;

const AddStory = () => {

  const auth = useAuth()
  const [image, setImage] = React.useState('')
  const { t } = useTranslation();
  const { push, locale } = useRouter()
  const [form] = Form.useForm();
  const { data, isLoading } = useGetUserCharactersQuery({ id: auth?.user?.uid, type: "newStory" } ?? skipToken, { refetchOnMountOrArgChange: true });
  const [addStory] = useAddStoryMutation()
  const isSending = React.useRef(false);

  const onFinish = async values => {
    if (auth?.user?.emailVerified) {
      isSending.current = true;

      await addStory({
        ...values,
        banner: typeof form.getFieldValue('banner') === null ? '' : form.getFieldValue('banner'),
        userImage: auth.user.image,
        authorName: auth?.user?.username,
      }).unwrap()
        .then((storyId) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          push(`/story/${storyId?.storyId}`)
        })
        .catch(err => isSending.current = false)
    }
  }
  const options = []

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  React.useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      push('/unauthorized')
    }
  }, [auth])

  const alphaCat = CATEGORIES.sort((a, b) => a.value.localeCompare(b.value, locale))

  const labelInfo = <>
    <b>{`${t('common:all-rights-reserved')}`}</b>: {`${t('common:all-rights-reserved-text')}`}<br />
    <b>{`${t('common:creative-commons')}`}</b>: {`${t('common:creative-commons-text')}`}<br />
    <b>{`${t('common:public-domain')}`}</b>: {`${t('common:public-domain-text')}`}<br />
    <b>{`${t('common:copyleft')}`}</b>: {`${t('common:copyleft-text')}
    `}</>

  return (
    <>
      <Head>
        <title>{t('form:add-story').charAt(0).toUpperCase() + t('form:add-story').slice(1)} - Kronikea</title>
      </Head>

      <div className="add__story custom__form p-4 w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
          <Spin spinning={isSending.current || auth.isLoading || isLoading}>
            <h2 className='text-2xl text-center tracking-widest uppercase mb-6'>{t('form:add-story')}</h2>
            {auth?.user?.emailVerified ? <Form name="addStory"
              layout='vertical'
              form={form}
              style={{ maxWidth: "100%" }}
              initialValues={{
                title: '',
                categories: [],
                summary: '',
                language: '',
                copyright: "",
                mainCharacters: [],
                banner: "",
                mature: false,
                public: true,
                tags: []
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
                        max: 6,
                        message: t('form:error-main'),
                        type: "array",
                      },
                    ]}
                  >
                    <Select mode="multiple"
                      allowClear>
                      {data?.map((chara) => (
                        <Option value={chara.id} key={chara.id}>
                          {`${chara.firstname} ${chara.lastname}`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div>
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
              <div>
                <Form.Item label={capitalize(t('form:add-image'))}>
                  <UploadImage
                    setImage={setImage}
                    name="banner"
                    image={""}
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
                <div className="md:w-1/4 w-full md:mr-3 capitalize">
                  <Form.Item
                    label={t('common:explicit')}
                    name="mature"
                  >
                    <Radio.Group name="mature">
                      <Radio value={false}>{t('common:no')}</Radio>
                      <Radio value={true}>{t('common:yes')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div className="md:w-1/4 w-full capitalize">
                  <Form.Item
                    label={t('form:visibility')}
                    name="public"
                  >
                    <Radio.Group buttonStyle="solid" name="public">
                      <Radio value={true}>{t('form:public')}</Radio>
                      <Radio value={false}>{t('form:private')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-end">
                <Button color="bg-primary" type="submit">
                  {t('form:post')}
                </Button>
              </div>
            </Form>
              : <Alert message={t('story:verify-story')} type="error" showIcon action={
                <Link href='/auth/verify'>
                  <Button textColor="text-slate-50" color="bg-secondary">
                    {t('common:verify-now')}
                  </Button>
                </Link>
              } />}
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

export default AddStory