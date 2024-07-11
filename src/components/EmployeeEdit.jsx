import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select, { components } from "react-select";
import { createPortal } from "react-dom";
import { Check, Eye, EyeOff } from "lucide-react";

function EmployeeEdit({ isVisible, onClose, user, refreshUsers }) {
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setNewUserId(user.userid);
      setNewName(user.name);
      setNewEmail(user.email);
      setNewPassword(""); // ไม่ตั้งค่ารหัสผ่านเดิม
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
    if (isSubmitting) return;

    if (!newUserId || !newName || !newEmail || !newRole) {
      setError("Please complete User details!");
      return;
    }

    const isDuplicate = await checkDuplicateUserId(newUserId, user?._id || "");
    if (isDuplicate) {
      setError("User ID already exists!");
      return;
    }

    const isDuplicateEmail = await checkDuplicateEmail(
      newEmail,
      user?._id || ""
    );
    if (isDuplicateEmail) {
      setError("Email already exists!");
      return;
    }
    setIsSubmitting(true);

    try {
      const updatedUserData = {
        newUserId,
        newName,
        newEmail,
        newRole,
      };

      // เพิ่มรหัสผ่านใหม่เฉพาะเมื่อมีการกรอกข้อมูล
      if (newPassword) {
        updatedUserData.newPassword = newPassword;
      }

      const res = await fetch(`/api/User/${user?._id || ""}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!res.ok) {
        throw new Error("Failed to update Employee");
      }

      setError("");
      setSuccess("Employee has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshUsers();
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to update Employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  //? DropDown setting
  const roleOptions = useMemo(() => [
    { value: "USER", label: "USER" },
    { value: "MEMBER", label: "MEMBER" },
    { value: "ADMIN", label: "ADMIN" },
  ], []); // ใส่ empty array เป็น dependencies เพราะค่าไม่เปลี่ยนแปลง

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

  useEffect(() => {
    if (newRole) {
      const initialOption = roleOptions.find(
        (option) => option.value === newRole
      );
      if (initialOption) {
        setSelectedRole(initialOption);
      }
    }
  }, [newRole, roleOptions]);

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
                      as="h1"
                      className="text-2xl font-bold my-4 text-center"
                    >
                      Update Account
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update the details of the User below.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-4">
                      <input
                        onChange={(e) => setNewUserId(e.target.value)}
                        value={newUserId}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="User ID"
                      />
                      <input
                        onChange={(e) => setNewName(e.target.value)}
                        value={newName}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Full Name"
                      />
                      <input
                        onChange={(e) => setNewEmail(e.target.value)}
                        value={newEmail}
                        className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md"
                        type="text"
                        placeholder="Email"
                      />
                      <div className="relative">
                        <input
                          onChange={(e) => setNewPassword(e.target.value)}
                          value={newPassword}
                          className="border border-gray-200 py-3 px-6 bg-zinc-100/40 rounded-md w-full pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password (leave blank to keep current)"
                        />
                        {/* <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-6 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                          )}
                        </button> */}
                      </div>
                      <Select
                        options={roleOptions}
                        onChange={(option) => {
                          setSelectedRole(option);
                          setNewRole(option ? option.value : "");
                        }}
                        value={selectedRole}
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
                        {isSubmitting ? "Updating..." : "Update Account"}
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
