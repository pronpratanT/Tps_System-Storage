"use client";

import { useState, useEffect, Fragment, useRef } from "react";
import { Edit, Search, Trash2, PackagePlus, Calendar } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import ImportEdit from "./ImportEdit";
import ImportDel from "./ImportDel";
import CountStatIXPort from "./CountStatIXPort";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";

const ImportTable = () => {
  //? State
  const [dateImport, setDateImport] = useState(null);
  const [documentId, setDocumentId] = useState("");
  const [importVen, setImportVen] = useState("");
  const [importEm, setImportEm] = useState("");
  const [imports, setImports] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [selectedImport, setSelectedImport] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const datePickerRef = useRef(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  //TODO < Function to fetch Import to table >
  const getImport = async () => {
    try {
      const res_get = await fetch("/api/ImportDB", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Import");
      }

      const newImports = await res_get.json();

      // Check for duplicates
      const uniqueImports = newImports.filter(
        (importPd, index, self) =>
          index === self.findIndex((t) => t.documentId === importPd.documentId)
      );

      // Sort Products by vendorId in alphabetical order
      const sortedImports = uniqueImports.sort((a, b) =>
        a.documentId.localeCompare(b.documentId)
      );

      setImports(sortedImports);
      console.log(sortedImports);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };
  //? Reload Products table
  useEffect(() => {
    getImport();
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

  //TODO <Function Search Document Id
  const filterImportsByID = (importPds, searchID) => {
    if (!searchID) return importPds; // Return all products if searchID is empty

    // Filter unique products based on searchID
    const filteredImports = importPds.filter(
      (importPd, index, self) =>
        importPd.documentId.toLowerCase().includes(searchID.toLowerCase()) &&
        index === self.findIndex((t) => t.documentId === importPd.documentId)
    );

    return filteredImports;
  };

  //TODO < Function Get Product by Id send to ProductEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getImport();
  };

  const getImportById = async (id) => {
    try {
      const res_byid = await fetch(`/api/ImportDB/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Import");
      }

      const data = await res_byid.json();
      console.log("Data:", data.importDb);
      return data.importDb; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Import:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const importPD = await getImportById(id);
      setSelectedImport(importPD); // Set the selected product
      setIsEditModalOpen(true);
      console.log("importPd: ", importPD);
    } catch (error) {
      console.error("Failed to get import:", error);
    }
  };

  //! < Function Add Import >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getImport();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < selectedDocuments.length; i++) {
      const selDoc = {
        imProId: selectedDocuments[i].productId,
        imProName: selectedDocuments[i].productName,
        import: selectedDocuments[i].importQuantity,
      };
      selectedProduct.push(selDoc);
    }
    console.log("selectedProduct : ", selectedProduct);
    console.log("selectedDocuments : ", selectedDocuments);

    if (!dateImport || !documentId || !importVen) {
      setError("Please complete Import Product details!");
      return;
    }

    if (!selectedProduct || selectedProduct.length === 0) {
      setError("Please add at least one product!");
      return;
    }

    try {
      const resCheckImport = await fetch("/api/checkImportDB", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      });
      const { importPd } = await resCheckImport.json();
      if (importPd) {
        setError("Document ID already exists!");
        return;
      }

      // Add Product to DB
      const res_add = await fetch("/api/ImportDB", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          dateImport,
          documentId,
          importVen,
          importEm,
          selectedProduct,
        }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add Import");
      }

      setError("");
      setSuccess("Import Product has been added successfully!");
      getImport();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setDateImport("");
        setDocumentId("");
        setImportVen("");
        setImportEm("");
        setSelectedProduct([]);
        setSelectedDocuments([]);
        setRefresh(!refresh);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add Import Product");
    }
  };

  //TODO < Function Delete Import >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`/api/ImportDB/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Import");
      }

      const data = await res_byid.json();
      return data.importPD; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Import:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const importPD = await getDelById(id);
      setSelectedImport(importPD);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get Import:", error);
    }
  };

  //Refresh CountStatIm-Export
  const handleRefresh = () => {
    setShouldRefresh(!shouldRefresh);
  };

  //? Selected Product

  //* Date Custom
  const CustomContainer = ({ className, children }) => (
    <div style={{ zIndex: 9999, position: "absolute" }}>
      <CalendarContainer className={className}>
        <div style={{ position: "relative" }}>{children}</div>
      </CalendarContainer>
    </div>
  );

  //* Date Custom >

  const handleProductIdChange = (selectedOption) => {
    if (!selectedOption) return;

    const productId = selectedOption.value;
    if (
      productId &&
      !selectedDocuments.some((doc) => doc.productId === productId)
    ) {
      const selected = products.find(
        (product) => product.productId === productId
      );
      if (selected) {
        setSelectedDocuments([
          ...selectedDocuments,
          { ...selected, importQuantity: 0 },
        ]);
      }
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedDocuments(
      selectedDocuments.filter((doc) => doc.productId !== productId)
    );
  };

  const handleImportQuantityChange = (productId, quantity) => {
    setSelectedDocuments(
      selectedDocuments.map((doc) =>
        doc.productId === productId ? { ...doc, importQuantity: quantity } : doc
      )
    );
  };

  const sortedProducts = products.sort((a, b) => {
    const isASelected = selectedDocuments.some(
      (doc) => doc.productId === a.productId
    );
    const isBSelected = selectedDocuments.some(
      (doc) => doc.productId === b.productId
    );

    if (isASelected && !isBSelected) return -1; // a ถูกเลือกแล้ว ให้อยู่ก่อน
    if (!isASelected && isBSelected) return 1; // b ถูกเลือกแล้ว ให้อยู่หลัง
    return 0;
  });

  const productOptions = sortedProducts.map((product) => ({
    value: product.productId,
    label: (
      <div className="flex justify-between items-center">
        <span>{product.productId}</span>
        {selectedDocuments.some(
          (doc) => doc.productId === product.productId
        ) && <span className="text-green-700 ml-2">&#10003;</span>}
      </div>
    ),
  }));
  //? Selected Product >

  //? Selected Vendor
  const sortedVendors = vendors.slice().sort((a, b) => {
    const isASelected = a.vendorName === importVen;
    const isBSelected = b.vendorName === importVen;

    if (isASelected && !isBSelected) return -1; // a ถูกเลือกแล้ว ให้อยู่ก่อน
    if (!isASelected && isBSelected) return 1; // b ถูกเลือกแล้ว ให้อยู่หลัง
    return 0; // กรณีอื่น ๆ ให้คงลำดับเดิม
  });

  const vendorOptions = sortedVendors.map((vendor) => ({
    value: vendor.vendorName,
    label: (
      <div className="flex justify-between items-center">
        <span>{vendor.vendorName}</span>
        {vendor.vendorName === importVen && (
          <span className="text-green-700 ml-2">&#10003;</span>
        )}
      </div>
    ),
  }));
  //? Selected Vendor >

  //? Selected User
  const sortedUsers = users.slice().sort((a, b) => {
    const isASelected = a.name === importEm;
    const isBSelected = b.name === importEm;

    if (isASelected && !isBSelected) return -1; // a ถูกเลือกแล้ว ให้อยู่ก่อน
    if (!isASelected && isBSelected) return 1; // b ถูกเลือกแล้ว ให้อยู่หลัง
    return 0; // กรณีอื่น ๆ ให้คงลำดับเดิม
  });

  const employeeOptions = sortedUsers.map((user) => ({
    value: user.name,
    label: (
      <div className="flex justify-between items-center">
        <span>{user.name}</span>
        {user.name === importEm && (
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

  //? Selected User >

  return (
    <div className="flex-1 p-4">
      <div>
        <CountStatIXPort refresh={refresh} shouldRefresh={shouldRefresh} />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
            รับสินค้าเข้า
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
              <PackagePlus size={20} className="mr-2" />
              Add Import
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
              {filterImportsByID(imports, searchID).map((importPd) => (
                <tr key={importPd.documentId} className="border-t">
                  <td className="py-4 pr-4 pl-10 w-auto">
                    {importPd.dateImport}
                  </td>
                  <td className="py-4 px-4 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: indigo[800], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {importPd.documentId.charAt(0).toUpperCase()}
                    </Avatar>
                    {importPd.documentId}
                  </td>
                  <td className="py-4 px-4">{importPd.importVen}</td>
                  <td className="py-4 px-4">{importPd.importEm}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(importPd._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(importPd._id)}
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
                              selected={dateImport}
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
                            onChange={(e) => setDocumentId(e.target.value)}
                            value={documentId}
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
                          onChange={(option) =>
                            setImportVen(option ? option.value : "")
                          }
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
                          className="basic-single shadow focus:shadow-outline focus:outline-none rounded"
                          classNamePrefix="select"
                          placeholder="Select Product ID"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
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
                            {selectedDocuments.map((doc) => (
                              <tr key={doc.productId}>
                                <td className="py-2 px-4 border">
                                  {doc.productId}
                                </td>
                                <td className="py-2 px-4 border">
                                  {doc.productName}
                                </td>
                                <td className="py-2 px-4 border text-right">
                                  {doc.amount}
                                </td>
                                <td className="py-2 px-4 border">
                                  <input
                                    type="number"
                                    value={doc.importQuantity || ""}
                                    onChange={(e) =>
                                      handleImportQuantityChange(
                                        doc.productId,
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
                                      handleRemoveProduct(doc.productId)
                                    }
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

                      {/* Employee */}
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="importEm"
                        >
                          Employee
                        </label>
                        <Select
                          options={employeeOptions}
                          onChange={(option) =>
                            setImportEm(option ? option.value : "")
                          }
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

      {/* // TODO : Edit Product Modal */}
      <ImportEdit
        isVisible={isEditModalOpen}
        onClose={handleEditModalClose}
        importPd={selectedImport}
        refreshImports={getImport}
      />

      {/* // TODO : Delete Product Modal */}
      <ImportDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        importPd={selectedImport}
        refreshImports={getImport}
        refreshCount={handleRefresh}
      />
    </div>
  );
};

export default ImportTable;
