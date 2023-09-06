import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSwiper } from 'swiper/react';

const TripleCard = ({ slide, prev, next }) => {
  const swiper = useSwiper();
  const [width, setWidth] = React.useState(typeof window !== 'undefined' && window.innerWidth)

  const updateDimensions = () => {
    setWidth(window.innerWidth)
  }

  React.useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  return (
    <div className='w-5/6 top-6 mx-auto h-full relative flex items-center justify-center transition duration-150 triple-card'>
      <div onClick={() => swiper.slidePrev()} style={{ height: width > 800 ? '80%' : "50%", width: width > 800 ? '55%' : '60%', }} className="bg-cover bg-center shadow-lg w-1/3 h-72 active rounded-xl absolute ease-in transition duration-150 left-6 -rotate-12 border border-zinc-700">
        <Image src={prev.banner} alt={prev.title} fill style={{ objectFit: 'cover' }} />
      </div>
      <div style={{ height: width > 800 ? '80%' : "70%", width: width > 800 ? '55%' : '60%', }} className="absolute z-10 bg-cover bg-center shadow-lg active ease-in transition duration-150 top-6 rounded-xl border border-zinc-700">
        <Link href={`/story/${slide && slide.id}`}>
          <Image src={slide.banner} fill alt={slide.title} style={{ objectFit: 'cover' }} />
        </Link>
      </div>
      <div style={{ height: width > 800 ? '80%' : "50%", width: width > 800 ? '55%' : '60%', }} onClick={() => swiper.slideNext()} className="absolute bg-cover bg-center shadow-lg w-2/5 h-72 rotate-12 active ease-in transition duration-150 right-6 rounded-xl border border-zinc-700">
        <Image src={next.banner} fill alt={next.title} style={{ objectFit: 'cover' }} />
      </div>
    </div>
  )
}

export default TripleCard