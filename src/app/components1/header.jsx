import { useState, useRef, useEffect, Fragment } from "react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Menu, Transition } from "@headlessui/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const UserProfile = ({ session }) => {
    const userInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="border-t flex p-3 relative justify-end bg-white h-16 px-4 shadow-sm top-0">
      <div className="flex items-center space-x-3">
        <div className="leading-4 text-right">
          <h4 className="font-semibold">{session?.user?.name}</h4>
          <span className="text-xs text-gray-600">{session?.user?.email}</span>
        </div>
        <div className="border-l h-full"></div>
        <Menu as="div" className="relative ml-2">
          <div>
            <Menu.Button className="flex items-center focus:outline-none pr-5">
              <Avatar
                sx={{ bgcolor: indigo[800], cursor: "pointer" }}
                variant="rounded-md"
              >
                {userInitial}
              </Avatar>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <div className="my-1 mx-3 border-t border-gray-300"></div> {/* Divider */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "flex items-center w-full px-4 py-2 text-sm text-red-600"
                    )}
                  >
                    <LogOut className="mr-2" size={20} /> Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default UserProfile;
