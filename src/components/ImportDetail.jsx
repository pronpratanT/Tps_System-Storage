import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";
import { Calendar } from "lucide-react";

function ImportDetail({ isVisible, onClose, importPd }) {
  const [delDate, setDelDate] = useState("");
  const [delDocumentId, setDelDocumentId] = useState("");
  const [delImportVen, setDelImportVen] = useState("");
  const [delImportEm, setDelImportEm] = useState("");
  const [delSelectedProduct, setDelSelectedProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const datePickerRef = useRef(null);
  const vendorOption = { value: delImportVen, label: delImportVen };
  const employeeOption = { value: delImportEm, label: delImportEm };

  useEffect(() => {
    if (importPd) {
      setDelDate(importPd.dateImport);
      setDelDocumentId(importPd.documentId);
      setDelImportVen(importPd.importVen);
      setDelImportEm(importPd.importEm);
      setDelSelectedProduct(importPd.selectedProduct);
    }
  }, [importPd]);

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
                  Detail Import Product Form
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Details of the Import Product.
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
                          selected={delDate}
                          onChange={(date) => setDelDate(date)}
                          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
                          id="dateImport"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select a date"
                          ref={datePickerRef}
                          onFocus={(e) => e.target.blur()}
                          popperPlacement="bottom-end"
                          readOnly
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
                        onChange={(e) => setDelDocumentId(e.target.value)}
                        value={delDocumentId}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="documentId"
                        type="text"
                        readOnly
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
                      value={vendorOption}
                      isDisabled={true}
                      placeholder="Select Vendor"
                      className="basic-single shadow rounded focus:outline-none focus:shadow-outline"
                      classNamePrefix="select"
                      maxMenuHeight={200}
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#f0f0f0",
                          borderColor: "#d1d5db",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#374151",
                        }),
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
                            Import
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {delSelectedProduct.map((prod) => {
                          return (
                            <tr key={prod.imProId}>
                              <td className="py-2 px-4 border">
                                {prod.imProId}
                              </td>
                              <td className="py-2 px-4 border">
                                {prod.imProName}
                              </td>
                              <td className="py-2 px-4 border text-right">
                                {prod.import}
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
                      value={employeeOption}
                      isDisabled={true}
                      placeholder="Select Vendor"
                      className="basic-single shadow rounded focus:outline-none focus:shadow-outline"
                      classNamePrefix="select"
                      maxMenuHeight={200}
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#f0f0f0",
                          borderColor: "#d1d5db",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#374151",
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ImportDetail;
