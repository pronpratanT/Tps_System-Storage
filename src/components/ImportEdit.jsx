import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";
import { Calendar, Trash2 } from "lucide-react";

function ImportEdit({ isVisible, onClose, importPd, refreshImports }) {
  const [newDateImport, setNewDateImport] = useState("");
  const [newDocumentId, setNewDocumentId] = useState("");
  const [newImportVen, setNewImportVen] = useState("");
  const [newImportEm, setNewImportEm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const datePickerRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newSelectedProduct, setNewSelectedProduct] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  useEffect(() => {
    if (importPd) {
      setNewDateImport(importPd.dateImport);
      setNewDocumentId(importPd.documentId);
      setNewImportVen(importPd.importVen);
      setNewImportEm(importPd.importEm);
      setNewSelectedProduct(importPd.selectedProduct);
    }
  }, [importPd]);

  const checkDuplicateDocumentId = async (newDocumentId, currentDocumentId) => {
    try {
      const res = await fetch("/api/ImportDB");
      const imports = await res.json();
      return imports.some(
        (importPd) =>
          importPd.documentId === newDocumentId &&
          importPd._id !== currentDocumentId
      );
    } catch (error) {
      console.error("Error checking duplicate Document ID:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDateImport || !newDocumentId || !newImportVen) {
      setError("Please complete Import Product details!");
      return;
    }

    const isDuplicate = await checkDuplicateDocumentId(
      newDocumentId,
      importPd?._id || ""
    );
    if (isDuplicate) {
      setError("Document ID already exists!");
      return;
    }

    try {
      const res = await fetch(`/api/Import/${importPd?._id || ""}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newDateImport,
          newDocumentId,
          newImportVen,
          newImportEm,
          newSelectedProduct,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update Import Product");
      }

      setError("");
      setSuccess("Import Product has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshImports();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update Import Product");
    }
  };

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

  //TODO < Function to fetch product to table >
  const getProducts = async () => {
    try {
      const res_get = await fetch("/api/Product", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Product");
      }

      const newProducts = await res_get.json();

      // Check for duplicates
      const uniqueProducts = newProducts.filter(
        (product, index, self) =>
          index === self.findIndex((t) => t.productId === product.productId)
      );

      // Sort Products by vendorId in alphabetical order
      const sortedProducts = uniqueProducts.sort((a, b) =>
        a.productId.localeCompare(b.productId)
      );

      setProducts(sortedProducts);
      console.log(sortedProducts);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  //? Reload Products table
  useEffect(() => {
    getProducts();
  }, []);

  //? Selected Vendor
  useEffect(() => {
    if (newImportVen && vendors.length > 0) {
      const initialVendor = vendors.find(
        (vendor) => vendor.vendorName === newImportVen
      );
      if (initialVendor) {
        setSelectedVendor({
          value: initialVendor.vendorName,
          label: initialVendor.vendorName,
        });
      }
    }
  }, [newImportVen, vendors]);

  const sortedVendors = vendors.slice().sort((a, b) => {
    const isASelected = a.vendorName === newImportVen;
    const isBSelected = b.vendorName === newImportVen;

    if (isASelected && !isBSelected) return -1;
    if (!isASelected && isBSelected) return 1;
    return 0;
  });

  const vendorOptions = sortedVendors.map((vendor) => ({
    value: vendor.vendorName,
    label: (
      <div className="flex justify-between items-center">
        <span>{vendor.vendorName}</span>
        {vendor.vendorName === newImportVen && (
          <span className="text-green-700 ml-2">&#10003;</span>
        )}
      </div>
    ),
  }));

  const handleVendorChange = (option) => {
    setSelectedVendor(option);
    setNewImportVen(option ? option.value : "");
  };
  //? Selected Vendor >

  //? Selected User
  useEffect(() => {
    if (newImportEm && users.length > 0) {
      const initialEmployee = users.find((user) => user.name === newImportEm);
      if (initialEmployee) {
        setSelectedEmployee({
          value: initialEmployee.name,
          label: initialEmployee.name,
        });
      }
    }
  }, [newImportEm, users]);

  const sortedUsers = users.slice().sort((a, b) => {
    const isASelected = a.name === newImportEm;
    const isBSelected = b.name === newImportEm;

    if (isASelected && !isBSelected) return -1; // a ถูกเลือกแล้ว ให้อยู่ก่อน
    if (!isASelected && isBSelected) return 1; // b ถูกเลือกแล้ว ให้อยู่หลัง
    return 0; // กรณีอื่น ๆ ให้คงลำดับเดิม
  });

  const employeeOptions = sortedUsers.map((user) => ({
    value: user.name,
    label: (
      <div className="flex justify-between items-center">
        <span>{user.name}</span>
        {user.name === newImportEm && (
          <span className="text-green-700 ml-2">&#10003;</span>
        )}
      </div>
    ),
  }));

  const renderDropdownInPortal = ({ props, isOpened }) => {
    if (isOpened) {
      return createPortal(
        <div {...props.menuPortalTarget}>{props.menuPortal}</div>,
        document.body
      );
    }
    return null;
  };

  const handleEmployeeChange = (option) => {
    setSelectedEmployee(option);
    setNewImportEm(option ? option.value : "");
  };
  //? Selected User >
  //* Date Custom
  const CustomContainer = ({ className, children }) => (
    <div style={{ zIndex: 9999, position: "absolute" }}>
      <CalendarContainer className={className}>
        <div style={{ position: "relative" }}>{children}</div>
      </CalendarContainer>
    </div>
  );
  //* Date Custom >
  //? Selected Product
  const handleProductIdChange = (selectedOption) => {
    if (!selectedOption) return;
  
    const productId = selectedOption.value;
    if (
      productId &&
      !newSelectedProduct.some((prod) => prod.imProId === productId)
    ) {
      const selected = products.find(
        (product) => product.productId === productId
      );
      if (selected) {
        const updatedSelectedProduct = [
          ...newSelectedProduct,
          { imProId: selected.productId, imProName: selected.productName, import: 0 },
        ];
        setNewSelectedProduct(updatedSelectedProduct);
      }
    }
  };
  
  const productOptions = products.map((product) => {
    const isSelected = newSelectedProduct.some((prod) => prod.imProId === product.productId);
  
    return {
      value: product.productId,
      label: (
        <div className="flex justify-between items-center">
          <span>{product.productId}</span>
          {isSelected && (
            <span className="text-green-500 ml-2">&#10003;</span> // เปลี่ยนเป็นเครื่องหมายถูก (checkmark icon)
          )}
        </div>
      ),
      isSelected: isSelected, // เพิ่มฟิลด์ isSelected เพื่อใช้ในการเรียงลำดับต่อไป (ถ้าต้องการ)
    };
  });
  
  // เรียงลำดับตัวเลือกที่มีเลือกแล้วไปอยู่บนสุดของ productOptions
  productOptions.sort((a, b) => {
    if (a.isSelected && !b.isSelected) return -1; // a มีเลือกแล้ว แต่ b ยังไม่มี
    if (!a.isSelected && b.isSelected) return 1; // b มีเลือกแล้ว แต่ a ยังไม่มี
    return 0; // ไม่มีการเปลี่ยนแปลงในการเรียงลำดับ
  });
  //? Selected Product >

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
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Import Product Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Add the details of the Import Product below.
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="mb-4 flex justify-between">
                      <div className="w-1/2 pr-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="dateImport"
                        >
                          Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={newDateImport}
                            onChange={(date) => setDateImport(date)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                            id="dateImport"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select a date"
                            ref={datePickerRef}
                            onFocus={(e) => e.target.blur()}
                            popperPlacement="bottom-end"
                          />
                          <div
                            className="absolute top-0 left-0 px-2 py-2 cursor-pointer"
                            onClick={() => datePickerRef.current.setFocus()}
                          >
                            <Calendar className="text-gray-500" />
                          </div>
                        </div>
                      </div>

                      <div className="w-1/2 pl-2">
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
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="unit"
                      >
                        Vendor
                      </label>
                      <Select
                        options={vendorOptions}
                        onChange={handleVendorChange}
                        value={selectedVendor}
                        placeholder="Select Vendor"
                        isClearable
                        className="basic-single shadow rounded focus:outline-none focus:shadow-outline"
                        classNamePrefix="select"
                        maxMenuHeight={200}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    {/* Product ID */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Product ID
                      </label>
                      <Select
                        options={productOptions}
                        onChange={handleProductIdChange}
                        placeholder="Select Product"
                        isClearable
                        className="basic-single shadow rounded focus:outline-none focus:shadow-outline"
                        classNamePrefix="select"
                        maxMenuHeight={200}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    {/* Products Table */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Selected Products
                      </label>
                      <table className="min-w-full bg-white border">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border w-3/12">
                              Product ID
                            </th>
                            <th className="py-2 px-4 border w-5/12">
                              Product Name
                            </th>
                            <th className="py-2 px-4 border w-1/12 text-center">
                              Amount
                            </th>
                            <th className="py-2 px-4 border w-2/12 text-center">
                              Import
                            </th>
                            <th className="py-2 px-4 border w-1/12 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newSelectedProduct.map((prod) => (
                            <tr key={prod.imProId}>
                              <td className="py-2 px-4 border">
                                {prod.imProId}
                              </td>
                              <td className="py-2 px-4 border">
                                {prod.imProName}
                              </td>
                              <td className="py-2 px-4 border text-right">
                                {prod.amount}
                              </td>
                              <td className="py-2 px-4 border">
                                <input
                                  type="number"
                                  value={prod.import || ""}
                                  onChange={(e) =>
                                    handleImportQuantityChange(
                                      prod.imProId,
                                      e.target.value
                                    )
                                  }
                                  className="w-full py-1 px-2 border rounded text-right"
                                />
                              </td>
                              <td className="py-2 px-4 border text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveProduct(prod.imProId)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={23} />
                                </button>
                                {prod.selected && (
                                  <span className="ml-2 text-green-500">
                                    Selected
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Employee */}
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="newImportEm"
                      >
                        Employee
                      </label>
                      <Select
                        options={employeeOptions}
                        onChange={handleEmployeeChange}
                        value={selectedEmployee}
                        placeholder="Select Employee"
                        isClearable
                        className="basic-single shadow focus:shadow-outline focus:outline-none rounded"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        maxMenuHeight={200}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>
                  </div>

                  {/* Error & Success Messages */}
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
                      Add Import Product
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

export default ImportEdit;
