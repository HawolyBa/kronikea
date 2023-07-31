import React from 'react'
import Head from 'next/head';
import Script from 'next/script';
import { notification } from 'antd';
import CookieConsent from "react-cookie-consent";
import { useTranslation } from 'next-i18next'

import { useNotifcations } from '../../database/notifications';
import Header from './Header';
import Footer from './Footer';


const Layout = ({ children, darkTheme, setDarkTheme }) => {
  const { t } = useTranslation()
  const notifications = useNotifcations();
  const [api, contextHolder] = notification.useNotification();
  const [currentNotification, setCurrentNotification] = React.useState(notifications?.items.filter(item => !item.read))

  const renderTitle = notif => {
    if (notif?.type === 'comment') {
      return t('common:new-comment')
    } else if (notif?.type === 'storyLike') {
      return t('common:new-story-like')
    } else if (notif?.type === "follow") {
      return t('common:new-follower')
    } else if (notif?.type === 'characterComment') {
      return t('common:new-feedback')
    } else if (notif?.type === 'characterLike') {
      return t('common:new-character-like')
    } else if (notif?.type === 'newChapter') {
      return t('common:new-chapter')
    }
  }

  const render = (item) => {
    if (item?.type === 'comment') {
      return `${item.senderName} ${t('common:chapter-commented')} ${item.chapterTitle}`
    } else if (item?.type === 'storyLike') {
      return `${item?.senderName} ${t('common:storyliked-message')} ${item.storyTitle} ${t('common:storyliked-message-2')}`
    } else if (item?.type === "follow") {
      return `${item?.senderName} ${t('common:follow-message')}`
    } else if (item?.type === 'characterComment') {
      return `${item?.senderName} ${t('common:character-feedback')} ${item.characterName}`
    } else if (item?.type === 'characterLike') {
      return `${item?.senderName} ${t('common:characterliked-message')} ${item?.characterName} ${t('common:characterliked-message-2')}`
    } else if (item?.type === 'newChapter') {
      return `New chapter for ${item?.storyTitle}`
    }
  }

  const openNotificationWithIcon = (notif) => {
    api.info({
      message: renderTitle(notif),
      placement: 'bottomRight',
      description: render(notif),
    });
  };

  React.useEffect(() => {
    if (currentNotification?.length !== notifications?.items.filter(item => !item.read).length) {
      if (notifications.items.filter(item => !item.read).length - 1 >= 0) {
        openNotificationWithIcon(notifications.items.filter(item => !item.read)[notifications.items.filter(item => !item.read).length - 1])
      }
      setCurrentNotification(notifications.items.filter(item => !item.read))
    }
  }, [notifications, currentNotification])

  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MPXV4K7DRX" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MPXV4K7DRX');
        `
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2847418034592467" ></script>
      </Head>

      <div className={`layout ${darkTheme ? 'dark' : ''}`}>
        <Header setDarkTheme={setDarkTheme} darkTheme={darkTheme} />
        <div className='relative'>
          {contextHolder}
          {children}
        </div>
        <Footer />
        <CookieConsent
          location="bottom"
          buttonText={t('common:accept')}
          cookieName="myAwesomeCookieName2"
          style={{ background: "#222" }}
          buttonStyle={{
            background: "#27746c", color: "#eee", fontSize: "13px"
          }}
          expires={150}
        >
          {t('common:cookies')}{" "}

        </CookieConsent>
      </div>
    </>
  );
}

export default Layout