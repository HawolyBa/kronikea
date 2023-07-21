import React from 'react'
import { Dropdown } from 'antd'
import { ImSortAmountDesc } from 'react-icons/im'

const Sort = ({ sortByUpvoted, t }) => {
  const items = [
    {
      label: t('common:most-upvoted'),
      key: 'top',
      onClick: () => sortByUpvoted('upvoted')
    },
    {
      label: t('common:most-recent'),
      key: 'recent',
      onClick: () => sortByUpvoted('recent')
    },
  ]

  return (
    <div className='my-4'>
      <p className='flex items-center'>
        <span className='mr-2'>{t('common:sort-by')}:</span>
        <Dropdown placement='bottomRight' overlayStyle={{ zIndex: 9999999999999 }} trigger={['click']} menu={{ items }}>
          <ImSortAmountDesc style={{ cursor: 'pointer' }} />
        </Dropdown>
      </p>
    </div>
  )
}

export default Sort