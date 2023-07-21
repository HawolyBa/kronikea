import React from 'react'
import Link from 'next/link'
import { AiFillPlayCircle, AiFillEdit } from 'react-icons/ai'

const Chapters = ({ isAuthor, chapters, t, id }) => {
  return (
    <ul>
      {chapters?.filter(c => !isAuthor ? c.status === 'published' : c).sort((a, b) => a.number - b.number).map(chap => (
        <li key={chap.id} className="relative flex justify-between mb-4 py-2 pl-4 shadow-md rounded items-center">
          <div className="flex flex-col leading-5 w-10/12">
            <span className="capitalize text-xs text-zinc-400">{`${t('story:chapter')} ${chap.number}`}</span>
            <span className="capitalize">{chap?.numberOnly ? `${t('story:chapter')} ${chap?.number}` : chap?.title} {chap.status !== 'published' && <i>(draft)</i>}</span>
          </div>
          <div className='w-2/12 flex items-center relative justify-end'>
            {isAuthor &&
              <Link className='flex mr-3 items-center' href={`/story/${id}/chapter/${chap?.id}/edit`}>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer"><AiFillEdit style={{ color: "#b4333a" }} /></div>
              </Link>
            }
            {chap.status === 'published' &&
              <Link className='transition duration-300 hover:scale-105  text-white flex items-center' href={`/story/${id}/chapter/${chap.id}`}>
                <div className="rounded-full text-2xl cursor-pointer flex items-center justify-center h-10 w-10" style={{ backgroundColor: "#27746c" }}>
                  <AiFillPlayCircle style={{ color: "#fff" }} />
                </div>
              </Link>
            }
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Chapters