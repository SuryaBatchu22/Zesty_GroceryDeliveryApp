import React, { useEffect } from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import TopDiscounts from '../components/TopDiscounts'
import { useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories/>
      <section id="bestsellers">
       <BestSeller />
      </section>
      <section id="topDiscounts">
       <TopDiscounts />
      </section>
      <BottomBanner/>
      <NewsLetter/>
    </div>
  )
}

export default Home