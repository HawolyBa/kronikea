import React from 'react'
import { useSwiper } from 'swiper/react';

const TripleCard = ({ slide, prev, next }) => {
  const swiper = useSwiper();
  return (
    <div className='w-5/6 top-6 mx-auto h-full relative flex items-center justify-center transition duration-150 triple-card'>
      <div onClick={() => swiper.slidePrev()} style={{ backgroundImage: `url(${prev.banner})` }} className="bg-cover bg-center shadow-lg w-1/3 h-72 active rounded-xl absolute ease-in transition duration-150 left-6 -rotate-12 border border-zinc-700">
      </div>
      <div style={{ backgroundImage: `url(${slide.banner})`, height: '80%', width: '55%', }} className="absolute z-10 bg-cover bg-center shadow-lg active ease-in transition duration-150 top-6 rounded-xl border border-zinc-700">
      </div>
      <div onClick={() => swiper.slideNext()} style={{ backgroundImage: `url(${next.banner})` }} className="absolute bg-cover bg-center shadow-lg w-2/5 h-72 rotate-12 active ease-in transition duration-150 right-6 rounded-xl border border-zinc-700">
      </div>
    </div>
  )
}

export default TripleCard