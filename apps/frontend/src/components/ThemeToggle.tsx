import { useTheme } from "@/contexts/ThemeContext";
import { Menu, Transition } from "@headlessui/react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const getActiveIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="h-5 w-5" />;
      case "dark":
        return <MoonIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center justify-center rounded-lg p-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800">
          {getActiveIcon()}
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
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("light")}
                  className={`
                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}
                    ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                    group flex w-full items-center rounded-md px-2 py-2 text-sm
                  `}
                >
                  <SunIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Light
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("dark")}
                  className={`
                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}
                    ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                    group flex w-full items-center rounded-md px-2 py-2 text-sm
                  `}
                >
                  <MoonIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Dark
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("system")}
                  className={`
                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}
                    ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-text-light dark:text-text-dark'}
                    group flex w-full items-center rounded-md px-2 py-2 text-sm
                  `}
                >
                  <ComputerDesktopIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  System
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
