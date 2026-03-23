export const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        { name: 'New Arrivals', href: '#' },
        { name: 'Basic Tees', href: '#' },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '#' },
            { name: 'Dresses', href: '#' },
          ],
        },
      ],
    },
  ],

  // 🔹 Adicione isso ↓
  pages: [
    { name: 'About', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Blog', href: '#' },
  ],
}
