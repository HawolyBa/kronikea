import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { Spin, Divider, Tooltip } from 'antd'

import { useAuth } from '../../database/auth';
import { useGetForYouPageQuery } from '../../database/reducers/profile'
import { CATEGORIES, placeholders } from '../../utils/constants'

import CategoryCard from '../../components/common/CategoryCard';
import StoryMiniCard from '../../components/common/StoryMiniCard';
import Button from '../../components/common/Button';

const MyFeed = () => {

  const { t } = useTranslation()
  const auth = useAuth()
  const { push } = useRouter()
  const { data, isLoading } = useGetForYouPageQuery(auth?.user?.subscribedCat ?? skipToken)

  const setActiveCategories = () => { }

  React.useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      push('/auth')
    }
  }, [auth])

  return (
    <>
      <Head>
        <title>{t('common:foryou')} - Kronikea</title>
      </Head>
      <div className='for__you w-full'>
        <div className="max-w-screen-xl pb-8 md:py-8 md:px-4 px-2  mx-auto">
          <Spin spinning={auth.isLoading || !auth.user || isLoading}>
            <div className="my-4 text-zinc-900 dark:text-slate-100 dark:bg-zinc-900 bg-white rounded-lg shadow-lg">
              <div className="md:flex">
                <div className="md:w-3/4 w-full p-8">
                  <section className="mb-12">
                    <Divider className="dark:border-stone-700" orientation="left" plain>
                      <h2 className="dark:text-slate-100 uppercase text-xl">{t('foryou:categories-you-follow')}</h2>
                    </Divider>
                    {auth?.user && auth?.user?.subscribedCat?.length > 0 ? <div className="grid gap-6 md:grid-cols-4 grid-cols-2">
                      {CATEGORIES.filter(cat => auth?.user?.subscribedCat?.includes(cat.value)).map((cat) => (
                        <CategoryCard t={t} setActiveCategories={setActiveCategories} data={cat} key={cat.value} />
                      ))}
                    </div>
                      : <>
                        <p className="">{t('foryou:empty')}</p>
                        <div className='mt-3 -ml-3'>
                          <Button onClick={() => push('/category')} color="bg-primary">
                            {t('foryou:go-categories')}
                          </Button>
                        </div>
                      </>
                    }
                  </section>
                  <section className="mb-12">
                    <Divider className="dark:border-stone-700" orientation="left" plain>
                      <h2 className="dark:text-slate-100 uppercase text-xl">{t('foryou:latest')}</h2>
                    </Divider>
                    <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-content-center place-items-center">
                      {data?.popular?.map(story => (
                        <StoryMiniCard key={story.id} data={story} />
                      ))}
                    </div>
                  </section>
                  <section>
                    <Divider className="dark:text-slate-100 dark:border-stone-700" orientation="left" plain>
                      <h2 className="uppercase text-xl">{t('foryou:popular')}</h2>
                    </Divider>
                    <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-content-center place-items-center">
                      {data?.stories?.map(story => (
                        <StoryMiniCard key={story.id} data={story} />
                      ))}
                    </div>
                  </section>
                </div>
                <div className='w-1/4 px-6 py-8 shadow-md'>
                  <section className="w-full mb-12">
                    <Divider className="dark:text-slate-100 dark:border-stone-700" orientation="left" plain>
                      <h2 className='uppercase text-lg'>{t('foryou:authors-you-follow')}</h2>
                    </Divider>
                    <div className="grid gap-5 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                      {data?.users?.map(user => (
                        <Tooltip key={user.id} placement="bottom" title={user.username}>
                          <Link href={`/profile/${user.id}`}>
                            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                              <Image src={user.image ? user.image : placeholders.avatar} alt={user.username} fill style={{ objectFit: 'cover' }} />
                            </div>
                          </Link>
                        </Tooltip>
                      ))}
                    </div>
                  </section>
                  <section>
                    <Divider className="dark:border-stone-700" orientation="left" plain>
                      <h2 className='dark:text-slate-100 uppercase text-lg'>Trending tags</h2>
                    </Divider>
                    <ul>
                      {data?.tags?.map(tag => (
                        <li className="text-base mb-2" key={tag}>
                          <Link href={`/tag/${tag}`}>
                            {tag}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["foryou", "common", "category"]))
    }
  }
}

export default MyFeed