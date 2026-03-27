'use client'

import HeroSection from '@/components/HeroSection/HeroSection'
import CategoriesSection from '@/components/Products/CategoriesSection/CategoriesSection'
import FeaturedSection from '@/components/FeaturedSection/FeaturedSection'
import ProductList from '@/components/Products/ProductList/productList'

export default function HomePage() {
  return (
    <div className="pb-16">
      <HeroSection />
      <CategoriesSection />
      <section id="produtos">
        <ProductList />
      </section>
      <FeaturedSection />
    </div>
  )
}
