"use client";

import { useState, useEffect, Fragment } from "react";
import { Check, Edit, Filter, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo, teal } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeDel from "./EmployeeDel";
import CountStat from "./CountStat";
import Select, { components } from "react-select";
import { createPortal } from "react-dom";

export default function UserTable() {
  //? State
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [searchType, setSearchType] = useState("userId");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  //! Table Fetch Data
  //? <Function Search Document Id / Date Export
  const filterData = (users, searchTerm, searchType) => {
    if (!searchTerm) return users;
    return users.filter((user) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      if (searchType === "userId") {
        return user.userid.toLowerCase().includes(lowercaseSearchTerm);
      } else if (searchType === "userName") {
        return user.name.toLowerCase().includes(lowercaseSearchTerm);
      }
      return false;
    });
  };
  //? Filter Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (isFilterDropdownOpen && !event.target.closest(".filter-dropdown")) {
        setIsFilterDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterDropdownOpen]);
  //? <Function Search Document Id / Date Export >
  //! Table Fetch Data >

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
    if (isSubmitting) return;

    if (!userId || !userName || !email || !role) {
      setError("Please complete User details!");
      return;
    }
    setIsSubmitting(true);

    try {
      const resCheckUser = await fetch("/api/checkUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const { user } = await resCheckUser.json();
      if (user) {
        setError("Email already exists!");
        return;
      }

      const resCheckUserId = await fetch("/api/checkUserId", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userid: userId }),
      });
      const { idUser } = await resCheckUserId.json();
      if (idUser) {
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
          userid: userId,
          name: userName,
          email,
          password,
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
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to add user");
    } finally {
      setIsSubmitting(false);
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

  //? DropDown setting
  const roleOptions = [
    { value: "USER", label: "USER" },
    { value: "MEMBER", label: "MEMBER" },
    { value: "ADMIN", label: "ADMIN" },
  ];

  const CustomOption = ({ children, ...props }) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {children}
          {props.isSelected && <Check size={16} className="text-indigo-600" />}
        </div>
      </components.Option>
    );
  };

  const renderDropdownInPortal = ({ props, isOpen }) => {
    if (isOpen) {
      return createPortal(
        <div {...props.menuProps}>{props.children}</div>,
        document.body
      );
    }
    return null;
  };
  //? DropDown setting >

  // ฟังก์ชันสำหรับกำหนดสีและสไตล์ตาม role
  const getRoleStyle = (role) => {
    switch (role) {
      case "USER":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "MEMBER":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "ADMIN":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
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
            <div className="flex items-center max-w-2xl w-full">
              <div className="flex items-center px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden w-full font-[sans-serif] relative">
                <Search size={16} className="text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${
                    searchType === "userId" ? "User ID" : "User Name"
                  }...`}
                  className="w-full outline-none bg-transparent text-gray-600 text-sm"
                  value={searchID}
                  onChange={(event) => setSearchID(event.target.value)}
                />
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full border-2 border-gray-200"
                >
                  <Filter size={16} className="text-gray-600" />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 filter-dropdown">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => {
                          setSearchType("userId");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        User ID
                        {searchType === "userId" && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSearchType("userName");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        User Name
                        {searchType === "userName" && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg ml-4"
            >
              <UserPlus size={20} className="mr-2" />
              Create Account
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-20 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-2/12">
                  User ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  User Name
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
              {filterData(users, searchID, searchType).map((user) => (
                <tr key={user.email} className="border-t">
                  <td className="py-4 px-4 pl-20">{user.userid}</td>
                  <td className="py-4 px-4 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: teal[400], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {user.name}
                  </td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      {" "}
                      <span
                        className={`px-4 py-2 text-sm font-medium rounded-md w-24 text-center ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
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
                      as="h1"
                      className="text-2xl font-bold my-4 text-center"
                    >
                      Create Account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the User below.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                      <input
                        onChange={(e) => setUserId(e.target.value)}
                        value={userId}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="User ID"
                      />
                      <input
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Full Name"
                      />
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Email"
                      />
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="password"
                        placeholder="Password"
                      />
                      <Select
                        options={roleOptions}
                        onChange={(option) =>
                          setRole(option ? option.value : "")
                        }
                        placeholder="Select Role"
                        isClearable
                        className="basic-single shadow focus:shadow-outline focus:outline-none rounded"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        components={{ Option: CustomOption }}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: "rgb(229, 231, 235)",
                            backgroundColor: "rgba(244, 244, 245, 0.4)",
                            borderRadius: "0.375rem",
                            minHeight: "50px",
                            height: "50px",
                            padding: "0",
                            paddingRight: "1rem",
                            alignItems: "center",
                            "&:hover": {
                              borderColor: "rgb(229, 231, 235)",
                            },
                          }),
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            padding: "0 1.5rem", // เพิ่ม padding ด้านข้าง
                            margin: "0",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }),
                          singleValue: (baseStyles) => ({
                            // เพิ่ม style สำหรับ singleValue
                            ...baseStyles,
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }),
                          input: (baseStyles) => ({
                            ...baseStyles,
                            margin: "0",
                            padding: "0",
                            height: "100%",
                            alignItems: "center",
                          }),
                          indicatorSeparator: () => ({
                            display: "none",
                          }),
                          dropdownIndicator: (baseStyles) => ({
                            ...baseStyles,
                            padding: "0 0.5rem",
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: "white",
                            borderRadius: "0.375rem",
                            boxShadow:
                              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                          }),
                          option: (baseStyles, { isFocused, isSelected }) => ({
                            ...baseStyles,
                            backgroundColor: isFocused
                              ? "rgba(243, 244, 246, 0.8)"
                              : isSelected
                              ? "rgba(243, 244, 246, 0.5)"
                              : "white",
                            color: "black",
                            "&:active": {
                              backgroundColor: "rgba(243, 244, 246, 1)",
                            },
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>

                    {error && (
                      <div className="mt-4 px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="mt-4 px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200">
                        {success}
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold cursor-pointer px-6 py-3 rounded-md w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating..." : "Create Account"}
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
