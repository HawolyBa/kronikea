import React from 'react'
import Link from 'next/link'
import { Badge } from 'antd';
import { FaBell } from 'react-icons/fa';

import { colors } from '../../utils/constants';

const NotificationsMenu = ({ notifications }) => {

  return (
    // <Dropdown placement='bottomRight' overlayStyle={{ zIndex: 9999999999999 }} trigger={['click']} menu={{ items }}>
    <Link className='active:scale-95 transition duration-200 ease-in-out cursor-pointer items-center justify-center p-2 rounded-md shadow-xl mx-2 md:flex hidden' href='/notifications'>
      <Badge count={notifications.items.filter(i => !i.read).length} size='small'>
        <FaBell style={{ color: colors.primary, fontSize: '1.1rem' }} />
      </Badge>
    </Link>
    // </Dropdown>
  )
}

export default NotificationsMenu