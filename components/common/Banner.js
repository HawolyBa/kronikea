import React from 'react'
import Image from 'next/image'
import { placeholders } from '../../utils/constants'

const Banner = ({ image, children }) => {
  return (
    <section className={` text-slate-50 bg-center  md:h-44 h-56 w-full md:rounded-3xl bg-cover relative flex md:items-center items-start justify-between md:justify-end overflow-hidden shadow-xl`}>
      <div className='z-10 absolute w-full h-full' style={{ background: `linear-gradient(113deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) 100%)` }}>
      </div>
      <Image src={image ? image : placeholders.card} alt={'story'} fill style={{ objectFit: 'cover', zIndex: 0 }} />
      {children}
    </section>
  )
}

export default Banner