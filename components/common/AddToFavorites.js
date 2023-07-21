import React from 'react'
import { BsFillStarFill } from 'react-icons/bs';

import { useAddToFavoritesMutation } from '../../database/reducers/characters'
import { useAddStoryToFavoritesMutation } from '../../database/reducers/stories'
import { useFollowUserMutation } from '../../database/reducers/profile'
import { colors } from '../../utils/constants';

const AddToFavorites = ({ push, auth, t, id, userImage, username, isFavorite, type, characterName, storyTitle }) => {
  const [addToFavorites] = useAddToFavoritesMutation()
  const [addStory] = useAddStoryToFavoritesMutation()
  const [follow] = useFollowUserMutation()
  const [isFav, setIsFav] = React.useState(isFavorite)

  const add = async () => {
    type === 'character' ?
      await addToFavorites({
        id, username, userImage, characterName
      }).unwrap()
        .then(() => {
          setIsFav(!isFav)
        })
        .catch(err => console.log(err)) :
      type === 'story' ?
        await addStory({
          id, username, userImage, storyTitle
        }).unwrap()
          .then(() => {
            setIsFav(!isFav)
          })
          .catch(err => console.log(err)) :
        await follow({ id, username, userImage })
          .unwrap()
          .then(() => {
            setIsFav(!isFav)
          })
          .catch(err => console.log(err))
  }
  return (
    <>
      <button onClick={() => auth?.user && auth?.user?.emailVerified ? add() : !auth?.user?.emailVerified ? push('/auth/verify') : push('/auth')} className={`active:scale-95 hidden md:flex items-center uppercase padding py-2 px-4 border-2 border-primary ml-6 text-slate-50 text-xs rounded-md ${isFav ? 'bg-white backdrop-filter backdrop-blur-md bg-opacity-20' : 'bg-primary'}`}>
        {!isFav ? type === 'profile' ? t('common:subscribe') : t('common:add-favorites') : type === 'profile' ? t('common:unsubscribe') : 'Remove from favorites'}
      </button>
      <div onClick={() => auth?.user && auth?.user?.emailVerified ? add() : !auth?.user?.emailVerified ? push('/auth/verify') : push('/auth')} className={`md:hidden`}>
        <BsFillStarFill style={{ fontSize: "1.2rem", color: isFav ? 'white' : colors.primary }} />
      </div>
    </>
  )
}

export default AddToFavorites