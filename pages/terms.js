import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Terms = () => {
  const { t } = useTranslation()
  return (
    <div className="p-4 w-full">
      <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg mb-12'>
        <h2 className="font-light text-2xl uppercase mb-6">
          {t('legals:terms')}
        </h2>
        <p className="mb-3">
          {t('legals:terms-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:description')}</h4>
        <p className="mb-3">
          {t('legals:description-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:responsibility')}</h4>
        <p className="mb-3">
          {t('legals:responsibility-intro')} :
        </p>
        <ul className="mb-3 ml-2">
          <li className="mb-2">
            3.1. {t('legals:responsibility-1')}
          </li>
          <li className="mb-2">
            3.2. {t('legals:responsibility-2')}
          </li>
          <li className="mb-2">
            3.3. {t('legals:responsibility-3')}
          </li>
          <li className="mb-2">
            3.4. {t('legals:responsibility-4')}
          </li>
        </ul>
        <h4 className="font-bold text-lg uppercase">{t('legals:porn-content')}</h4>
        <ul className="mb-3 ml-2">
          <li className="mb-2">
            4.1. {t('legals:porn-content-1')}
          </li>
          <li className="mb-2">
            4.2. {t('legals:porn-content-2')}
          </li>
          <li className="mb-2">
            4.3. {t('legals:porn-content-3')}
          </li>
          <li className="mb-2">
            4.4. {t('legals:porn-content-4')}
          </li>
        </ul>
        <h4 className="font-bold text-lg uppercase">{t('legals:intellectual-property')}</h4>
        <p className="mb-3">
          {t('legals:intellectual-property-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:privacy')}</h4>
        <p className="mb-3">
          {t('legals:privacy-text')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:liability')}</h4>
        <p className="mb-3">
          {t('legals:liability-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:terms-update')}</h4>
        <p className="mb-3">
          {t('legals:terms-update-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">{t('legals:termination')}</h4>
        <p className="mb-3">
          {t('legals:termination-intro')}
        </p>
        <h4 className="font-bold text-lg uppercase">Contact</h4>
        <p className="mb-3">
          {t('legals:contact-privacy')}
        </p>
        <p>
          {t('legals:privacy-conclusion')}
        </p>
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "contact", "common", "legals"]))
    }
  }
}

export default Terms