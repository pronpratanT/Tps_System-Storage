import { useContext, createContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronLast,
  ChevronFirst,
  LogOut,
  User,
  Ruler,
  PackageSearch,
  HeartHandshake,
  PackagePlus,
  PackageMinus,
  Receipt,
  Settings,
  HelpCircle,
} from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { signOut } from "next-auth/react";
import Link from "next/link";

// Create a context for the sidebar
const SidebarContext = createContext();

const sidebarItems = [
  {
    header: "Employee Management",
    items: [
      { icon: <User size={20} />, text: "Employee ID", href: "/employee" },
      { icon: <Ruler size={20} />, text: "Unit ID", href: "/unit" },
      {
        icon: <PackageSearch size={20} />,
        text: "Product ID",
        href: "/product",
      },
      {
        icon: <HeartHandshake size={20} />,
        text: "Vendor ID",
        href: "/vendor",
      },
    ],
  },
  {
    header: "Product Management",
    items: [
      {
        icon: <PackagePlus size={20} />,
        text: "Import Products",
        href: "/import",
      },
      {
        icon: <PackageMinus size={20} />,
        text: "Export Products",
        href: "/export",
      },
    ],
  },
  {
    header: "Analytics",
    items: [{ icon: <Receipt size={20} />, text: "Reports", href: "/report" }],
  },
  {
    header: "Settings",
    items: [
      { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
      { icon: <HelpCircle size={20} />, text: "Help", href: "/help" },
    ],
  },
  {
    items: [
      {
        icon: <LogOut size={20} />,
        text: "Sign out",
        onClick: () => signOut(),
      },
    ],
  },
];

function SidebarItem({ icon, text, href, onClick }) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  const active = pathname === href;

  const itemContent = (
    <>
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={`flex items-center w-full overflow-hidden transition-all duration-300 ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {!expanded && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </>
  );

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
      onClick={onClick}
    >
      {href ? (
        <Link href={href} className="flex items-center w-full">
          {itemContent}
        </Link>
      ) : (
        <div className="flex items-center w-full">{itemContent}</div>
      )}
    </li>
  );
}

function SidebarHeader({ text, expanded }) {
  return expanded ? (
    <div className="my-3 text-gray-600 font-bold text-xs uppercase px-3">
      {text}
    </div>
  ) : null;
}

export default function Sidebar({ session, children }) {
  const [expanded, setExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex">
      <aside className="h-screen sticky top-0">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all duration-300 ${
                expanded ? "w-32" : "w-0"
              }`}
              alt=""
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 mt-4">
              {sidebarItems.map(({ header, items }, index) => (
                <div key={index}>
                  {header && (
                    <SidebarHeader text={header} expanded={expanded} />
                  )}
                  {items.map((item, idx) => (
                    <SidebarItem key={idx} {...item} />
                  ))}
                  {header && <hr className="my-3" />}
                </div>
              ))}
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3 relative">
            <Avatar sx={{ bgcolor: indigo[800] }} variant="rounded">
              {userInitial}
            </Avatar>
            <div
              className={`flex flex-col justify-center overflow-hidden transition-all duration-300 ${
                expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{session?.user?.name}</h4>
                <span className="text-xs text-gray-600">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
