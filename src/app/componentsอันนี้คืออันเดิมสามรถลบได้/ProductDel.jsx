import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function ProductDel({ isVisible, onClose, product, refreshProducts, refreshCount }) {
  const [delId, setDelId] = useState("");
  const [delName, setDelName] = useState("");
  const [delUnit, setDelUnit] = useState("");
  const [delStoreHouse, setDelStoreHouse] = useState("");
  const [delAmount, setDelAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (product) {
      setDelId(product.productId);
      setDelName(product.productName);
      setDelUnit(product.productUnit);
      setDelStoreHouse(product.storeHouse);
      setDelAmount(product.amount);
    }
  }, [product]);

  const removeProduct = async (event) => {
    event.preventDefault();

    try {
      const resDelete = await fetch(
        `https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Product?id=${product._id}`,
        {
          method: "DELETE",
        }
      );
      if (!resDelete.ok) {
        throw new Error("Failed to delete Product");
      }
      setError("");
      setSuccess("Product has been deleted successfully!");
      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshProducts();
        refreshCount();
      }, 2000);
    } catch (error) {
      setError("Failed to delete product");
    }
  };

  return (
    <div>
      <Transition appear show={isVisible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterForm="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            Leave="ease-in duration-200"
            LeaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <form onSubmit={removeProduct}>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterForm="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  Leave="ease-in duration-200"
                  LeaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Delete Product Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Detail of the Product to be removed are below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Product ID
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="ProductId"
                          type="text"
                          value={delId}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Product Name
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="ProductName"
                          type="text"
                          value={delName}
                          readOnly
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          StoreHouse
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="StoreHouse"
                          type="text"
                          value={delStoreHouse}
                          readOnly
                        />
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="flex-1 mr-1">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Amount
                          </label>
                          <input
                            value={delAmount}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="amount"
                            type="number"
                            readOnly
                          />
                        </div>
                        <div className="flex-1 mr-1">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Unit
                          </label>
                          <input
                            value={delUnit}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="Unit"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

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
                        Delete Product
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>
    </div>
  );
}

export default ProductDel;
