import React from 'react'
import Link from 'next/link'
import { Badge } from 'antd'
import { AiFillHome, AiOutlineSearch, AiOutlinePlus, AiOutlineBell, AiOutlineMenu } from 'react-icons/ai'
import { colors } from '../../utils/constants'

const BottomTabs = ({ auth, setActiveCategories, activeCategories, activeSearch, setActiveSearch, notifications }) => {

  return (
    <div className="bottom-0 rounded-t-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] md:hidden left-0 w-full h-14 bg-slate-50 dark:bg-zinc-900 fixed z-50 py-4 px-6">
      <ul className="flex items-start justify-between">
        <li className="text-2xl cursor-pointer">
          <Link href="/">
            <AiFillHome style={{ fontSize: '1.5rem', color: colors.primary }} />
          </Link>
        </li>
        <li className="text-2xl cursor-pointer" onClick={() => setActiveSearch(!activeSearch)}>
          <AiOutlineSearch style={{ fontSize: '1.5rem', color: colors.primary }} />
        </li>
        {
          !auth.isLoading && auth.user.uid &&
          <li className="text-2xl cursor-pointer">
            <Link href="/notifications">
              <Badge count={notifications.items.filter(i => !i.read).length} size='small'>
                <AiOutlineBell style={{ fontSize: '1.5rem', color: colors.primary }} />
              </Badge>
            </Link>
          </li>
        }
        <li onClick={() => setActiveCategories(!activeCategories)} className="text-2xl cursor-pointer">
          <AiOutlineMenu style={{ fontSize: '1.5rem', color: colors.primary }} />
        </li>
      </ul>
    </div>
  )
}

export default BottomTabs