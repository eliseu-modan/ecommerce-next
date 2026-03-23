// components/Header/DesktopMenu.tsx
"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from "@headlessui/react";
import { navigation } from "@/components/Layout/navigation";


export default function DesktopMenu() {
  
  return (
    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
      <div className="flex h-full space-x-8">
        {navigation.categories.map((category) => (
          <Popover key={category.name} className="flex">
            <div className="relative flex">
              <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:text-indigo-600">
                {category.name}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-[open]:bg-indigo-600"
                />
              </PopoverButton>
            </div>

            <PopoverPanel className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-[closed]:opacity-0">
              <div
                aria-hidden="true"
                className="absolute inset-0 top-1/2 bg-white shadow"
              />
              <div className="relative bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                    <div className="col-start-2 grid grid-cols-2 gap-x-8"></div>

                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p
                            id={`${section.name}-heading`}
                            className="font-medium text-gray-900"
                          >
                            {section.name}
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`${section.name}-heading`}
                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                          >
                            {section.items.map((item) => (
                              <li key={item.name} className="flex">
                                <a
                                  href={item.href}
                                  className="hover:text-gray-800"
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        ))}

        {/* pages */}
        {navigation.pages.map((page) => (
          <a
            key={page.name}
            href={page.href}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            {page.name}
          </a>
        ))}
      </div>
    </PopoverGroup>
  );
}
