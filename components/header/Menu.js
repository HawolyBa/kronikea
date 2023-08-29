import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { Drawer, Tooltip } from 'antd'
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi"
import { MdModeNight } from "react-icons/md";
import { BsSunFill } from "react-icons/bs";

import SocialButtons from '../header/SocialButtons'
import { CATEGORIES, colors } from '../../utils/constants'
import logo from '../../images/search.png'

const Menu = ({ t, darkTheme, changeTheme, activeCategories, setActiveCategories }) => {

  return (
    <Drawer
      placement="left"
      onClose={() => setActiveCategories(false)}
      className="main-menu"
      open={activeCategories}
      rootStyle={{ zIndex: "9999999999999999999" }}
      headerStyle={{ background: darkTheme ? '#18181b' : "white" }}
      bodyStyle={{ background: darkTheme ? '#18181b' : "white" }}
    >
      <div className="">
        <Link href="/"><h4 onClick={() => setActiveCategories(false)} className='cursor-pointer md:hidden mb-6 mt-6 text-lg uppercase'>Home</h4></Link>
        <h4 className='mb-3 mt-6 text-lg uppercase'>Night Mode</h4>
        <div className='flex items-center'>
          <Tooltip placement='bottom' title={"Night mode"}>
            <div onClick={() => changeTheme(true)} className="mr-4 cursor-pointer hover:scale-105 transition duration-200 ease-in-out w-6 h-6 flex items-center justify-center rounded-md shadow-lg" style={{ fontSize: '1.2rem', border: `1 px solid ${colors.primary}` }}>
              <MdModeNight color={"black"} />
            </div>
          </Tooltip>
          <Tooltip placement='bottom' title={"Light mode"}>
            <div onClick={() => changeTheme(false)} className="cursor-pointer hover:scale-105 transition duration-200 ease-in-out w-6 h-6 flex items-center justify-center rounded-md shadow-lg" style={{ fontSize: '1.2rem', border: `1 px solid ${colors.primary}` }}>
              <BsSunFill color={"black"} />
            </div>
          </Tooltip>
        </div>
        <Link href="/category">
          <h4 onClick={() => setActiveCategories(false)} className='cursor-pointer mb-3 mt-6 text-lg uppercase'>Categories</h4>
        </Link>
        <ul>
          {CATEGORIES.map(cat => (
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`} key={cat.name} onClick={() => setActiveCategories(false)}>
              <Link href={`/category/${cat.name}`}>{t(`common:${cat.value}`)}</Link>
            </li>
          ))}
        </ul>
        <div className="md:hidden mb-6">
          <h4 className='mt-6 mb-3 text-lg uppercase'>{t('common:navigate')}</h4>
          <ul>
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`}>
              <Link href={`/contact`}>Contact</Link>
            </li>
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`}>
              <Link href={`/feedback`}>{t('common:feedback')}</Link>
            </li>
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`}>
              <Link href={`/about`}>{t('common:about-us')}</Link>
            </li>
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`}>
              <Link href={`/terms`}>{t('common:terms')}</Link>
            </li>
            <li className={`text-base border-b ${darkTheme ? 'border-neutral-800' : 'border-slate-100'} cursor-pointer py-2 capitalize`}>
              <Link href={`/privacy`}>{t('common:privacy')}</Link>
            </li>
          </ul>
          <h4 className='mt-6 mb-3 text-lg uppercase'>SOCIAL LINKS</h4>
          <div className='flex'>
            <SocialButtons title="Facebook">
              <FiFacebook />
            </SocialButtons>
            <SocialButtons title='Twitter'>
              <FiTwitter />
            </SocialButtons>
            <SocialButtons title="Instagram">
              <FiInstagram />
            </SocialButtons>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='w-8 h-8 rounded-full overflow-hidden relative mr-3'>
            <Image fill src={logo.src} alt="logo Kronikea" />
          </div>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 capitalize">© 2023 <a href="https://flowbite.com/" className="hover:underline">Kronikea™</a>. {t('common:all-rights')}.
          </span>
        </div>
      </div>
    </Drawer>
  )
}

export default Menu