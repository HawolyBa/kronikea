import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Form, Input, Select, Divider, Spin, Alert } from 'antd'
import { skipToken } from '@reduxjs/toolkit/query'

import { useAuth } from '../../database/auth'
import { useGetUserStoriesQuery } from '../../database/reducers/stories'
import { useAddLocationMutation } from '../../database/reducers/locations'
import { capitalize } from '../../utils/helpers'

import UploadImage from '../../components/common/UploadImage'
import Button from '../../components/common/Button'

const AddLocation = () => {

  const { t } = useTranslation();
  const auth = useAuth()
  const { push } = useRouter()
  const [form] = Form.useForm();
  const { data, isLoading } = useGetUserStoriesQuery({ id: auth?.user?.uid, type: "newLocation", uid: auth?.user?.uid } ?? skipToken)
  const [addLocation, { error }] = useAddLocationMutation()
  const isSending = React.useRef(false);
  const [image, setImage] = React.useState('')

  const onFinish = async values => {
    if (auth.user.emailVerified) {
      isSending.current = true;
      await addLocation({
        ...values,
        image: typeof form.getFieldValue('image') === null ? '' : form.getFieldValue('image'),
        userImage: auth.user.image,
        authorName: auth?.user?.username,
        storyTitle: data?.find((s) => s.id === values.storyId).title
      }).unwrap()
        .then((res) => push(`/story/${res?.locId}`))
        .catch(err => {
          isSending.current = false
        })
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  React.useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      push('/unauthorized')
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>{t('form:add-location').charAt(0).toUpperCase() + t('form:add-location').slice(1)} - Kronikea</title>
      </Head>
      <div className='add__location custom__form p-4 w-full'>
        <Spin spinning={isLoading || auth.isLoading || isSending.current}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
            <div className="mb-6 text-center">
              <h2 className='text-2xl tracking-widest uppercase '>{t('form:add-location')}</h2>
              {/* <h3 className="mt-2 text-sm"><span className='capitalize'>{t('common:story')}</span>: <Link href={`/story/${storyId}`}><span className="cursor-pointer underline">{storyTitle}</span></Link></h3> */}
            </div>
            {auth?.user?.emailVerified ?
              <Form name="addLocation"
                layout='vertical'
                style={{ maxWidth: "100%" }}
                initialValues={{
                  name: '',
                  storyId: '',
                  description: '',
                  image: '',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off">
                <div className="md:flex">
                  <div className="md:w-1/2 w-full md:mr-3">
                    <Form.Item
                      label={capitalize(t('form:name'))}
                      name="name"

                      rules={[{ required: true, message: t('form:error-name') }, { max: 65 }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className="md:w-1/2 w-full md:mr-3">
                    <Form.Item
                      name="storyId"
                      label={capitalize(t('common:story'))}
                      rules={[{ required: true, message: t('form:error-story') }]}
                    >
                      <Select options={data?.map((story) => ({ label: story.title, value: story.id }))} />
                    </Form.Item>
                  </div>
                </div>
                <div className=''>
                  <Form.Item
                    name="description"
                    label={capitalize(t('form:description'))}
                    rules={[{ max: 210, message: t('form:error-description') }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
                <Divider className="dark:border-stone-700" />
                <Form.Item label={capitalize(t('form:add-image'))}>
                  <UploadImage
                    setImage={setImage}
                    name="image"
                    image={""}
                    t={t}
                    shape="rect"
                    type="picture-card"
                    aspect={300 / 300}
                    form={form}
                  />
                </Form.Item>
                <div className="flex justify-end">
                  <Button type="submit" color="bg-primary">{t('form:post')}</Button>
                </div>
              </Form>
              : <Alert message={t('form:verify-location')} type="error" showIcon action={
                <Link href='/auth/verify'>
                  <Button textColor="text-slate-50" color="bg-secondary">
                    {t('common:verify-now')}
                  </Button>
                </Link>
              } />}
          </div>
        </Spin>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "common"]))
    }
  }
}

export default AddLocation