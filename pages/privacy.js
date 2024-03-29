import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import 'moment/locale/fr'
import moment from 'moment/moment';
import { Divider } from 'antd'

const Privacy = () => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{t('legals:kronikea-policy')} - Kronikea</title>
      </Head>
      <div className="md:px-4 py-4 px-2 w-full">
        <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg mb-12'>
          <h2 className="font-light text-2xl uppercase mb-6">
            {t('legals:kronikea-policy')}
          </h2>
          <h3 className="mb-4 font-light">
            <i>
              {t('legals:latest-update')} : {locale === 'en' ? moment('2023-09-02').format('MMM DD, YYYY') : moment('2023-09-02').locale('fr').format("DD MMMM YYYY")}</i>
          </h3>
          <p className="mb-5">
            {t('legals:privacy-intro')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:collect')}</h4>
          <p className="mb-5">
            {t('legals:collect-intro')} :

          </p>
          <ul className="mb-5 ml-2">
            <li className="mb-2">
              1.1. {t('legals:collect-1')}
            </li>
            <li className="mb-2">
              1.2. {t('legals:collect-2')}
            </li>
            <li className="mb-2">
              1.3. {t('legals:collect-3')}
            </li>
          </ul>
          <h4 className="font-bold text-lg uppercase">{t('legals:use')}</h4>
          <p className="mb-3">
            {t('legals:use-intro')} :
          </p>
          <ul className="mb-5 ml-2">
            <li className="mb-2">
              2.1. {t('legals:use-1')}
            </li>
            <li className="mb-2">
              2.2. {t('legals:use-2')}
            </li>
            <li className="mb-2">
              2.3. {t('legals:use-3')}
            </li>
          </ul>

          <h4 className="font-bold text-lg uppercase">{t('legals:share')}</h4>
          <p className="mb-3">
            {t('legals:share-intro')} :
          </p>
          <ul className="mb-5 ml-2">
            <li className="mb-2">
              3.1. {t('legals:share-1')}
            </li>
            <li className="mb-2">
              3.2. {t('legals:share-2')}
            </li>
            <li className="mb-2">
              3.3. {t('legals:share-3')}
            </li>
          </ul>
          <h4 className="font-bold text-lg uppercase">{t('legals:security')}</h4>
          <p className="mb-5">
            {t('legals:security-intro')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:access-control')}</h4>
          <p className="mb-5">
            {t('legals:access-control-intro')}
          </p>
          <h4 className="font-bold text-lg uppercase">{t('legals:policy-update')}</h4>
          <p className="mb-5">
            {t('legals:policy-update-intro')}
          </p>
          <h4 className="font-bold text-lg uppercase">Contact</h4>
          <p className="mb-5">
            {t('legals:contact-intro')} : contact@kronikea.com
          </p>
          <p className="mb-5">
            {t('legals:conclusion')}
          </p>
          <Divider />
          <h4 className="font-bold text-lg uppercase">{t('legals:about-links')}</h4>
          <ul className="mb-4">
            <li className="mb-2">
              <Link href="/terms" className="underline">{t('legals:terms')}</Link>
            </li>
            <li className="mb-2">
              <Link href="/about" className="underline">{t('legals:about-us')}</Link>
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

export default Privacy