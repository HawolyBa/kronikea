import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Divider, Spin, Tooltip } from 'antd'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { useAuth } from '../database/auth'
import { useGetFeaturedQuery } from '../database/reducers/stories'
import { placeholders } from '../utils/constants'

import StoryMiniCard from '../components/common/StoryMiniCard'
import CharacterCard from '../components/common/CharacterCard'
import Slider from '../components/home/Slider'
import CatSlider from '../components/home/CatSlider'
import StoryCardMini from '../components/common/StoryCardMini'
import { getPopularStories, getPopularStoriesByCategory } from '../database/actions/stories'
import { getPopularCharacters } from '../database/actions/characters'
import SliderMobile from '../components/home/SliderMobile'
import { getPopularAuthors } from '../database/actions/users'

const Home = ({ characters, popular, drama, crime, fantasy, isLoading: isDataloading, authors }) => {

  // TODO - ADD CTA FOR LOGIN 

  const auth = useAuth()
  const { data, isLoading } = useGetFeaturedQuery()

  const { t } = useTranslation();

  React.useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  console.log(authors)

  return (
    <>
      <Head>
        <title>{t('common:home')} - Kronikea</title>
        <meta charset="utf-8" />
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Spin spinning={auth.isLoading || isLoading}>
        <main className="home max-w-screen-xl mx-auto pb-8 md:pt-8">
          <Slider t={t} data={data?.featured} />
          <SliderMobile t={t} data={data?.featured} />
          <div className="mt-4">
            <ins className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-2847418034592467"
              data-ad-slot="5483409976"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
          <CatSlider t={t} />
          {/* POPULAR STORIES */}
          <div className="mt-12 px-4">
            <Divider className="dark:border-stone-700" orientation="left" plain>
              <h3 className="uppercase dark:text-zinc-50 font-light home__heading">{t('home:popular-stories')}</h3>
            </Divider>
            <div className="grid my-8 gap-5 grid-cols-2 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 place-items-center">
              {popular?.map((story, i) => (
                <div before={i + 1} key={story.id} className="relative before:content-[attr(before)] before:absolute before:text-8xl before:-left-9 before:-top-10 before:text-gray-200 before:dark:text-zinc-900">
                  <StoryMiniCard width={'full'} height={60} data={story} />
                </div>
              ))}
            </div>
            {/* CATEGORIES STORIES SECTION */}
            <section className='my-12 md:p-4 w-full grid gap-6 grid-cols-1 md:grid-cols-3 place-content-center px-4'>
              <div className="md:px-2 md:border-r md:dark:border-neutral-800">
                <h4 className="text-lg mb-6">{t('common:drama')}</h4>
                <div>
                  {drama?.map(story => (
                    <StoryCardMini type="other" key={story.id} data={story} />
                  ))}
                </div>
                <Link href="/category/drama">{'See More >>'}</Link>
              </div>
              <div className="md:px-2 md:border-r md:dark:border-neutral-800">
                <h4 className="text-lg mb-6">{t('common:crime')}</h4>
                <div>
                  {crime?.map(story => (
                    <StoryCardMini type="other" key={story.id} data={story} />
                  ))}
                </div>
                <Link href="/category/crime">{'See More >>'}</Link>
              </div>
              <div className="md:px-2">
                <h4 className="text-lg mb-6">{t('common:fantasy')}</h4>
                <div>
                  {fantasy?.map(story => (
                    <StoryCardMini type="other" key={story.id} data={story} />
                  ))}
                </div>
                <Link href="/category/fantasy">{'See More >>'}</Link>
              </div>
            </section>
            <div className="mt-12 px-4">
              <Divider orientation="left" plain className="dark:border-stone-700">
                <h3 className="uppercase dark:text-zinc-50 font-light home__heading">{t('home:popular-characters')}</h3>
              </Divider>
              <div className="grid my-8 sm:grid-cols-4 grid-cols-2 md:grid-cols-6 gap-5">
                {characters?.map((char, i) => (
                  <div before={i + 1} key={char.id} className="z-30 relative before:content-[attr(before)] before:absolute before:text-5xl before:-top-10 before:text-gray-200 before:dark:text-zinc-900">
                    <CharacterCard type="show" data={char} />
                  </div>
                ))}
              </div>
              <div className="flex items-end">
                <div className='w-3/4 mr-5'>
                  <Divider orientation="left" plain className="dark:border-stone-700">
                    <h3 className="uppercase dark:text-zinc-50 font-light home__heading">{t('home:popular-characters')}</h3>
                  </Divider>
                  <div style={{ height: "500px" }} className="w-full bg-white dark:bg-zinc-900 p-8 flex">
                    <div className="w-2/3 h-full mr-3">
                      <Link href={`/character/${characters[0].id}`}>
                        <figure className="chara-card h-full transition duration-300 cursor-pointer bg-white dark:bg-zinc-900 rounded-xl min-w-36 w-full max-w-44 flex flex-col items-center overflow-hidden text-zinc-900 dark:text-slate-100 shadow-lg">
                          <div className={`w-full h-5/6 rounded-xl overflow-hidden relative after-border after:absolute after:dark:border-zinc-800 after:border after:content-[''] after:bg-transparent after:rounded-xl`}>
                            <img className="w-full h-full object-cover" src={characters[0].image ? characters[0].image : placeholders.card} alt={`${characters[0].firstname} ${characters[0].lastname}`} />
                          </div>
                          <figcaption className='py-2 text-center flex items-center justify-center h-1/6'>
                            <h3 className="font-light text-2xl uppercase">
                              {`${characters[0].firstname} ${characters[0].lastname}`}
                            </h3>
                          </figcaption>
                        </figure>
                      </Link>
                    </div>
                    <div className="w-1/3 h-full flex flex-col">
                      <div style={{ height: "48%", marginBottom: "6%" }} className="w-full">
                        <Link href={`/character/${characters[1].id}`}>
                          <figure className="chara-card w-full h-full transition duration-300 cursor-pointer bg-white dark:bg-zinc-900 rounded-xl min-w-36 w-full max-w-44 flex flex-col items-center overflow-hidden text-zinc-900 dark:text-slate-100 shadow-lg">
                            <div className={`w-full h-5/6 rounded-xl overflow-hidden relative after-border after:absolute after:dark:border-zinc-800 after:border after:content-[''] after:bg-transparent after:rounded-xl`}>
                              <img className="w-full h-full object-cover" src={characters[1].image ? characters[1].image : placeholders.card} alt={`${characters[1].firstname} ${characters[1].lastname}`} />
                            </div>
                            <figcaption className='py-2 text-center flex items-center justify-center h-1/6'>
                              <h3 className="font-light text-lg uppercase pt-2">
                                {`${characters[1].firstname} ${characters[1].lastname}`}
                              </h3>
                            </figcaption>
                          </figure>
                        </Link>
                      </div>
                      <div style={{ height: "48%" }} className="w-full">
                        <Link href={`/character/${characters[2].id}`}>
                          <figure className="chara-card h-full transition duration-300 cursor-pointer bg-white dark:bg-zinc-900 rounded-xl min-w-36 w-full max-w-44 flex flex-col items-center overflow-hidden text-zinc-900 dark:text-slate-100 shadow-lg">
                            <div className={`w-full h-5/6 rounded-xl overflow-hidden relative after-border after:absolute after:dark:border-zinc-800 after:border after:content-[''] after:bg-transparent after:rounded-xl`}>
                              <img className="w-full h-full object-cover" src={characters[2].image ? characters[2].image : placeholders.card} alt={`${characters[2].firstname} ${characters[2].lastname}`} />
                            </div>
                            <figcaption className='py-2 text-center flex items-center justify-center h-1/6'>
                              <h3 className="font-light text-lg uppercase pt-2">
                                {`${characters[2].firstname} ${characters[2].lastname}`}
                              </h3>
                            </figcaption>
                          </figure>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/4">
                  <Divider orientation="left" plain className="dark:border-stone-700">
                    <h3 className="uppercase dark:text-zinc-50 font-light home__heading">{t('home:popular-authors')}</h3>
                  </Divider>
                  <div style={{ height: "500px" }} className="w-full p-4">
                    <div className="grid gap-5 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                      {
                        authors.map(user => (
                          <Tooltip key={user.id} placement="bottom" title={user.username}>
                            <Link href={`/profile/${user.id}`}>
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image src={user.image ? user.image : placeholders.avatar} alt={user.username} fill style={{ objectFit: 'cover' }} />
                              </div>
                            </Link>
                          </Tooltip>
                        ))
                      }
                    </div>
                  </div>
                  <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-2847418034592467"
                    data-ad-slot="9382895021"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Spin>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const popular = await getPopularStories()
  const drama = await getPopularStoriesByCategory('drama')
  const crime = await getPopularStoriesByCategory('crime')
  const fantasy = await getPopularStoriesByCategory('fantasy')
  const characters = await getPopularCharacters()
  const authors = await getPopularAuthors()
  return {
    props: {
      characters: characters.data || null,
      fantasy: fantasy.data || null,
      crime: crime.data || null,
      drama: drama.data || null,
      popular: popular.data || null,
      authors: authors.data || null,
      ...(await serverSideTranslations(locale, ["home", "common"]))
    }
  }
}

export default Home