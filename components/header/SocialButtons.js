import React from 'react'
import { Tooltip } from 'antd';

import { colors } from '../../utils/constants'

const SocialButtons = ({ children, title, link }) => {
  return (
    <Tooltip placement='bottom' title={title}>
      <a href={link} rel="noreferrer" target="_blank" className="active:scale-95 transition duration-200 ease-in-out w-6 h-6 flex items-center justify-center rounded-md drop-shadow-xl mx-2" style={{ color: colors.primary, fontSize: '0.9rem', border: `1 px solid ${colors.primary}` }}>
        {children}
      </a>
    </Tooltip>
  )
}

export default SocialButtons