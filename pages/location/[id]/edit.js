import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Form, Input, Select, Divider, Popconfirm, Spin } from 'antd'
import { skipToken } from '@reduxjs/toolkit/query'

import { useAuth } from '../../../database/auth'
import { useGetUserStoriesQuery } from '../../../database/reducers/stories'
import { useDeleteLocationMutation, useEditLocationMutation, useGetLocationQuery } from '../../../database/reducers/locations'

import UploadImage from '../../../components/common/UploadImage'
import Button from '../../../components/common/Button'

const EditLocation = () => {

  const { t } = useTranslation();
  const auth = useAuth()
  const { push, query } = useRouter()
  const [form] = Form.useForm();
  const { data: stories } = useGetUserStoriesQuery({ id: auth?.user?.uid, type: "newLocation" } ?? skipToken, { refetchOnMountOrArgChange: true })
  const [editLocation] = useEditLocationMutation()
  const [deleteLocation] = useDeleteLocationMutation()
  const { data, isLoading } = useGetLocationQuery(query.id, { refetchOnMountOrArgChange: true })
  const isSending = React.useRef(false);
  const [image, setImage] = React.useState('')

  const onFinish = async values => {
    if (auth.user.emailVerified) {
      isSending.current = true;
      await editLocation({
        id: query.id, data: {
          ...values,
          image: typeof form.getFieldValue('image') === null ? '' : form.getFieldValue('image'),
          userImage: auth.user.image,
          authorName: auth?.user?.username,
          storyTitle: stories?.find((s) => s.id === values.storyId).title
        }
      }).unwrap()
        .then((res) => push(`/story/${data?.info?.storyId}`))
        .catch(err => {
          console.log(err)
          isSending.current = false
        })
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const triggerDelete = () => {
    const storyId = data?.info?.storyId
    deleteLocation(query.id)
      .unwrap()
      .then(res => {
        if (res) {
          push(`/story/${storyId}`)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    if (data && data.info) {
      form.resetFields()
      if (!data?.locationExists) {
        push('/404')
      }
    }
  }, [data])

  React.useEffect(() => {
    if (!auth.isLoading && data?.info) {
      if (!auth.user || (auth.user.uid !== data?.info?.authorId)) {
        push('/unauthorized')
      }
    }
  }, [data, auth])

  return (
    <>
      <Head>
        <title>{t('form:edit-location').charAt(0).toUpperCase() + t('form:edit-location').slice(1)} - Kronikea</title>
      </Head>
      <div className='add__location custom__form p-4 w-full'>
        <Spin spinning={isLoading || auth.isLoading || isSending?.current}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto">
            <div className="mb-6 text-center">
              <h2 className='text-2xl tracking-widest uppercase '>{t('form:edit-location')}</h2>
            </div>
            <Form name="editLocation"
              layout='vertical'
              form={form}
              style={{ maxWidth: "100%" }}
              initialValues={{
                name: data?.info?.name,
                storyId: data?.info?.storyId,
                description: data?.info?.description,
                image: data?.info?.image,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <div className="md:flex">
                <div className="md:w-1/2 w-full md:mr-3 capitalize">
                  <Form.Item
                    label={t('form:name')}
                    name="name"

                    rules={[{ required: true, message: t('form:error-name') }, { max: 65 },]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="md:w-1/2 w-full md:mr-3 capitalize">
                  <Form.Item
                    name="storyId"
                    label={t('common:story')}
                    rules={[{ required: true, message: t('form:error-story') }]}
                  >
                    <Select options={stories?.map((story) => ({ label: story.title, value: story.id }))} />
                  </Form.Item>
                </div>
              </div>
              <div className='capitalize'>
                <Form.Item
                  name="description"
                  label={t('form:description')}
                  rules={[{ max: 210, message: t('form:error-description') }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </div>
              <Divider className="dark:border-stone-700" />
              <Form.Item label="Add an image">
                <UploadImage
                  setImage={setImage}
                  name="image"
                  image={data?.info?.image}
                  t={t}
                  shape="rect"
                  type="picture-card"
                  aspect={300 / 300}
                  form={form}
                />
              </Form.Item>
              <div className="flex justify-between">
                <Popconfirm
                  title="Delete this location"
                  description="Do you really want to delete this location ? This action cannot be undone."
                  onConfirm={triggerDelete}
                  okText={t('common:yes')}
                  cancelText={t('common:no')}
                >
                  <>
                    <Button type="button" textColor="text-red-500" color="">
                      {t('form:delete')}
                    </Button>
                  </>
                </Popconfirm>
                <Button type="submit" color="bg-primary">
                  {t('form:save-changes')}
                </Button>
              </div>
            </Form>
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

export const getStaticPaths = async () => {

  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}

export default EditLocation