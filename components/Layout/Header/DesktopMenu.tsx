"use client";

import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverGroup,
} from "@headlessui/react";
import { navigation } from "@/components/Layout/navigation";

const groups = [
  { title: "Loja", items: navigation.loja },
  { title: "Conta", items: navigation.conta },
  { title: "Suporte", items: navigation.suporte },
];

export default function DesktopMenu() {
  return (
    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
      <div className="flex h-full space-x-8">
        {groups.map((group) => (
          <Popover key={group.title} className="flex">
            <div className="relative flex">
              <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:text-indigo-600">
                {group.title}
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
                  <div className="py-10">
                    <div className="max-w-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                        {group.title}
                      </p>
                      <ul role="list" className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        ))}
      </div>
    </PopoverGroup>
  );
}
