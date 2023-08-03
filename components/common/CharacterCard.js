import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { placeholders } from '../../utils/constants'

const CharacterCard = ({ data, type, removeCharacter }) => {
  return (
    <div className='relative w-full'>
      {type === "add" && (
        <span
          onClick={() => removeCharacter(data.id)}
          className="flex cursor-pointer items-center justify-center absolute bottom-0 right-0 w-8 h-8 rounded-full text-white bg-red-500 shadow-lg opacity-50 hover:opacity-100"
        >
          x
        </span>
      )}
      <Link href={`/character/${data.id}`}>
        <figure className="chara-card transition duration-300 cursor-pointer bg-white dark:bg-zinc-900 rounded-md min-w-36 w-full max-w-44 flex flex-col items-center overflow-hidden text-zinc-900 dark:text-slate-100 shadow-lg">
          <div className={`w-full h-36 rounded-md overflow-hidden relative after-border after:absolute after:dark:border-zinc-800 after:border after:content-[''] after:bg-transparent after:rounded-md`}>
            <Image src={data?.image ? data?.image : placeholders.card} alt={`${data.firstname} ${data.lastname}`} fill style={{ objectFit: 'cover' }} />
          </div>
          <figcaption className='py-2 text-center'>
            <h3 className="card__title">
              {`${data.firstname} ${data.lastname}`}
            </h3>
            {(type === "add" || type === "show") && (
              <span className="text-xs text-gray-400 text-center">
                {data.relation ? data.relation : data.authorName ? 'by ' + data.authorName : ''}
              </span>
            )}
          </figcaption>
        </figure>
      </Link>
    </div>
  )
}

export default CharacterCard