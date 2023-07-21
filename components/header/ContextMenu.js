import React from 'react'
import { useRouter } from 'next/router'
import { Dropdown } from 'antd';
import { BiUser, BiGlobe, BiSun, BiLogOutCircle, BiMoon } from 'react-icons/bi';
import { WiMoonAltFirstQuarter } from 'react-icons/wi';
import Flag from 'react-world-flags';

const ContextMenu = ({ children, darkTheme, changeTheme, changeLanguage, t, auth, type, locale }) => {

  // FIXME - DISABLE CURRENT LANGUAGE

  const { push } = useRouter()
  const themes = [
    {
      label: t('common:dark'),
      key: 'dark',
      icon: <BiMoon />,
      disabled: darkTheme,
      style: { textTransform: 'uppercase' },
      onClick: () => changeTheme(true)
    },
    {
      label: t('common:light'),
      key: 'light',
      icon: <BiSun />,
      disabled: !darkTheme,
      onClick: () => changeTheme(false)
    }
  ]
  const lang = [
    {
      key: "en",
      label: 'English',
      disabled: locale === 'en',
      icon: <Flag code="gb" width="16px" />,
      onClick: () => changeLanguage('en')
    },
    {
      key: "fr",
      label: "Français",
      disabled: locale === 'fr',
      icon: <Flag code="fr" width="16px" />,
      onClick: () => changeLanguage('fr')
    }
  ]
  const items = [
    (type === "user" && {
      label: t('common:your-profile'),
      icon: <BiUser />,
      key: '1',
      onClick: () => push('/profile')
    }),
    {
      label: t('common:language'),
      key: '2',
      icon: <BiGlobe />,
      children: lang
    },
    {
      label: t('common:theme'),
      key: '3',
      icon: <WiMoonAltFirstQuarter />,
      children: themes,
    },
    (type === "user" && {
      label: t('common:logout'),
      key: '4',
      icon: <BiLogOutCircle />,
      onClick: () => auth.signout()
    }),
  ];

  return (
    <Dropdown placement='bottomRight' overlayStyle={{ zIndex: 9999999999999 }} trigger={['click']} menu={{ items }}>
      {children}
    </Dropdown>
  )
}

export default ContextMenu