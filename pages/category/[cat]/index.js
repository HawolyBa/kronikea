import React from 'react'
import Head from 'next/head'
import { useRouter } from "next/router";
import { Divider, Select, Form, Radio, Empty } from 'antd'

import { STATUS, LANGUAGES, CATEGORIES } from '../../../utils/constants';
import Pagination from '../../../components/common/Pagination'
import Banner from '../../../components/common/Banner'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { getStoriesByCategory } from '../../../database/actions/stories';
import { useAuth } from '../../../database/auth';
import { useSubscribeToCategoryMutation } from '../../../database/reducers/stories';


const Category = ({ stories }) => {

  // TODO - ADD TRANSLATIONS
  const auth = useAuth()
  const [data, setData] = React.useState([])
  const { t } = useTranslation();
  const router = useRouter();
  const [form] = Form.useForm()
  const category = CATEGORIES.find(c => c.value === router.query.cat.toLocaleLowerCase())
  const [filters, setFilters] = React.useState({})
  const [subscribe] = useSubscribeToCategoryMutation()

  React.useEffect(() => {
    if (stories.length > 0) {
      setData(stories)
    }
  }, [stories])

  React.useEffect(() => {
    if (router.query.cat) {
      form.resetFields()
      setFilters({
        lang: '',
        status: '',
        mature: false,
        popularity: true,
        date: false,
        title: false
      })
    }
  }, [router.query.cat])

  React.useEffect(() => {
    setData(stories
      .sort((a, b) => {
        if (filters.date) {
          return a.createdAt && b.createdAt && typeof a.createdAt === "object"
            ? new Date(b.createdAt.seconds * 1000) -
            new Date(a.createdAt.seconds * 1000)
            : new Date(b.createdAt) - new Date(a.createdAt)
        } else if (filters.title) {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        } else if (filters.popularity) {
          return b.likedBy.length - a.likedBy.length
        }
      })
      .filter(story => filters.mature ? story : story.mature === false)
      .filter(story => filters.lang ? story.language === filters.lang : story)
      .filter(story => filters.status ? story.status === filters.status : story)
    )
  }, [filters])

  return (
    <>
      <Head>
        <title>{t(`common:${router.query.cat}`).toUpperCase()} - Kronikea</title>
      </Head>
      <div className='archive custom__archive w-full'>
        <div className="max-w-screen-xl pb-8 md:py-8 md:px-8 mx-auto">
          <Banner image={category.image.src}>
            <div className="flex h-full w-full justify-center md:justify-between md:flex-row flex-col md:ml-24 items-center z-20">
              <div className="flex flex-col items-center md:block">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-50 capitalize">{t('common:category')}: {t(`common:${router.query.cat.toLowerCase()}`)}</h2>
                <h3 className="text-2xl">{data.length} {data.length > 1 ? t('common:stories') : t('common:story')}</h3>
              </div>
              {/* SUBSCRIBE BUTTON */}
              <div onClick={() => auth?.user ? subscribe(router.query.cat) : router.push('/auth')} className={`md:mr-24 px-4 py-2 flex items-center justify-center active:scale-95 border-2 border-primary text-slate-50 text-xs rounded-md cursor-pointer  uppercase shadow-md ${auth?.user?.subscribedCat?.includes(router.query.cat) ? 'bg-white backdrop-filter backdrop-blur-md bg-opacity-20' : 'bg-primary'}`}>
                {auth?.user?.subscribedCat?.includes(router.query.cat) ? "Unsubscribe" : "Subscribe"}
              </div>

            </div>
          </Banner>

          <div className="mt-8 bg-white dark:bg-zinc-900 px-4 py-2 rounded-md md:flex md:justify-between md:items-center w-full">
            <Form name="filter"
              initialValues={{
                mature: false,
                status: '',
                language: '',
                sortBy: 'popularity',
                categories: []
              }}
              form={form}
              style={{ width: "100%" }}
              layout='vertical'>
              <div className="md:flex">
                <div className="flex md:w-1/3 w-full">
                  <div className='md:w-fit w-fit capitalize'>
                    <Form.Item name="mature" label={t('common:explicit')}>
                      <Radio.Group buttonStyle="solid" onChange={(e) => setFilters({ ...filters, mature: e.target.value })}>
                        <Radio.Button value={false}>Off</Radio.Button>
                        <Radio.Button value={true}>On</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className="md:w-1/2 md:mr-3 ml-3 flex-1">
                    <Form.Item name="sortBy" label={t('common:sort-by')} >
                      <Select
                        onChange={(v) => setFilters({
                          ...filters,
                          title: v === 'title' ? true : false,
                          date: v === 'date' ? true : false,
                          popularity: v === 'popularity' ? true : false
                        })}
                        options={[{ value: "popularity", label: "Popularity" }, { value: "date", label: "Date" }, { value: "title", label: "Title" }]}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="md:mr-3 md:w-1/3 w-full capitalize">
                  <Form.Item name="language" label={t('common:language')}>
                    <Select
                      allowClear="true"
                      onChange={l => setFilters({ ...filters, lang: l })}
                      placeholder="Select a language"
                      showSearch
                      options={LANGUAGES.map(l => ({
                        value: l.value,
                        label: l.name,
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </div>
                <div className='md:w-1/3 md:mr-3 w-full capitalize'>
                  <Form.Item name="status" label={t('category:status')} >
                    <Select
                      onChange={s => setFilters({ ...filters, status: s })}
                      showSearch
                      allowClear
                      placeholder="Select a status"
                      options={STATUS.map(l => ({
                        value: l.value,
                        label: t(`common:${l.value.split(' ').join('-')}`),
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <Divider className="dark:border-stone-700" />
          {data.length > 0 ?
            <Pagination dataPerPage={10} type='stories-archives' data={data} />
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ locale, query }) {
  const data = await getStoriesByCategory(query.cat.toLowerCase())
  return {
    props: {
      stories: data,
      ...(await serverSideTranslations(locale, ["story", "common", "category"]))
    }
  }
}

export default Category