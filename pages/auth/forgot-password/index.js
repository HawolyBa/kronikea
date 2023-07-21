import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Input } from 'antd'

import { useAuth } from '../../../database/auth'
import Loading from '../../../components/common/Loading'

const ForgotPassword = () => {

  const auth = useAuth()
  const { t } = useTranslation()
  const { push } = useRouter()
  const [email, setEmail] = React.useState('')
  const [decount, setDecount] = React.useState(0)
  const sent = React.useRef(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!auth.isLoading) {
      if (auth.user) {
        push('/profile')
      }
    }
  }, [auth])

  const send = async () => {
    if (decount === 0 && email) {
      const emailSent = await auth.resetEmail(email)
      if (emailSent) {
        setDecount(60)
        sent.current = true
      } else {
        setError('')
      }
    } else if (!email) {
      setError(t('auth:error-email'))
    }
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
        <title>{t('auth:forgotten-password')}</title>
      </Head>
      {!auth.isLoading && !auth.user ?
        <div className="h-fullwidth flex items-center justify-center">
          <div className="w-1/2 text-center dark:bg-zinc-900 text-zinc-500 bg-slate-100 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl mb-6">{t('auth:forgotten-password')}</h2>
            {!sent.current ?
              <>
                <p>
                  {t('auth:forgotten-1')}
                </p>
                <p className="my-4">
                  {t('auth:forgotten-2')}
                </p>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                <p className='text-red-500 text-xs my-2'>{!error && auth.errors.email}</p>
                <p className='text-red-500 text-xs my-2'>{error}</p>
                <button disabled={decount > 0} onClick={send} className={` px-4 py-2 my-4 rounded-md active:scale-95 shadow-lg ${decount > 0 ? 'bg-slate-100 text-zinc-300' : 'bg-secondary text-slate-50'}`}>{t('auth:send-again')} ! {decount > 0 && `(${decount} s)`}</button>
              </>
              : <>
                <p className="my-2">{t('auth:forgotten-3')}</p>
                <p>
                  {t('auth:forgotten-4')}
                </p>
                <p className="my-2">
                  {t('auth:forgotten-5')} contact@kronikea.com
                </p>
                <p>
                  {t('auth:forgotten-6')} <span className="underline cursor-pointer" onClick={() => sent.current = false}>{t('auth:forgotten-7')}</span>
                </p>
              </>
            }
          </div>
        </div>
        : <Loading />
      }
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

export default ForgotPassword