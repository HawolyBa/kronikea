import React from 'react';
import Link from 'next/link'
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Divider, Drawer, Tooltip } from 'antd'
import { FiFacebook, FiTwitter, FiInstagram, FiMenu } from "react-icons/fi"
import { MdModeNight } from "react-icons/md";
import { BsSunFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { BiSearchAlt, BiDotsVerticalRounded } from "react-icons/bi";

import { useAuth } from '../../database/auth'

import Search from './Search';
import SocialButtons from '../header/SocialButtons'
import ContextMenu from '../header/ContextMenu'
import { CATEGORIES, colors, placeholders } from '../../utils/constants'
import Create from '../cta/Create';
import NotificationsMenu from '../header/NotificationsMenu';

const Header = ({ setDarkTheme, darkTheme }) => {
    const auth = useAuth()
    const { t } = useTranslation();
    const [activeSearch, setActiveSearch] = React.useState(false)
    const [activeCategories, setActiveCategories] = React.useState(false)

    const changeTheme = (val) => {
        setDarkTheme(val)
        localStorage.setItem('darkTheme', val)
    }

    const { push, asPath, locale } = useRouter()

    const changeLanguage = locale => {
        push(asPath, undefined, { locale })
    }
    return (
        <>
            <header id="main-header" className="top-0 left-0 w-full sticky main__header dark:text-white text-zinc-900 bg-white dark:bg-zinc-900 z-50">
                <div className='max-w-screen-xl mx-auto flex items-center justify-between h-full'>
                    <div className='pl-6 flex items-center'>
                        <Link href='/'>
                            <h1 className="main_title text-lg cursor-pointer">Kronikea</h1>
                        </Link>
                        <nav className="ml-8 mt-1 md:block hidden">
                            <ul className="flex items-center">
                                <li className="mr-3"><Link href='/'>{t('common:home')}</Link></li>
                                <li className='mr-3'><Link href='/for-you'>{t('common:foryou')}</Link></li>
                                <li className='mr-3 capitalize'><Link href='/search'>{t('common:explore')}</Link></li>
                                <li className='capitalize'><Link href='/category'>{t('common:categories')}</Link></li>
                            </ul>
                        </nav>
                        <div className="dark:text-white text-black menu-btn cursor-pointer ml-3" onClick={() => setActiveCategories(!activeCategories)}>
                            <IconContext.Provider value={{ size: "1.5em" }}>
                                <FiMenu />
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex mr-3 items-center">
                            <div onClick={() => setActiveSearch(!activeSearch)} style={{ backgroundColor: colors.secondary }} className='hover:scale-105 transition duration-200 ease-in-out cursor-pointer p-2 rounded-md shadow-md mx-2'>
                                <BiSearchAlt style={{ color: 'white' }} />
                            </div>
                            {auth.user ?
                                <>
                                    <Create t={t} />
                                    <ContextMenu locale={locale} type="user" auth={auth} t={t} changeLanguage={changeLanguage} darkTheme={darkTheme} changeTheme={changeTheme}>
                                        <div className='hover:scale-105 transition duration-200 ease-in-out cursor-pointer rounded-full shadow-md mx-2 overflow-hidden h-8 w-8 relative'>
                                            <Image src={auth.user.image ? auth.user.image : placeholders.avatar} alt={auth.user.username} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                    </ContextMenu>
                                    <NotificationsMenu />
                                </> :
                                <>
                                    <Divider type='vertical' />
                                    <Link className="active:scale-95 flex items-center font-light uppercase rounded-lg px-3 h-8 mr-3 text-xs text-white" style={{ background: colors.primary }} href="/auth">
                                        {t('common:join-button')}
                                    </Link>
                                    <ContextMenu locale={locale} type="invite" auth={auth} t={t} changeLanguage={changeLanguage} darkTheme={darkTheme} changeTheme={changeTheme}>
                                        <div className='cursor-pointer'>
                                            <BiDotsVerticalRounded />
                                        </div>
                                    </ContextMenu>
                                </>}
                            <div className='dark:border-zinc-800 border-l-2 ml-4 border-slate-100 md:flex hidden'>
                                <SocialButtons title="Facebook" link="https://facebook.com">
                                    <FiFacebook />
                                </SocialButtons>
                                <SocialButtons title='Twitter' link="https://twitter.com">
                                    <FiTwitter />
                                </SocialButtons>
                                <SocialButtons title="Instagram" link="https://instagram.com">
                                    <FiInstagram />
                                </SocialButtons>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Drawer
                rootStyle={{ zIndex: "9999999999999999999" }}
                height={"80px"}
                width={"100%"}
                placement="top"
                onClose={() => setActiveSearch(false)}
                open={activeSearch}
                closable={false}
                headerStyle={{ background: darkTheme ? '#18181b' : "white" }}
                bodyStyle={{ background: darkTheme ? '#18181b' : "white" }}
            >
                <div className="h-full flex items-center justify-center">
                    <Search push={push} t={t} activeSearch={activeSearch} setActiveSearch={setActiveSearch} />
                </div>

            </Drawer>
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
                    <div className="md:hidden ">
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
                </div>
            </Drawer>
        </>
    )
}

export default Header