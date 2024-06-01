import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Edit, Ruler, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

const users = [
    { name: 'Lindsay Walton', title: 'ST99' },
    { name: 'Courtney Henry', title: 'ST99' },
    { name: 'Tom Cook', title: 'ST99', email: 'tom.cook@example.com', role: 'Member' },
    { name: 'Whitney Francis', title: 'ST99' },
    { name: 'Leonard Krasner', title: 'ST99' },
    { name: 'Floyd Miles', title: 'ST99' },
    { name: 'Lindsay Walton', title: 'ST99' },
    { name: 'Courtney Henry', title: 'ST99' },
    { name: 'Tom Cook', title: 'ST99' },
    { name: 'Whitney Francis', title: 'ST99' },
    { name: 'Leonard Krasner', title: 'ST99' },
    { name: 'Floyd Miles', title: 'ST99' },
];

const ITEMS_PER_PAGE = 5;

export default function UnitTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
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

  const openModal = () => {
      setIsOpen(true);
  };

  const closeModal = () => {
      setIsOpen(false);
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
      setUserList((prev) => [...prev, newUser]);
      setNewUser({ name: '', title: '', email: '', role: '' });
      closeModal();
  };

  return (
      <div className="flex-1 p-4">
          <div >
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                      <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">กำหนดรหัสหน่วยนับสินค้า</h2>
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-[#8146FF] overflow-hidden max-w-2xl w-full font-[sans-serif]">
                              <input type="text" placeholder="Search Something..." className="w-full cursor-pointer outline-none bg-transparent text-gray-600 text-sm" />
                              <Search size={16} className="text-gray-600 " />
                          </div>
                          <button onClick={openModal} className="flex items-center bg-[#8146FF] hover:bg-purple-700 text-white px-4 py-2 rounded-lg ml-4">
                              <Ruler size={20} className="mr-2" />
                              Add Unit
                          </button>
                      </div>
                      <table className="min-w-full bg-white">
                          <thead>
                              <tr>
                                  <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">Unit ID</th>
                                  <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">Unit Name</th>
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
                                      <td className="py-4 px-4 text-center">
                                          <div className="flex justify-center space-x-2">
                                              <Edit size={20} className="text-indigo-600 hover:text-[#8146FF] cursor-pointer" />
                                              <Trash2 size={20} className="text-red-400 hover:text-red-600 cursor-pointer" />
                                          </div>
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
          <Transition appear show={isOpen} as="div">
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                      Add New Unit
                                  </Dialog.Title>
                                  <div className="mt-2">
                                      <div className="mt-4">
                                          <input
                                              type="text"
                                              name="name"
                                              placeholder="Unit ID"
                                              value={newUser.name}
                                              onChange={handleInputChange}
                                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                          />
                                      </div>
                                      <div className="mt-4">
                                          <input
                                              type="text"
                                              name="title"
                                              placeholder="Unit Name"
                                              value={newUser.title}
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
                                          onClick={closeModal}
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
