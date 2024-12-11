"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  BugAntIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { Balance, Address } from "~~/components/scaffold-eth";

import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { usePrivy } from '@privy-io/react-auth';

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external: boolean;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    external: false,
  },

  {
    label: "Free Mint",
    href: "/myNFTs",
    icon: <PhotoIcon className="h-4 w-4" />,
    external: false,
  },

  {
    label: "Collection on Opensea",
    href: "https://opensea.io/collection/ethereum-north-star-1",
    icon: <LinkIcon className="h-4 w-4" />,
    external: true,
  },
  // {
  //   label: "Transfers",
  //   href: "/transfers",
  //   icon: <ArrowPathIcon className="h-4 w-4" />,
  // },
  // {
  //   label: "IPFS Upload",
  //   href: "/ipfsUpload",
  //   icon: <ArrowUpTrayIcon className="h-4 w-4" />,
  // },
  // {
  //   label: "IPFS Download",
  //   href: "/ipfsDownload",
  //   icon: <ArrowDownTrayIcon className="h-4 w-4" />,
  // },
  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon, external }) => {
        const isActive = pathname === href && !external;

        return (
          <li key={href}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col"
              >
                {icon}
                <span>{label}</span>
              </a>
            ) : (
              <Link
                href={href}
                passHref
                className={`${
                  isActive ? "bg-secondary shadow-md" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};


/**
 * Site header
 */
export const Header = () => {
  const {login, logout, user, ready, authenticated,} = usePrivy();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky xl:static top-0 navbar bg-primary min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto xl:w-1/2">
        <div className="xl:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden xl:flex items-center gap-1 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            {/* <span className="font-bold leading-tight">Ethereum North Star</span> */}
            {/* <span className="text-xs">Ethereum North Star</span> */}
          </div>
        </Link>
        <ul className="hidden xl:flex xl:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      {/* <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div> */}

<div className="navbar-end">
        {authenticated ? (
          <div className="flex items-center space-x-4">
            <button
              className=""
              onClick={() => setIsModalOpen(true)}
            >
              <Balance address={user?.wallet?.address as `0x${string}`} usdMode={false}/>
            </button>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                  <h2 className="text-lg font-bold mb-4">Account Details</h2>
                  <div className="mb-4">
                    <Address
                      address={user?.wallet?.address as `0x${string}`}
                      format="long"
                      disableAddressLink
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="btn btn-outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => {
                        logout();
                        setIsModalOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>  
              </div>
            )}
          </div>
        ) : (
          <button className="" onClick={() => login()}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};
