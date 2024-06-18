import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const VendorEdit = ({ isVisible, onClose, vendor, refreshVendors }) => {
  const [newVendorId, setNewVendorId] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCountry, setNewVendorCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (vendor) {
      setNewVendorId(vendor.vendorId);
      setNewVendorName(vendor.vendorName);
      setNewVendorCountry(vendor.vendorCountry);
    }
  }, [vendor]);

  // TODO : Check update duplicate Vendor ID
  const checkDuplicateVendorId = async (newVendorId, currentVendorId) => {
    try {
      const res = await fetch("/api/addVendor");
      const vendors = await res.json();
  
      // Check if newVendorId already exists in the vendors list, excluding the current vendor
      return vendors.some(
        (vendor) =>
          vendor.vendorId === newVendorId && vendor._id !== currentVendorId
      );
    } catch (error) {
      console.error("Error checking duplicate vendor ID:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newVendorId || !newVendorName || !newVendorCountry) {
      setError("Please complete Vendor details!");
      return;
    }
  
    //? Check for duplicate Vendor Id
    const isDuplicate = await checkDuplicateVendorId(
      newVendorId,
      vendor?._id || ""
    );
    if (isDuplicate) {
      setError("Vendor ID already exists!");
      return;
    }
  
    try {
      //? Update Vendor
      const res = await fetch(
        `/api/addVendor/${vendor?._id || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ newVendorId, newVendorName, newVendorCountry }),
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to update Vendor");
      }
  
      setError("");
      setSuccess("Vendor has been updated successfully!");
  
      setTimeout(() => {
        onClose(); // Close the modal after successful update
        setSuccess("");
        refreshVendors(); // Refresh the vendors list
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update vendor");
    }
  };

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
                    Update Vendor Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the details of the Vendor below.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="vendorId"
                      >
                        Vendor ID
                      </label>
                      <input
                        onChange={(e) => setNewVendorId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="vendorId"
                        type="text"
                        value={newVendorId}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="vendorName"
                      >
                        Vendor Name
                      </label>
                      <input
                        onChange={(e) => setNewVendorName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="vendorName"
                        type="text"
                        value={newVendorName}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="vendorName"
                      >
                        Country
                      </label>
                      <input
                        onChange={(e) => setNewVendorCountry(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="vendorName"
                        type="text"
                        value={newVendorCountry}
                      />
                    </div>
                  </div>

                  {/* TODO: Error & Success */}
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
                      Update Vendor
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
};

export default VendorEdit;
