import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Edit, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import users from "../data/user";

const ITEMS_PER_PAGE = 5;

export default function UserTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', title: '', email: '', role: '' });
    const [userList, setUserList] = useState(users);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = userList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);
    const totalUser = userList.length;

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = () => {
        setUserList((prev) => [...prev, newUser]);
        setNewUser({ name: '', title: '', email: '', role: '' });
        closeAddModal();
    };

    const handleEditUser = () => {
        setUserList((prev) => prev.map(user => user === selectedUser ? newUser : user));
        setNewUser({ name: '', title: '', email: '', role: '' });
        closeEditModal();
    };

    const handleDeleteUser = () => {
        setUserList((prev) => prev.filter(user => user !== selectedUser));
        closeDeleteModal();
    };

    return (
        <div className="flex-1 p-4">
            <div >
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
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-[#8146FF] overflow-hidden max-w-2xl w-full font-[sans-serif]">
                                <input type="text" placeholder="Search Something..." className="w-full cursor-pointer outline-none bg-transparent text-gray-600 text-sm" />
                                <Search size={16} className="text-gray-600 " />
                            </div>
                            <button onClick={openAddModal} className="flex items-center bg-[#8146FF] hover:bg-purple-700 text-white px-4 py-2 rounded-lg ml-4">
                                <UserPlus size={20} className="mr-2" />
                                Add User
                            </button>
                        </div>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">User ID</th>
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
                                            <Edit size={20} className="text-indigo-600 hover:text-[#8146FF] cursor-pointer" onClick={() => openEditModal(user)} />
                                            <Trash2 size={20} className="text-red-400 hover:text-red-600 cursor-pointer" onClick={() => openDeleteModal(user)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

            {/* Add User Modal */}
            <Transition appear show={isAddModalOpen} as="div">
                <Dialog as="div" className="relative z-10" onClose={closeAddModal}>
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as="div"
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Add New User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={newUser.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="User ID"
                                                value={newUser.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={newUser.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="role"
                                                placeholder="Role"
                                                value={newUser.role}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                                            onClick={handleAddUser}
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200"
                                            onClick={closeAddModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Edit User Modal */}
            <Transition appear show={isEditModalOpen} as="div">
                <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as="div"
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Edit User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={newUser.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="User ID"
                                                value={newUser.title}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={newUser.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                name="role"
                                                placeholder="Role"
                                                value={newUser.role}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                                            onClick={handleEditUser}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200"
                                            onClick={closeEditModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Delete Confirmation Modal */}
            <Transition appear show={isDeleteModalOpen} as="div">
                <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as="div"
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Delete User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this user? This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200"
                                            onClick={handleDeleteUser}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"
                                            onClick={closeDeleteModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
