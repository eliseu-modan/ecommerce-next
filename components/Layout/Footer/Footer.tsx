import { navigation } from '../navigation'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(navigation).map(([section, links]) => (
          <div key={section}>
            <h3 className="font-semibold text-white mb-3 capitalize">{section}</h3>
            <ul className="space-y-2">
              {links.map((link: any) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-gray-500">
        © 2025 Ecommerce. All rights reserved.
      </div>
    </footer>
  )
}
