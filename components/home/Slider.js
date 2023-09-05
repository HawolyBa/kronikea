import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { FaEye, FaStar } from 'react-icons/fa'
import { ArrowRightOutlined } from '@ant-design/icons'
import { A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { colors } from '../../utils/constants'
import { capitalize } from '../../utils/helpers'
import NextButton from './NextButton'
import PrevButton from './PrevButton'
import TripleCard from './TripleCard';
import Button from '../common/Button';


const Slider = ({ data, t }) => {

  const [currentSlide, setCurrentSlide] = React.useState(0)

  return (
    <div className="px-4">
      <div className="md:flex hidden flex-col md:flex-row relative carousel shadow-md rounded-xl overflow-hidden border bg-white dark:bg-zinc-900 dark:border-zinc-700 border-slate-200">
        <div className="w-full md:w-1/2 flex flex-col p-8 justify-center transition-all duration-75 ease-in md:order-1 order-2">
          <div className='border-l-8 p-2' style={{ borderColor: colors.secondary }}>
            <h2 className="md:leading-2 text-xs md:text-lg uppercase tracking-widest">{data && data[currentSlide]?.title}</h2>
            <span>{capitalize(t('common:by'))} {data && data[currentSlide]?.authorName}</span>
            <div className='flex items-center mt-4'>
              <div className='flex items-center text-xl text-zinc-500 dark:text-slate mr-6'><FaEye /><span className='ml-1'>{data && data[currentSlide]?.views ? data[currentSlide]?.views : 0} {t('common:views')}</span></div>
              <div className='flex items-center  text-xl text-zinc-500 dark:text-slate'><FaStar /><span className='ml-1'>{data && data[currentSlide]?.likedBy?.length} {t('common:favorites')}</span></div>
            </div>

          </div>
          <p className="text-sm md:mt-8 mt-3">{data && data[currentSlide]?.summary}</p>
          <Link className='mt-4 -ml-4' href={`/story/${data && data[currentSlide]?.id}`}>
            <Button color="bg-primary">
              <ArrowRightOutlined /> {t('home:read')}</Button>
          </Link>
        </div>
        <div className="w-full md:w-1/2 md:order-2 order-1">
          <section className='w-full shadow-xl home__cover '>
            <Swiper
              style={{ height: "100%" }}
              loop={true}
              modules={[A11y]}
              spaceBetween={0}
              slidesPerView={1}
              onSwiper={(swiper) => setCurrentSlide(swiper.realIndex)}
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            >
              <NextButton />
              <PrevButton />
              {data && data.map(slide => (
                <SwiperSlide key={slide.id} style={{ height: "100%", position: 'relative' }}>
                  <div className='z-10 absolute w-full h-full' style={{ background: `linear-gradient(113deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) 100%)` }}>
                  </div>
                  <Image src={data && data[currentSlide].banner} alt={data[currentSlide].title} fill style={{ objectFit: 'cover', zIndex: 0 }} />
                  <TripleCard prev={data[currentSlide - 1 >= 0 ? currentSlide - 1 : data.length - 1]} slide={slide} next={data[currentSlide + 1 > data.length - 1 ? 0 : currentSlide + 1]} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </div >
      </div >
    </div>
  )
}

export default Slider