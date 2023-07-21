import React from 'react'
import Link from 'next/link'
import { capitalize } from '../../utils/helpers'

const AddButton = ({ link, name }) => {
  return (
    <Link className="cursor-pointer mb-5 flex items-center" href={`${link}/new`}>
      <span className="w-5 h-5 dark:text-slate-50 dark:bg-zinc-900 bg-slate-200 text-zinc-800 rounded-full flex items-center justify-center mr-2">+</span> {capitalize(name)}
    </Link>
  )
}

export default AddButton