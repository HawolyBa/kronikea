import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import nookies from 'nookies'
import { default as Img } from 'next/image'
import { Divider, Image, Tag, Tabs, Empty, Tooltip, Spin, Badge } from 'antd';
import { BsFillStarFill } from 'react-icons/bs';
import { IoIosLock } from "react-icons/io";
import { AiOutlineBars, AiFillEdit } from 'react-icons/ai';
import { BookOutlined, FlagOutlined, CommentOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import 'moment/locale/fr'
import moment from 'moment/moment';

import { useAuth } from '../../../database/auth'
import serviceAccount from '../../../database/serviceAccount'
import { CATEGORIES, colors, LANGUAGES, placeholders } from '../../../utils/constants'
import { capitalize, intersperse } from '../../../utils/helpers'

import CharacterCard from '../../../components/common/CharacterCard';
import LocationCard from '../../../components/common/LocationCard';
import Banner from '../../../components/common/Banner';
import AddToFavorites from '../../../components/common/AddToFavorites';
import { getStory } from '../../../database/actions/stories'
import Chapters from '../../../components/story/Chapters'
import AddButton from '../../../components/common/AddButton'

const Story = ({ isLoading, data, storyExists }) => {

  // TODO - COPYRIGHTS 
  // TODO - GERER LES ESPACES DANS LES TAGS

  const auth = useAuth();
  const { t } = useTranslation()
  const { locale, query, push } = useRouter()
  const [storyDate, setStoryDate] = React.useState(null)
  let tags = data?.story?.tags.map(function (tag, i) {
    return <Link key={i} href={`/tag/${tag}`}>{`${tag}`}</Link>;
  })
  tags = data?.story && intersperse(tags, ', ')

  React.useEffect(() => {
    if (!storyExists) {
      push('/404')
    }
  }, [storyExists])

  React.useEffect(() => {
    if (data && data?.story?.createdAt) {
      setStoryDate(data?.story?.createdAt.seconds ? moment.unix(data?.story?.createdAt.seconds) : moment(data?.story?.createdAt))
    }
  }, [data])

  React.useEffect(() => {
    if (!auth.isLoading && !isLoading && storyExists && (data.story.authorId !== auth.user.uid && !data?.story.public || !data?.story.public && !auth.user)) {
      push('/unauthorized')
    }
  }, [data, auth, isLoading, storyExists])
  return (
    <>
      <Head>
        <title>{`${data?.story?.title ? data?.story?.title : ''} by ${data?.story?.authorName ? data?.story?.authorName : ''}`} - Kronikea</title>
      </Head>
      <Spin spinning={auth?.isLoading || isLoading || !storyExists || (!data?.story?.public && data.story.authorId !== auth.user.uid)}>
        <div className='story min-h-screen'>
          {/* TOP DETAILS */}
          <div className='md:max-w-screen-xl w-full md:px-4 mx-auto md:mt-6 '>
            <Banner image={data?.story?.banner}>
              <div className="w-full flex md:items-center items-start md:justify-end md:pr-8 lg:pr-24 h-full overflow-hidden rounded-3xl z-20">
                <div className="w-full flex items-center md:justify-end justify-between px-8 py-6 md:py-0">
                  <div className="flex items-center">
                    <div className="rounded-full text-white bg-primary p-2 mr-3">
                      <BsFillStarFill style={{ fontSize: "1.2rem" }} />
                    </div>
                    <span className="text-xl">{data?.story?.likedBy?.length}</span>
                  </div>
                  {(auth?.user && auth?.user?.uid !== data?.story?.authorId) || !auth?.user ?
                    <AddToFavorites storyTitle={data?.story?.title} userImage={auth?.user?.image} push={push} auth={auth && auth} isFavorite={data?.story?.likedBy.includes(auth?.user?.uid)} username={auth?.user?.username} type="story" t={t} id={query.id} /> :
                    <Link className="active:scale-95 bg-white backdrop-filter backdrop-blur-md bg-opacity-20 flex items-center uppercase padding py-2 px-4 border-2 border-primary ml-6 text-xs rounded-xl" href={`/story/${data?.story?.id}/edit`}>
                      <AiFillEdit /> <span className=' ml-1'>{t('common:edit')}</span>
                    </Link>
                  }
                </div>
              </div>
            </Banner>
            <section className="z-30 bg-slate-50 -mb-32 md:mb-0 bg-transparent relative md:top-0 -top-8 rounded-t-3xl h-fit w-full flex flex-col md:flex-row md:items-start items-center">
              <div className="md:w-80 w-full md:ml-12 lg:ml-24 h-full relative flex items-center justify-center">
                <div className="w-full flex items-center justify-center -top-28 relative md:absolute flex-col">
                  <div className={`poster mb-5 before:bg-slate-50 before:dark:bg-zinc-800 before:absolute before:content-[''] before:rounded-lg before:shadow-lg flex items-center justify-center rounded-lg z-20`}>
                    <Image
                      width={"100%"}
                      height={"100%"}
                      src={data?.story?.banner}
                      alt={data?.story?.title}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                    />
                  </div>
                  <div className='md:hidden flex px-12'>
                    <h2 className="text-xl uppercase font-bold text-center">{data?.story?.title}</h2>
                    <div className="ml-4">
                      {!data?.story?.public &&
                        <Tooltip placement='bottom' title="Only you can see this page while private">
                          <span className="bg-secondary p-1 flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>
                        </Tooltip>
                      }
                    </div>
                  </div>

                </div>
              </div>
              {/* <h2 className="text-xl uppercase font-bold">{data.title}</h2> */}
              <div className="md:p-4 px-12 md:w-1/2 w-full h-full md:mt-0 mt-32 hidden md:block">
                <div className="flex flex-col md:items-start items-center">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl uppercase font-bold mb-0">{data?.story?.title}</h2>
                    <div className="ml-4">
                      {!data?.story?.public &&
                        <Tooltip placement='bottom' title="Only you can see this page while private">
                          <span className="bg-secondary p-1 flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>
                        </Tooltip>
                      }
                    </div>
                  </div>

                </div>
                <span className="block mt-3 text-sm capitalize story-title text-white">
                  <Link href={`/profile/${data?.story?.authorId}`}>
                    <div className='flex items-center cursor-pointer'>
                      <div className="mr-2 author-avatar rounded-full w-8 h-8 overflow-hidden relative">
                        <Img src={data?.story?.userImage ? data?.story?.userImage : placeholders.avatar} alt={data?.story?.authorName} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <span className="text-zinc-900 dark:text-slate-50">{data?.story?.authorName}</span>
                    </div>
                  </Link>
                </span>
                <div className="capitalize mt-4">
                  {data?.story?.mature && <Tag color="#b4333a">{t('common:explicit')}</Tag>}
                  {data?.story?.categories ? data?.story?.categories.map(cat => (
                    <Link key={cat} href={`/category/${cat}`}>
                      <Tag color={colors.primary}>{t(`common:${cat}`)}</Tag>
                    </Link>)
                  ).reduce((prev, curr) => [prev, ' ', curr]) : data?.story.category.map(cat => (
                    <Link key={cat} href={`/category/${CATEGORIES.find(c => c.id === cat).value}`}>
                      <Tag color={colors.primary}>{t(`common:${cat}`)}</Tag>
                    </Link>)
                  ).reduce((prev, curr) => [prev, ' ', curr])}
                </div>
                <div className=" metadatas mt-4 text-zinc-900 dark:text-slate-50 ">
                  <ul className='flex items-center text-md font-bold'>
                    <li className='flex'><AiOutlineBars /> <span className='ml-1'>{data?.chapters?.length}</span></li>
                    {data?.story?.language &&
                      <Tooltip placement='bottom' title={LANGUAGES.find(l => l.value === data?.story?.language.toLowerCase()).name}>
                        <li className="uppercase"><FlagOutlined /> {data?.story?.language}</li>
                      </Tooltip>
                    }
                    <li><CommentOutlined /> {data?.story?.commentsCount ? data?.story?.commentsCount : 0}</li>
                    <li>
                      <ClockCircleOutlined /> {locale === 'en' ?
                        storyDate?.locale('en').format("MMM DD YYYY")
                        : storyDate?.locale('fr').format("DD MMMM YYYY")}
                    </li>
                  </ul>
                </div>
                <p className='mt-3 mb-1 text-sm text-zinc-500 dark:text-slate-50'>{data?.story?.summary}</p>
                <span className="font-bold text-xs">Tags: {tags}</span>
              </div>
            </section>
          </div >
          {/* BOTTOM DETAILS */}
          <div className="px-4">
            <div className="hidden  bg-white dark:bg-zinc-900 rounded-lg shadow-lg mt-44 md:flex w-full md:max-w-screen-xl md:mx-auto mb-8 z-40">
              <div className='w-1/2 p-4'>
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className="text-zinc-800 capitalize dark:text-slate-50">{t('story:main')}</h4>
                </Divider>
                {data?.story?.mainCharacters?.length > 0 ?
                  <div className="w-full grid lg:grid-cols-3 grid-cols-2 mb-8 gap-6">
                    {data?.story?.mainCharacters?.map(char =>
                      char.public ?
                        <CharacterCard key={char.id} data={char} /> :
                        <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                          <CharacterCard key={char.id} data={char} />
                        </Badge.Ribbon>
                    )}
                  </div> :
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                {/* <Divider className="dark:border-stone-700" orientation="left" plain>
                <h4 className="text-zinc-800 dark:text-slate-50 capitalize">{t('story:secondary')}</h4>
              </Divider>
              {data?.story?.secondaryCharacters?.length > 0 ?
                <div className="w-full grid lg:grid-cols-3 grid-cols-2 mb-8 gap-6">
                  {data?.story?.secondaryCharacters?.map(char => (
                    char.public ?
                      <CharacterCard key={char.id} data={char} /> :
                      <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                        <CharacterCard key={char.id} data={char} />
                      </Badge.Ribbon>
                  ))}
                </div> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />} */}
                {auth?.user?.uid === data?.story?.authorId && <AddButton name={t('common:add-location')} link={`/location`} />}
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className="text-zinc-800 capitalize dark:text-slate-50">{t('common:locations')}</h4>
                </Divider>
                {data?.locations?.length > 0 ?
                  <div className="w-full grid lg:grid-cols-3 grid-cols-2 mb-8 gap-6">
                    {data?.locations?.map(loc => (
                      <LocationCard key={loc.id} data={loc} />
                    ))}
                  </div> :
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              </div>
              <div className='w-1/2 py-4 px-8'>
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className="text-zinc-800 dark:text-slate-50 uppercase">{t('story:chapters')}</h4>
                </Divider>
                {auth?.user?.uid === data?.story?.authorId && <AddButton name={t('story:add-chapter')} link={`/story/${data?.story?.id}/chapter`} />}
                {
                  data?.chapters?.length > 0 ?
                    <Chapters id={data?.story?.id} t={t} chapters={data?.chapters} isAuthor={auth?.user?.uid === data?.story?.authorId} /> :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
                {/* SIMILAR STORIES  */}
              </div>
            </div >
          </div>
          {/* MOBILE  */}
          <div className="relative md:hidden p-2 z-40">
            <div className="rounded-lg py-8 px-4 mb-12 bg-zinc-100 dark:bg-zinc-900 w-full shadow-lg">
              <Tabs centered defaultActiveKey='item-1' items={[
                {
                  label: t('story:details').charAt(0).toUpperCase() + t('story:details').slice(1),
                  key: 'item-1',
                  children: (
                    <div className="w-full">
                      <span className="block mt-3 text-sm capitalize story-title text-white">
                        <Link href={`/profile/${data?.story?.authorId}`}>
                          <div className='flex items-center cursor-pointer'>
                            <div className="mr-2 author-avatar rounded-full w-8 h-8 overflow-hidden relative">
                              <Img alt={data?.story?.authorName} src={data?.story?.userImage ? data?.story?.userImage : placeholders.avatar} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <span className="text-zinc-900 dark:text-slate-50">{data?.story?.authorName}</span>
                          </div>
                        </Link>
                      </span>
                      <div className="capitalize mt-4">
                        {data?.story?.mature && <Tag color="#b4333a">{t('common:explicit')}</Tag>}
                      </div>
                      <div className=" metadatas mt-4 text-zinc-900 dark:text-slate-50">
                        <ul className='flex items-center text-md font-bold'>
                          <li><BookOutlined /> {data?.chapters?.length}</li>
                          <li className='uppercase'><FlagOutlined /> {data?.story.language}</li>
                          <li><CommentOutlined /> 32</li>
                          <li><ClockCircleOutlined /> {locale === 'en' ? moment.unix(data?.story?.createdAt?.seconds).format("DD MM YYYY") : moment.unix(data?.story?.createdAt.seconds).locale('fr').format("DD MMMM YYYY")}</li>
                        </ul>
                      </div>
                      <p className='my-3 text-sm text-zinc-500 dark:text-slate-50'>{data?.story?.summary}</p>
                      <div className='my-2'>
                        {data?.story?.categories?.length > 0 ? data?.story?.categories.map(cat => (
                          <Link key={cat} href={`/category/${cat}`}>
                            <Tag color={colors.primary}>{t(`common:${cat}`)}</Tag>
                          </Link>)
                        ).reduce((prev, curr) => [prev, ' ', curr]) : data?.story?.category.length > 0 && data?.story?.category.map(cat => (
                          <Link key={cat} href={`/category/${CATEGORIES.find(c => c.id === cat).value}`}>
                            {t(`common:${cat}`)}
                          </Link>)
                        ).reduce((prev, curr) => [prev, ' ', curr])}
                      </div>
                    </div>
                  )
                },
                {
                  label: t('story:chapters').charAt(0).toUpperCase() + t('story:chapters').slice(1),
                  key: 'item-2',
                  children: (<>
                    {auth?.user?.uid === data?.story?.authorId && <AddButton name={t('story:add-chapter')} link={`/story/${data?.story?.id}/chapter`} />}
                    {data?.chapters?.length ?
                      <Chapters id={data?.story?.id} t={t} chapters={data?.chapters} isAuthor={auth?.user?.uid === data?.story?.authorId} />
                      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  </>)
                },
                {
                  label: t('common:characters').charAt(0).toUpperCase() + t('common:characters').slice(1),
                  key: 'item-3',
                  children: (
                    <>
                      <div>
                        {auth?.user?.uid === data?.story?.authorId && <AddButton name={t('common:add-character')} link={`/character`} />}
                        <Divider className="dark:border-stone-700" orientation="left" plain>
                          <h4 className="text-zinc-800 dark:text-slate-50"> {capitalize(t('story:main'))}</h4>
                        </Divider>
                        {data?.story?.mainCharacters?.length > 0 ?
                          <div className="w-full grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
                            {data?.story?.mainCharacters?.map(char => (
                              <CharacterCard key={char.id} data={char} />
                            ))}
                          </div>
                          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                      </div>

                      {/* <div>
                        <Divider className="dark:border-stone-700" orientation="left" plain>
                          <h4 className="text-zinc-800 dark:text-slate-50">Secondary Characters</h4>
                        </Divider>
                        {data?.story?.secondaryCharacters?.length > 0 ?
                          <div className="w-full grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
                            {data?.story?.secondaryCharacters?.map(char => (
                              <CharacterCard key={char.id} data={char} />
                            ))}
                          </div>
                          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                      </div> */}
                    </>
                  )
                },
                {
                  label: t('common:locations').charAt(0).toUpperCase() + t('common:locations').slice(1),
                  key: 'item-4',
                  children: (
                    <>
                      {auth?.user?.uid === data?.story?.authorId && <AddButton name={t('common:add-location')} link={`/location`} />}
                      {data?.locations?.length > 0 ?
                        <div className="w-full grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
                          {data?.locations?.map(loc => (
                            <LocationCard key={loc.id} data={loc} />
                          ))}
                        </div> :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      }</>
                  )
                }
              ]}
              />
            </div>
          </div>
        </div >
      </Spin>
    </>
  )
}

export async function getServerSideProps(context) {
  const admin = require('firebase-admin');
  const { credential } = require('firebase-admin');

  if (!admin.apps.length) admin.initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: "https://story-center.firebaseio.com"
  });

  const cookies = nookies.get(context);
  const token = cookies.token ? await admin.auth().verifyIdToken(cookies.token) : null;
  const uid = token ? token.uid : null;
  let data = await getStory(context.query.id, uid)
  return {
    props: {
      data: data.data,
      storyExists: data.storyExists,
      ...(await serverSideTranslations(context.locale, ["story", "common"]))
    }
  }
}


export default Story