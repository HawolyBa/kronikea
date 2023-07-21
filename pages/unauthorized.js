import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Result } from 'antd';

const Unauthorized = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>403 | {t('notFound:unauthorized')} - Kronikea</title>
      </Head>
      <div className='flex items-center justify-center h-fullwidth'> <Result
        status="403"
        title={(<span className="dark:text-slate-50">403</span>)}
        subTitle={(<span className="dark:text-slate-50">{t('notFound:unauthorized-text')}</span>)}
        extra={(<div className='flex justify-between mt-8'>
          <Link className="bg-primary hover:text-slate-50 active:scale-95 rounded-full px-4 py-2 text-white shadow-xl mr-3 uppercase text-xs" href='/'>
            {t('notFound:homepage')}
          </Link>
          <Link className="cursor-pointer hover:text-slate-50 rounded-full active:scale-95 px-4 py-2 bg-secondary text-white shadow-xl mr-3 uppercase text-xs" href='/auth'>
            {t('common:join-button')}
          </Link>
        </div>)}
      /></div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["notFound", "common"]))
    }
  }
}

export default Unauthorized