import React from 'react';
import { useRouter } from 'next/router'
import { Avatar, Tooltip, Badge } from "antd";
import { Comment } from '@ant-design/compatible';
import moment from 'moment';
import 'moment/locale/fr'

import Pagination from './Pagination'
import Sort from './Sort';

const Comments = ({ t, authorId, authorName, routeId, type, setRes, comments, userComment, auth, deleteComment, showModal, setAnsweredTo }) => {

  const { locale } = useRouter()
  const [data, setData] = React.useState([])

  const sortByUpvoted = (type) => {
    let arr = []

    arr = data?.slice().sort((a, b) => type === 'upvoted' ? b.likedBy.length - a.likedBy.length : b.createdAt.seconds - a.createdAt.seconds)

    setData(arr)
  }

  React.useEffect(() => {
    if (comments?.length > 0) {
      setData(comments)
    }
  }, [comments])
  return (
    <section className="comments px-4">
      <div className="comments__content">
        <Sort t={t} sortByUpvoted={sortByUpvoted} />
        <div className="comments__item">
          {userComment && <Badge.Ribbon text={t('common:your-feedback')}>
            <Comment
              author={<a className="text-sm text-zinc-900 dark:text-slate-50">{userComment?.username}</a>}
              actions={[
                userComment.userId === auth?.user?.uid && (

                  <span className='capitalize' onClick={() => {
                    deleteComment(userComment.id)
                    setRes(null)
                  }}>{t('chapter:delete')}</span>

                ),
                auth.user && auth.user.uid !== userComment.userId && (
                  <span className="dark:slate-100">Report</span>
                )
              ]}
              avatar={<Avatar src={userComment?.userImage} alt={userComment.username} />}
              content={
                <p className="text-sm text-zinc-900 dark:text-slate-50">
                  {userComment?.content}
                </p>
              }
              datetime={
                <Tooltip title={userComment?.createdAt ? moment
                  .unix(userComment?.createdAt?.seconds)
                  .locale(locale)
                  .format("YYYY-MM-DD HH:mm:ss") : moment(Date.now())
                    .locale(locale)
                    .format("YYYY-MM-DD HH:mm:ss")}>
                  <span className="text-zinc-900 dark:text-zinc-500">{userComment?.createdAt ? moment
                    .unix(userComment?.createdAt?.seconds)
                    .locale(locale)
                    .fromNow() : moment(Date.now())
                      .locale(locale)
                      .fromNow()}</span>
                </Tooltip>
              } />
          </Badge.Ribbon>}
          {data?.length > 0 &&
            <Pagination setAnsweredTo={setAnsweredTo} showModal={showModal} auth={auth} authorId={authorId} authorName={authorName} commentType={type} routeId={routeId} data={data} type='comments' />
          }
        </div>
      </div>
    </section>
  )
}

export default Comments