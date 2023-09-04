import React from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { FaEye, FaStar } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'

import { placeholders } from '../../utils/constants'

const StoryMiniCard = ({ data }) => {
  const { t } = useTranslation()
  return (
    <Link href={`/story/${data.id}`}>
      <figure style={{ width: '150px' }} className={`cursor-pointer mb-4 flex flex-col`}>
        <div className={`mini-card transition duration-150 w-full after-border after:absolute after:border after:content-[''] after:dark:border-zinc-900 after:bg-transparent after:rounded-md`} style={{ height: "200px", position: 'relative' }}>
          <Image fill style={{ objectFit: 'cover' }} src={data.banner ? data.banner : placeholders.card} alt={data.title} className={`w-full h-full object-cover shadow-lg rounded-md min-h-full`} />
        </div>
        <figcaption className="overflow-hidden text-center leading-3">
          <h3 className="text-sm mt-2 p-0 mb-0 font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">{data.title}</h3>
          <span className="text-gray-400 mb-1 text-sm block">{t('common:by')} {data.authorName}</span>
          <div className='flex items-center justify-center'>
            <div className='flex items-center text-xs text-zinc-500 dark:text-slate mr-4'><FaEye /><span className='ml-1'>{data?.views ? data?.views : 0}</span></div>
            <div className='flex items-center  text-xs text-zinc-500 dark:text-slate'><FaStar /><span className='ml-1'>{data?.likedBy?.length}</span></div>
          </div>
        </figcaption>
      </figure>
    </Link >
  )
}

export default StoryMiniCard