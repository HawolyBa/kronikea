import React, { createElement } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next'
import { Tooltip, Avatar } from 'antd'
import { BiCaretDown, BiCaretUp } from 'react-icons/bi'
import { Comment } from '@ant-design/compatible';
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import moment from 'moment';
import 'moment/locale/fr'

import { useRateCommentMutation } from '../../database/reducers/characters'
import { useRateCommentMutation as useRateChapter } from '../../database/reducers/stories'
import { placeholders } from '../../utils/constants';

import Report from './Report';

const UserComment = ({ auth, comment, authorId, authorName, routeId, type, showModal, setAnsweredTo }) => {
  const { t } = useTranslation();
  const [rateComment] = useRateCommentMutation()
  const [rateChapter] = useRateChapter()
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);

  const rate = async (commentId, commenTtype) => {
    const submit = type === 'character-comment' ? rateComment : rateChapter
    await submit({ commentId: commentId, type: commenTtype })
      .unwrap()
      .then((res) => console.log(res))
      .catch(err => console.log(err))
  }

  const reply = (info) => {
    setAnsweredTo(info)
    showModal()
  }

  return (
    <Comment
      actions={[
        <Tooltip key="comment-basic-like" title="Like">
          <span onClick={() => rate(comment.id, "like")}>
            {createElement(
              comment.likedBy?.includes(auth.user.uid)
                ? LikeFilled
                : LikeOutlined
            )}
            <span className="dark:slate-100 comment-action">
              {" "}
              {comment.likedBy?.length}
            </span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
          <span className="dark:text-slate-50" onClick={() => rate(comment?.id, "dislike")}>
            {React.createElement(
              comment?.dislikedBy?.includes(auth.user.uid)
                ? DislikeFilled
                : DislikeOutlined
            )}
            <span className="comment-action dark:slate-100">
              {" "}
              {comment.dislikedBy?.length}
            </span>
          </span>
        </Tooltip>,
        auth && auth.user && type === 'chapter' && (
          <span
            className='capitalize'
            key="comment-basic-reply-to"
            onClick={() => reply({
              id: comment.id,
              userId: comment.userId,
              username: comment.username,
            })}
          >
            {t('chapter:reply')}{" "}
          </span>
        ),
        auth.user && auth.user.uid !== comment.userId && (
          <Report authorId={authorId} authorName={authorName} auth={auth} routeId={routeId} type={type} />
        ),
      ]}
      author={
        <Link className="dark:text-slate-100" href={`/profile/${comment.userId}`}>
          {comment.username}
        </Link>
      }
      avatar={
        <Link href={`/profile/${comment.userId}`}>
          <Avatar
            src={
              comment.userImage ? comment.userImage : placeholders.avatar
            }
            alt={comment.username}
          />
        </Link>
      }
      content={<p className="dark:text-slate-50">{comment.content}</p>}
      datetime={
        <Tooltip
          title={
            comment.createdAt &&
              typeof comment.createdAt === "object"
              ? moment
                .unix(comment.createdAt.seconds)
                .format("YYYY-MM-DD HH:mm:ss")
              : moment(comment.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )
          }
        >
          <span>
            {comment.createdAt &&
              typeof comment.createdAt === "object"
              ? moment.unix(comment.createdAt.seconds).fromNow()
              : moment(comment.createdAt).fromNow()}
          </span>
        </Tooltip>
      }
    >
      {type == 'chapter' && comment.responses.length > 0 &&
        <div className="nested-group">
          <button ref={buttonRef} id={`btn-${comment?.id}`} onClick={() => ref.current?.classList.toggle('hidden')} className="flex items-center dark:text-gray-500 see-responses capitalize">{comment?.responses.length} {comment.responses.length > 1 ? t('chapter:replies') : t('chapter:reply-answer')}</button>
          <div ref={ref} className={`nested-comments hidden`}>
            {comment.responses.map(comm => (
              <Comment
                key={comm.id}
                actions={[
                  <Tooltip key="comment-basic-like" title="Like">
                    <span onClick={() => rate(comm.id, "like")}>
                      {createElement(
                        comm.likedBy.includes(auth.user.uid)
                          ? LikeFilled
                          : LikeOutlined
                      )}
                      <span className="dark:slate-100 comment-action">
                        {" "}
                        {comm.likedBy.length}
                      </span>
                    </span>
                  </Tooltip>,
                  <Tooltip key="comment-basic-dislike" title="Dislike">
                    <span className="dark:text-slate-50" onClick={() => rate(comm.id, "dislike")}>
                      {React.createElement(
                        comm.dislikedBy.includes(auth.user.uid)
                          ? DislikeFilled
                          : DislikeOutlined
                      )}
                      <span className="comment-action dark:slate-100">
                        {" "}
                        {comm.dislikedBy.length}
                      </span>
                    </span>
                  </Tooltip>,
                  auth && auth.user && type === 'chapter' && (
                    <span
                      className='capitalize'
                      key="comment-basic-reply-to"
                      onClick={() => reply({
                        id: comment.id,
                        userId: comm.userId,
                        username: comm.username,
                      })}
                    >
                      {t('chapter:reply')}{" "}
                    </span>
                  ),
                  auth.user && auth.user.uid !== comm.userId && (
                    <Report authorId={authorId} authorName={authorName} auth={auth} routeId={routeId} type={type} />
                  ),
                ]}
                author={
                  <Link className="dark:text-slate-100" href={`/profile/${comm.userId}`}>
                    {comm.username}
                  </Link>
                }
                avatar={
                  <Link href={`/profile/${comm.userId}`}>
                    <Avatar
                      src={
                        comm.userImage ? comm.userImage : placeholders.avatar
                      }
                      alt={comm.username}
                    />
                  </Link>
                }
                content={<p className="dark:text-slate-50">{comm.content}</p>}
                datetime={
                  <Tooltip
                    title={
                      comm.createdAt &&
                        typeof comm.createdAt === "object"
                        ? moment
                          .unix(comm.createdAt.seconds)
                          .format("YYYY-MM-DD HH:mm:ss")
                        : moment(comm.createdAt).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )
                    }
                  >
                    <span>
                      {comm.createdAt &&
                        typeof comm.createdAt === "object"
                        ? moment.unix(comm.createdAt.seconds).fromNow()
                        : moment(comm.createdAt).fromNow()}
                    </span>
                  </Tooltip>
                }
              >
              </Comment>
            ))}
          </div>

        </div>
      }
    </Comment>
  )
}

export default UserComment