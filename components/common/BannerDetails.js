import React from 'react'
import { Image } from 'antd'

const BannerDetails = ({ beforeWidth, beforeHeight, height, width, rounded, image, title, children }) => {
  return (
    <section className="bg-slate-50 dark:bg-zinc-800 relative md:top-0 -top-8 rounded-3xl h-fit w-full flex flex-col md:flex-row justify-center md:items-start items-center">
      <div className="w-56 h-full relative flex items-center justify-center">
        <div className={`absolute before:bg-slate-50 before:dark:bg-zinc-800 -top-20  w-${width} h-${height} flex items-center before:absolute before:content-[''] before:rounded-${rounded} before:shadow-lg before:w-${beforeWidth} before:h-${beforeHeight} justify-center rounded-${rounded} flex`}>
          <Image
            width={"100%"}
            height={"100%"}
            src={image}
            alt={title}
            style={{ borderRadius: "5px", objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="md:p-4 px-12 md:w-1/2 w-full h-full md:mt-0 mt-32">
        <div className="flex flex-col md:items-start items-center">
          <h2 className="text-xl uppercase font-bold">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

export default BannerDetails