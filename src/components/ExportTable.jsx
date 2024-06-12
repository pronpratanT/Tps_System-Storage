"use client";

import { useState, useEffect, Fragment } from "react";
import { Edit, Search, Trash2, PackageMinus } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import ExportEdit from "./ExportEdit";
import ExportDel from "./ExportDel";
import CountStatIXPort from "./CountStatIXPort";

function ExportTable() {
  //? State
  const [dateExport, setDateExport] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [exportVen, setExportVen] = useState("");
  const [exportEm, setExportEm] = useState("");
  const [exports, setExports] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [selectedExport, setSelectedExport] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  //TODO < Function to fetch Export to table >
  const getExport = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/Export", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Export");
      }

      const newExports = await res_get.json();

      // Check for duplicates
      const uniqueExports = newExports.filter(
        (exportPd, index, self) =>
          index === self.findIndex((t) => t.documentId === exportPd.documentId)
      );

      // Sort Products by vendorId in alphabetical order
      const sortedExports = uniqueExports.sort((a, b) =>
        a.documentId.localeCompare(b.documentId)
      );

      setExports(sortedExports);
      console.log(sortedExports);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };
  //? Reload Products table
  useEffect(() => {
    getExport();
  }, []);

  //TODO < Function to fetch vendors to table >
  const getVendors = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/addVendor", {
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

  //TODO < Function to fetch user to table >
  const getUsers = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/User", {
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

  //TODO <Function Search Document Id
  const filterExportsByID = (exportPds, searchID) => {
    if (!searchID) return exportPds; // Return all products if searchID is empty

    // Filter unique products based on searchID
    const filteredExports = exportPds.filter(
      (exportPd, index, self) =>
        exportPd.documentId.toLowerCase().includes(searchID.toLowerCase()) &&
        index === self.findIndex((t) => t.documentId === exportPd.documentId)
    );

    return filteredExports;
  };

  //TODO < Function Get Product by Id send to ProductEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getExport();
  };

  const getExportById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/Export/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Export");
      }

      const data = await res_byid.json();
      console.log("Data:", data.exportPD);
      return data.exportPD; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Export:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const exportPD = await getExportById(id);
      setSelectedExport(exportPD); // Set the selected product
      setIsEditModalOpen(true);
      console.log("exportPd: ", exportPD);
    } catch (error) {
      console.error("Failed to get Export:", error);
    }
  };

  //TODO < Function Add Export >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getExport();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!dateExport || !documentId || !exportVen) {
      setError("Please complete Export Product details!");
      return;
    }

    try {
      const resCheckExport = await fetch(
        "http://localhost:3000/api/checkExport",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ documentId }),
        }
      );
      const { exportPd } = await resCheckExport.json();
      if (exportPd) {
        setError("Document ID already exists!");
        return;
      }

      //* Add Product to DB
      const res_add = await fetch("http://localhost:3000/api/Export", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          dateExport,
          documentId,
          exportVen,
          exportEm,
        }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add Export");
      }

      setError("");
      setSuccess("Export Product has been added successfully!");
      getExport();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setDateExport("");
        setDocumentId("");
        setExportVen("");
        setExportEm("");
        setRefresh(!refresh);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add Export Product");
    }
  };

  //TODO < Function Delete Export >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/Export/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Export");
      }

      const data = await res_byid.json();
      return data.exportPD; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Export:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const exportPD = await getDelById(id);
      setSelectedExport(exportPD);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get Export:", error);
    }
  };

  const handleRefresh = () => {
    setShouldRefresh(!shouldRefresh);
  };

  return (
    <div className="flex-1 p-4">
      <div>
        <CountStatIXPort refresh={refresh} shouldRefresh={shouldRefresh} />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
            เบิกสินค้าออก
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden max-w-2xl w-full font-[sans-serif]">
              <input
                type="text"
                placeholder="Search Document ID..."
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
              <PackageMinus size={20} className="mr-2" />
              Add Export
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-10 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-2/12">
                  Date
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  Document ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  Vendor
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/12">
                  Employee
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterExportsByID(exports, searchID).map((exportPd) => (
                <tr key={exportPd.documentId} className="border-t">
                  <td className="py-4 pr-4 pl-10 w-auto">
                    {exportPd.dateExport}
                  </td>
                  <td className="py-4 px-4 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: indigo[800], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {exportPd.documentId.charAt(0).toUpperCase()}
                    </Avatar>
                    {exportPd.documentId}
                  </td>
                  <td className="py-4 px-4">{exportPd.exportVen}</td>
                  <td className="py-4 px-4">{exportPd.exportEm}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(exportPd._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(exportPd._id)}
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
                      Add Export Product Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Export Product below.
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
                          onChange={(e) => setDateExport(e.target.value)}
                          value={dateExport}
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
                          onChange={(e) => setDocumentId(e.target.value)}
                          value={documentId}
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
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedText =
                              e.target.selectedOptions[0].text;
                            setExportVen(
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
                          htmlFor="importEm"
                        >
                          Employee
                        </label>
                        <select
                          id="importEm"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedText =
                              e.target.selectedOptions[0].text;
                            setExportEm(
                              selectedValue === "" ? "" : selectedText
                            );
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select Employee</option>
                          {users.map((user) => (
                            <option key={user.userid} value={user.userid}>
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
                        Add Export Product
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>

      {/* // TODO : Edit Product Modal */}
      <ExportEdit
        isVisible={isEditModalOpen}
        onClose={handleEditModalClose}
        exportPd={selectedExport}
        refreshExports={getExport}
      />

      {/* // TODO : Delete Product Modal */}
      <ExportDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        exportPd={selectedExport}
        refreshExports={getExport}
        refreshCount={handleRefresh}
      />
    </div>
  );
}

export default ExportTable;
