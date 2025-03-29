import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

interface SidebarItemProps {
  href?: string;
  onClick?: () => void;
  icon: JSX.Element;
  label?: string;
  isOpen: boolean;
  subItems?: { label: string; href: string }[];
  title?: string;
  activeMenu?: string | null;
  setActiveMenu?: (menu: string | null) => void;
  className?: string;
}

const SidebarItem = ({
  href,
  onClick,
  icon,
  label,
  isOpen,
  subItems,
  title,
  activeMenu,
  setActiveMenu,
  className,
}: SidebarItemProps) => {
  const hasSubmenu = subItems && subItems.length > 0;
  const isActive = activeMenu === title;

  return (
    <div className="relative">
      {href ? (
        <Link href={href} passHref>
          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${
              isOpen ? "justify-start" : "justify-center"
            } ${
              className
                ? className
                : "hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
            }`}
          >
            {icon}
            {isOpen && <span className="ml-3">{label}</span>}
          </div>
        </Link>
      ) : (
        <div
          className={`flex items-center px-4 py-3 cursor-pointer ${
            isOpen ? "justify-start" : "justify-center"
          } text-gray-300 hover:bg-gray-700 hover:text-white transition-all`}
          onClick={() =>
            setActiveMenu && setActiveMenu(isActive ? null : title!)
          }
        >
          {icon}
          {isOpen && (
            <span className="ml-3 flex items-center justify-between w-full">
              {title}
              {hasSubmenu && (
                <FiChevronDown
                  className={`ml-auto transition-transform ${
                    isActive ? "rotate-180" : ""
                  }`}
                />
              )}
            </span>
          )}
        </div>
      )}

      {hasSubmenu && isActive && (
        <div className="ml-6 bg-gray-800 rounded-md">
          {subItems.map((sub) => (
            <Link key={sub.href} href={sub.href} passHref>
              <div className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-all">
                {sub.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
