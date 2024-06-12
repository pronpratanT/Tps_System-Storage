import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function ExportEdit({ isVisible, onClose, exportPd, refreshExports }) {
  const [newDateExport, setNewDateExport] = useState("");
  const [newDocumentId, setNewDocumentId] = useState("");
  const [newExportVen, setNewExportVen] = useState("");
  const [newExportEm, setNewExportEm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (exportPd) {
      setNewDateExport(exportPd.dateExport);
      setNewDocumentId(exportPd.documentId);
      setNewExportVen(exportPd.exportVen);
      setNewExportEm(exportPd.exportEm);
    }
  }, [exportPd]);

  const checkDuplicateDocumentId = async (newDocumentId, currentDocumentId) => {
    try {
      const res = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Export");
      const exports = await res.json();
      return exports.some(
        (exportPd) =>
          exportPd.documentId === newDocumentId &&
          exportPd._id !== currentDocumentId
      );
    } catch (error) {
      console.error("Error checking duplicate Document ID:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDateExport || !newDocumentId || !newExportVen) {
      setError("Please complete Export Product details!");
      return;
    }

    const isDuplicate = await checkDuplicateDocumentId(
      newDocumentId,
      exportPd?._id || ""
    );
    if (isDuplicate) {
      setError("Document ID already exists!");
      return;
    }

    try {
      const res = await fetch(
        `https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Export/${exportPd?._id || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newDateExport,
            newDocumentId,
            newExportVen,
            newExportEm,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update Export Product");
      }

      setError("");
      setSuccess("Export Product has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshExports();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update Export Product");
    }
  };

  //TODO < Function to fetch user to table >
  const getUsers = async () => {
    try {
      const res_get = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/User", {
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

  //TODO < Function to fetch vendors to table >
  const getVendors = async () => {
    try {
      const res_get = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/addVendor", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const newVendors = await res_get.json();

      // Check for duplicates
      const uniqueVendors = newVendors.filter(
        (vendor, index, self) =>
          index === self.findIndex((t) => t.vendorId === vendor.vendorId)
      );

      // Sort vendors by vendorId in alphabetical order
      const sortedVendors = uniqueVendors.sort((a, b) =>
        a.vendorId.localeCompare(b.vendorId)
      );

      setVendors(sortedVendors);
      console.log(sortedVendors);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  //? Reload Vendors table
  useEffect(() => {
    getVendors();
  }, []);

  return (
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
                    Update Export Product Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the details of the Export Product below.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="dateImport"
                      >
                        Date
                      </label>
                      <input
                        onChange={(e) => setNewDateExport(e.target.value)}
                        value={newDateExport}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="dateImport"
                        type="text"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="documentId"
                      >
                        Document ID
                      </label>
                      <input
                        onChange={(e) => setNewDocumentId(e.target.value)}
                        value={newDocumentId}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="documentId"
                        type="text"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="unit"
                      >
                        Vendor
                      </label>
                      <select
                        id="unit"
                        value={newExportVen}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedText = e.target.selectedOptions[0].text;
                          setNewExportVen(
                            selectedValue === "" ? "" : selectedText
                          );
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map((vendor) => (
                          <option
                            key={vendor.vendorId}
                            value={vendor.vendorName}
                          >
                            {vendor.vendorName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="exportEm"
                      >
                        Employee
                      </label>
                      <select
                        id="exportEm"
                        value={newExportEm}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedText = e.target.selectedOptions[0].text;
                          setNewExportEm(
                            selectedValue === "" ? "" : selectedText
                          );
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select Employee</option>
                        {users.map((user) => (
                          <option key={user.userid} value={user.name}>
                            {user.name}
                          </option>
                        ))}
                      </select>
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
                      Update Export Product
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </form>
      </Dialog>
    </Transition>
  );
}

export default ExportEdit;
