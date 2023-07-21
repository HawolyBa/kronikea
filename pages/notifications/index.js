import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { AiOutlineComment, AiOutlineUser, AiOutlineBook } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs';
import { BiCommentDetail } from 'react-icons/bi';
import { Divider, Empty, Spin } from 'antd'
import 'moment/locale/fr'
import moment from 'moment/moment';

import { useNotifcations } from '../../database/notifications'
import { placeholders } from '../../utils/constants'
import { useAuth } from '../../database/auth'

const Notifications = ({ isLoading }) => {
  const auth = useAuth()
  const notifications = useNotifcations()
  const { locale, push } = useRouter()
  const { t } = useTranslation()
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      push('/unauthorized')
    }
  }, [auth])


  React.useEffect(() => {
    if (notifications) {
      setData(notifications.items)
      if (notifications.items.some(item => !item.read))
        notifications.markAllAsRead()
    }
  }, [notifications.items])

  const filterItems = (type1, type2) => {
    setData(notifications.items.filter(item => type1 !== "all" ? item.type === type1 || item.type === type2 : item))
  }

  const render = (item) => {
    if (item.type === 'comment') {
      return `${item.senderName} ${t('notifications:chapter-commented')} ${item.chapterTitle}`
    } else if (item.type === 'storyLike') {
      return `${item.senderName} ${t('notifications:storyliked-message')} ${item.storyTitle} ${t('notifications:storyliked-message-2')}`
    } else if (item.type === "follow") {
      return `${item.senderName} ${t('notifications:follow-message')}`
    } else if (item.type === 'characterComment') {
      return `${item.senderName} ${t('notifications:character-feedback')} ${item.characterName}`
    } else if (item.type === 'characterLike') {
      return `${item.senderName} ${t('notifications:characterliked-message')} ${item.characterName} ${t('notifications:characterliked-message-2')}`
    } else if (item.type === 'newChapter') {
      return `${t('notifications:new-chapter')} ${item.storyTitle}`
    }
  }

  const linkRender = (item) => {
    if (item.type === 'comment') {
      return `/story/${item.storyId ? item.storyId : ''}/chapter/${item.chapterId ? item.chapterId : ''}`
    } else if (item.type === 'storyLike') {
      return `/story/${item.storyId ? item.storyId : ''}`
    } else if (item.type === "follow") {
      return `/profile/${item.sender ? item.sender : ''}`
    } else if (item.type === 'characterComment') {
      return `/character/${item.characterId ? item.characterId : ''}`
    } else if (item.type === 'characterLike') {
      return `/character/${item.characterId ? item.characterId : ''}`
    } else if (item.type === 'newChapter') {
      return `/story/${item.storyId ? item.storyId : ''}/chapter/${item.chapterId ? item.chapterId : ''}`
    } else return ''
  }

  const renderIcon = item => {
    if (item.type === 'comment') {
      return <AiOutlineComment />
    } else if (item.type === 'storyLike') {
      return <BsStar />
    } else if (item.type === "follow") {
      return <AiOutlineUser />
    } else if (item.type === 'characterComment') {
      return <BiCommentDetail />
    } else if (item.type === 'characterLike') {
      return <BsStar />
    } else if (item.type === 'newChapter') {
      return <AiOutlineBook />
    } else return ''
  }

  return (
    <>
      <Head>
        <title>{notifications?.items.filter(i => !i.read).length > 0 ? `(${notifications?.items.filter(i => !i.read).length})` : ''} Notifications - Kronikea</title>
      </Head>
      <div className='p-8'>
        <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto min-h-screen">
          <Spin spinning={auth.isLoading || !auth.user || isLoading || notifications.isLoading}>
            <h2 className="text-xl uppercase">Notifications</h2>
            <div className="mt-6">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <span>Filter: </span>
                  <span onClick={() => filterItems("all")} className="text-teal-700 active:scale-95 cursor-pointer px-2 border-r dark:border-zinc-800">
                    All
                  </span>
                  <span onClick={() => filterItems("follow")} className="text-teal-700 active:scale-95 cursor-pointer px-2 border-r dark:border-zinc-800">
                    <AiOutlineUser />
                  </span>
                  <span onClick={() => filterItems("characterLike", "StoryLike")} className="text-teal-700 active:scale-95 cursor-pointer px-2 border-r dark:border-zinc-800">
                    <BsStar />
                  </span>
                  <span onClick={() => filterItems("comment")} className="text-teal-700 active:scale-95 cursor-pointer px-2 border-r dark:border-zinc-800">
                    <AiOutlineComment />
                  </span>
                  <span onClick={() => filterItems("characterComment")} className="text-teal-700 active:scale-95 cursor-pointer px-2">
                    <BiCommentDetail />
                  </span>
                </div>
                <button onClick={() => notifications.deleteAll()} className='px-2 py-1 bg-primary text-slate-50 rounded-sm shadow-lg active:scale-95 bg-secondary'>Dismiss All</button>
              </div>
              <Divider className="dark:border-stone-700" />
              {data.length > 0 ? data.map(notification => (
                <div key={notification.id} className='flex items-center justify-between border-b dark:border-zinc-800 border-slate-200 py-3'>
                  <Link href={linkRender(notification)} className="flex items-center">
                    <span className="text-xl border-r dark:border-zinc-800 px-2 text-teal-700">
                      {renderIcon(notification)}
                    </span>
                    <span className="px-3">
                      <span className="flex md:flex-row flex-col md:items-center">
                        <div className="flex items-center">
                          <span className={`  overflow-hidden ${notification.type !== 'newChapter' ? 'w-5 h-5 rounded-full' : 'w-5 h-8 rounded-sm'}`}>
                            <img className="w-full h-full object-cover" src={notification.type !== 'newChapter' ? notification.userImage ? notification.userImage : placeholders.avatar : notification.banner ? notification.banner : placeholders.card} />
                          </span>
                          <p className="flex-1 text-sm ml-2 md:mr-2">{render(notification)}</p>
                        </div>
                        <small className='text-xs  text-slate-400'>{moment
                          .unix(notification?.createdAt?.seconds)
                          .locale(locale)
                          .fromNow()}</small>
                      </span>
                    </span>
                  </Link>
                  <div className="flex items-center text-xs">
                    <button onClick={() => notifications.deleteOne(notification.id)} className='px-2 py-1 bg-primary text-slate-50 rounded-sm shadow-lg active:scale-95 bg-secondary'>Dismiss</button>
                  </div>
                </div>
              ))
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </div>
          </Spin>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["notifications", "common"])),
    }
  }
}

export default Notifications