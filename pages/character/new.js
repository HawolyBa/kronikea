import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Form, Input, Divider, InputNumber, Select, Spin, Radio, Alert } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/query'

import { useAuth } from '../../database/auth'
import { useAddCharacterMutation, useGetUserCharactersQuery } from '../../database/reducers/characters'

import UploadImage from '../../components/common/UploadImage'
import Button from '../../components/common/Button'
import Relatives from '../../components/forms/Relatives'
import { capitalize } from '../../utils/helpers'

const AddCharacter = () => {

  const auth = useAuth()
  const { push } = useRouter()
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [image, setImage] = React.useState('')
  const { data, isLoading } = useGetUserCharactersQuery({ id: auth?.user?.uid, type: "newStory" } ?? skipToken, { refetchOnMountOrArgChange: true });
  const [addCharacter] = useAddCharacterMutation()
  const character = null

  const isSending = React.useRef(false);

  const onFinish = async values => {
    isSending.current = true;
    if (auth.user.emailVerified) {
      await addCharacter({
        ...values,
        image: typeof form.getFieldValue('image') === null ? '' : form.getFieldValue('image'),
        relatives: form.getFieldValue('relatives') ? form.getFieldValue('relatives') : [],
        authorName: auth?.user?.username,
        relativesArr: form.getFieldValue('relatives') ? form.getFieldValue('relatives').map((c) => c.character_id) : [],
        userImage: auth.user.image ? auth.user.image : "",
      }).unwrap()
        .then((res) => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          push(`/character/${res?.charaId}`)
        })
        .catch(err => isSending.current = false)
    }
  }

  const onFinishFailed = errorInfo => {
    console.log(form.getFieldValue('relatives'))
    console.log('Failed:', errorInfo)
  }

  const options = [];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  React.useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      push('/unauthorized')
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>{capitalize(t('form:add-character'))}</title>
      </Head>
      <div className="add__character custom__form p-4 w-full">
        <div className="bg-white shadow-lg dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
          <Spin spinning={auth.isLoading || !auth.user || isLoading || isSending.current}>
            <h2 className='text-2xl text-center tracking-widest uppercase mb-6'>{t('form:add-character')}</h2>
            {auth?.user?.emailVerified ? <Form name="addCharacter"
              layout='vertical'
              style={{ maxWidth: "100%" }}
              initialValues={{
                firstname: '',
                lastname: '',
                age: 0,
                gender: '',
                location: '',
                group: '',
                occupation: '',
                ethnicity: '',
                likes: [],
                dislikes: [],
                image: '',
                description: '',
                relatives: [],
                birthday: '',
                astrological: '',
                public: true
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
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
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
                      placeholder={capitalize(t('form:press-enter'))}
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
                      placeholder={capitalize(t('form:press-enter'))}
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
              <Relatives
                character={character && character}
                form={form}
                characters={data}
                t={t}
                capitalize={capitalize}
              />
              <Divider className="dark:border-stone-700" />
              <Form.Item label={capitalize(t('form:add-image'))}>
                <UploadImage
                  name="image"
                  setImage={setImage}
                  image={""}
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
              <div className="flex justify-end">
                <Spin spinning={isSending.current}>
                  <button type="submit" className="mt-3 text-slate-50 py-2 px-4 rounded-sm text-xs active:scale-95 bg-primary md:w-fit w-full tracking-widest uppercase">{t('form:post')}</button></Spin>
              </div>
            </Form>
              : <Alert message={t('character:verify-character')} type="error" showIcon action={
                <Link href='/auth/verify'>
                  <Button textColor="text-slate-50" color="bg-secondary">
                    {t('common:verify-now')}
                  </Button>
                </Link>
              } />}
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

export default AddCharacter