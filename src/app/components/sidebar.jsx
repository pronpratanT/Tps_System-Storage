import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react"
import { User, Ruler, PackageSearch, HeartHandshake, PackagePlus, PackageMinus, Receipt, Settings, HelpCircle } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange, green } from '@mui/material/colors';

const SidebarContext = createContext();

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

export default function Sidebar({session}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="https://img.logoipsum.com/243.svg"
              className={`overflow-hidden transition-all ${
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
            <ul className="flex-1 px-3">
              {/* <div className="px-3 py-2 font-semibold text-gray-600">Main Menu</div> */}
              <SidebarItem icon={<User size={20} />} text="Employee ID" alert />
              <SidebarItem icon={<Ruler size={20} />} text="Unit ID" active />
              <SidebarItem icon={<PackageSearch size={20} />} text="Product ID" />
              <SidebarItem icon={<HeartHandshake size={20} />} text="Vendor ID" />
              <hr className="my-3" />
              {/* <div className="px-3 py-2 font-semibold text-gray-600">Inventory</div> */}
              <SidebarItem icon={<PackagePlus size={20} />} text="Receive Products" alert />
              <SidebarItem icon={<PackageMinus size={20} />} text="Issue Products" />
              <hr className="my-3" />
              {/* <div className="px-3 py-2 font-semibold text-gray-600">Inventory Reports</div> */}
              <SidebarItem icon={<Receipt size={20} />} text="Reports" />
              <hr className="my-3" />
              <SidebarItem icon={<Settings size={20} />} text="Settings" />
              <SidebarItem icon={<HelpCircle size={20} />} text="Help" />
            </ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            {/* <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt=""
              className="w-10 h-10 rounded-md"
            /> */}
            <Avatar sx={{ bgcolor: deepOrange[500] }} variant="rounded">
              N
            </Avatar>
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{session?.user?.name}</h4>
                <span className="text-xs text-gray-600">{session?.user?.email}</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4">
        {/* Main content goes here */}
      </main>
    </div>
  );
}
