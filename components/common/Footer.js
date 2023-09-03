import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

import { CATEGORIES } from '../../utils/constants'
import logo from '../../images/search.png'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <footer className="bg-white dark:bg-zinc-900 p-8 hidden md:block">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex md:flex-row flex-col md:justify-between md:items-start items-center h-full">
          <div className="flex flex-col h-full items-center mb-6 md:mb-0">
            <div className='w-16 h-16 rounded-full overflow-hidden mb-4 relative'>
              <Image fill src={logo.src} alt="logo Kronikea" />
            </div>
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 capitalize">© 2023 <a href="https://flowbite.com/" className="hover:underline">Kronikea™</a>. {t('common:all-rights')}.
            </span>
          </div>
          <div className="flex md:w-1/2 justify-end">
            <div className="md:mr-12 mb-6 md:mb-0 flex flex-col md:items-start items-center md:text-left text-center">
              <h5 className="font-bold mb-3 uppercase text-primary">{t('common:popular-categories')}</h5>
              <ul>
                {CATEGORIES.map(cat => (
                  <li key={cat.value} className="text-sm mb-1 capitalize">
                    <Link href={`/category/${cat.value}`}>{t(`common:${cat.value}`)}</Link>
                  </li>
                )).slice(0, 6)}
              </ul>
            </div>
            <div className="md:mr-12 mb-6 md:mb-0 flex flex-col md:items-start items-center md:text-left text-center">
              <h5 className="font-bold mb-3 uppercase text-primary">{t('common:navigate')}</h5>
              <ul>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/">{t('common:home')}</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/search">{t('common:explore')}</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/contact">Contact</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/feedback">{t('common:feedback')}</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/about">{t('common:about-us')}</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/terms">{t('common:terms')}</Link>
                </li>
                <li className="text-sm mb-1 capitalize">
                  <Link href="/privacy">{t('common:privacy')}</Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col md:items-start items-center md:text-left text-center">
              <h5 className="text-primary font-bold mb-3 uppercase">{t('common:join-us')}</h5>
              <ul>
                <li className="text-sm mb-1">
                  <a target="_blank" rel="noreferrer" href="https://facebook.com/kronikea">Facebook</a>
                </li>
                <li className="text-sm mb-1">
                  <a target="_blank" rel="noreferrer" href="https://twitter.com/kronikea">Twitter</a>
                </li>
                <li className="text-sm mb-1">
                  <a target="_blank" rel="noreferrer" href="https://instagram.com/kronikea">Instagram</a>
                </li>
                <li className="text-sm mb-1">
                  <a target="_blank" rel="noreferrer" href="https://tiktok.com/kronikea">TikTok</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer