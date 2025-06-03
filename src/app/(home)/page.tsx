import Hero from '@/components/hero/hero'
import { Navbar } from '@/components/home/Navbar'
import { Footer } from '@/components/home/Footer'
import { TopArticles } from '@/components/topArticles/TopArticles'
import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Articles
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Discover our most popular and trending content
            </p>
          </div>

          <Suspense fallback={<h1>Loading....</h1>}>
            <TopArticles/>
          </Suspense>

          <div className="mt-12 text-center">
            <Link href={"/articles"}>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
              >
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}
