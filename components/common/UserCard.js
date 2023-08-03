import Link from 'next/link'
import Image from "next/image"
import { placeholders } from "../../utils/constants"

const UserCard = ({ data, show }) => {
  return (
    <Link onClick={show && show} href={`/profile/${data.id}`}>
      <div className="active:scale-95 transparent ">
        <div style={{ backgroundImage: `url(${data?.banner ? data?.banner : placeholders.card})` }} className="w-full h-16 rounded-t-xl bg-center bg-cover">
        </div>
        <div className="relative dark:bg-zinc-900 bg-white pb-3 shadow-md">
          <div className="user-card-avatar rounded-full absolute left-4 -top-8 flex items-center before:absolute before:content-[''] before:rounded-full before:dark:bg-zinc-900 before:shadow-lg justify-center before:bg-slate-50">
            <Image fill style={{ objectFit: 'cover' }} src={data?.image ? data?.image : placeholders.avatar} alt={data?.username} />
          </div>
          <div className="pl-24 pt-2 px-2">
            <h2 className="text-zinc-800 dark:text-slate-50 uppercase text-xs">{data?.username}</h2>
          </div>
        </div>
      </div>
    </Link>
    // <div className="user__card">
    //   <div className="user__card__content bg-gray-200 p-2 rounded-md">
    //     <div className="user__card__content__left">
    //       <div className="user__card__image relative">
    //         <img src={data.image ? data.image : placeholders.avatar} alt={data.username} className="w-full h-full object-cover" />
    //       </div>
    //       <div>
    //         <h3>{data.username}</h3>
    //         {/* <div className="user__card__counters">
    //           <span>130 Followers</span>
    //           <Divider type="vertical" />
    //           <span>49 stories</span>
    //         </div> */}
    //       </div>
    //     </div>
    //     <div className="follow__btn">
    //       <button className="bg-primary shadow-lg active:scale-95 px-4 py-2 text-slate-50 rounded-xl text-xs">Follow</button>
    //     </div>
    //   </div>
    // </div>
  )
}

export default UserCard