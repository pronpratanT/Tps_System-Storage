import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";
import { Calendar, RefreshCw, Trash2 } from "lucide-react";
import { parseISO, format, startOfDay } from "date-fns";

function ExportEdit({ isVisible, onClose, exportPd, refreshExports }) {
  const [newDateExport, setNewDateExport] = useState("");
  const [newDocumentId, setNewDocumentId] = useState("");
  const [newExportVen, setNewExportVen] = useState("");
  const [newExportEm, setNewExportEm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const datePickerRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newSelectedProduct, setNewSelectedProduct] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiddenProducts, setHiddenProducts] = useState([]);

  useEffect(() => {
    if (exportPd) {
      setNewDateExport(exportPd.dateExport);
      setNewDocumentId(exportPd.documentId);
      setNewExportVen(exportPd.exportVen);
      setNewExportEm(exportPd.exportEm);
      setNewSelectedProduct(exportPd.selectedProduct);
    }
  }, [exportPd]);

  //! Fetch Data
  const fetchData = async (url, key, setStateFunction) => {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}`);
      }
      const data = await response.json();

      const uniqueData = data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t[key] === item[key])
      );

      const sortedData = uniqueData.sort((a, b) =>
        a[key].localeCompare(b[key])
      );

      setStateFunction(sortedData);
      console.log(`Sorted ${key}:`, sortedData);
      return sortedData;
    } catch (error) {
      console.log(`Error loading ${key}:`, error);
      throw error;
    }
  };

  const getVendors = () => {
    return fetchData("/api/addVendor", "vendorId", setVendors);
  };
  const getUsers = () => {
    return fetchData("/api/User", "email", setUsers);
  };
  const getProducts = () => {
    return fetchData("/api/Product", "productId", setProducts);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([getProducts(), getUsers(), getVendors()]);
        console.log("All data fetched successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);
  //! Fetch Data >

  const checkDuplicateDocumentId = async (newDocumentId, currentDocumentId) => {
    try {
      const res = await fetch("/api/ExportDB");
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

  //! Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!newDateExport || !newDocumentId || !newExportVen) {
      setError("Please complete Export Product details!");
      setIsSubmitting(false);
      return;
    }

    const visibleProducts = newSelectedProduct.filter(
      (prod) => !hiddenProducts.includes(prod.exProId)
    );
    if (visibleProducts.length === 0) {
      setError("Please add at least one product!");
      return;
    }

    const isDuplicate = await checkDuplicateDocumentId(
      newDocumentId,
      exportPd?._id || ""
    );

    if (isDuplicate) {
      setError("Document ID already exists!");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      //? Update Export
      const visibleProducts = newSelectedProduct.filter(
        (prod) => !hiddenProducts.includes(prod.exProId)
      );

      const res = await fetch(`/api/ExportDB/${exportPd?._id || ""}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newDateExport,
          newDocumentId,
          newExportVen,
          newExportEm,
          newSelectedProduct: visibleProducts,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update Export Product");
      }

      //? Update Export-Product
      const updatePromises = newSelectedProduct.map(async (prod) => {
        const product = products.find((p) => p.productId === prod.exProId);
        if (!product) return null;

        console.log("Product ID : ", product._id);

        const originalExport =
          exportPd.selectedProduct.find((p) => p.exProId === prod.exProId)
            ?.export || "0";
        const newExport = hiddenProducts.includes(prod.exProId)
          ? "0"
          : prod.export || "0";

        if (originalExport === newExport) {
          console.log(`No change for product ${prod.exProId}, skipping update`);
          return null;
        }

        const newAmount = (
          parseInt(product.amount) +
          parseInt(originalExport) -
          parseInt(newExport)
        ).toString();

        const res = await fetch(`/api/Product/${product._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newProductId: product.productId,
            newProductName: product.productName,
            newProductUnit: product.productUnit,
            newBrand: product.brand,
            newStoreHouse: product.storeHouse,
            newAmount: newAmount,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to update Product ${product.productId}`);
        }

        return res.json();
      });

      await Promise.all(updatePromises.filter(Boolean));

      setError("");
      setSuccess("Export Product has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshExports();
        getProducts();
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to update Export Product");
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO SELECTED
  //? Selected Vendor
  useEffect(() => {
    if (newExportVen && vendors.length > 0) {
      const initialVendor = vendors.find(
        (vendor) => vendor.vendorName === newExportVen
      );
      if (initialVendor) {
        setSelectedVendor({
          value: initialVendor.vendorName,
          label: initialVendor.vendorName,
        });
      }
    }
  }, [newExportVen, vendors]);

  const sortedVendors = vendors.slice().sort((a, b) => {
    const isASelected = a.vendorName === newExportVen;
    const isBSelected = b.vendorName === newExportVen;

    if (isASelected && !isBSelected) return -1;
    if (!isASelected && isBSelected) return 1;
    return 0;
  });

  const vendorOptions = sortedVendors.map((vendor) => ({
    value: vendor.vendorName,
    label: (
      <div className="flex justify-between items-center">
        <span>{vendor.vendorName}</span>
        {vendor.vendorName === newExportVen && (
          <span className="text-green-700 ml-2">&#10003;</span>
        )}
      </div>
    ),
  }));

  const handleVendorChange = (option) => {
    setSelectedVendor(option);
    setNewExportVen(option ? option.value : "");
  };
  //? Selected Vendor >

  //? Selected User
  useEffect(() => {
    if (newExportEm && users.length > 0) {
      const initialEmployee = users.find((user) => user.name === newExportEm);
      if (initialEmployee) {
        setSelectedEmployee({
          value: initialEmployee.name,
          label: initialEmployee.name,
        });
      }
    }
  }, [newExportEm, users]);

  const sortedUsers = users.slice().sort((a, b) => {
    const isASelected = a.name === newExportEm;
    const isBSelected = b.name === newExportEm;

    if (isASelected && !isBSelected) return -1; // a ถูกเลือกแล้ว ให้อยู่ก่อน
    if (!isASelected && isBSelected) return 1; // b ถูกเลือกแล้ว ให้อยู่หลัง
    return 0; // กรณีอื่น ๆ ให้คงลำดับเดิม
  });

  const employeeOptions = sortedUsers.map((user) => ({
    value: user.name,
    label: (
      <div className="flex justify-between items-center">
        <span>{user.name}</span>
        {user.name === newExportEm && (
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
    setNewExportEm(option ? option.value : "");
  };
  //? Selected User >

  //? Selected Product
  const handleProductIdChange = (selectedOption) => {
    if (!selectedOption) return;

    const productId = selectedOption.value;
    if (
      productId &&
      !newSelectedProduct.some((prod) => prod.exProId === productId)
    ) {
      const selected = products.find(
        (product) => product.productId === productId
      );
      if (selected) {
        const updatedSelectedProduct = [
          ...newSelectedProduct,
          {
            exProId: selected.productId,
            exProName: selected.productName,
            export: "0",
            amount: selected.amount,
            originalAmount: selected.amount,
          },
        ];
        setNewSelectedProduct(updatedSelectedProduct);
      }
    }
  };
  useEffect(() => {
    console.log(newSelectedProduct);
  }, [newSelectedProduct]);

  const productOptions = products.map((product) => {
    const isSelected = newSelectedProduct.some(
      (prod) => prod.exProId === product.productId
    );

    return {
      value: product.productId,
      label: (
        <div className="flex justify-between items-center">
          <span>{product.productId}</span>
          {isSelected && <span className="text-green-500 ml-2">&#10003;</span>}
        </div>
      ),
      isSelected: isSelected,
    };
  });

  productOptions.sort((a, b) => {
    if (a.isSelected && !b.isSelected) return -1;
    if (!a.isSelected && b.isSelected) return 1;
    return 0; //
  });

  const handleExportQuantityChange = (productId, quantity) => {
    setNewSelectedProduct((prevSelectedProduct) =>
      prevSelectedProduct.map((prod) => {
        if (prod.exProId === productId) {
          const originalProduct = products.find(
            (p) => p.productId === productId
          );
          const originalAmount = originalProduct
            ? parseInt(originalProduct.amount) || 0
            : 0;
          let newExportQuantity = parseInt(quantity) || 0;
          const prevExportQuantity = parseInt(prod.export) || 0;

          const currentAmount =
            prod.amount !== undefined ? parseInt(prod.amount) : originalAmount;

          let newAmount = Math.max(
            0,
            currentAmount - (newExportQuantity - prevExportQuantity)
          );

          if (newAmount === 0 && newExportQuantity > originalAmount) {
            newExportQuantity = originalAmount;
            newAmount = 0;
          }

          const isModified = newExportQuantity !== 0;
          const isLowStock = newAmount > 0 && newAmount <= 10;
          const isOutOfStock = newAmount === 0;

          return {
            ...prod,
            export: newExportQuantity.toString(),
            amount: newAmount,
            isModified: isModified,
            isLowStock: isLowStock,
            isOutOfStock: isOutOfStock,
          };
        }
        return prod;
      })
    );
  };

  const handleRemoveProduct = (productId) => {
    const currentVisibleProducts = newSelectedProduct.filter(
      (prod) => !hiddenProducts.includes(prod.exProId)
    );

    if (
      currentVisibleProducts.length === 1 &&
      currentVisibleProducts[0].exProId === productId
    ) {
      setError("You must have at least one product selected!");
      return;
    }

    setHiddenProducts((prevHiddenProducts) => {
      if (prevHiddenProducts.includes(productId)) {
        return prevHiddenProducts.filter((id) => id !== productId);
      } else {
        return [...prevHiddenProducts, productId];
      }
    });
    setError("");
  };
  //? Selected Product >
  //TODO SELECTED >

  //* Date Custom
  const CustomContainer = ({ className, children }) => (
    <div style={{ zIndex: 9999, position: "absolute" }}>
      <CalendarContainer className={className}>
        <div style={{ position: "relative" }}>{children}</div>
      </CalendarContainer>
    </div>
  );
  const adjustedDate = useMemo(() => {
    if (newDateExport) {
      return parseISO(newDateExport);
    }
    return null;
  }, [newDateExport]);

  const handleDateChange = (date) => {
    if (date) {
      const startOfSelectedDay = startOfDay(date);
      setNewDateExport(format(startOfSelectedDay, "yyyy-MM-dd"));
    } else {
      setNewDateExport(null);
    }
  };
  //* Date Custom >

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
                    Update Export Product Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the details of the Export Product below.
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
                            selected={adjustedDate}
                            onChange={handleDateChange}
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
                            <th className="py-2 px-4 border w-2/12 text-center">
                              Amount
                            </th>
                            <th className="py-2 px-4 border w-2/12 text-center">
                              Export
                            </th>
                            <th className="py-2 px-4 border w-1/12 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {newSelectedProduct.map((prod) => {
                            const originalProduct = products.find(
                              (p) => p.productId === prod.exProId
                            );
                            const originalAmount = originalProduct
                              ? parseInt(originalProduct.amount) || 0
                              : 0;
                            const exportQuantity = parseInt(prod.export) || 0;

                            const displayAmount =
                              (prod.amount !== undefined
                                ? parseInt(prod.amount)
                                : originalAmount) || 0;

                            const isModified = exportQuantity !== 0;
                            const isOutOfStock = displayAmount === 0;
                            const isHidden = hiddenProducts.includes(
                              prod.exProId
                            );

                            return (
                              <tr
                                key={prod.exProId}
                                className={isHidden ? "opacity-50" : ""}
                              >
                                <td className="py-2 px-4 border">
                                  {prod.exProId}
                                </td>
                                <td className="py-2 px-4 border">
                                  {prod.exProName}
                                </td>
                                <td
                                  className={`py-2 px-4 border text-right ${
                                    isModified && !isHidden
                                      ? "text-red-600"
                                      : ""
                                  }`}
                                >
                                  {displayAmount}
                                  {prod.isLowStock && !isOutOfStock && (
                                    <span className="ml-2 text-yellow-500">
                                      Low Stock!
                                    </span>
                                  )}
                                  {isOutOfStock && (
                                    <span className="ml-2 text-red-500">
                                      Out of Stock!
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-4 border">
                                  <input
                                    type="number"
                                    value={prod.export || ""}
                                    onChange={(e) =>
                                      handleExportQuantityChange(
                                        prod.exProId,
                                        e.target.value
                                      )
                                    }
                                    min="0"
                                    className="w-full py-1 px-2 border rounded text-right"
                                    disabled={isHidden}
                                  />
                                </td>
                                <td className="py-2 px-4 border text-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveProduct(prod.exProId)
                                    }
                                    className={`${
                                      isHidden
                                        ? "text-green-500 hover:text-green-700"
                                        : "text-red-500 hover:text-red-700"
                                    }`}
                                  >
                                    {isHidden ? (
                                      <RefreshCw size={23} />
                                    ) : (
                                      <Trash2 size={23} />
                                    )}
                                  </button>
                                  {prod.selected && (
                                    <span className="ml-2 text-green-500">
                                      Selected
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Export Product"}
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
