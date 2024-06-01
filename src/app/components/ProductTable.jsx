import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { Fragment } from "react";

const users = [
    { name: 'Lindsay Walton', title: 'ST99', email: 'เมตร', role: 'Member', total: '9' },
    { name: 'Courtney Henry', title: 'ST99', email: 'แผ่น', role: 'Admin', total: '99' },
    { name: 'Tom Cook', title: 'ST99', email: 'เมตร', role: 'Member', total: '999' },
    { name: 'Whitney Francis', title: 'ST99', email: 'เมตร', role: 'Admin', total: '9,999' },
    { name: 'Leonard Krasner', title: 'ST99', email: 'เมตร', role: 'Owner', total: '99,999' },
    { name: 'Floyd Miles', title: 'ST99', email: 'เมตร', role: 'Member', total: '999' },
    { name: 'Lindsay Walton', title: 'ST99', email: 'เมตร', role: 'Member', total: '99' },
    { name: 'Courtney Henry', title: 'ST99', email: 'เมตร', role: 'Admin', total: '9,999' },
    { name: 'Tom Cook', title: 'ST99', email: 'เมตร', role: 'Member', total: '9' },
    { name: 'Whitney Francis', title: 'ST99', email: 'เมตร', role: 'Admin', total: '999' },
    { name: 'Leonard Krasner', title: 'ST99', email: 'เมตร', role: 'Owner', total: '9' },
    { name: 'Floyd Miles', title: 'ST99', email: 'เมตร', role: 'Member', total: '9' },
];

const units = [
    { unitid: 'PAN', unitname: 'แผ่น' },
    { unitid: 'PAN', unitname: 'เมตร' },
    { unitid: 'PAN', unitname: 'เซ็น' },
];

const ITEMS_PER_PAGE = 5;

export default function ProductTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [newUser, setNewUser] = useState({ name: '', title: '', email: '', role: '', total: '' });
    const [userList, setUserList] = useState(users);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = userList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);
    const totalUser = userList.length;

    const [selectedUser, setSelectedUser] = useState(null);
    const [localUser, setLocalUser] = useState(selectedUser || {});

    const [selectedUnit, setSelectedUnit] = useState(null);
    const [localUnit, setLocalUnit] = useState(selectedUnit || {});

    useEffect(() => {
        setLocalUser(selectedUser || {});
        setLocalUnit(selectedUnit || {});
    }, [selectedUser]);

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
        setLocalUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddUser = () => {
        setUserList((prev) => [...prev, newUser]);
        setNewUser({ name: '', title: '', email: '', role: '', total: '' });
        closeAddModal();
    };

    const handleEditUser = () => {
        updateUser(localUser);
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
                        <div className="text-lg font-semibold text-gray-600">Total Product</div>
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
                        <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">กำหนดรหัสสินค้า</h2>
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
                        {/* Table */}
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">Product ID</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Product Name</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Unit</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">StoreHouse</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-right">Total</th>
                                    <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-4 px-4 text-center">{user.title}</td>
                                        <td className="py-4 px-4 flex items-center">
                                            <Avatar sx={{ bgcolor: deepOrange[500], marginRight: '20px' }} variant="rounded-md">
                                                {user.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            {user.name}
                                        </td>
                                        <td className="py-4 px-4">{user.email}</td>
                                        <td className="py-4 px-4">{user.role}</td>
                                        <td className="py-4 px-4 text-right">{user.total}</td>
                                        <td className="py-4 px-4 text-center">
                                            <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => openDeleteModal(user)} className="text-red-500 hover:text-red-700 ml-2">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-4">
                            <button onClick={handlePrevPage} className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100" disabled={currentPage === 1}>
                                <ChevronLeft size={16} />
                            </button>
                            <span>{`Page ${currentPage} of ${totalPages}`}</span>
                            <button onClick={handleNextPage} className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100" disabled={currentPage === totalPages}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            <Transition appear show={isAddModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeAddModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-100"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Add New User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Fill in the details of the new user below.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                Product ID
                                            </label>
                                            <input
                                                name="title"
                                                value={newUser.title}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="title"
                                                type="text"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                Product Name
                                            </label>
                                            <input
                                                name="name"
                                                value={newUser.name}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="name"
                                                type="text"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                Unit
                                            </label>
                                            <select
                                                name="email"
                                                value={newUser.email}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="email"
                                            >
                                                <option value="เมตร">เมตร</option>
                                                <option value="กิโลกรัม">กิโลกรัม</option>
                                                <option value="ลิตร">ลิตร</option>
                                                <option value="หน่วย">หน่วย</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                                StoreHouse
                                            </label>
                                            <input
                                                name="role"
                                                value={newUser.role}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="role"
                                                type="text"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">
                                                Total
                                            </label>
                                            <input
                                                name="total"
                                                value={newUser.total}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="total"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-[#8146FF] px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                                            onClick={handleAddUser}
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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

            {/* Edit Modal */}
            <Transition appear show={isEditModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Edit User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Update the details of the user below.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                Product ID
                                            </label>
                                            <input
                                                name="title"
                                                value={localUser.title || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="title"
                                                type="text"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                Product Name
                                            </label>
                                            <input
                                                name="name"
                                                value={localUser.name || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="name"
                                                type="text"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                                StoreHouse
                                            </label>
                                            <input
                                                name="role"
                                                value={localUser.role || ''}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="role"
                                                type="text"
                                            />
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <div className="flex-1 mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total">
                                                    Total
                                                </label>
                                                <input
                                                    name="total"
                                                    value={localUser.total || ''}
                                                    onChange={handleInputChange}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
                                                    id="total"
                                                    type="text"
                                                />
                                            </div>
                                            <div className="flex-1 mb-4 relative">
                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
                                                    Unit
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="email"
                                                        value={localUser.units || ''}
                                                        onChange={handleInputChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                                                        id="email"
                                                    >
                                                        <option value="">Select Unit</option>
                                                        {units.map((unit) => (
                                                            <option key={unit.unitid} value={unit.unitid}>
                                                                {unit.unitname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-[#8146FF] px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                                            onClick={handleEditUser}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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

            {/* Delete Modal */}
            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Delete User
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Are you sure you want to delete this user? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={handleDeleteUser}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
