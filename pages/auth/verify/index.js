import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Spin } from 'antd'

import { useAuth } from '../../../database/auth'

const Verify = () => {

  const auth = useAuth()
  const [decount, setDecount] = React.useState(0)
  const { t } = useTranslation()
  const { push } = useRouter()

  React.useEffect(() => {
    if (!auth.isLoading) {
      if (auth.user) {
        if (auth.user.emailVerified) {
          push('/profile')
        }
      } else {
        push('/auth')
      }
    }
  }, [auth])

  const send = () => {
    if (decount === 0) {
      auth.verifyEmail()
    }
    setDecount(60)
  }

  React.useEffect(() => {
    if (decount > 0) {
      setTimeout(() => {
        setDecount(decount - 1);
      }, 1000);
    }
  }, [decount])

  return (
    <>
      <Head>
        <title>{t('auth:verify-email')}</title>
      </Head>
      <Spin spinning={auth.isLoading || auth.user.emailVerified}>
        <div className="h-fullwidth flex items-center justify-center">
          <div className="w-1/2 text-center shadow-md dark:bg-zinc-900 text-zinc-500 bg-slate-100 rounded-xl p-8">
            <h2 className="text-2xl mb-6">{t('auth:thanks')}</h2>
            <p>{t('auth:verify-text-1')}</p>
            <p>{t('auth:verify-text-2')}</p>
            <p className='my-6 text-sm'>{t('auth:not-received')} {decount > 0 && `(${decount} s)`}</p>
            <button disabled={decount > 0} onClick={send} className={` px-4 py-2 rounded-md shadow-lg ${decount > 0 ? 'bg-slate-100 text-zinc-300' : 'active:scale-95 bg-secondary text-slate-50'}`}>{t('auth:send-again')} !</button>
          </div>
        </div>
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

export default Verify