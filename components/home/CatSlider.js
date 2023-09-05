import React from 'react'
import Link from 'next/link'
import { RightOutlined } from '@ant-design/icons'
import { A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { CATEGORIES } from '../../utils/constants'
import NextButton from './NextButton'
import PrevButton from './PrevButton'
import CategoryCard from '../common/CategoryCard'


const CatSlider = ({ t }) => {
  const [width, setWidth] = React.useState(typeof window !== 'undefined' && window.innerWidth)
  const [slideNumber, setSlideNumber] = React.useState(5);

  const updateDimensions = () => {
    setWidth(window.innerWidth)
  }

  React.useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  React.useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  React.useEffect(() => {
    let number = null
    if (width > 1280) {
      number = 5
    } else if (width < 1280 && width >= 1000) {
      number = 4
    } else if (width < 1000 && width >= 600) {
      number = 3
    } else if (width < 600) {
      number = 2
    }
    setSlideNumber(number);
  }, [width])

  return (
    <div className='mt-12 px-4'>
      <div className="flex justify-between items-center mb-2">
        <h3 className='uppercase home__heading font-light'>Explore</h3>
        <div>
          <Link href="/category">
            <span className='cursor-pointer'>{t('home:see-all')}<RightOutlined />
            </span>
          </Link>
        </div>
      </div>
      <Swiper
        style={{ height: "100%" }}
        loop={true}
        modules={[A11y]}
        spaceBetween={10}
        slidesPerView={slideNumber}
      >
        <NextButton />
        <PrevButton />
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-2847418034592467"
          data-ad-slot="5007136949"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        {CATEGORIES.map(cat => (
          <SwiperSlide key={cat.id} style={{ height: "100%" }}>
            <CategoryCard t={t} data={cat} />
          </SwiperSlide >
        ))}
      </Swiper>
    </div>
  )
}

export default CatSlider