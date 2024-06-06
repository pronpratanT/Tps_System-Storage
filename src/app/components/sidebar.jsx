import { useContext, createContext, useState, useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';
import { MoreVertical, ChevronLast, ChevronFirst, LogOut, User, Ruler, PackageSearch, HeartHandshake, PackagePlus, PackageMinus, Receipt, Settings, HelpCircle } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

// Create a context for the sidebar
const SidebarContext = createContext();

function SidebarItem({ icon, text, href }) {
  const { expanded } = useContext(SidebarContext);
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}
        `}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
          {text}
        </span>
        {!expanded && (
          <div className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}>
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

function SidebarHeader({ text, expanded }) {
  if (!expanded) {
    return null;
  }
  return (
    <div className="my-3 text-gray-600 font-bold text-xs uppercase px-3">
      {text}
    </div>
  );
}

export default function Sidebar({ session, children }) {
  const [expanded, setExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract the first letter of the user's name
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex">
      <aside className="h-screen sticky top-0">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm  ">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
              alt=""
            />
            <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 mt-4">
              <SidebarHeader text="Employee Management" expanded={expanded} />
              <SidebarItem 
                icon={<User size={20} />} 
                text="Employee ID" 
                href="/employee"
              />
              <SidebarItem 
                icon={<Ruler size={20} />} 
                text="Unit ID" 
                href="/unit"
              />
              <SidebarItem 
                icon={<PackageSearch size={20} />} 
                text="Product ID" 
                href="/product"
              />
              <SidebarItem 
                icon={<HeartHandshake size={20} />} 
                text="Vendor ID" 
                href="/vendor"
              />
              <hr className="my-3" />
              <SidebarHeader text="Product Management" expanded={expanded} />
              <SidebarItem 
                icon={<PackagePlus size={20} />} 
                text="Import Products" 
                href="/import-products"
              />
              <SidebarItem 
                icon={<PackageMinus size={20} />} 
                text="Export Products" 
                href="/export-products"
              />
              <hr className="my-3" />
              <SidebarHeader text="Analytics" expanded={expanded} />
              <SidebarItem 
                icon={<Receipt size={20} />} 
                text="Reports" 
                href="/reports"
              />
              <hr className="my-3" />
              <SidebarHeader text="Settings" expanded={expanded} />
              <SidebarItem 
                icon={<Settings size={20} />} 
                text="Settings" 
                href="/settings"
              />
              <SidebarItem 
                icon={<HelpCircle size={20} />} 
                text="Help" 
                href="/help"
              />
              <SidebarItem 
                icon={<LogOut size={20} />} 
                text="Sign out" 
                href="/help"
              />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3 relative">
            <Avatar sx={{ bgcolor: deepOrange[500] }} variant="rounded">
              {userInitial}
            </Avatar>
            <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className="leading-4">
                <h4 className="font-semibold">{session?.user?.name}</h4>
                <span className="text-xs text-gray-600">{session?.user?.email}</span>
              </div>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <MoreVertical size={20} />
              </button>
            </div>

            {dropdownOpen && (
              <div ref={dropdownRef} className="absolute bottom-12 right-4 w-48 bg-white border rounded shadow-md">
                <button className="w-full flex items-center text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={() => { signOut() }}>
                  <LogOut className="mr-2" size={20} /> Sign out
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
