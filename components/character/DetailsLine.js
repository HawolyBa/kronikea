import React from 'react'

const DetailsLine = ({ character, t, type }) => {

  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    if (character) {
      setItems([
        { name: t('form:firstname'), val: character?.firstname },
        { name: t('form:lastname'), val: character?.lastname },
        { name: t('form:gender'), val: character?.gender },
        { name: t('form:age'), val: character?.age },
        { name: t('character:birthday'), val: character?.birthday },
        { name: t('form:location'), val: character?.location },
        { name: t('form:occupation'), val: character?.occupation },
        { name: t('character:astrological'), val: character.astrological },
        { name: t('form:likes'), val: character?.likes?.join(', ') },
        { name: t('form:dislikes'), val: character?.dislikes?.join(', ') },
      ])
    }
  }, [character])

  return (
    <>
      {items && items.map(i => (
        <p key={i.name} className={`mb-3 capitalize ${type === 'mobile' ? 'flex flex-col items-center' : ''}`}>
          <span className='font-bold'>{i.name}{type === 'desktop' && ':'}</span> {i.val ? i.val : 'N/A'}
        </p>
      ))}
    </>
  )
}

export default DetailsLine