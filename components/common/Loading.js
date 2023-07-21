import React from 'react'
import { Spin } from 'antd';

const Loading = () => {
  return (
    <div className='h-fullwidth absolute top-0 left-0 bg-slate-50 dark:bg-zinc-800 z-50 w-full h-full flex items-center justify-center'>
      <Spin size="large" />
    </div>
  )
}

export default Loading