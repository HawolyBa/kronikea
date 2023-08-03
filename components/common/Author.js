import Link from 'next/link'
import Image from 'next/image'
import { placeholders } from '../../utils/constants'

const Author = ({ data }) => {
  return (
    <Link href={`/profile/${data?.authorId}`}>
      <div className='flex items-center cursor-pointer'>
        <div className="mr-2 author-avatar rounded-full w-6 h-6 relative overflow-hidden">
          <Image fill src={data?.authorImage ? data?.authorImage : data?.userImage ? data?.userImage : placeholders.avatar} alt={data.authorName} style={{ objectFit: 'cover' }} />
        </div>
        <span className="text-xs">{data ? data?.authorName : ''}</span>
      </div>
    </Link>
  )
}

export default Author