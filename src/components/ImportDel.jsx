import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function ImportDel({ isVisible, onClose, importPd, refreshImports, refreshCount }) {
  const [delDate, setDelDate] = useState("");
  const [delDocumentId, setDelDocumentId] = useState("");
  const [delImportVen, setDelImportVen] = useState("");
  const [delImportEm, setDelImportEm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (importPd) {
      setDelDate(importPd.dateImport);
      setDelDocumentId(importPd.documentId);
      setDelImportVen(importPd.importVen);
      setDelImportEm(importPd.importEm);
    }
  }, [importPd]);

  const removeImport = async (event) => {
    event.preventDefault();

    try {
      const resDelete = await fetch(
        `/api/Import?id=${importPd._id}`,
        {
          method: "DELETE",
        }
      );
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="dateImport"
                      >
                        Date
                      </label>
                      <input
                        onChange={(e) => setDelDate(e.target.value)}
                        value={delDate}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="dateImport"
                        type="text"
                        readOnly
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
                        onChange={(e) => setDelDocumentId(e.target.value)}
                        value={delDocumentId}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="documentId"
                        type="text"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="documentId"
                      >
                        Vendor
                      </label>
                      <input
                        onChange={(e) => setDelImportVen(e.target.value)}
                        value={delImportVen}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="documentId"
                        type="text"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="documentId"
                      >
                        Employee
                      </label>
                      <input
                        onChange={(e) => setDelImportEm(e.target.value)}
                        value={delImportEm}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="documentId"
                        type="text"
                        readOnly
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
