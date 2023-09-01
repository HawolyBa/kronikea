import React from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import CategoryCard from '../../components/common/CategoryCard'
import { CATEGORIES } from '../../utils/constants'
import { capitalize } from '../../utils/helpers'

const Categories = ({ setActiveCategories }) => {

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>
          {capitalize(t('common:categories'))} - Kronikea
        </title>
      </Head>
      <div className='px-4 py-8 max-w-screen-xl mx-auto'>
        <h2 className='text-xl uppercase'>{t('category:all-categories')}</h2>
        <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 mt-8">
          {CATEGORIES.map((cat) => (
            <CategoryCard t={t} setActiveCategories={setActiveCategories} data={cat} key={cat.value} />
          ))}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["story", "common", "category"]))
    }
  }
}

export default Categories