'use client'

import { useEffect, useState, type JSX } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import getCookie from '../utils/getCookie'
import { NavLink, useNavigate } from 'react-router-dom'

const navigation = [
    { name: 'Books', href: '/books' },
    { name: 'Add Customer', href: '/addcustomer' },
    { name: 'Issue Book', href: '/issuebook' },
    { name: 'Return Book', href: '/returnbook' },
    { name: 'Re Issue', href: '/reissue' },
]

type NavbarProps = {
    mobileNavbarOpen?: boolean
    setMobileNavbarOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navbar(props: NavbarProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const mobileNavbarOpen = props.mobileNavbarOpen ?? internalOpen
    const setMobileNavbarOpen = props.setMobileNavbarOpen ?? setInternalOpen
    const navigate = useNavigate()


    useEffect(() => {
        const result = getCookie("token")
        if (result == "") {
            navigate('/')
        }
    }, [])

    return (
        <header className=" bg-gray-800 z-40">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileNavbarOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <NavLink key={item.name} to={item.href} className="text-sm/6 font-bold text-white">
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="/" className="text-sm/6 font-bold text-white">
                        Log Out <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>

            <Dialog open={mobileNavbarOpen} onClose={setMobileNavbarOpen} className="lg:hidden z-50">
                <div className="fixed inset-0 z-40 bg-black/50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-indigo-600 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileNavbarOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-white"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-bold text-white hover:bg-white hover:text-indigo-600 transition"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                <a href="/" className="text-sm/6 font-bold text-white">
                                    Log Out <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}