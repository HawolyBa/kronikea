import React from 'react'
import Link from 'next/link'
import { AiFillHome, AiOutlineSearch, AiOutlinePlus, AiOutlineBell, AiOutlineMenu } from 'react-icons/ai'

const BottomTabs = ({ setActiveCategories, activeCategories, activeSearch, setActiveSearch }) => {
  return (
    <div className="bottom-0 rounded-t-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] md:hidden left-0 w-full h-16 bg-slate-50 dark:bg-zinc-900 fixed z-50 py-4 px-6">
      <ul className="flex items-center justify-between">
        <li className="text-2xl cursor-pointer">
          <Link href="/">
            <AiFillHome />
          </Link>
        </li>
        <li className="text-2xl cursor-pointer" >
          <AiOutlinePlus />
        </li>
        <li className="text-2xl cursor-pointer" onClick={() => setActiveSearch(!activeSearch)}>
          <AiOutlineSearch />
        </li>
        <li className="text-2xl cursor-pointer">
          <Link href="/notifications">
            <AiOutlineBell />
          </Link>
        </li>
        <li onClick={() => setActiveCategories(!activeCategories)} className="text-2xl cursor-pointer">
          <AiOutlineMenu />
        </li>
      </ul>
    </div>
  )
}

export default BottomTabs