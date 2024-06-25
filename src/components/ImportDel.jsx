import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";
import { Calendar, Trash2 } from "lucide-react";

function ImportDel({
  isVisible,
  onClose,
  importPd,
  refreshImports,
  refreshCount,
}) {
  const [delDate, setDelDate] = useState("");
  const [delDocumentId, setDelDocumentId] = useState("");
  const [delImportVen, setDelImportVen] = useState("");
  const [delImportEm, setDelImportEm] = useState("");
  const [delSelectedProduct, setDelSelectedProduct] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const removeImport = async (event) => {
    event.preventDefault();

    try {
      const resDelete = await fetch(`/api/ImportDB?id=${importPd._id}`, {
        method: "DELETE",
      });
      if (!resDelete.ok) {
        throw new Error("Failed to delete Import Product");
      }
      setError("");
      setSuccess("Import Product has been deleted successfully!");
      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshImports();
        refreshCount();
      }, 2000);
    } catch (error) {
      setError("Failed to delete Import product");
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
        <form onSubmit={removeImport}>
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
                    Delete Import Product Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Delete the details of the Import Product below.
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
                    {/* Product ID */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Product ID
                      </label>
                      <Select
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 w-full"
                    >
                      Delete Import Product
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

export default ImportDel;
