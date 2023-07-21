import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Form, Input, Spin } from 'antd'
import { FcGoogle } from "react-icons/fc";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { useAuth } from '../../database/auth';

import { colors } from '../../utils/constants'
import bookGirl from '../../images/search-icon.png'
import illus from '../../images/writer.png'

const Authentication = () => {

  // TODO - TROUVER MEILLEURES ILLUSTRATIONS 

  const auth = useAuth()
  const router = useRouter()
  const { t } = useTranslation('common')
  const [active, setActive] = React.useState(false)
  const [form] = Form.useForm()

  const onSignIn = values => auth.signin(values.email, values.password)
  const onSignUp = values => auth.signup(values.email, values.password, values.username)
  const onFinishFailed = values => console.log('Failed:', values)

  React.useEffect(() => {
    form.resetFields()
  }, [router.pathname])

  React.useEffect(() => {
    if (!auth.isLoading) {
      if (auth.user) {
        if (auth.user.emailVerified) {
          setTimeout(() => {
            router.push('/for-you')
          }, 200)
        } else {
          router.push('/auth/verify')
        }
      }
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>{t('common:login').charAt(0).toUpperCase() + t('common:login').slice(1)} - Kronikea</title>
      </Head>
      <Spin spinning={auth.isLoading || auth.user}>
        <div className="auth mt-8 px-4 h-full mb-8">
          <div className={`max-w-screen-lg w-screen-lg bg-white dark:bg-zinc-900 shadow-lg rounded-2xl w-full mx-auto flex relative overflow-hidden ${active ? 'active' : ''}`}>
            {/* SIGN IN */}
            <div className={`sign-in md:w-1/2 w-full h-full absolute top-0 transiton duration-1000 ease-in-out left-0 z-20 ${active ? 'md:translate-x-full ' : ''}`}>
              <div className="bg-white dark:bg-zinc-900 py-8 lg:px-24 px-6">
                <div className="w-28 h-28 mx-auto overflow-hidden rounded-full mb-8 relative">
                  <Image src={bookGirl.src} style={{ objectFit: 'cover' }} alt="logo Kronikea" fill />
                </div>
                <h2 className="text-3xl text-center tracking-widest capitalize">{t('common:sign-in')}</h2>
                <p className="w-full mx-auto mt-3 mb-8 font-lighter text-xs text-gray-400 text-center">{t('auth:greeting-auth')}</p>
                <Form
                  form={form}
                  name="signin"
                  layout='vertical'
                  style={{ maxWidth: "100%" }}
                  initialValues={{ remember: true }}
                  onFinish={onSignIn}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: t('auth:error-email') }]}
                    help={auth.errors.email}
                    validateStatus={auth.errors.email ? "error" : ''}
                  >
                    <Input placeholder={t('auth:email')} suffix={"@"} />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: t('auth:error-password') }]}
                    help={auth.errors.password}
                    validateStatus={auth.errors.password ? "error" : ''}
                  >
                    <Input.Password placeholder={t('auth:password')} />
                  </Form.Item>
                  <Link className="dark:text-slate-50" href='/auth/forgot-password'>
                    {t('auth:forgot')}
                  </Link>
                  <button type="submit" style={{ background: colors.primary }} className="rounded-sm w-full text-white py-2 mt-8 capitalize active:scale-90 transform duration-1000 tracking-widest">{t('common:login')}</button>
                  <button type="button" style={{ border: `1px solid ${colors.primary}` }} className="flex items-center justify-center rounded-sm w-full py-2 mt-3 active:scale-90 transform duration-1000 tracking-widest" onClick={() => auth.signInWithGoogle()}>
                    <FcGoogle style={{ fontSize: '1.5rem' }} />
                    <span className="ml-2 dark:text-slate-50">{t('auth:login-google')}</span>
                  </button>
                  <p onClick={() => setActive(!active)} className="md:hidden mt-6 text-center cursor-pointer dark:text-slate-50">{t('auth:no-account-yet')}</p>
                </Form>
              </div>
            </div>
            {/* SIGN UP HIDDEN */}
            <div className={`sign-up md:w-1/2 w-full h-full absolute top-0 transiton duration-1000 ease-in-out left-0 ${active ? 'translate-x-full opacity-100 z-30 ' : 'opacity-0 z-10 '}`}>
              <div className="bg-white dark:bg-zinc-900 py-8 lg:px-24 px-6">
                <div className="w-28 h-28 mx-auto overflow-hidden rounded-full mb-8 relative">
                  <Image src={bookGirl.src} style={{ objectFit: 'cover' }} alt="logo Kronikea" fill />
                </div>
                <h2 className="text-3xl text-center tracking-widest capitalize">{t('common:sign-up')}</h2>
                <p className="w-full mx-auto mt-3 mb-8 font-lighter text-xs text-gray-400 text-center">{t('auth:greeting-auth')}</p>
                <Form
                  layout='vertical'
                  style={{ maxWidth: "100%" }}
                  initialValues={{ remember: false }}
                  onFinish={onSignUp}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: t('auth:error-username') }, { max: 30, message: t('auth:error-username-len') }]}
                  >
                    <Input placeholder={t('common:username')} />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    help={auth.errors.email}
                    validateStatus={auth.errors.email ? "error" : ''}
                    rules={[{ required: true, message: t('auth:error-email') }]}
                  >
                    <Input placeholder={t('auth:email')} suffix={"@"} />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    help={auth.errors.password}
                    validateStatus={auth.errors.password ? "error" : ''}
                    rules={[{ required: true, message: t('auth:error-password') }]}
                  >
                    <Input.Password placeholder={t('auth:password')} />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    help={auth.errors.confirmPassword}
                    validateStatus={auth.errors.confirmPassword ? "error" : ''}
                    rules={[{ required: true, message: t('auth:error-confirm-password') }, ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            t('auth:passwords-not-match')
                          )
                        );
                      },
                    }),]}
                  >
                    <Input.Password placeholder={t('auth:confirm-password')} />
                  </Form.Item>
                  <button type="submit" style={{ background: colors.primary }} className="rounded-sm w-full text-white py-2 mt-8 capitalize active:scale-90 transform duration-1000 tracking-widest">{t('common:login')}</button>
                  <button type='button' style={{ border: `1px solid ${colors.primary}` }} className="flex items-center justify-center rounded-sm w-full py-2 mt-3 active:scale-90 transform duration-1000 tracking-widest" onClick={() => auth.signInWithGoogle()}>
                    <FcGoogle style={{ fontSize: '1.5rem' }} />
                    <span className="ml-2 dark:text-slate-50 capitalize">{t('auth:signup-google')}</span>
                  </button>
                  <p onClick={() => setActive(!active)} className="md:hidden mt-6 text-center cursor-pointer dark:text-slate-50">{t('auth:already-account')}</p>
                </Form>
              </div>
            </div>
            {/* OVERLAY CONTAINER */}
            <div style={{ transform: active ? 'translateX(-100%) ' : '' }} className="  md:block hidden overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transiton duration-1000 ease-in-out z-50">
              {/* OVERLAY INNER */}
              <div style={{ background: colors.secondary, width: '200%', transform: active ? 'translateX(50%)' : 'translateX(0)' }} className={`-left-full relative h-full transiton duration-1000 ease-in-out text-white overlay-inner `}>

                {/* OVERLAY 1 */}
                <div style={{ transform: active ? 'translateX(0)' : 'translateX(-20%)' }} className="absolute flex items-center justify-center flex-col px-8 text-center top-0 h-full w-1/2 transiton ease-in-out duration-1000 ">
                  <img src={illus.src} />
                  <p onClick={() => setActive(!active)} className="mt-6 text-center cursor-pointer">{t('auth:already-account')}</p>
                </div>
                {/* OVERLAY 2*/}
                <div style={{ transform: active ? 'translateX(20%)' : 'translateX(0)' }} className={`absolute flex items-center justify-center flex-col px-8 text-center top-0 h-full w-1/2 transiton duration-1000 ease-in-out right-0`}>
                  <img src={illus.src} />
                  <p onClick={() => setActive(!active)} className="mt-6 text-center cursor-pointer">{t('auth:no-account-yet')}</p>
                </div>
              </div>
            </div>
          </div>
        </div >
      </Spin>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["auth", 'form', "common"]))
    }
  }
}

export default Authentication