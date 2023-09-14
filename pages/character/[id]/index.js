import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { default as Img } from 'next/image'
import nookies from 'nookies'
import { useRouter } from 'next/router';
import { Image, Divider, Tabs, Spin, Empty, Tooltip, Badge } from 'antd';
import { BsFillStarFill } from 'react-icons/bs';
import { IoIosLock } from 'react-icons/io'
import { AiFillEdit } from 'react-icons/ai';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { useAuth } from '../../../database/auth'
import { colors } from '../../../utils/constants'
import { useGetCharacterCommentsQuery, useSubmitCharacterFeedbackMutation, useDeleteCharacterCommentMutation } from '../../../database/reducers/characters'
import serviceAccount from '../../../database/serviceAccount'

import Comments from "../../../components/common/Comments";
import StoryMiniCard from '../../../components/common/StoryMiniCard';
import CharacterCard from '../../../components/common/CharacterCard';
import AddReview from '../../../components/common/AddReview';
import Banner from '../../../components/common/Banner';
import { placeholders } from '../../../utils/constants';
import AddToFavorites from '../../../components/common/AddToFavorites';
import { getCharacter } from '../../../database/actions/characters';
import Report from '../../../components/common/Report';
import DetailsLine from '../../../components/character/DetailsLine';
import Button from '../../../components/common/Button';

