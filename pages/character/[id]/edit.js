import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Form, Input, Divider, InputNumber, Select, Spin, Popconfirm, Radio } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/query'

import { useAuth } from '../../../database/auth'
import { capitalize } from '../../../utils/helpers'
import { useEditCharacterMutation, useGetCharacterQuery, useGetUserCharactersQuery, useDeleteCharacterMutation } from '../../../database/reducers/characters'

import UploadImage from '../../../components/common/UploadImage'
import Relatives from '../../../components/forms/Relatives'

const EditCharacter = () => {
  const auth = useAuth()
  const { push, query } = useRouter()
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [image, setImage] = React.useState('')
  const { data: characters } = useGetUserCharactersQuery({ id: auth?.user?.uid, type: "newStory" } ?? skipToken, { refetchOnMountOrArgChange: true });
  const [editCharacter] = useEditCharacterMutation()
  const [deleteCharacter] = useDeleteCharacterMutation()
  const { data, isLoading } = useGetCharacterQuery({ id: query.id, type: "edit" }, { refetchOnMountOrArgChange: true })
  const isSending = React.useRef(false);

  const onFinish = async values => {
    if (auth.user.emailVerified) {
      isSending.current = true;
      await editCharacter({
        id: query.id, data: {
          ...values,
          authorId: data?.character?.authorId,
          image: typeof form.getFieldValue('image') === null ? '' : form.getFieldValue('image'),
          relatives: form.getFieldValue('relatives'),
          relativesArr: form.getFieldValue('relatives').map((c) => c.character_id),
        }
      }).unwrap()
        .then(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          setTimeout(() => { push(`/character/${query.id}`) }, 2000)
        })
        .catch(err => {
          console.log(err)
          isSending.current = false
        })
    }
  }

  const triggerDelete = () => {
    deleteCharacter(query.id)
      .unwrap()
      .then(res => {
        if (res) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          isSending.current = true
          push(`/profile`)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const options = [];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  React.useEffect(() => {
    if (data && data.character) {
      form.resetFields()
      if (!data?.charaExists) {
        push('/404')
      }
    }
  }, [data])

  React.useEffect(() => {
    if (!auth.isLoading && !isLoading && (!auth.user || auth.user.uid !== data?.character.authorId)) {
      push('/unauthorized')
    }
  }, [auth, data, isLoading])

  return (
    <>
      <Head>
        <title>{capitalize(t('form:edit-character'))}</title>
      </Head>
      <div className="add__character custom__form p-4 w-full">
        <div className="bg-white shadow-lg dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
          <Spin spinning={isSending.current || auth.isLoading || auth?.user?.uid !== data?.character?.authorId || !auth.user || isLoading || !data?.charaExists}>
            <h2 className='text-2xl text-center tracking-widest uppercase mb-6'>{t('form:edit-character')}</h2>
            <Form name="addCharacter"
              layout='vertical'
              form={form}
              style={{ maxWidth: "100%" }}
              initialValues={{
                firstname: data?.character?.firstname || '',
                lastname: data?.character?.lastname || '',
                age: data?.character?.age || '',
                gender: data?.character?.gender || '',
                location: data?.character?.location || '',
                group: data?.character?.group || '',
                occupation: data?.character?.occupation || '',
                ethnicity: data?.character?.ethnicity || '',
                likes: data?.character?.likes || [],
                dislikes: data?.character?.dislikes || [],
                image: data?.character?.image || '',
                description: data?.character?.description || '',
                birthday: data?.character?.birthday || '',
                astrological: data?.character?.astrological || '',
                relatives: data?.character?.relatives || [],
                public: data?.character?.public
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <div className="md:flex">
                <div className="md:w-1/2 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:firstname'))}
                    name="firstname"
                    rules={[{ required: true, message: 'Please input a firstname' }, { max: 30, message: t('form:error-characters') },]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/2 w-full">
                  <Form.Item
                    label={capitalize(t('form:lastname'))}
                    name="lastname"
                    rules={[{ max: 30, message: t('form:error-characters') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:age'))}
                    name="age"
                  // rules={[{ min: 0, message: t('form:error-age') }]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </div>
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:gender'))}
                    name="gender"
                    rules={[{ required: true, message: t('form:error-gender') }]}
                  >
                    <Select options={[
                      { label: capitalize(t('form:male')), value: 'male' },
                      { label: capitalize(t('form:female')), value: 'female' },
                      { label: capitalize(t('form:other')), value: 'other' }
                    ]} />
                  </Form.Item>
                </div>
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:location'))}
                    name="location"
                    rules={[{ max: 30, message: t('form:error-characters') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:group'))}
                    name="group"
                    rules={[{ max: 30, message: t('form:error-characters') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:occupation'))}
                    name="occupation"
                    rules={[{ max: 30, message: t('form:error-characters') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/3 w-full md:mr-3">
                  <Form.Item
                    label={capitalize(t('form:ethnicity'))}
                    name="ethnicity"
                    rules={[{ max: 30, message: t('form:error-characters') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/2 md:mr-3">
                  <Form.Item
                    label={capitalize(t('character:birthday'))}
                    name="birthday"
                    rules={[{ max: 30, message: t('form:error-birthday') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/2">
                  <Form.Item
                    label={capitalize(t('character:astrological'))}
                    name="astrological"
                    rules={[{ max: 30, message: t('form:error-astro') }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:w-1/2 w-full md:mr-3">
                  <Form.Item rules={[{ type: 'array', max: 5, message: t('form:error-likes') }
                  ]} label={capitalize(t('form:likes'))}
                    name="likes">
                    <Select
                      mode="tags"
                      style={{
                        width: '100%',
                      }}
                      placeholder="Add and press 'enter'"
                      onChange={handleChange}
                      options={options}
                    />
                  </Form.Item>
                </div>
                <div className="md:w-1/2 w-full">
                  <Form.Item rules={[{ type: 'array', max: 5, message: t('form:error-likes') }]} label={capitalize(t('form:dislikes'))}
                    name="dislikes">
                    <Select
                      mode="tags"
                      style={{
                        width: '100%',
                      }}
                      placeholder="Add and press 'enter'"
                      onChange={handleChange}
                      options={options}
                    />
                  </Form.Item>
                </div>
              </div>
              <Form.Item label="Description"
                name={t('form:description')}
                rules={[{ max: 210, message: t('form:error-description') }]}>
                <Input.TextArea />
              </Form.Item>
              <Divider className="dark:border-stone-700" />
              {characters && <Relatives
                character={data?.character || null}
                form={form}
                characters={characters}
                capitalize={capitalize}
                t={t}
              />}
              <Divider className="dark:border-stone-700" />
              <Form.Item label={capitalize(t('form:add-image'))}>
                <UploadImage
                  name="image"
                  setImage={setImage}
                  image={data?.character?.image}
                  t={t}
                  shape="rect"
                  type="picture-card"
                  aspect={300 / 400}
                  form={form}
                />
              </Form.Item>
              <div className='capitalize'>
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
              <div className="flex justify-between">
                <Popconfirm
                  title={t('form:delete-character')}
                  description={t('form:delete-explain')}
                  onConfirm={triggerDelete}
                  okText={t('common:yes')}
                  cancelText={t('common:no')}
                >
                  <button type="button" className="rounded-sm active:scale-95 text-xs mt-3 text-red-500 py-2 px-3 md:w-fit w-full tracking-widest uppercase">{t('form:delete')}</button>
                </Popconfirm>
                <button type="submit" className="mt-3 text-slate-50 py-2 px-4 rounded-sm text-xs active:scale-95 bg-primary md:w-fit w-full tracking-widest uppercase">{t('form:save-changes')}</button>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "common", 'character']))
    }
  }
}

export const getStaticPaths = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default EditCharacter

