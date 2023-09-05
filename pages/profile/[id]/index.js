import React, { useState } from "react";
import Head from 'next/head'
import Link from 'next/link'
// import nookies from 'nookies'
import { useRouter } from 'next/router'
import { FiFacebook, FiTwitter, FiInstagram, FiLink } from "react-icons/fi"
import { FaDeviantart } from "react-icons/fa"
import { IconContext } from "react-icons";
import { IoIosLogOut, IoIosLock } from "react-icons/io";
import { Divider, Image, Tabs, Tooltip, Empty, Spin } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { skipToken } from '@reduxjs/toolkit/query'

import { useAuth } from '../../../database/auth'
import { useChangeProfileMutation, useGetProfileQuery } from '../../../database/reducers/profile'
// import { getProfile } from "../../../database/actions/profile";
// import config from '../../../database/firebaseConfig'

import Pagination from "../../../components/common/Pagination";
import Settings from "../../../components/profile/Settings";
import Followers from "../../../components/profile/Followers";
import SocialButtons from "../../../components/header/SocialButtons";
import { placeholders } from "../../../utils/constants";
import AddToFavorites from "../../../components/common/AddToFavorites";

const Profile = () => {

  // TODO - CHANGE LINK COPY PATH WHEN LIVE !!!

  // const { data, isLoading, userExists } = props

  const auth = useAuth()

  const router = useRouter()
  const [newData, setNewData] = React.useState({
    banner: '',
    image: '',
    biography: '',
    username: '',
  })
  const [changeProfile] = useChangeProfileMutation()
  const { data, isLoading } = useGetProfileQuery({ id: router.query.id, type: 'show', uid: auth?.user?.uid ?? skipToken })
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false)
  const [isFollowingsOpen, setIsFollowingsOpen] = useState(false)
  const showMessage = React.useRef(false)
  const [message, setMessage] = React.useState(null)

  const handleOk = () => setIsModalOpen(false)
  const handleCancel = () => setIsModalOpen(false);

  const showFollowers = () => setIsFollowersOpen(isFollowersOpen => !isFollowersOpen)
  const showFollowings = () => setIsFollowingsOpen(isFollowingsOpen => !isFollowingsOpen)


  React.useEffect(() => {
    if (!isLoading) {
      if (!data?.userExists) {
        router.push('/404')
      }
    }
  }, [data?.userExists, isLoading])

  const changePassword = (values) => {
    auth.changePassword(values.oldPassword, values.newPassword)
  }

  const submit = async (values) => {
    if (((router.query.id === auth?.user.uid) || !router.query.id)) {
      await changeProfile({ data: { ...values, username: values.username ? values.username : newData.username ? newData.username : profile?.username }, id: auth.user.uid, form })
        .unwrap()
        .then((res) => {
          setMessage({ message: res.message, type: "success" })
          setNewData({ ...newData, ...res.newData })
          showMessage.current = true
        }).catch((res) => setMessage({ message: res.error, type: "error" }))
    }
  }

  return (
    <>
      <Head>
        <title>{newData.username ? newData.username : data?.profile?.username ? data?.profile?.username : ''} | Profile - Kronikea</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Spin spinning={!data?.userExists || auth.isLoading || isLoading}>
          <div className="md:px-4 mx-auto max-w-screen-xl" id="profile">
            <section className={`md:mt-6 relative`}>
              {/* BANNER */}
              <div style={{ backgroundImage: `url(${newData.banner ? newData.banner : data?.profile?.banner ? data?.profile?.banner : placeholders.card})` }} className={` bg-center h-56 w-full md:rounded-3xl bg-cover relative flex md:items-center items-start justify-between md:justify-end`}>
                <div className="flex md:mr-24 mr-4 md:justify-end mt-4 md:mt-0 justify-between w-full">
                  <div className="rounded-3xl mr-4 backdrop-filter backdrop-blur-md bg-opacity-20 px-2 w-fit bg-white flex items-center ml-4">
                    <div className="flex">
                      {data?.profile?.deviantart && <SocialButtons link={`https://deviantart.com/${data?.profile?.deviantart}`} title="Deviantart">
                        <FaDeviantart style={{ color: "white" }} />
                      </SocialButtons>}
                      {data?.profile?.twitter && <SocialButtons link={`https://twitter.com/${data?.profile?.twitter}`} title='Twitter'>
                        <FiTwitter style={{ color: "white" }} />
                      </SocialButtons>}
                      {data?.profile?.instagram && <SocialButtons link={`https://instagram.com/${data?.profile?.instagram}`} title="Instagram">
                        <FiInstagram style={{ color: "white" }} />
                      </SocialButtons>}
                      {data?.profile?.facebook && <SocialButtons link={`https://facebook.com/${data?.profile?.facebook}`} title="Facebook">
                        <FiFacebook style={{ color: "white" }} />
                      </SocialButtons>}
                      <Tooltip placement='bottom' title={"Copy my link"}>
                        <div onClick={() => {
                          navigator.clipboard.writeText(`https://www.kronikea.com/profile/${data?.profile?.id}`)
                        }} className="active:scale-95 transition duration-200 ease-in-out w-6 h-6 flex items-center justify-center rounded-md drop-shadow-xl mx-2 cursor-pointer" style={{ fontSize: '0.9rem' }}>
                          <FiLink style={{ color: "white" }} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  {/* <div className="active:scale-95 flex rounded-full backdrop-filter backdrop-blur-md bg-opacity-20 uppercase text-sm py-2 px-4 w-fit bg-primary text-white cursor-pointer shadow-lg">
                    Subscribe
                  </div> : */}
                  {(auth?.user && auth?.user?.uid !== data?.profile.id) || !auth?.user ?
                    <AddToFavorites userImage={auth?.user?.image} push={router.push} auth={auth && auth} type="profile" isFavorite={data?.profile.likedBy.includes(auth?.user?.uid)} username={auth?.user?.username} t={t} id={router.query.id} />
                    :
                    <div className="flex">
                      <Settings message={message} showMessage={showMessage} submit={submit} auth={auth} success={auth?.success} errors={auth?.errors} profile={data?.profile} changePassword={changePassword} t={t} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />
                      <Tooltip placement='bottom' title={t('common:logout').charAt(0).toUpperCase() + t('common:logout').slice(1)}>
                        <div onClick={() => auth.signout()} className="rounded-full p-2 backdrop-filter backdrop-blur-md bg-opacity-20 cursor-pointer">
                          <IconContext.Provider value={{ size: "1.3em", color: "#24292f" }}>
                            <IoIosLogOut color='white' />
                          </IconContext.Provider>
                        </div>
                      </Tooltip>
                    </div>
                  }
                </div>
              </div>
              {/* BANNER DETAILS */}
              <div className="bg-slate-50 dark:bg-zinc-800 relative md:top-0 -top-8 rounded-3xl h-fit w-full flex flex-col md:flex-row justify-center md:items-start items-center">
                <div className="w-56 h-full relative flex items-center justify-center">
                  <div className="absolute before:bg-slate-50 before:dark:bg-zinc-800 -top-20 profile__avatar w-48 h-48 flex items-center before:absolute before:content-[''] before:rounded-full before:shadow-lg before:w-52 before:h-52 justify-center rounded-full flex">
                    <Image
                      width={"100%"}
                      height={"100%"}
                      preview={{
                        maskClassName: 'rounded-full',
                      }}
                      src={newData.image ? newData.image : data?.profile?.image ? data?.profile?.image : placeholders.avatar}
                      alt={newData.username ? newData.username : data?.profile?.username}
                      style={{ borderRadius: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="md:p-4 px-12 md:w-1/2 w-full h-full md:mt-0 mt-32">
                  <div className="flex flex-col md:items-start items-center">
                    <h2 className="text-xl uppercase font-bold">{newData.username ? newData.username : data?.profile?.username}</h2>
                    <div className="flex justify-center text-center md:w-fit md:mt-2 mt-4">
                      <div style={{ borderRight: '1px solid #ececec' }} className="cursor-pointer counters__item pr-2" onClick={showFollowers}>
                        <p><span className="text-lg font-bold" >{data?.followers?.length}</span> {t('profile:followers')}</p>
                      </div>
                      <div className="cursor-pointer counters__item px-2" onClick={showFollowings}>
                        <p><span className="text-lg font-bold">{data?.followings?.length}</span> {t('profile:followings')}</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem' }} className="mt-2 text-center md:text-justify">{newData.biography ? newData.biography : data?.profile?.biography}</p>
                </div>
              </div>
            </section>
            <div className="profile mt-8 mb-8 px-4 text-zinc-900 dark:text-slate-100 dark:bg-zinc-900 bg-white rounded-lg shadow-lg">
              <section className="profile__right">
                <Tabs defaultActiveKey="1" centered items={[
                  {
                    key: '1',
                    label: t('profile:created').charAt(0).toUpperCase() + t('profile:created').slice(1),
                    children: (
                      <>
                        < div className="profile__right__stories">
                          <Divider plain>
                            <h4 className="text-xl text-center uppercase font-extralight my-6 text-zinc-900 dark:text-slate-50 mb-8">{`${t('profile:my')} ${t('common:stories')}`}</h4>
                          </Divider>
                          {data?.stories.length > 0 ?
                            <>
                              {auth?.user?.uid === router.query.id &&
                                <Link className="cursor-pointer mb-5 flex items-center capitalize" href="/story/new">
                                  <span className="w-5 h-5 dark:text-slate-50 dark:bg-zinc-900 bg-slate-200 text-zinc-800 rounded-full flex items-center justify-center mr-2">+</span> {t('form:add-story')}
                                </Link>}
                              <Pagination type='profile' data={data?.stories} />
                            </>
                            : auth?.user?.uid === router.query.id ? <div className="flex flex-col items-center justify-center">
                              <p className="text-lg text-zinc-400">{t('profile:empty-stories')}</p>
                              <Link href='/story/new'>
                                <button className="active:scale-95 rounded-xl mt-4 px-4 py-2 bg-primary text-slate-50 shadow-lg uppercase text-sm">{t('profile:first-story')}</button>
                              </Link>
                            </div> :
                              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          }
                        </div>
                        <div className="md:grid grid-cols-2 gap-24">
                          {/* CHARACTERS */}
                          <div className="profile__right__characters">
                            <Divider plain>
                              <h4 className="text-zinc-900 dark:text-slate-50 text-xl text-center uppercase font-extralight my-6">{`${t('profile:my')} ${t('common:characters')}`}</h4>
                            </Divider>
                            {auth?.user?.uid === router.query.id &&
                              <Link className="cursor-pointer mb-5 flex items-center capitalize" href="/character/new">
                                <span className="w-5 h-5 dark:text-slate-50 dark:bg-zinc-900 bg-slate-200 text-zinc-800 rounded-full flex items-center justify-center mr-2">+</span> {t('form:add-character')}
                              </Link>}
                            {data?.characters.length > 0 ?
                              <Pagination type='characters' data={data?.characters} />
                              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                          </div>
                          {/* LOCATIONS */}
                          <div className="profile__right__locations">
                            <Divider plain>
                              <h4 className="text-zinc-900 dark:text-slate-50 text-xl text-center uppercase font-extralight my-6">{`${t('profile:my')} ${t('common:locations')}`}</h4>
                            </Divider>
                            {auth?.user?.uid === router.query.id &&
                              <Link className="cursor-pointer mb-5 flex items-center capitalize" href="/location/new">
                                <span className="w-5 h-5 dark:text-slate-50 dark:bg-zinc-900 bg-slate-200 text-zinc-800 rounded-full flex items-center justify-center mr-2">+</span> {t('form:add-location')}
                              </Link>}
                            {data?.locations.length > 0 ?
                              <Pagination type='profile-locations' data={data?.locations} />
                              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                          </div>
                        </div></>)
                  },
                  {
                    key: '2',
                    label: (<span className="flex items-center">{data?.profile?.privateLikes && <IoIosLock />} <span className="ml-1">{t('profile:favorites').charAt(0).toUpperCase() + t('profile:favorites').slice(1)}</span></span>),
                    children: (
                      (!data?.profile?.privateLikes) || (router.query.id === auth?.user?.uid) ?
                        <>
                          {data?.profile?.privateLikes && auth?.user?.uid === router.query.id &&
                            <div className="text-slate-600 my-4">
                              <p className="flex items-center"><IoIosLock /> <span className="ml-1">{t('profile:private-tab-1')}</span>
                              </p>
                              <p>{t('profile:private-2')}</p>
                            </div>
                          }
                          {/* FAVORITE STORIES */}
                          <div className="profile__right__fav__stories">
                            <h4 className="text-xl mb-8 text-center uppercase font-extralight my-6">{t('profile:favorite-stories')}</h4>
                            {data?.favStories.length > 0 ?
                              <Pagination type='fav-profile' data={data?.favStories} />
                              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                          </div>
                          <Divider className="dark:border-stone-700" />
                          {/* FAVORITE CHARACTERS */}
                          <div className="profile__right__fav__characters">
                            <h4 className="text-xl mb-8 text-center uppercase font-extralight my-6">{t('profile:favorite-characters')}</h4>
                            {data?.favCharacters.length > 0 ?
                              <Pagination type='characters-archives' data={data?.favCharacters} />
                              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                          </div>
                        </>
                        :
                        <div className="mt-6 flex items-center justify-center flex-col">
                          <IoIosLock style={{ fontSize: '6rem' }} />
                          <p className="text-slate-500">{`${data?.profile?.username} ${t('profile:private-message')}`}</p>
                        </div>
                    )
                  }
                ]} />
              </section>
            </div>
          </div>
        </Spin>
        <Followers data={data?.followers} show={showFollowers} isOpen={isFollowersOpen} title="Followers" />
        <Followers data={data?.followings} show={showFollowings} isOpen={isFollowingsOpen} title='Favorite Authors' />
      </>
    </>
  )
}

export const getServerSideProps = async (context) => {
  // const admin = require('firebase-admin');
  // if (!admin.apps.length) admin.initializeApp(config);

  // const cookies = nookies.get(context);
  // const token = cookies.token ? await admin.auth().verifyIdToken(cookies.token) : null;
  // const uid = token ? token.uid : null;
  // const data = await getProfile(context.query.id, 'show', uid)
  return {
    props: {
      // data: data.data,
      // userExists: data.userExists,
      ...(await serverSideTranslations(context.locale, ["profile", 'form', 'auth', "common"]))
    },
  };
}

export default React.memo(Profile)