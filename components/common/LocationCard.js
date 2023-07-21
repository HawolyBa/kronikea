// import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Modal, Button } from 'antd'
import { useAuth } from '../../database/auth'

import { placeholders } from '../../utils/constants'

const LocationCard = ({ data }) => {
  const auth = useAuth()
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <figure onClick={() => setVisible(true)} className='hover:scale-105 transition duration-300 cursor-pointer bg-white dark:bg-zinc-900 rounded-md min-w-36 w-full max-w-44 flex flex-col items-center overflow-hidden text-zinc-900 dark:text-slate-100 shadow-lg'>
        <div className='after-border after:absolute after:border after:content-[""] after:bg-transparent after:z-50 after:rounded-md w-full h-36 rounded-md overflow-hidden relative after:dark:border-zinc-900'>
          {/* <Image layout='fill' objectFit='cover' src={data.image ? data.image : placeholders.card} alt={data.name} /> */}
          <img className="w-full h-full object-cover" src={data.image ? data.image : placeholders.card} alt={data.name} />
        </div>
        <figcaption className='py-2'>
          <h3 className="uppercase text-center text-xs">{data.name}</h3>
        </figcaption>
      </figure>
      <Modal
        open={visible}
        title={data.name}
        closable
        onCancel={() => setVisible(false)}
        footer={[
          (auth?.user?.uid === data?.authorId && <Link className='mr-5' href={`/location/${data?.id}/edit`}>Edit</Link>),
          (<Button key="back" onClick={() => setVisible(false)}>Ok</Button>)
        ]}
        okText="Close"
        onOk={() => setVisible(false)}
      >
        <figure onClick={() => setVisible(true)} className='w-full flex flex-col items-center text-zinc-900 dark:text-slate-100'>
          <div className='w-full h-96 rounded-xl overflow-hidden relative'>
            <img className="w-full h-full object-cover" src={data.image ? data.image : placeholders.card} alt={data.name} />
          </div>
          <figcaption className='text-center py-2'>
            <h3 className="card__title mt-2">{data.name}</h3>
            <p>{data.description}</p>
            <h4 className="mt-2">Story: <Link href={`/story/${data.storyId}`}>{data.storyTitle}</Link></h4>
          </figcaption>
        </figure>
      </Modal>
    </>
  )
}

export default LocationCard