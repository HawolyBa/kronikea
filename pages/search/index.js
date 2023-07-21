import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { Select, Form, Radio, Divider, Empty, Spin, Tabs } from 'antd'

import { STATUS, LANGUAGES, CATEGORIES } from '../../utils/constants';
import { index } from '../../database/algolia'

import Pagination from '../../components/common/Pagination';
import { getAllStories } from '../../database/actions/stories';
import { charactersAPI } from '../../database/reducers/characters';
import { capitalize } from '../../utils/helpers';

const Explore = ({ stories, isLoading }) => {

  // TODO - ADD TRANSLATIONS

  const { t } = useTranslation();
  const { locale } = useRouter()
  const [form] = Form.useForm()
  const [charaForm] = Form.useForm()
  const [trigger, { data: characters, isLoading: isCharaLoading }] = charactersAPI.endpoints.getAllCharacters.useLazyQuery()
  const [data, setData] = React.useState([])
  const [charaData, setCharaData] = React.useState([])
  const [filters, setFilters] = React.useState({})
  const [charaFilters, setCharaFilters] = React.useState({})
  const [activeTab, setActiveTab] = React.useState('stories');

  const alphaCat = CATEGORIES.sort((a, b) => a.value.localeCompare(b.value, locale))

  React.useEffect(() => {
    if (stories.length > 0) {
      setData(stories)
      index.saveObjects(stories, { autoGenerateObjectIDIfNotExist: true });
    }
  }, [stories])

  React.useEffect(() => {
    if (characters && characters.length > 0) {
      setCharaData(characters)
    }
  }, [characters])

  React.useEffect(() => {
    form.resetFields()
    charaForm.resetFields()
    setFilters({
      lang: '',
      status: '',
      mature: false,
      popularity: true,
      date: false,
      title: false,
      categories: []
    })
    setCharaFilters({
      gender: '',
      sortBy: ''
    })
  }, [])

  React.useEffect(() => {
    if (activeTab === 'characters' && !characters) {
      trigger()
    }
  }, [activeTab]);

  React.useEffect(() => {
    index.search('test').then(({ hits }) => {
      console.log(hits);
    });
  }, [])

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
      .filter(story => filters.categories && filters.categories?.length > 0 ? story.categories ? story.categories.some(s => filters.categories.indexOf(s) >= 0) : story.category.some(s => filters.categories.indexOf(s) >= 0) : story)
    )
  }, [filters])

  React.useEffect(() => {
    if (characters && characters.length > 0) {
      setCharaData([...characters]
        .sort((a, b) => {
          if (charaFilters.date) {
            return a.createdAt && b.createdAt && typeof a.createdAt === "object"
              ? new Date(b.createdAt.seconds * 1000) -
              new Date(a.createdAt.seconds * 1000)
              : new Date(b.createdAt) - new Date(a.createdAt)
          } else if (charaFilters.firstname) {
            if (a.firstname < b.firstname) {
              return -1;
            }
            if (a.firstname > b.firstname) {
              return 1;
            }
            return 0;
          } else if (charaFilters.popularity) {
            return b.likedBy.length - a.likedBy.length
          }
        })
        .filter(chara => charaFilters.gender ? chara.gender === charaFilters.gender : chara)
      )
    }
  }, [charaFilters])

  return (
    <>
      <Head>
        <title>Explore - Kronikea</title>
      </Head>
      <div className='archive custom__archive w-full'>
        <div className="max-w-screen-xl pb-8 md:py-8 md:px-8 md:px-4 mx-auto">
          <h2 className='text-center mb-6 text-xl uppercase'>{t('common:explore')}</h2>
          <Tabs activeKey={activeTab}
            onChange={key => setActiveTab(key)} centered defaultActiveKey='stories' items={[
              {
                label: <span className='capitalize'>{t('common:stories')}</span>,
                key: 'stories',
                children: (
                  <>
                    <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-md md:flex md:justify-between md:items-center w-full">
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
                          <div className="flex md:w-1/4 w-full">
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
                                  options={[{ value: "popularity", label: t('common:popularity') }, { value: "date", label: "Date" }, { value: "title", label: "Title" }]}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="md:mr-3 md:w-1/4 w-full capitalize">
                            <Form.Item name="language" label={t('common:language')}>
                              <Select
                                allowClear="true"
                                onChange={l => setFilters({ ...filters, lang: l })}
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
                          <div className='md:w-1/4 md:mr-3 w-full capitalize'>
                            <Form.Item name="status" label={t('category:status')} >
                              <Select
                                onChange={s => setFilters({ ...filters, status: s })}
                                showSearch
                                allowClear
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
                          <div className='md:w-1/4 md:mr-3 w-full capitalize'>
                            <Form.Item name="categories" label={t('category:categories')} >
                              <Select
                                onChange={s => setFilters({ ...filters, categories: s })}
                                mode="multiple"
                                showSearch
                                allowClear
                                options={alphaCat.map(c => ({
                                  value: c.value,
                                  label: capitalize(t(`common:${c.value}`)),
                                }))}
                                filterOption={(input, option) =>
                                  (option.value ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Form>
                    </div>
                    <Divider className="dark:border-stone-700" />
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
                label: <span className='capitalize'>{t('common:characters')}</span>,
                key: 'characters',
                children: (
                  <>
                    <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-md md:flex md:justify-between md:items-center w-full">
                      <Form name="charafilter"
                        initialValues={{
                          gender: '',
                          sortBy: 'popularity',
                        }}
                        form={charaForm}
                        style={{ width: "100%" }}
                        layout='vertical'>
                        <div className="md:flex">
                          <div className="flex md:w-1/4 w-full">
                            <div className="md:w-1/2 md:mr-3 ml-3 flex-1">
                              <Form.Item name="sortBy" label={t('common:sort-by')} >
                                <Select
                                  onChange={(v) => setCharaFilters({
                                    ...filters,
                                    firstname: v === 'firstname' ? true : false,
                                    date: v === 'date' ? true : false,
                                    popularity: v === 'popularity' ? true : false
                                  })}
                                  options={[{ value: "popularity", label: "Popularity" }, { value: "date", label: "Date" }, { value: "firstname", label: "Name" }]}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="md:mr-3 md:w-1/4 w-full capitalize">
                            <Form.Item name="gender" label={t('common:gender')}>
                              <Select
                                allowClear="true"
                                onChange={l => setCharaFilters({ ...filters, gender: l })}
                                showSearch
                                options={[
                                  { value: "male", label: "Male" },
                                  { value: "female", label: "Female" },
                                  { value: "other", label: "Other" }
                                ]}
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
                    <Spin spinning={isCharaLoading}>
                      {charaData?.length > 0 ?
                        <Pagination dataPerPage={10} type='characters-archives' data={charaData} />
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

export async function getStaticProps({ locale }) {
  const data = await getAllStories()
  return {
    props: {
      stories: data.data,
      ...(await serverSideTranslations(locale, ["story", "common", "category"]))
    }
  }
}

export default Explore