import React from 'react'
import { placeholders } from '../../utils/constants'

const Banner = ({ image, children }) => {
  return (
    <section style={{ backgroundImage: `linear-gradient(113deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5) 100%), url(${image ? image : placeholders.card})` }} className={` text-slate-50 bg-center bg-zinc-800 md:h-44 h-56 w-full md:rounded-3xl bg-cover relative flex md:items-center items-start justify-between md:justify-end overflow-hidden shadow-xl`}>
      {children}
    </section>
  )
}

export default Banner