import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function EmployeeEdit({ isVisible, onClose, user, refreshUsers }) {
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setNewUserId(user.userid);
      setNewName(user.name);
      setNewEmail(user.email);
      setNewRole(user.role);
    }
  }, [user]);

  const checkDuplicateUserId = async (newUserId, currentUserId) => {
    try {
      const res = await fetch("/api/User");
      const users = await res.json();
      return users.some(
        (user) => user.userid === newUserId && user._id !== currentUserId
      );
    } catch (error) {
      console.error("Error checking duplicate User ID:", error);
      return false;
    }
  };

  const checkDuplicateEmail = async (newEmail, currentEmail) => {
    try {
      const res = await fetch("/api/User");
      const users = await res.json();
      return users.some(
        (user) => user.email === newEmail && user._id !== currentEmail
      );
    } catch (error) {
      console.error("Error checking duplicate Email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUserId || !newName || !newEmail || !newRole) {
      setError("Please complete Employee details!");
      return;
    }

    const isDuplicate = await checkDuplicateUserId(newUserId, user?._id || "");
    if (isDuplicate) {
      setError("Employee ID already exists!");
      return;
    }

    const isDuplicateEmail = await checkDuplicateEmail(newEmail, user?._id || "");
    if (isDuplicateEmail) {
      setError("Email already exists!");
      return;
    }

    try {
      const res = await fetch(
        `/api/User/${user?._id || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newUserId,
            newName,
            newEmail,
            newRole,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update Employee");
      }

      setError("");
      setSuccess("Employee has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshUsers();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update Employee");
    }
  };

  return (
    <div>
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
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
          <form onSubmit={handleSubmit}>
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
                      Update Employee Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update the details of the Employee below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="id"
                        >
                          Employee ID
                        </label>
                        <input
                          onChange={(e) => setNewUserId(e.target.value)}
                          value={newUserId}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="id"
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
                          onChange={(e) => setNewName(e.target.value)}
                          value={newName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          onChange={(e) => setNewEmail(e.target.value)}
                          value={newEmail}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="email"
                          type="text"
                        />
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="flex-1 mr-1">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="role"
                          >
                            Role
                          </label>
                          <input
                            onChange={(e) => setNewRole(e.target.value)}
                            value={newRole}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="role"
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
                        Update Employee
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>
    </div>
  );
}

export default EmployeeEdit;
