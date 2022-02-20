import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Logo from "../public/img/longlogo.png";

import { GoThreeBars } from "react-icons/go"

const links = [
    {
        name: "Dashboard",
        link: "/coming-soon",
        id: "dashboard",
        priority: false
    },
    {
        name: "Full Map",
        link: "/coming-soon",
        id: "full-map",
        priority: false
    },
    {
        name: "Rebate Points",
        link: "/coming-soon",
        id: "rebate-points",
        priority: false
    },
    {
        name: "Settings",
        link: "/coming-soon",
        id: "settings",
        priority: false
    },
    {
        name: "Sign out",
        link: "/signout",
        id: "signout",
        priority: true
    },
];

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <header className={`bg-gray-100 py-2 lg:py-4 sticky`}>
            <div className="container px-4 mx-auto lg:flex lg:items-center">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <a className="font-bold text-xl text-teal">
                            <Image src={Logo} alt="logo" width={120} height={30} />
                        </a>
                    </Link>

                    <button
                        className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 lg:hidden"
                        aria-label="Menu"
                        data-test-id="navbar-menu"
                        onClick={
                            () => {
                                setShowDropdown(!showDropdown);
                            }}
                        >
                        <GoThreeBars />
                    </button>
                </div>

                <div className={`${showDropdown ? "flex" : "hidden"} lg:flex flex-col lg:flex-row lg:ml-auto mt-3 lg:mt-0`} data-test-id="navbar">
                    {
                        links.map(({ name, link, priority, id }) =>
                            <Link key={name} href={link}>
                                <a 
                                    className={`${priority ? "text-blue-600 hover:bg-blue-600 hover:text-white text-center border border-solid border-blue-600 mt-1 lg:mt-0 lg:ml-1" : "text-gray-600 hover:bg-gray-200 hover:text-gray-700 "} p-2 lg:px-4 lg:mx-2 rounded duration-300 transition-colors `}
                                    data-test-id={`navbar-${id}`}
                                >
                                    {name}
                                </a>
                            </Link>
                        )
                    }
                </div>
            </div>
        </header>
    )
}