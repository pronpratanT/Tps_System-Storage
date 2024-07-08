"use client";

import { useState, useEffect, Fragment } from "react";
import {
  Edit,
  Search,
  Trash2,
  HeartHandshake,
  Filter,
  Check,
} from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo, teal } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import VendorEdit from "./VendorEdit";
import VendorDel from "./VendorDel";
import CountStat from "./CountStat";

function VendorTable() {
  //? State
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorCountry, setVendorCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [searchType, setSearchType] = useState("vendorId");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //TODO < Function to fetch vendors to table >
  const getVendors = async () => {
    try {
      const res_get = await fetch("/api/addVendor", {
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

  //! Table Fetch Data
  //? <Function Search Document Id / Date Export
  const filterData = (vendors, searchTerm, searchType) => {
    if (!searchTerm) return vendors;
    return vendors.filter((vendor) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      if (searchType === "vendorId") {
        return vendor.vendorId.toLowerCase().includes(lowercaseSearchTerm);
      } else if (searchType === "vendorName") {
        return vendor.vendorName.toLowerCase().includes(lowercaseSearchTerm);
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

  //? Sorted Data Table
  const sortExportsByDate = (exports) => {
    return exports.sort((a, b) => {
      const dateA = parse(a.dateExport, "yyyy-MM-dd", new Date());
      const dateB = parse(b.dateExport, "yyyy-MM-dd", new Date());
      return compareAsc(dateA, dateB);
    });
  };
  //! Table Fetch Data >

  //TODO < Function Get Vendor by Id send to VendorEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getVendors(); // Fetch vendors after closing the edit modal
  };

  const getVendorById = async (id) => {
    try {
      const res_byid = await fetch(`/api/addVendor/${id}`, {
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

  //! < Function Add Vendor >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getVendors();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!vendorId || !vendorName) {
      setError("Please complete Vendor details!");
      return;
    }

    setIsSubmitting(true);

    try {
      const resCheckVendor = await fetch("/api/checkVendor", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ vendorId }),
      });
      const { vendor } = await resCheckVendor.json();
      if (vendor) {
        setError("Vendor ID already exists!");
        setIsSubmitting(false);
        return;
      }

      //* Add Vendor to DB
      const res_add = await fetch("/api/addVendor", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ vendorId, vendorName, vendorCountry }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add vendor");
      }

      setError("");
      setSuccess("Vendor has been added successfully!");
      getVendors();

      setTimeout(() => {
        setRefresh(!refresh);
        closeAddModal();
        setSuccess("");
        setVendorId("");
        setVendorName("");
        setVendorCountry("");
        setError("");
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to add vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO < Function Delete Vendor >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`/api/addVendor/${id}`, {
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
      setSelectedVendor(vendor);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get vendor:", error);
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
            กำหนดรหัส Vendor
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center max-w-2xl w-full">
              <div className="flex items-center px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden w-full font-[sans-serif] relative">
                <Search size={16} className="text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${
                    searchType === "vendorId" ? "Vendor ID" : "Vendor Name"
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
                          setSearchType("vendorId");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Vendor ID
                        {searchType === "vendorId" && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSearchType("vendorName");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Vendor Name
                        {searchType === "vendorName" && (
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
              <HeartHandshake size={20} className="mr-2" />
              Add Vendor
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-20 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-3/12">
                  Vendor ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-4/12">
                  Vendor Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  Country
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md w-2/12">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterData(vendors, searchID, searchType).map((vendor) => (
                <tr key={vendor.vendorId} className="border-t">
                  <td className="py-4 pr-4 pl-20 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: teal[400], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {vendor.vendorId.charAt(0).toUpperCase()}
                    </Avatar>
                    {vendor.vendorId}
                  </td>
                  <td className="py-4 px-4">{vendor.vendorName}</td>
                  <td className="py-4 px-4">{vendor.vendorCountry}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(vendor._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(vendor._id)}
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
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Country
                        </label>
                        <input
                          onChange={(e) => setVendorCountry(e.target.value)}
                          value={vendorCountry}
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add Vendor"}
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
        onClose={handleEditModalClose}
        vendor={selectedVendor}
        refreshVendors={getVendors}
      />

      {/* // TODO : Delete Vendor Modal */}
      <VendorDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        vendor={selectedVendor}
        refreshVendors={getVendors}
        refreshCount={handleRefresh}
      />
    </div>
  );
}

export default VendorTable;
