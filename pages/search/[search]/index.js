import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { Empty, Spin, Tabs } from 'antd'
import { charactersIndex, index, usersIndex } from '../../../database/algolia'

import Pagination from '../../../components/common/Pagination';

const Search = ({ isLoading }) => {
  const { t } = useTranslation();
  const { query } = useRouter()
  const [data, setData] = React.useState([])
  const [characters, setCharacters] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [activeTab, setActiveTab] = React.useState('stories');

  React.useEffect(() => {
    index.search(query.search).then(({ hits }) => {
      setData([...new Set(hits)].filter(i => i.public).map(i => ({ ...i, id: i.objectID })));
    });
    charactersIndex.search(query.search).then(({ hits }) => {
      setCharacters([...new Set(hits)].filter(i => i.public).map(i => ({ ...i, id: i.objectID })));
    });
    usersIndex.search(query.search).then(({ hits }) => {
      setUsers([...new Set(hits)].map(i => ({ ...i, id: i.objectID })));
    });
  }, [query.search])

  React.useEffect(() => {
    setActiveTab(data?.length > 0 ? 'stories' : characters.length > 0 ? 'characters' : characters.length > 0 ? 'users' : 'stories')
  }, [data, characters, users])

  return (
    <>
      <Head>
        <title>{query.search} | {t('common:search').charAt(0).toUpperCase() + t('common:search').slice(1)} - Kronikea</title>
      </Head>
      <div className='archive custom__archive w-full min-h-screen'>
        <div className="max-w-screen-xl pb-8 md:py-8 md:px-8 md:px-4 mx-auto">
          <h2 className='text-center mb-6 text-xl uppercase'>{t('common:search').charAt(0).toUpperCase() + t('common:search').slice(1)}: {query.search} ({data.length + users.length + characters.length} {t('category:results')})</h2>
          <Tabs
            activeKey={activeTab}
            onChange={key => setActiveTab(key)}
            centered
            defaultActiveKey={data?.length > 0 ? 'stories' : characters.length > 0 ? 'characters' : users.length > 0 ? 'users' : 'stories'}
            items={[
              {
                label: <span className='capitalize'>{t('common:stories')} ({data.length})</span>,
                key: 'stories',
                children: (
                  <>
                    <Spin spinning={isLoading}>
                      {data?.length > 0 ?
                        <Pagination dataPerPage={10} type='stories-archives' data={data} />
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      }
                    </Spin>
                  </>
                )
              },
              {
                label: <span className='capitalize'>{t('common:characters')} ({characters.length})</span>,
                key: 'characters',
                children: (
                  <>
                    <Spin spinning={isLoading}>
                      {characters?.length > 0 ?
                        <Pagination dataPerPage={10} type='characters-archives' data={characters} />
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      }
                    </Spin>
                  </>
                )
              },
              {
                label: <span className='capitalize'>{t('common:authors')} ({users.length})</span>,
                key: 'users',
                children: (
                  <>
                    <Spin spinning={isLoading}>
                      {users?.length > 0 ?
                        <Pagination dataPerPage={10} type='users-archives' data={users} />
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      }
                    </Spin>
                  </>
                )
              }
            ]} />
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

export default Search