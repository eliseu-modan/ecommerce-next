"use client";

import { Fragment, useContext, useState } from "react";
import Link from "next/link";
import Checkout from "../../Cart/CheckoutForms/index";
import LoginModal from "../../Auth/LoginModal";
import CreateAccountModal from "@/components/Auth/CreateAccountModal";
import { AuthContext } from "@/contexts/AuthProvider";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt: "Models sitting back to back.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [{ name: "Tops", href: "#" }, { name: "Dresses", href: "#" }],
        },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "#" },
    { name: "Stores", href: "#" },
  ],
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const auth = useContext(AuthContext);

  const userMenu = [
    { name: "Meu perfil", href: "/perfil" },
    { name: "Compras", href: "/compras" },
    { name: "Histórico", href: "/historico" },
    { name: "Perguntas", href: "/perguntas" },
    { name: "Opiniões", href: "/opinioes" },
    { name: "Listas de presentes", href: "/listas" },
    { name: "Empréstimos", href: "/emprestimos" },
    { name: "Assinaturas", href: "/assinaturas" },
    { name: "Vender", href: "/vender" },
  ];

  const adminMenu = [
    { name: "Cadastrar produto", href: "/admin/produtos/novo" },
    { name: "Gerenciar produtos", href: "/admin/produtos" },
    { name: "Minhas vendas", href: "/admin/vendas" },
    { name: "Gerenciar usuários", href: "/admin/usuarios" },
    { name: "Relatórios", href: "/admin/relatorios" },
  ];

  const renderUserPopover = () => {
    const menuItems =
      auth?.user?.role === "ADMIN"
        ? [...adminMenu, ...userMenu]
        : userMenu;

    return (
      <Popover className="relative">
        <PopoverButton className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-800">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
            {auth?.user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
          <span>{auth?.user?.name || "Usuário"}</span>
        </PopoverButton>

        <PopoverPanel className="absolute right-0 z-20 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={auth?.logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    );
  };

return (
  <div className="bg-white">
    <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 z-40 flex">
        <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
          <div className="flex px-4 pb-2 pt-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-m-2 p-2 text-gray-400"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          <TabGroup className="mt-2">
            <TabList className="-mb-px flex space-x-8 px-4 border-b border-gray-200">
              {navigation.categories.map((category) => (
                <Tab
                  key={category.name}
                  className="flex-1 border-transparent py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                >
                  {category.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels as={Fragment}>
              {navigation.categories.map((category) => (
                <TabPanel key={category.name} className="px-4 pb-8 pt-10">
                  <div className="grid grid-cols-2 gap-x-4">
                    {category.featured?.map((item) => (
                      <div key={item.name} className="group relative text-sm">
                        <img
                          alt={item.imageAlt}
                          src={item.imageSrc}
                          className="aspect-square w-full rounded-lg object-cover group-hover:opacity-75"
                        />
                        <a
                          href={item.href}
                          className="mt-6 block font-medium text-gray-900"
                        >
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="border-t border-gray-200 px-4 py-6 space-y-4">
            {auth?.token ? (
              renderUserPopover()
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Entre
                </button>
                <button
                  onClick={() => setShowCreateAccount(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Crie sua conta
                </button>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <header className="relative bg-white border-b border-gray-200">
      <p className="flex h-10 items-center justify-center bg-indigo-600 text-sm font-medium text-white">
        Get free delivery on orders over $100
      </p>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-gray-400"
          >
            <Bars3Icon className="size-6" />
          </button>

          <Link href="/" className="ml-4 flex lg:ml-0">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
              alt="Logo"
            />
          </Link>
          <PopoverGroup className="hidden lg:ml-8 lg:block">
            <div className="flex h-full space-x-8">
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="flex">
                  {({ open }) => (
                    <>
                      <PopoverButton
                        className={`relative flex items-center justify-center text-sm font-medium transition-colors ${
                          open ? "text-indigo-600" : "text-gray-700 hover:text-gray-800"
                        }`}
                      >
                        {category.name}
                      </PopoverButton>

                      <PopoverPanel className="absolute inset-x-0 top-full z-10 bg-white shadow-lg">
                        <div className="mx-auto max-w-7xl px-8 py-6">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {category.sections.map((section) => (
                              <div key={section.name}>
                                <p className="font-medium text-gray-900">{section.name}</p>
                                <ul className="mt-2 space-y-2">
                                  {section.items.map((item) => (
                                    <li key={item.name}>
                                      <a
                                        href={item.href}
                                        className="text-sm text-gray-600 hover:text-gray-800"
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
                      </PopoverPanel>
                    </>
                  )}
                </Popover>
              ))}
            </div>
          </PopoverGroup>

          <div className="ml-auto flex items-center lg:space-x-6">
            {auth?.token && auth.user ? (
              renderUserPopover()
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Entre
                </button>
                <button
                  onClick={() => setShowCreateAccount(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Crie sua conta
                </button>
              </>
            )}

            <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
              <MagnifyingGlassIcon className="size-6" />
            </a>

            <button
              onClick={() => setShowCheckout(true)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <ShoppingBagIcon className="size-6" />
            </button>
          </div>
        </div>
      </nav>
    </header>

    {showCheckout && (
      <div className="fixed inset-0 z-30 bg-white overflow-y-auto">
        <button
          onClick={() => setShowCheckout(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <Checkout />
      </div>
    )}

    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    {showCreateAccount && (
      <CreateAccountModal
        open={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
      />
    )}
  </div>
);

}
