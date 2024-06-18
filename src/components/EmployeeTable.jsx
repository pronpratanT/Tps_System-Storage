"use client";

import { useState, useEffect, Fragment } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeDel from "./EmployeeDel";
import CountStat from "./CountStat";

export default function UserTable() {
  //? State
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  //TODO < Function to fetch user to table >
  const getUsers = async () => {
    try {
      const res_get = await fetch("/api/User", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch User");
      }

      const newUsers = await res_get.json();

      // Check for duplicates
      const uniqueUsers = newUsers.filter(
        (user, index, self) =>
          index === self.findIndex((t) => t.email === user.email)
      );

      // Sort Users by vendorId in alphabetical order
      const sortedUsers = uniqueUsers.sort((a, b) =>
        a.email.localeCompare(b.email)
      );

      setUsers(sortedUsers);
      console.log("SortedUsers: ", sortedUsers);
    } catch (error) {
      console.log("Error loading Users: ", error);
    }
  };

  //? Reload users table
  useEffect(() => {
    getUsers();
  }, []);

  //TODO <Function Search Product Id
  const filterUsersById = (users, searchID) => {
    if (!searchID) return users; // Return all products if searchID is empty

    // Filter unique products based on searchID
    const filteredUsers = users.filter(
      (user, index, self) =>
        user.userid.toLowerCase().includes(searchID.toLowerCase()) &&
        index === self.findIndex((t) => t.userid === user.userid)
    );

    return filteredUsers;
  };

  //TODO < Function Get User by Id send to UserEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getUsers();
  };

  const getUserById = async (id) => {
    try {
      const res_byid = await fetch(`/api/User/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch User");
      }

      const data = await res_byid.json();
      return data.user; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch User:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const user = await getUserById(id);
      setSelectedUser(user); // Set the selected product
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to get user:", error);
    }
  };

  //TODO < Function Add User >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getUsers();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !userName || !email || !role) {
      setError("Please complete User details!");
      return;
    }

    try {
      const resCheckUser = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const { user } = await resCheckUser.json();
      if (user) {
        setError("User ID already exists!");
        return;
      }

      //* Add User to DB
      const res_add = await fetch("/api/User", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userName,
          email,
          role,
        }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add User");
      }

      setError("");
      setSuccess("User has been added successfully!");
      getUsers();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setUserId("");
        setUserName("");
        setEmail("");
        setRole("");
        setRefresh(!refresh);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add user");
    }
  };

  //TODO < Function Delete User >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`/api/User/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch User");
      }

      const data = await res_byid.json();
      return data.user; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch User:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const user = await getDelById(id);
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get user:", error);
    }
  };

  const handleRefresh = () => {
    setShouldRefresh(!shouldRefresh);
  };

  return (
    <div className="flex-1 p-4">
      <div>
        <CountStat refresh={refresh} shouldRefresh={shouldRefresh} />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
            กำหนดรหัสพนักงาน
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden max-w-2xl w-full font-[sans-serif]">
              <input
                type="text"
                placeholder="Search Employee ID..."
                className="w-full cursor-pointer outline-none bg-transparent text-gray-600 text-sm"
                value={searchID}
                onChange={(event) => setSearchID(event.target.value)}
              />
              <Search size={16} className="text-gray-600 " />
            </div>
            {/* <button
              onClick={openAddModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg ml-4"
            >
              <UserPlus size={20} className="mr-2" />
              Add Role
            </button> */}
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-20 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-2/12">
                  Employee ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  Employee Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-4/12">
                  Email
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  Role
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterUsersById(users, searchID).map((user) => (
                <tr key={user.email} className="border-t">
                  <td className="py-4 px-4 pl-20">{user.userid}</td>
                  <td className="py-4 px-4 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: indigo[800], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {user.name}
                  </td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">{user.role}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(user._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={23} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* // TODO : Add Unit Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeAddModal}>
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
          <form onSubmit={handleAddSubmit}>
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
                      Add Employee Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Employee below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Employee ID
                        </label>
                        <input
                          onChange={(e) => setUserId(e.target.value)}
                          value={userId}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Employee Name
                        </label>
                        <input
                          onChange={(e) => setUserName(e.target.value)}
                          value={userName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Email
                        </label>
                        <input
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="flex-1 mr-1">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="amount"
                          >
                            Role
                          </label>
                          <input
                            onChange={(e) => setRole(e.target.value)}
                            value={role}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="amount"
                            type="text"
                          />
                        </div>
                        {/* <div className="flex-1 ml-1">
                          <div className="mb-2">
                            <label
                              htmlFor="unit"
                              className="block text-gray-700 text-sm font-bold"
                            >
                              Unit
                            </label>
                          </div>
                          <select
                            id="unit"
                            onChange={(e) =>
                              setProductUnit(e.target.selectedOptions[0].text)
                            }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="">Select a unit</option>
                            {units.map((unit) => (
                              <option key={unit.unitId} value={unit.unitName}>
                                {unit.unitName}
                              </option>
                            ))}
                          </select>
                        </div> */}
                      </div>
                    </div>

                    {/* // TODO : Error & Success */}
                    {error && (
                      <div className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200">
                        {success}
                      </div>
                    )}

                    <div className="mt-4 py-2">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 w-full"
                      >
                        Add Employee
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>

      {/* // TODO : Edit User Modal */}
      <EmployeeEdit
        isVisible={isEditModalOpen}
        onClose={handleEditModalClose}
        user={selectedUser}
        refreshUsers={getUsers}
      />

      {/* // TODO : Delete Product Modal */}
      <EmployeeDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        refreshUsers={getUsers}
        refreshCount={handleRefresh}
      />
    </div>
  );
}
