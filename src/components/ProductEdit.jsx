import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function ProductEdit({ isVisible, onClose, product, refreshProducts }) {
  const [newProductId, setNewProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [newStoreHouse, setNewStoreHouse] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (product) {
      setNewProductId(product.productId);
      setNewProductName(product.productName);
      setNewProductUnit(product.productUnit);
      setNewStoreHouse(product.storeHouse);
      setNewAmount(product.amount);
    }
  }, [product]);

  const checkDuplicateProductId = async (newProductId, currentProductId) => {
    try {
      const res = await fetch("/api/Product");
      const products = await res.json();
      return products.some(
        (product) =>
          product.productId === newProductId && product._id !== currentProductId
      );
    } catch (error) {
      console.error("Error checking duplicate product ID:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newProductId ||
      !newProductName ||
      !newProductUnit ||
      !newStoreHouse ||
      !newAmount
    ) {
      setError("Please complete Product details!");
      return;
    }

    const isDuplicate = await checkDuplicateProductId(
      newProductId,
      product?._id || ""
    );
    if (isDuplicate) {
      setError("Product ID already exists!");
      return;
    }

    try {
      const res = await fetch(
        `/api/Product/${product?._id || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newProductId,
            newProductName,
            newProductUnit,
            newStoreHouse,
            newAmount,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update Product");
      }

      setError("");
      setSuccess("Product has been updated successfully!");

      setTimeout(() => {
        onClose();
        setSuccess("");
        refreshProducts();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update product");
    }
  };

  const getUnits = async () => {
    try {
      const resGetUnit = await fetch("/api/Unit", {
        cache: "no-store",
      });

      if (!resGetUnit.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const newUnits = await resGetUnit.json();

      const uniqueUnits = newUnits.filter(
        (unit, index, self) =>
          index === self.findIndex((t) => t.unitId === unit.unitId)
      );

      const sortedUnits = uniqueUnits.sort((a, b) =>
        a.unitId.localeCompare(b.unitId)
      );

      setUnits(sortedUnits);
      console.log(sortedUnits);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  useEffect(() => {
    getUnits();
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Product Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the details of the Product below.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Product ID
                      </label>
                      <input
                        onChange={(e) => setNewProductId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={newProductId}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Product Name
                      </label>
                      <input
                        onChange={(e) => setNewProductName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={newProductName}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        StoreHouse
                      </label>
                      <input
                        onChange={(e) => setNewStoreHouse(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={newStoreHouse}
                      />
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="flex-1 mr-1">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Amount
                        </label>
                        <input
                          onChange={(e) => setNewAmount(e.target.value)}
                          value={newAmount}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="amount"
                          type="number"
                        />
                      </div>
                      <div className="flex-1 ml-1">
                        <div className="mb-2">
                          <label
                            htmlFor="unit"
                            className="block text-gray-700 text-sm font-bold"
                          >
                            Unit
                          </label>
                        </div>
                        <select
                          id="unit"
                          value={newProductUnit}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            const selectedText =
                              e.target.selectedOptions[0].text;
                            setNewProductUnit(
                              selectedValue === "" ? "" : selectedText
                            );
                          }}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select a unit</option>
                          {units.map((unit) => (
                            <option key={unit.unitId} value={unit.unitName}>
                              {unit.unitName}
                            </option>
                          ))}
                        </select>
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 w-full"
                    >
                      Update Product
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

export default ProductEdit;
