import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Divider, Drawer, Popconfirm, Tooltip, Image, Spin } from 'antd'
import { AiFillCaretLeft, AiFillEdit, AiFillCaretRight, AiOutlineUser, AiFillHome, AiOutlineFontSize } from 'react-icons/ai'
import { BsFillStarFill } from 'react-icons/bs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { getChapter } from '../../../../../database/actions/stories'
import { useAuth } from '../../../../../database/auth'
import { useGetCommentsQuery, useSubmitCommentMutation } from '../../../../../database/reducers/stories'
import { capitalize } from '../../../../../utils/helpers'

import Button from '../../../../../components/common/Button'
import AddToFavorites from '../../../../../components/common/AddToFavorites'
import Comments from '../../../../../components/common/Comments'
import CharacterCard from '../../../../../components/common/CharacterCard'
import LocationCard from '../../../../../components/common/LocationCard'
import Author from '../../../../../components/common/Author'
import Banner from '../../../../../components/common/Banner'
import AddReview from '../../../../../components/common/AddReview'

const Chapter = ({ darkTheme, data, isLoading, storyExists }) => {

  const router = useRouter();
  const { t } = useTranslation();
  const auth = useAuth();
  const [modal, setModal] = React.useState(false);
  const [answeredTo, setAnsweredTo] = React.useState(null);
  const { data: comments, isLoading: isCommentsLoading } = useGetCommentsQuery(router.query.chapid, { refetchOnMountOrArgChange: true });

  const [submit] = useSubmitCommentMutation()
  const [res, setRes] = React.useState(null)
  const [font, setFont] = React.useState("text-sm")

  const topComments = comments?.filter((comm) => !comm.answer);
  const responses = comments?.filter((comm) => comm.answer);
  const allComments = topComments?.map((comm) => {
    let res = [];
    responses?.forEach((response) => {
      if (response?.commentAnsweredId === comm?.id) {
        res.push(response);
      }
    });
    return {
      ...comm,
      responses: res?.sort((a, b) =>
        a.createdAt && b.createdAt && typeof a.createdAt === "object"
          ? new Date(a.createdAt.seconds * 1000) -
          new Date(b.createdAt.seconds * 1000)
          : new Date(a.createdAt) - new Date(b.createdAt)
      ),
    };
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const changeFont = () => {
    if (font === "text-sm") {
      setFont("text-base")
    } else if (font === "text-base") {
      setFont("text-lg")
    } else if (font === "text-lg") {
      setFont("text-xl")
    } else if (font === "text-xl") {
      setFont("text-sm")
    }
  }

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const showDrawer = () => {
    setOpenDrawer(!openDrawer)
    scrollToTop()
  }
  const deleteComment = () => { }
  const confirm = () => showDrawer()
  const cancel = (e) => { }

  const onClose = (form) => {
    setModal(false)
    setAnsweredTo(null)
    form.resetFields()
  }

  const showModal = () => setModal(!modal);

  const submitComment = async (form, values) => {
    await submit({
      userId: auth.user.uid,
      username: auth.user.username,
      content: values.content,
      storyId: router.query.id,
      chapterId: router.query.chapid,
      chapterTitle: data?.title,
      authorId: data.authorId,
      answer: false,
      likedBy: [],
      dislikedBy: [],
      voters: [],
      userImage: auth.user.image,
      title: data?.title,
    }).unwrap()
      .then((res) => {
        form.resetFields()
        setRes(res.message)
      })
      .catch((err) => console.log(err))
  }

  const submitAnswer = async (form, values) => {
    await submit({
      answer: true,
      likedBy: [],
      dislikedBy: [],
      voters: [],
      chapterTitle: data?.title,
      userId: auth.user.uid,
      username: auth.user.username,
      commentAnsweredId: answeredTo.id,
      answeredToId: answeredTo.userId,
      content: `@${answeredTo.username} ${values.content}`,
      storyId: router.query.id,
      chapterId: router.query.chapid,
      authorId: data.authorId,
      title: data.title,
      answeredTo: answeredTo.username,
      answer: true,
      userImage: auth.user.image,
    }).unwrap()
      .then(() => form.resetFields())
      .catch((err) => console.log(err))
  }

  React.useEffect(() => {
    if (!storyExists) {
      router.push('/404')
    }
  }, [storyExists])

  React.useEffect(() => {
    if (!auth.isLoading && !isLoading && data) {
      if (data.status !== 'published') {
        router.push('/404')
      } else if (!data?.public) {
        if (data?.authorId !== auth?.user?.uid) {
          router.push('/unauthorized')
        }
      }
    }
  }, [data, auth, isLoading])

  return (
    <>
      <Head>
        <title>{`${t('chapter:chapter').charAt(0).toUpperCase() + t('chapter:chapter').slice(1)} ${data?.number}: ${data?.title}`} - Kronikea</title>
      </Head>
      <Spin spinning={!storyExists || auth?.isLoading || isLoading || (!data?.public && data?.authorId !== auth?.user?.uid) || data.status !== 'published'}>
        <div className='chapter md:mt-6 md:px-4 mb-24'>
          <div className="md:max-w-screen-lg w-full mx-auto">
            <Banner image={data?.image}>
              <div className="w-full flex items-center justify-center md:justify-end w-full h-full overflow-hidden rounded-3xl relative">
                <div className="flex md:justify-start justify-center items-center md:w-2/3 w-full">
                  <div className={`w-28 mr-3 h-36 rounded-lg md:ml-24 shadow-lg`}>
                    <Image
                      width={"100%"}
                      height={"100%"}
                      src={data?.image}
                      alt={data?.title}
                      style={{ borderRadius: "5px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="">
                    <h2 className="mb-2">{data?.storyTitle}</h2>
                    <h3 className="mb-2 uppercase">{`${t('chapter:chapter')} ${data?.number}: ${data?.numberOnly ? `${t('chapter:chapter')} ${data?.number}` : data?.title}`}</h3>
                    <Author data={data && data} />
                  </div>
                </div>
                {/* EDIT & FAV MOBILE MODE */}
                {(auth?.user?.uid !== data?.authorId) || !auth?.user ?
                  <div className='flex items-center md:hidden absolute top-3 right-5'>
                    <div className=' cursor-pointer rounded-full bg-white backdrop-filter backdrop-blur-md bg-opacity-20 p-2'>
                      <AddToFavorites storyTitle={data?.storyTitle} userImage={auth?.user?.image} push={router.push} auth={auth && auth} type='story' isFavorite={data?.likedBy.includes(auth?.user?.uid)} username={auth?.user?.username} t={t} id={router.query.id} />
                    </div>
                    <span className="text-xl ml-2">{data?.likedBy?.length}</span>
                  </div>
                  :
                  <div className='absolute top-3 right-5 cursor-pointer md:hidden rounded-full bg-white backdrop-filter backdrop-blur-md bg-opacity-20 p-2'>
                    <AiFillEdit onClick={() => router.push(`/story/${router.query.id}/edit`)} style={{ fontSize: "1.2rem" }} />
                  </div>
                }

                {/* EDIT & FAV DESKTOP MODE */}
                <div className="flex items-center w-1/3 hidden md:flex px-8 py-6">
                  <div className="flex items-center">
                    <div className="rounded-full text-white bg-primary p-2 mr-3">
                      <BsFillStarFill style={{ fontSize: "1.2rem" }} />
                    </div>
                    <span className="text-xl">{data?.likedBy?.length}</span>
                  </div>
                  {(auth?.user?.uid !== data?.authorId) || !auth?.user ? <AddToFavorites storyTitle={data?.storyTitle} userImage={auth?.user?.image} push={router.push} auth={auth && auth} type='story' isFavorite={data?.likedBy.includes(auth?.user?.uid)} username={auth?.user?.username} t={t} id={router.query.id} />
                    : <Link className="active:scale-95 bg-white backdrop-filter backdrop-blur-md bg-opacity-20 flex items-center uppercase padding py-2 px-4 border-2 border-primary ml-6 text-xs rounded-xl" href={`/story/${router.query.id}/edit`}>
                      <AiFillEdit /> <span className=' ml-1'>{t('form:edit-story')}</span>
                    </Link>
                  }
                </div>
              </div>
            </Banner>
          </div>
          <div className="mx-auto px-2 md:px-0 max-w-screen-lg pb-8">
            <div className=" my-6 relative md:flex justify-between">
              {/* BARRE LATERALE */}
              <aside className="md:w-1/12 left-0 top-20 sticky bg-white dark:bg-zinc-900 md:py-8 py-2 md:h-96 h-fit rounded-xl shadow-md flex md:flex-col text-zinc-500 justify-center items-center text-2xl md:mb-0 mb-3 z-50">
                <Tooltip placement='bottom' title={t('chapter:story-page')}>
                  <Link className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 shadow-lg block md:mb-4" href={`/story/${router.query.id}`}>
                    <AiFillHome />
                  </Link>
                </Tooltip>
                <Tooltip placement='bottom' title={`${t('common:characters').charAt(0).toUpperCase()}${t('common:characters').slice(1)} & ${t('common:locations').charAt(0).toUpperCase()}${t('common:locations').slice(1)}`}>
                  <Popconfirm
                    title={t('chapter:spoilers')}
                    description={t('chapter:validate-spoilers')}
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText={t('common:yes')}
                    cancelText={t('common:no')}
                  >
                    <div className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 md:mb-4 shadow-lg block">
                      <AiOutlineUser />
                    </div>
                  </Popconfirm>
                </Tooltip>
                <Tooltip placement='bottom' title={capitalize(t('form:change-font'))}>
                  <div onClick={() => changeFont()} className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 shadow-lg block md:mb-4">
                    <AiOutlineFontSize />
                  </div>
                </Tooltip>
                {auth?.user?.uid === data.authorId &&
                  <Tooltip placement='bottom' title={capitalize(t('form:edit-chapter'))}>
                    <Link className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 shadow-lg block md:mb-4" href={`/story/${router.query.id}/chapter/${router.query.chapid}/edit`}>
                      <AiFillEdit />
                    </Link>
                  </Tooltip>
                }
                {data?.prev &&
                  <Tooltip placement='bottom' title={t('chapter:previous-chapter')}>
                    <Link className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 shadow-lg block md:mb-4" href={`/story/${router.query.id}/chapter/${data?.prev}`}>
                      <AiFillCaretLeft />
                    </Link>
                  </Tooltip>
                }
                {data?.next &&
                  <Tooltip placement='bottom' title={t('chapter:next-chapter')}>
                    <Link className="active:scale-95 bg-slate-100 dark:bg-zinc-800 transition duration-200 ease-in-out p-3 flex items-center justify-center rounded-md mx-2 hover:dark:text-slate-50 hover:text-zinc-500 hover:scale-105 shadow-lg block md:mb-4" href={`/story/${router.query.id}/chapter/${data?.next}`}>
                      <AiFillCaretRight />
                    </Link>
                  </Tooltip>
                }
              </aside>
              <div className="chapter__content w-9/10 bg-white dark:bg-zinc-900 py-8 relative min-h-screen rounded-xl overflow-hidden md:px-12 px-4 shadow-md">
                <div dangerouslySetInnerHTML={{ __html: data?.body }} className={`chapter__body text-justify text ${font}`}></div>
                <Divider className="dark:border-stone-700" />
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="capitalize">{comments?.length} {comments?.length > 1 ? t('chapter:comments') : t('chapter:comment')}</h3>
                    {auth?.user ?
                      <div className='float-right'>
                        <Button onClick={() => setModal(true)} color="bg-primary">
                          {t('chapter:review')}
                        </Button>
                      </div>
                      : <p>{t('chapter:login-message')} <Link className="py-1 hover:text-slate-50 active:scale-95 px-2 text-xs bg-primary text-slate-50 rounded-md" href='/auth'>{t('chapter:click-here')}</Link></p>
                    }
                  </div>
                  <Spin spinning={isCommentsLoading}>
                    <Comments
                      showModal={showModal}
                      auth={auth}
                      deleteComment={deleteComment}
                      userComment={null}
                      comments={allComments}
                      setRes={setRes}
                      type="chapter"
                      routeId={router.query.chapid}
                      authorName={auth?.user?.username}
                      authorId={auth?.user?.uid}
                      setAnsweredTo={setAnsweredTo}
                      t={t}
                    />
                  </Spin>
                </div>
                <Drawer
                  headerStyle={{ color: darkTheme ? "white" : '#18181b', background: darkTheme ? '#18181b' : "white" }}
                  bodyStyle={{ background: darkTheme ? '#18181b' : "white" }}
                  closable={true}
                  title={`${t('common:characters').charAt(0).toUpperCase()}${t('common:characters').slice(1)} & ${t('common:locations').charAt(0).toUpperCase()}${t('common:locations').slice(1)}`}
                  placement="bottom"
                  height={"100%"}
                  width={"100%"}
                  onClose={showDrawer}
                  open={openDrawer}
                  getContainer={false}
                >
                  <>
                    <div>
                      <Divider className="dark:border-stone-700" orientation="left" plain>
                        <h4 className='dark:text-slate-50 capitalize'>{t('common:characters')}</h4>
                      </Divider>
                      <div className="w-full grid gap-2 grid-cols-2 mt-3 md:grid-cols-3 lg:grid-cols-6">
                        {data?.characters.map(char => (
                          <CharacterCard key={char.id} data={char} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Divider className="dark:border-stone-700" orientation="left" plain>
                        <h4 className='dark:text-slate-50 capitalize'>{t('common:locations')}</h4>
                      </Divider>
                      <div className="w-full grid gap-2 grid-cols-2 mt-3 md:grid-cols-3 lg:grid-cols-6">
                        {data?.locations.map(char => (
                          <LocationCard key={char.id} data={char} />
                        ))}
                      </div>
                    </div>
                  </>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </Spin>
      <AddReview onClose={onClose} auth={auth} submitComment={answeredTo ? submitAnswer : submitComment} t={t} modal={modal} showModal={showModal} />
    </>
  )
}

export async function getServerSideProps({ locale, query }) {
  const data = await getChapter(query.chapid, query.id, 'show')
  return {
    props: {
      data: data.data,
      storyExists: data.storyExists,
      ...(await serverSideTranslations(locale, ["chapter", "common", 'character', 'form']))
    }
  }
}

export default Chapter