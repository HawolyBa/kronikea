import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { placeholders } from '../../utils/constants';

const SliderMobile = ({ data, t }) => {

  return (
    <div className="md:hidden block">
      <h2 className="uppercase mb-2 font-light">À la une</h2>
      <Flicking
        viewportTag="a"
        cameraTag="div"
        cameraClass=""
        renderOnSameKey={true}
        onMove={(e) => { }}
        onWillChange={(e) => { }}
        horizontal={true}
        circular={true}
      >
        {data && data.map(story => (
          <Link key={story.id} href={`/story/${story.id}`}>
            <figure style={{ width: '150px' }} className={`cursor-pointer mb-4 flex flex-col mr-2`}>
              <div className={`mini-card transition duration-150 w-full after-border after:absolute after:border after:content-[''] after:dark:border-zinc-900 after:bg-transparent after:rounded-md`} style={{ height: "200px", position: 'relative' }}>
                <Image fill style={{ objectFit: 'cover' }} src={story.banner ? story.banner : placeholders.card} alt={story.title} className={`w-full h-full object-cover shadow-lg rounded-md min-h-full`} />
              </div>
              <figcaption className="overflow-hidden text-center leading-3">
                <h3 className="text-sm mt-2 p-0 mb-0 font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">{story.title}</h3>
                <span className="text-gray-400 mb-1 text-sm block">by {story.authorName}</span>
              </figcaption>
            </figure>
          </Link>
          // <div className="w-1/2 h-24 mx-2 bg-blue-200">panel 1</div>
        ))}
        {/* // <div className="w-1/2 h-24 mx-2 bg-blue-500">panel 0</div>
        // <div className="w-1/2 h-24 mx-2 bg-blue-200">panel 1</div>
        // <div className="w-1/2 h-24 mx-2 bg-blue-800">panel 2</div> */}
      </Flicking>
    </div>
  )
}

export default SliderMobile