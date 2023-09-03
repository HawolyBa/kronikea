import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Divider, Form, Input, Select, Alert } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { useAuth } from '../database/auth'
import { useSendFeedbackMutation } from '../database/reducers/profile'

import Button from '../components/common/Button'
import { capitalize } from '../utils/helpers'

const Feeback = () => {
  const auth = useAuth()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [send] = useSendFeedbackMutation()
  const [message, setMessage] = React.useState('')
  const [empty, setEmpty] = React.useState(true)

  const submit = async values => {
    if (values.body) {
      await send({
        userId: auth?.user?.uid,
        username: auth?.user?.username,
        category: values.category,
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
        <title>{t('legals:feedback')} - Kronikea</title>
      </Head>
      <div className="p-4 w-full">
        <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg mb-12'>
          <h2 className='font-light text-2xl uppercase mb-8'>{t('legals:feedback')}</h2>
          <p className="mb-6">{t('legals:feedback-intro')}</p>
          {/* FORM */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{ body: "", category: "" }}
            onValuesChange={v => {
              setEmpty(v.body ? false : true)
              resetMessage()
            }}
            onFinish={submit}
          >
            <Form.Item name="category" >
              <Select placeholder={capitalize(t('common:category'))} options={[
                { value: "design", label: "UI/Design" },
                { value: "features", label: t('legals:features') },
                { value: "security", label: t('legals:security') },
                { value: "communication", label: "Communication" },
                { value: "other", label: t('legals:other') },
              ]} />

            </Form.Item>
            <Form.Item name="body">
              <Input.TextArea placeholder={t('legals:contact-us-placeholder')} rows={12}></Input.TextArea>
            </Form.Item>
            <div className='flex items-center justify-center'>
              <Button disabled={!auth.user || empty} type="submit" color='bg-primary'>{t('legals:send-button')}</Button>
            </div>
          </Form>
          <div className='my-3'>
            {message && <Alert message={message} type="success" />}
          </div>
          <p className="mb-3 mt-6">
            {t('legals:feeback-1')}
          </p>
          <p className="mb-3">
            {t('legals:feeback-2')}
          </p>
          <p className="mb-3">
            {t('legals:feeback-3')}
          </p>
          <p className="mb-3">
            {t('legals:feeback-4')}
          </p>
          <Divider />
          <h4 className="font-bold text-lg uppercase">{t('legals:about-links')}</h4>
          <ul className="mb-4">
            <li className="mb-2">
              <Link href="/terms" className="underline">{t('legals:terms')}</Link>
            </li>
            <li className="mb-2">
              <Link href="/privacy" className="underline">{t('legals:kronikea-policy')}</Link>
            </li>
            <li className="mb-2">
              <Link href="/contact" className="underline">Contact</Link>
            </li>
            <li className="mb-2">
              <Link href="/about" className="underline">{t('legals:about-us')}</Link>
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

export default Feeback