const Character = (props) => {

  const { push, query } = useRouter();
  const { t } = useTranslation();
  const { data, isLoading } = props
  const { data: comments } = useGetCharacterCommentsQuery({ id: query.id, type: "characterId" }, { refetchOnMountOrArgChange: true })
  const auth = useAuth()
  const [modal, setModal] = useState(false)
  const [commentsCount, setCommentsCount] = React.useState(0)
  const showModal = () => setModal(!modal)
  const [submitReview] = useSubmitCharacterFeedbackMutation()
  const [deleteComment] = useDeleteCharacterCommentMutation()
  const [res, setRes] = React.useState(null)

  React.useEffect(() => {
    setCommentsCount(comments?.userComment ? comments?.comments?.length + 1 : comments?.comments?.length || 0)
  }, [comments])

  const submitComment = async (form, values) => {
    await submitReview({
      info: {
        userImage: auth?.user?.image,
        userId: auth.user.uid,
        username: auth.user.username,
        content: values.content,
        characterId: query.id,
        authorId: data.character.authorId,
        answer: false,
        likedBy: [],
        dislikedBy: [],
        voters: [],
        characterName: `${data.character.firstname} ${data.character.lastname ? data.character.lastname : ""
          }`,
      },
      userComment: comments.userComment,
    }).unwrap()
      .then((res) => form.resetFields())
      .catch((err) => {
        setRes(err)
      })
  }

  React.useEffect(() => {
    if (res && res.message) {
      setModal(false)
    }
  }, [res])

  React.useEffect(() => {
    if (!data.charaExists) {
      push('/404')
    }
  }, [data])

  React.useEffect(() => {
    if (!auth.isLoading && !isLoading && data.charaExists && (data.character.authorId !== auth.user.uid && !data?.character.public || !data?.character.public && !auth.user)) {
      push('/unauthorized')
    }
  }, [data, auth, isLoading])

  return (
    <>
      <Head>
        <title>{`${data?.character?.firstname} ${data?.character?.lastname}`} - Kronikea</title>
      </Head>
      <Spin spinning={auth.isLoading || isLoading || !data?.charaExists || (!data?.character?.public && data?.character?.authorId !== auth.user.uid)}>
        <div className="w-full character text-zinc-900 dark:text-slate-50">
          <div className='max-w-screen-xl w-full md:px-4 mx-auto md:pt-6 '>
            <Banner image={data?.character?.image}>
              <div className="w-full flex md:items-center items-start md:justify-end md:pr-8 lg:pr-24 h-full overflow-hidden rounded-3xl z-20">
                <div className="w-full flex items-center md:justify-end justify-between px-8 py-6 md:py-0">
                  <div className="flex items-center">
                    <div className="rounded-full text-white bg-primary p-2 mr-3">
                      <BsFillStarFill style={{ fontSize: "1.2rem" }} />
                    </div>
                    <span className="text-xl">{data?.character?.likedBy?.length}</span>
                  </div>
                  {(auth?.user && auth?.user?.uid !== data?.character?.authorId) || !auth?.user ?
                    <>
                      <AddToFavorites characterName={`${data?.character?.firstname} ${data?.character?.lastname ? data?.character?.lastname : ""
                        }`} userImage={auth?.user?.image} push={push} auth={auth && auth} type='character' isFavorite={data?.character?.likedBy.includes(auth?.user?.uid)} username={auth?.user?.username} id={query.id} t={t} />
                      <Report authorId={auth?.user?.uid} authorName={auth?.user?.username} auth={auth} routeId={query.id} type='character' />
                    </>
                    :
                    <Link className="active:scale-95 bg-white backdrop-filter backdrop-blur-md bg-opacity-20 flex items-center uppercase padding py-2 px-4 border-2 border-primary ml-6 text-xs rounded-xl" href={`/character/${data?.character?.id}/edit`}>
                      <AiFillEdit /> <span className=' ml-1'>{t('common:edit')}</span>
                    </Link>}
                </div>
              </div>
            </Banner>
            <section className="bg-slate-50 z-30 -mb-32 md:mb-0 dark:bg-zinc-800 relative md:top-0 -top-8 md:rounded-none rounded-3xl h-fit w-full flex flex-col md:flex-row md:items-start items-center">
              <div className="md:w-80 w-full md:ml-12 lg:ml-24 h-full relative flex items-center justify-center">
                <div className="w-full flex items-center justify-center -top-28 relative md:absolute flex-col ">
                  <div className={`poster mb-5 before:bg-slate-50 before:dark:bg-zinc-800 before:absolute before:content-[''] before:rounded-lg before:shadow-lg flex items-center justify-center rounded-lg z-20`}>
                    <Image
                      width={"100%"}
                      height={"100%"}
                      src={data?.character?.image}
                      alt={`${data?.character?.firstname} ${data?.character?.lastname}`}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                    />
                  </div>
                  <div className='md:hidden flex px-12'>
                    <h2 className="text-xl uppercase font-bold text-center">{`${data?.character?.firstname} ${data?.character?.lastname}`}</h2>
                    <div className="ml-4">
                      {!data?.character?.public &&
                        <Tooltip placement='bottom' title="Only you can see this page while private">
                          <span className="bg-secondary p-1 flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:p-4 px-12 md:w-1/2 w-full h-full md:mt-0 mt-32 hidden md:block">
                <div className="flex flex-col md:items-start items-center">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl uppercase font-bold mb-0">{`${data?.character?.firstname} ${data?.character?.lastname}`}</h2>
                    <div className="ml-4">
                      {!data?.character?.public &&
                        <Tooltip placement='bottom' title="Only you can see this page while private">
                          <span className="bg-secondary p-1 flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </div>
                <span className="block mt-3 text-sm capitalize story-title">
                  <Link href={`/profile/${data?.character?.authorId}`}>
                    <div className='flex items-center cursor-pointer'>
                      <div className="mr-2 author-avatar rounded-full w-8 h-8 overflow-hidden relative">
                        <Img src={data?.character?.userImage ? data?.character?.userImage : placeholders.avatar} alt={data?.character?.authorName} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <span className="text-zinc-900 dark:text-slate-50">{data?.character?.authorName}</span>
                    </div>
                  </Link>
                </span>
                <p className="bio">{data?.character?.description}</p>
                <div className="grid grid-cols-2 gap-x-8 place-items-start text-xs">
                  <DetailsLine type="desktop" character={data?.character} t={t} />
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* DETAILS MD*/}
        <div className="px-4">
          <div className="my-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg hidden md:block mt-24 max-w-screen-xl mx-auto py-8 px-4">
            <div className="md:flex">
              <div className="md:w-1/2 w-full">
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className='capitalize text-zinc-900 dark:text-slate-50'>
                    {t('common:stories')}
                  </h4>
                </Divider>
                {data?.character?.stories?.length > 0
                  ? <div className="w-full gap-y-6 grid gap-2 mt-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 mb-8 place-content-center place-items-center">
                    {data?.character?.stories.map((story) => (
                      story.public ?
                        <StoryMiniCard width={'100%'} height={72} type="character" key={story.id} data={story} /> :
                        <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                          <StoryMiniCard width={'100%'} height={72} type="character" key={story.id} data={story} />
                        </Badge.Ribbon>
                    ))}
                  </div>
                  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className='text-zinc-900 dark:text-slate-50 capitalize'>
                    {t('character:relationships')}
                  </h4>
                </Divider>
                {data?.character?.relatives?.length > 0 ?
                  <div className="w-full grid gap-5 grid-cols-2 mt-3 md:grid-cols-3 ">
                    {data?.character?.relatives.map(char =>
                      char.public ?
                        <CharacterCard type="show" key={char.id} data={char} /> :
                        <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                          <CharacterCard type="show" key={char.id} data={char} />
                        </Badge.Ribbon>
                    )}
                  </div>
                  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
              </div>

              <div className="md:w-1/2 pl-4 shadow-xl ml-4 w-full">
                <Divider className="dark:border-stone-700" orientation="left" plain>
                  <h4 className='text-zinc-900 dark:text-slate-50'>
                    {commentsCount} {t(`${commentsCount > 1 ? 'chapter:comments' : 'chapter:comment'}`)}
                  </h4>
                </Divider>
                {!comments?.userComment ?
                  auth?.user ?
                    <div className="float-right mr-2 mb-2">
                      <Button onClick={showModal} color="bg-primary">
                        {t('character:review-character')}
                      </Button>
                    </div>
                    :
                    <p className="float-right mr-2">{t('character:login-message')}
                      <Button color='bg-primary' onClick={() => push('/auth')}>{t('character:click-here')}</Button></p>
                  : <></>
                }
                {(comments?.userComment || comments?.comments?.length > 0) &&
                  <div className="clear-right">
                    <Comments t={t} authorId={data?.character?.authorId} authorName={data?.character?.authorName} routeId={query.id} type="character-comment" deleteComment={deleteComment} auth={auth} comments={comments?.comments} setRes={setRes} userComment={comments?.userComment} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        {/* DETAILS SM */}
        <div className="w-full relative z-30 p-4 md:hidden mb-12">
          <div className="dark:bg-zinc-900 px-4 pb-8 rounded-xl shadow-lg dark:text-slate-50">
            <Tabs centered defaultActiveKey="item-1" items={[
              {
                label: (<span className='capitalize'>{t('story:details')}</span>),
                key: 'item-1',
                children: (
                  <>
                    <p className="px-8 text-center dark:text-slate-50">{data?.character?.description}</p>
                    <Divider className="dark:border-stone-700" />
                    <div className="grid grid-cols-2 gap-3 place-items-center dark:text-slate-50">
                      <DetailsLine character={data?.character} t={t} type="mobile" />
                    </div></>
                )
              },
              {
                label: (<span className='capitalize'>{t('common:stories')}</span>),
                key: 'item-2',
                children: data?.character?.stories.length > 0 ?
                  <div className="w-full grid gap-2 gap-y-6 mt-3 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-3 grid-cols-2 place-content-center place-items-center">
                    {data?.character?.stories?.map((story) =>
                      story.public ?
                        <StoryMiniCard width={'100%'} height={72} type="character" key={story.id} data={story} /> :
                        <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                          <StoryMiniCard width={'100%'} height={72} type="character" key={story.id} data={story} />
                        </Badge.Ribbon>
                    )}
                  </div>
                  :
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              },
              {
                label: (<span className='capitalize'>{t('character:relationships')}</span>),
                key: 'item-3',
                children: data?.character?.relatives.length > 0 ?
                  <div className="w-full grid gap-3 grid-cols-2 sm:grid-cols-3">
                    {data?.character?.relatives.map(char => (
                      char.public ?
                        <CharacterCard type="show" key={char.id} data={char} /> :
                        <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                          <CharacterCard type="show" key={char.id} data={char} />
                        </Badge.Ribbon>
                    ))}
                  </div>
                  :
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              },
              {
                label: (<span className='capitalize'>{t('chapter:comments')}</span>),
                key: 'item-4',
                children: (
                  <div className="shadow-xl mt-4">
                    {!comments?.userComment ?
                      auth?.user ?
                        <div className="float-right mr-2 mb-2">
                          <Button onClick={showModal} color="bg-primary">
                            {t('character:review-character')}
                          </Button>
                        </div>
                        :
                        <p className="float-right mr-2">{t('character:login-message')}
                          <Button color='bg-primary' onClick={() => push('/auth')}>{t('character:click-here')}</Button></p>
                      : <></>
                    }
                    <div className="clear-right">
                      <Comments t={t} routeId={query.id} type="character-comment" setRes={setRes} deleteComment={deleteComment} auth={auth} comments={comments?.comments} userComment={comments?.userComment} />
                    </div>
                  </div>
                )
              }
            ]} />
          </div>
        </div>
        <AddReview onClose={() => setModal(false)} auth={auth} submitComment={submitComment} t={t} modal={modal} showModal={showModal} />
      </Spin>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const admin = require('firebase-admin');
  const { credential } = require('firebase-admin');

  if (!admin.apps.length) admin.initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: "https://story-center.firebaseio.com"
  });

  const cookies = nookies.get(context);
  const token = cookies.token ? await admin.auth().verifyIdToken(cookies.token) : null;
  const uid = token ? token.uid : null;
  const data = await getCharacter(context.query.id, uid, 'show')

  return {
    props: {
      data: data.data,
      ...(await serverSideTranslations(context.locale, ["character", "chapter", "form", "story", "common"])),
    }
  }
}

export default Character