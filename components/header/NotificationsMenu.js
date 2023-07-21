import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Dropdown, Badge } from 'antd';
import { FaBell } from 'react-icons/fa';

import { colors } from '../../utils/constants';
import { useNotifcations } from '../../database/notifications';

const NotificationsMenu = () => {

  const { push } = useRouter()
  const notifications = useNotifcations()

  const items = []

  return (
    // <Dropdown placement='bottomRight' overlayStyle={{ zIndex: 9999999999999 }} trigger={['click']} menu={{ items }}>
    <Link className='active:scale-95 transition duration-200 ease-in-out cursor-pointer flex items-center justify-center p-2 rounded-md shadow-xl mx-2' href='/notifications'>
      <Badge count={notifications.items.filter(i => !i.read).length} size='small'>
        <FaBell style={{ color: colors.primary, fontSize: '1.1rem' }} />
      </Badge>
    </Link>
    // </Dropdown>
  )
}

export default NotificationsMenu