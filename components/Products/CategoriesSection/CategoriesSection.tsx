export default function CategoriesSection() {
  const categories = [
    { name: 'T-Shirts', image: 'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg' },
    { name: 'Hoodies', image: 'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-02.jpg' },
    { name: 'Accessories', image: 'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-03.jpg' },
  ]

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.name} className="group relative overflow-hidden rounded-lg shadow hover:shadow-lg transition">
            <img src={cat.image} alt={cat.name} className="h-64 w-full object-cover group-hover:scale-105 transition" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <p className="text-white text-xl font-semibold">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
