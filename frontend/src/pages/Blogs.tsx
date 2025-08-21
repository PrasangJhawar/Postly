import React from 'react'
import BlogCard from '../components/BlogCard'

const Blogs = () => {
  return (
    <div>
        <BlogCard
            authorName={'Elon'}
            title={'Exploring LLMs'}
            content={'Why grok hates the Left'}
            date={'1st Jan 2020'}
        />
    </div>
  )
}

export default Blogs