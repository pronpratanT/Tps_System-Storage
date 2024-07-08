import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select, { components } from "react-select";
import { createPortal } from "react-dom";
import { Check, Eye, EyeOff } from "lucide-react";


function EmployeeDel({ isVisible, onClose, user, refreshUsers, refreshCount }) {
  const [delId, setDelId] = useState("");
  const [delName, setDelName] = useState("");
  const [delEmail, setDelEmail] = useState("");
  const [delPassword, setDelPassword] = useState("");
  const [delRole, setDelRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roleOption = { value: delRole, label: delRole };
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setDelId(user.userid);
      setDelName(user.name);
      setDelEmail(user.email);
      setDelPassword(user.password);
      setDelRole(user.role);
    }
  }, [user]);

  const removeUser = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const resDelete = await fetch(`/api/User?id=${user._id}`, {
        method: "DELETE",
      });
      if (!resDelete.ok) {
        throw new Error("Failed to delete User");
      }
      setError("");
      setSuccess("Employee has been deleted successfully!");
      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshUsers();
        refreshCount();
      }, 1500);
    } catch (error) {
      setError("Failed to delete employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterForm="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            Leave="ease-in duration-200"
            LeaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <form onSubmit={removeUser}>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterForm="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  Leave="ease-in duration-200"
                  LeaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h1"
                      className="text-2xl font-bold my-4 text-center"
                    >
                      Delete Account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Delete the details of the User below.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                      <input
                        onChange={(e) => setDelId(e.target.value)}
                        value={delId}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="User ID"
                        readOnly
                      />
                      <input
                        onChange={(e) => setDelName(e.target.value)}
                        value={delName}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Full Name"
                        readOnly
                      />
                      <input
                        onChange={(e) => setDelEmail(e.target.value)}
                        value={delEmail}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Email"
                        readOnly
                      />
                      <div className="relative">
                        <input
                          onChange={(e) => setDelPassword(e.target.value)}
                          value={delPassword}
                          className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md w-full pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          readOnly
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-6 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <Select
                        value={roleOption}
                        placeholder="Select Role"
                        isClearable
                        className="basic-single shadow focus:shadow-outline focus:outline-none rounded"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        isDisabled={true}
                        menuPosition="fixed"
                        maxMenuHeight={200}
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
                            padding: "0 1.5rem",
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
                        {isSubmitting ? "Deleting..." : "Delete Account"}
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

export default EmployeeDel;
