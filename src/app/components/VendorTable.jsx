"use client";

import { useState, useEffect, Fragment } from "react";
import { Edit, Search, Trash2, UserPlus } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import VendorEdit from "./VendorEdit";
import VendorDel from "./VendorDel";

function VendorTable() {

  //? State
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //TODO < Function to fetch vendors to table >
  const getVendors = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/addVendor", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Vendor");
      }
      const data = await res_get.json();
      setVendors(data);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  //? Reload Vendors table
  useEffect(() => {
    getVendors();
  }, []);

  //TODO < Function Get Vendor by Id send to VendorEdit >
  const [selectedVendor, setSelectedVendor] = useState(null); // Initialize with null

  const getVendorById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/addVendor/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const data = await res_byid.json();
      return data.vendor; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Vendor:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const vendor = await getVendorById(id);
      setSelectedVendor(vendor); // Set the selected vendor
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to get vendor:", error);
    }
  };

  //TODO < Function Add Vendor >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId || !vendorName) {
      setError("Please complete Vendor details!");
      return;
    }

    try {
      const resCheckVendor = await fetch("http://localhost:3000/api/checkVendor", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      });
      const { vendor } = await resCheckVendor.json();
      if (vendor) {
        setError("Vendor id already exists!");
        return;
      }

      //* Add Vendor to DB
      const res_add = await fetch("http://localhost:3000/api/addVendor", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ vendorId, vendorName }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add vendor");
      }

      setError("");
      setSuccess("Vendor has been added successfully!");
      getVendors();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setVendorId("");
        setVendorName("");
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add vendor");
    }
  };

  //TODO < Function Delete Vendor >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/addVendor/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const data = await res_byid.json();
      return data.vendor; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Vendor:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const vendor = await getDelById(id);
      setSelectedVendor(vendor); // Set the selected vendor
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get vendor:", error);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6 space-x-5">
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">กำหนดรหัสสินค้า</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden max-w-2xl w-full font-[sans-serif]">
              <input
                type="text"
                placeholder="Search Something..."
                className="w-full cursor-pointer outline-none bg-transparent text-gray-600 text-sm"
                value={searchID}
                onChange={(event) => setSearchID(event.target.value)}
              />
              <Search size={16} className="text-gray-600 " />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg ml-4"
            >
              <UserPlus size={20} className="mr-2" />
              Add User
            </button>
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">
                  Vendor ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">
                  Vendor Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.vendorId} className="border-t">
                  <td className="py-4 px-4 text-center">{vendor.vendorId}</td>
                  <td className="py-4 px-4 flex items-center">
                    <Avatar
                      sx={{ bgcolor: deepOrange[500], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {vendor.vendorName.charAt(0).toUpperCase()}
                    </Avatar>
                    {vendor.vendorName}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => getValue(vendor._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>

                    <button
                      // onClick={() => removeVendor(vendor._id)}
                      onClick={() => { getDelValue(vendor._id) }}
                      className="text-red-500 hover:text-red-700 ml-2"
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

      {/* // TODO : Add Vendor Modal */}
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
                      Add Vendor Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Vendor below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Vendor ID
                        </label>
                        <input
                          onChange={(e) => setVendorId(e.target.value)}
                          value={vendorId}
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
                          Vendor Name
                        </label>
                        <input
                          onChange={(e) => setVendorName(e.target.value)}
                          value={vendorName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
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
                        Add Vendor
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>

      {/* // TODO : Edit Vendor Modal */}
      <VendorEdit
        isVisible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vendor={selectedVendor}
        refreshVendors={getVendors}
      />

      {/* // TODO : Delete Vendor Modal */}
      <VendorDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        vendor={selectedVendor}
        refreshVendors={getVendors}
      />

    </div>
  );
}

export default VendorTable;
