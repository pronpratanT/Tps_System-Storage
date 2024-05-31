import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

const users = [
    { name: 'Lindsay Walton', title: 'ST99', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Courtney Henry', title: 'ST99', email: 'courtney.henry@example.com', role: 'Admin' },
    { name: 'Tom Cook', title: 'ST99', email: 'tom.cook@example.com', role: 'Member' },
    { name: 'Whitney Francis', title: 'ST99', email: 'whitney.francis@example.com', role: 'Admin' },
    { name: 'Leonard Krasner', title: 'ST99', email: 'leonard.krasner@example.com', role: 'Owner' },
    { name: 'Floyd Miles', title: 'ST99', email: 'floyd.miles@example.com', role: 'Member' },
    { name: 'Lindsay Walton', title: 'ST99', email: 'lindsay.walton@example.com', role: 'Member' },
    { name: 'Courtney Henry', title: 'ST99', email: 'courtney.henry@example.com', role: 'Admin' },
    { name: 'Tom Cook', title: 'ST99', email: 'tom.cook@example.com', role: 'Member' },
    { name: 'Whitney Francis', title: 'ST99', email: 'whitney.francis@example.com', role: 'Admin' },
    { name: 'Leonard Krasner', title: 'ST99', email: 'leonard.krasner@example.com', role: 'Owner' },
    { name: 'Floyd Miles', title: 'ST99', email: 'floyd.miles@example.com', role: 'Member' },
];

const ITEMS_PER_PAGE = 5;

export default function UserTable() {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the range of users to display
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const totalUser = users.length;

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="flex-1 p-4">
            <div className="p-4">
                {/* Statistics Section */}
                <div className="flex justify-between items-center mb-6 space-x-5">
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <div className="text-lg font-semibold text-gray-600">Total User</div>
                        <div className="text-2xl font-bold text-[#8146FF]">{totalUser}</div>
                    </div>
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <div className="text-lg font-bold">Avg. Open Rate</div>
                        <div className="text-2xl font-bold text-green-500">58.16% <span className="text-sm text-green-500">▲ 5.4%</span></div>
                        <a href="#" className="text-indigo-600 hover:underline">View all</a>
                    </div>
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <div className="text-lg font-bold">Avg. Click Rate</div>
                        <div className="text-2xl font-bold text-red-500">24.57% <span className="text-sm text-red-500">▼ 3.2%</span></div>
                        <a href="#" className="text-indigo-600 hover:underline">View all</a>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">กำหนดรหัสพนักงาน</h2>
                        {/* Search and Add User Section */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-[#8146FF] overflow-hidden max-w-2xl w-full font-[sans-serif]">
                                <input type="text" placeholder="Search Something..." className="w-full cursor-pointer outline-none bg-transparent text-gray-600 text-sm" />
                                <Search size={16} className="text-gray-600 " />
                            </div>
                            <button className="flex items-center bg-[#8146FF] text-white px-4 py-2 rounded-lg ml-4">
                                <UserPlus size={20} className="mr-2" />
                                Add user
                            </button>
                        </div>

                        {/* User Table */}
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-3 px-1 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">User ID</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Name</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Email</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Role</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-4 px-1 text-center">{user.title}</td>
                                        <td className="py-4 px-4 flex items-center">
                                            <Avatar sx={{ bgcolor: deepOrange[500], marginRight: '20px' }} variant="rounded-md">
                                                {user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            {user.name}
                                        </td>
                                        <td className="py-4 px-4">{user.email}</td>
                                        <td className="py-4 px-4">{user.role}</td>
                                        <td className="py-4 px-4 flex space-x-2 justify-center">
                                            <Edit size={20} className="text-indigo-600 hover:text-[#8146FF] cursor-pointer" />
                                            <Trash2 size={20} className="text-red-400 hover:text-red-600 cursor-pointer" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center pt-3 border-t">
                            <div className="flex">
                                <span>{currentPage} of {totalPages}</span>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
