import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import bookImage from '../images/search.png'

const NotFound = () => {

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>404 | {t('common:page-not-found')} - Kronikea</title>
      </Head>
      <div style={{ backgroundImage: `url(${bookImage.src})`, backgroundSize: 'contain', backgroundPosition: "center", backgroundRepeat: 'no-repeat' }} className={`bg-contain bg-center bg-no-repeat relative notFound w-full flex items-center justify-center`}>
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="relative z-50 text-white">404</h2>
          <p className="z-50 text-white text-xl">{t('notFound:notfound')}</p>
          <div className="flex mt-8">
            <Link className="bg-primary active:scale-95 rounded-full px-4 py-2 text-white shadow-xl mr-3 uppercase text-xs" href='/'>
              {t('notFound:homepage')}
            </Link>
            <Link className="cursor-pointer rounded-full active:scale-95 px-4 py-2 backdrop-filter backdrop-blur-md bg-opacity-20 bg-secondary text-white shadow-xl mr-3 uppercase text-xs" href="/auth">
              {t('common:join-button')}
            </Link>
          </div>
        </div>
      </div>
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

export default NotFound