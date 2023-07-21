import Link from 'next/link'
import Image from 'next/image'
import { Tag, Divider } from 'antd'
// import { BookOutlined, CommentOutlined, HeartOutlined } from '@ant-design/icons'
import Author from './Author'
import Ratings from './Ratings'

import { placeholders } from '../../utils/constants'

const StoryCard = ({ story, type }) => {
  return (
    <Link href={`/story/${story.id}`}>

      <div className="w-full story-card relative cursor-pointer hover:shadow-lg ease-linear duration-75 h-fit-content my-4 ">
        <div className="poster w-36 h-full absolute bottom-0 left-0 relative">
          {/* <Image layout='fill' objectFit='cover' src={story.image ? story.image : placeholders.card} alt={story.title} /> */}
          <img className="w-full h-full object-cover" src={story.image ? story.image : placeholders.card} alt={story.title} />
        </div>
        <div className="ml-40 pt-2 pb-3">
          <h3 className='text-lg'>{story.title}</h3>
          <div className="text-gray-400 pt-2">
            <Author data={story} />
          </div>
          <div className="flex mt-4 mb-2">
            {story.genres.map((genre, i) => (
              <span key={i} className="genre capitalize px-2 py-1 mr-2 bg-gray-200">{genre}</span>
            ))}
          </div>
          {/* <div className="flex items-center">
            <Ratings rating={story.rating} />
            <div className="mr-3 ml-3 rounded-full border w-6 h-6 flex items-center justify-center" style={{ borderColor: "#27746c" }}>
              <h3 className="text-white text-xs">4.2</h3>
            </div>
          </div> */}
          <p className='overflow-hidden text-xs pr-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, totam alias quaerat inventore...Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, totam alias quaerat inventore...</p>
        </div>
        <span className="circle-border up-border"></span>
        <span className="circle-border down-border"></span>
      </div>

    </Link>
  )
}

export default StoryCard