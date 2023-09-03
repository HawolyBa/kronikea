import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useAuth } from '../database/auth'
import { Form, Input, Alert } from 'antd'

import Button from '../components/common/Button'
import { useSendMessageMutation } from '../database/reducers/profile'

const Contact = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const auth = useAuth()
  const [send] = useSendMessageMutation()
  const [message, setMessage] = React.useState('')
  const [empty, setEmpty] = React.useState(true)

  const submit = async values => {
    if (values.body) {
      await send({
        userId: auth?.user?.uid,
        username: auth?.user?.username,
        message: values.body
      }).unwrap()
        .then((res) => {
          setMessage(res)
          form.resetFields()
        })
        .catch(err => console.log(err))
    }
  }

  const resetMessage = () => {
    setMessage('')
  }

  return (
    <>
      <Head>
        <title>Contact - Kronikea</title>
      </Head>
      <div className="contact p-4 w-full">
        <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg'>
          <h2 className='text-center text-2xl uppercase mb-8'>{t('legals:contact-us')}</h2>
          <p className="mb-4">{t('legals:contact-us-intro')}</p>
          <div className='my-8'>
            {
              !auth.isLoading && auth.user ?
                <ul className="mb-4">
                  <li>{t('legals:your-id')}: {auth?.user?.uid}</li>
                  <li>{t('legals:your-username')}: {auth?.user?.username}</li>
                </ul> :
                <Link href="/auth" className="underline block mb-4">{t('legals:contact-us-login')}</Link>
            }
            <p className='mb-4'>{t('legals:contact-us-alternative')} <b>contact@kronikea.com </b></p>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ body: "" }}
              onValuesChange={v => {
                setEmpty(v.body ? false : true)
                resetMessage()
              }}
              onFinish={submit}
            >
              <Form.Item name="body" >
                <Input.TextArea placeholder={t('legals:contact-us-placeholder')} rows={12}></Input.TextArea>
              </Form.Item>
              <div className='flex items-center justify-center'>
                <Button disabled={!auth.user || empty} type="submit" color='bg-primary'>{t('legals:send-button')}</Button>
              </div>
            </Form>
            <div className='my-3'>
              {message && <Alert message={message} type="success" />}
            </div>
          </div>
          <p className="mb-4">{t('legals:follow-us')}:</p>
          <ul>
            <li>
              Facebook: @kronikea
            </li>
            <li>
              Twitter: @kronikea
            </li>
            <li>
              Instagram: @kronikea
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "contact", "common", "legals"]))
    }
  }
}

export default Contact