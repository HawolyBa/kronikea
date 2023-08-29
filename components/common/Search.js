import React from 'react'
import Image from 'next/image';
import { IconContext } from "react-icons";
import { BiSearchAlt } from "react-icons/bi";
import bookLover from '../../images/search-2.png';

const Search = ({ activeSearch, setActiveSearch, t, push }) => {
  const [search, setSearch] = React.useState('')

  const handleSubmit = e => {
    e.preventDefault()
    setActiveSearch(!activeSearch)
    push(`/search/${search}`)
  }
  return (

    <div className={`main__search active-search`}>
      <div className='md:h-12 md:w-12 hidden md:block overflow-hidden rounded-full relative mr-8'>
        <Image src={bookLover.src} alt="logo" fill style={{ objectFit: "cover" }} />
      </div>
      <div className="main__search__inner text-zinc-800">
        {/* <div className="main__search__inner__list px-2">
          <select name="type" className='capitalize'>
            <option value="stories">{t('common:stories')}</option>
            <option value="characters">{t('common:characters')}</option>
            <option value="authors">{t('common:authors')}</option>
          </select>
        </div> */}
        <form onSubmit={handleSubmit}>
          <input onChange={e => setSearch(e.target.value)} placeholder={t('common:search-for-something')}
            className="main__search__inner__area" type="text" />

          <div className="main__search__inner__btn" onClick={() => {
            setActiveSearch(!activeSearch)
            push(`/search/${search}`)
          }}>

            <IconContext.Provider value={{ size: "1em", color: "white" }}>
              <BiSearchAlt />
            </IconContext.Provider>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Search