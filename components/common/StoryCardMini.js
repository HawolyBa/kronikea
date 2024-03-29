import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoIosLock } from "react-icons/io";
import { Badge } from 'antd'
import { FaEye, FaStar } from 'react-icons/fa'
import { placeholders, colors } from '../../utils/constants'
import { useTranslation } from 'next-i18next'


const StoryCardMini = ({ data, type }) => {
  const { t } = useTranslation()
  return (
    <Link className='mb-4 w-full story__mini__card' href={`/story/${data.id}`}>
      <figure className="flex">
        {data?.public ?
          <div className={`w-24 h-36 rounded-md overflow-hidden relative after-border after:absolute after:border after:content-[''] after:dark:border-zinc-900 after:bg-transparent after:z-50 after:rounded-md`}>
            <Image src={data.banner ? data.banner : placeholders.card} alt={data.title} fill style={{ objectFit: 'cover' }} />
          </div>
          : <Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
            <div className={`w-24 h-36 rounded-md overflow-hidden relative after-border after:absolute after:border after:content-[''] after:dark:border-zinc-900 after:bg-transparent after:rounded-md`}>
              <Image src={data.banner ? data.banner : placeholders.card} alt={data.title} fill style={{ objectFit: 'cover' }} />
            </div>
          </Badge.Ribbon>
        }
        <figcaption style={{ width: `calc(100% - 7rem)` }} className="px-3">
          <h4 className="text-lg text-zinc-900 dark:text-slate-50 capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer mb-0">{data.title}</h4>
          {type === 'other' && <span>{t('common:by')} {data.authorName}</span>}
          <p className='card-description text-gray-400 text-xs mt-3'>{data.summary}</p>
          <div className='flex items-center mt-4'>
            <div className='flex items-center text-xs text-zinc-500 dark:text-slate mr-4'><FaEye /><span className='ml-1'>{data?.views ? data?.views : 0}</span></div>
            <div className='flex items-center  text-xs text-zinc-500 dark:text-slate'><FaStar /><span className='ml-1'>{data?.likedBy?.length}</span></div>
          </div>
        </figcaption>
      </figure>
    </Link>
  )
}

export default StoryCardMini