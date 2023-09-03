import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const About = () => {
  return (
    <div className="p-4 w-full">
      <div className='bg-white dark:bg-zinc-900 rounded-xl max-w-screen-lg py-8 md:px-12 px-4 mx-auto shadow-lg mb-12'>
        <h2>À propos de nous</h2>
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["form", "contact", "common", "legals"]))
    }
  }
}

export default About