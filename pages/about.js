import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Divider } from 'antd'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const About = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{t('legals:about-us')} - Kronikea</title>
      </Head>
      <div className="p-4 w-full">
        <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg mb-12'>
          <h2 className='font-light text-2xl uppercase mb-8'>{t('legals:about-us')}</h2>
          <p className="mb-3">
            {t('legals:about-intro')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:about-mission')}</h4>
          <p className="mb-3">
            {t('legals:about-mission-text')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:about-offer')}</h4>
          <p className="mb-3">
            {t('legals:about-offer-1')}
          </p>
          <p className="mb-3">
            {t('legals:about-offer-2')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:about-community')}</h4>
          <p className="mb-3">
            {t('legals:about-community-text')}
          </p>
          <p className="mb-3">
            {t('legals:about-read')}
          </p>
          <p className="mb-3">
            {t('legals:about-thanks')}
          </p>
          <h4 className="font-bold mt-6 text-md uppercase">{t('legals:team')}</h4>
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
              <Link href="/feedback" className="underline">{t('legals:feedback')}</Link>
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

export default About