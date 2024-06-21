import { useState, useEffect, Fragment, useRef } from "react";
import { Edit, Search, Trash2, PackagePlus, Calendar } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ModalForm.css";
import Select from "react-select";

function ImportAdd({
  isVisible,
  onClose,
  vendors,
  users,
  products,
  refreshImports,
  refreshCount
}) {
  const [dateImport, setDateImport] = useState(null);
  const datePickerRef = useRef(null);
  const [documentId, setDocumentId] = useState("");
  const [importVen, setImportVen] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [importEm, setImportEm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //TODO < Function Add Import >
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!dateImport || !documentId || !importVen) {
      setError("Please complete Import Product details!");
      return;
    }

    try {
      const resCheckImport = await fetch("/api/checkImport", {
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

      //* Add Product to DB
      const res_add = await fetch("/api/Import", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          dateImport,
          documentId,
          importVen,
          importEm,
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
        setRefresh(!refresh);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add Import Product");
    }
  };

  const CustomContainer = ({ className, children }) => (
    <div style={{ zIndex: 9999 }}>
      <CalendarContainer className={className}>
        <div style={{ position: "relative" }}>{children}</div>
      </CalendarContainer>
    </div>
  );

  const handleProductIdChange = (selectedOption) => {
    if (!selectedOption) return;

    const productId = selectedOption.value;
    if (
      productId &&
      !selectedDocuments.some((doc) => doc.productId === productId)
    ) {
      const selectedProduct = products.find(
        (product) => product.productId === productId
      );
      if (selectedProduct) {
        setSelectedDocuments([
          ...selectedDocuments,
          { ...selectedProduct, importQuantity: 0 },
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

  const availableProducts = products.filter(
    (product) =>
      !selectedDocuments.some((doc) => doc.productId === product.productId)
  );

  const productOptions = availableProducts.map((product) => ({
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pl-10"
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
                      <select
                        id="unit"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedText = e.target.selectedOptions[0].text;
                          setImportVen(
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
                    {/* Product ID */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Product ID
                      </label>
                      <Select
                        options={productOptions}
                        onChange={handleProductIdChange}
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Select Product ID"
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
                      <select
                        id="importEm"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedText = e.target.selectedOptions[0].text;
                          setImportEm(selectedValue === "" ? "" : selectedText);
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

export default ImportAdd;
