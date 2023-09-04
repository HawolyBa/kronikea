import React from 'react'
import { AiOutlineBook } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { Tooltip, Dropdown } from 'antd';
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlinePlace } from "react-icons/md";
import { GiCharacter } from "react-icons/gi";

import { colors } from '../../utils/constants';

const Create = ({ t }) => {
  const { push } = useRouter()
  const items = [
    {
      label: t('common:add-story'),
      icon: <AiOutlineBook />,
      key: 'story',
      onClick: () => push('/story/new')
    },
    {
      label: t('common:add-character'),
      icon: <GiCharacter />,
      key: 'character',
      onClick: () => push('/character/new')
    },
    {
      label: t('common:add-location'),
      icon: <MdOutlinePlace />,
      key: 'location',
      onClick: () => push('/location/new')
    }
  ]

  return (
    <Dropdown placement='bottomRight' overlayStyle={{ zIndex: 9999999999999 }} trigger={['click']} menu={{ items }}>
      <Tooltip placement="bottom" title={t('common:create')}>
        <div className='hover:scale-105 transition duration-200 ease-in-out cursor-pointer p-2 rounded-md shadow-md mx-2'>
          <AiOutlinePlus style={{ color: colors.primary }} />
        </div>
      </Tooltip>
    </Dropdown>
  )
}

export default Create