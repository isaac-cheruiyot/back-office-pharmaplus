import { BlogProvider } from '@/context/BlogContext'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BlogProvider>
      {children}
    </BlogProvider>
  )
}

export default Layout
