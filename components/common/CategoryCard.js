import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { colors } from '../../utils/constants'

const CategoryCard = ({ data, t }) => {
  return (
    <Link href={`/category/${data.value}`} key={data.value}>
      <div className={`category-card hover:shadow-md bg-cover relative overflow-hidden bg-center cursor-pointer py-2 h-96 text-center px-4 rounded-lg flex items-end justify-center pb-8`} key={data.value}>
        <Image src={data.image.src} alt={data.value} fill style={{ objectFit: 'cover', position: 'absolute', zIndex: -1 }} />
        <span style={{ backgroundColor: `rgba(${colors.secondary}, 0.5)` }} className="uppercase text-gray-300 tracking-widest text-sm py-2 px-4 rounded-lg">{t(`common:${data.value}`)}</span>
      </div>
    </Link>
  )
}

export default CategoryCard