import React from 'react'
import Banner from './Banner'
import FeaturedBooks from './FeaturedBooks'
import AboutAuthor from './AboutAuthor'
import BlogsPage from './BlogsPage'
import Testimonials from './Testimonials'
import ReaderThoughts from './ReaderThoughts'
import ReadersFeedback from './ReadersFeedback'
import InspirationBoard from './InspirationBoard'
import Corners from './corners'

const Home = () => {
  return (
    <>
        <Banner/>
        <FeaturedBooks />
        <ReaderThoughts />
        <ReadersFeedback />
        <InspirationBoard />
        <Corners />
        <AboutAuthor />
        <BlogsPage />
        <Testimonials />
    </>
  )
}

export default Home