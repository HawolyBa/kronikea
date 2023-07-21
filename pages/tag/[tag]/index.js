import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { Spin, Empty, Divider } from 'antd'

import { useGetStoriesByTagQuery } from '../../../database/reducers/stories'

import Pagination from '../../../components/common/Pagination';

const Tag = () => {
  const { t } = useTranslation();
  const { query } = useRouter()
  const { data, isLoading } = useGetStoriesByTagQuery(query.tag)

  return (
    <>
      <Head>
        <title>{query.tag} | Tag - Kronikea</title>
      </Head>
      <div className='archive custom__archive w-full h-fullwidth'>
        <div className="max-w-screen-xl pb-8 md:py-8 md:px-8 md:px-4 mx-auto">
          <h2 className='text-center mb-6 text-xl uppercase'>Tag: {query.tag} ({data?.length} {data?.length > 1 ? t('category:results') : t('category:results').slice(0, -1)})</h2>
          <Divider />
          <Spin spinning={isLoading}>
            {data?.length > 0 ?
              <Pagination dataPerPage={10} type='stories-archives' data={data} />
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
          </Spin>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["story", "common", "category"]))
    }
  }
}

export default Tag