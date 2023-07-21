import React from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useAuth } from '../database/auth'
import { Form, Input, Alert } from 'antd'

import Button from '../components/common/Button'
import Link from 'next/link'
import { useSendMessageMutation } from '../database/reducers/profile'

const Contact = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const auth = useAuth()
  const [send] = useSendMessageMutation()
  const [message, setMessage] = React.useState('')

  const submit = async values => {
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
          <h2 className='text-center text-2xl uppercase mb-8'>Contact Us</h2>
          <p className="mb-4">Do you have questions or comments for Kronikea? We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.</p>
          <div className='my-8'>
            {
              !auth.isLoading && auth.user ?
                <ul className="mb-4">
                  <li>Your ID: {auth?.user?.uid}</li>
                  <li>Your username: {auth?.user?.username}</li>
                </ul> :
                <Link href="/auth" className="underline block mb-4">Please login to fill the form</Link>
            }
            <p className='mb-4'>Alternatively, you can reach us via email at <b>contact@kronikea.com</b></p>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ body: "" }}
              onValuesChange={resetMessage}
              onFinish={submit}
            >
              <Form.Item name="body" >
                <Input.TextArea placeholder="How can we help you ?" rows={12}></Input.TextArea>
              </Form.Item>
              <div className='flex items-center justify-center'>
                <Button disabled={!auth.user} type="submit" color='bg-primary'>Send</Button>
              </div>
            </Form>
            <div className='my-3'>
              {message && <Alert message={message} type="success" />}
            </div>
          </div>
          <p className="mb-4">Follow us on social media for the latest news, product updates, and promotions:</p>
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
      ...(await serverSideTranslations(locale, ["form", "contact", "common"]))
    }
  }
}

export default Contact