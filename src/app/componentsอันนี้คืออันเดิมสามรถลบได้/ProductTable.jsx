"use client";

import { useState, useEffect, Fragment } from "react";
import { Edit, Search, Trash2, Package } from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import ProductEdit from "./ProductEdit";
import ProductDel from "./ProductDel";
import CountStat from "./CountStat";

export default function ProductTable() {
  //? State
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [storeHouse, setStoreHouse] = useState("");
  const [amount, setAmount] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [units, setUnits] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  //TODO < Function to fetch product to table >
  const getProducts = async () => {
    try {
      const res_get = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Product", {
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

  //TODO < Function to fetch units to table >
  const getUnits = async () => {
    try {
      const resGetUnit = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Unit", {
        cache: "no-store",
      });

      if (!resGetUnit.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const newUnits = await resGetUnit.json();

      // Check for duplicates
      const uniqueUnits = newUnits.filter(
        (unit, index, self) =>
          index === self.findIndex((t) => t.unitId === unit.unitId)
      );

      // Sort units by vendorId in alphabetical order
      const sortedUnits = uniqueUnits.sort((a, b) =>
        a.unitId.localeCompare(b.unitId)
      );

      setUnits(sortedUnits);
      console.log(sortedUnits);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  //? Reload Units table
  useEffect(() => {
    getUnits();
  }, []);

  //TODO <Function Search Product Id
  const filterProductsByID = (products, searchID) => {
    if (!searchID) return products; // Return all products if searchID is empty

    // Filter unique products based on searchID
    const filteredProducts = products.filter(
      (product, index, self) =>
        product.productId.toLowerCase().includes(searchID.toLowerCase()) &&
        index === self.findIndex((t) => t.productId === product.productId)
    );

    return filteredProducts;
  };

  //TODO < Function Get Product by Id send to ProductEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getProducts();
  };

  const getProductById = async (id) => {
    try {
      const res_byid = await fetch(`https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Product/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Product");
      }

      const data = await res_byid.json();
      return data.product; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Product:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const product = await getProductById(id);
      setSelectedProduct(product); // Set the selected product
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to get product:", error);
    }
  };

  //TODO < Function Add Product >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getProducts();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !productName || !productUnit || !storeHouse || !amount) {
      setError("Please complete Product details!");
      return;
    }

    try {
      const resCheckProduct = await fetch(
        "https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/checkProduct",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );
      const { product } = await resCheckProduct.json();
      if (product) {
        setError("Unit ID already exists!");
        return;
      }

      //* Add Product to DB
      const res_add = await fetch("https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Product", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          productUnit,
          storeHouse,
          amount,
        }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add Product");
      }

      setError("");
      setSuccess("Product has been added successfully!");
      getProducts();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setProductId("");
        setProductName("");
        setProductUnit("");
        setStoreHouse("");
        setAmount("");
        setRefresh(!refresh);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add product");
    }
  };

  //TODO < Function Delete Product >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`https://tps-system-storage-nmjpypynm-pronpratants-projects.vercel.app/api/Product/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Product");
      }

      const data = await res_byid.json();
      return data.product; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Product:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const product = await getDelById(id);
      setSelectedProduct(product);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get product:", error);
    }
  };

  const handleRefresh = () => {
    setShouldRefresh(!shouldRefresh);
  };

  return (
    <div className="flex-1 p-4">
      <div>
        <CountStat refresh={refresh} shouldRefresh={shouldRefresh} />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
            กำหนดรหัสสินค้า
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden max-w-2xl w-full font-[sans-serif]">
              <input
                type="text"
                placeholder="Search Product ID..."
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
              <Package size={20} className="mr-2" />
              Add Product
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-20 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-3/12">
                  Product ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-4/12">
                  Product Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  Unit
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  StoreHouse
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-right w-1/12">
                  Amount
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterProductsByID(products, searchID).map((product) => (
                <tr key={product.productId} className="border-t">
                  <td className="py-4 pr-4 pl-20 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: indigo[800], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {product.productId.charAt(0).toUpperCase()}
                    </Avatar>
                    {product.productId}
                  </td>
                  <td className="py-4 px-4">{product.productName}</td>
                  <td className="py-4 px-4">{product.productUnit}</td>
                  <td className="py-4 px-4">{product.storeHouse}</td>
                  <td className="py-4 px-4 text-right">{product.amount}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(product._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(product._id)}
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
                      Add Product Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Product below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Product ID
                        </label>
                        <input
                          onChange={(e) => setProductId(e.target.value)}
                          value={productId}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Product Name
                        </label>
                        <input
                          onChange={(e) => setProductName(e.target.value)}
                          value={productName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          StoreHouse
                        </label>
                        <input
                          onChange={(e) => setStoreHouse(e.target.value)}
                          value={storeHouse}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="flex-1 mr-1">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="amount"
                          >
                            Amount
                          </label>
                          <input
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
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
                            onChange={(e) =>
                              setProductUnit(e.target.selectedOptions[0].text)
                            }
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
                        Add Product
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
      <ProductEdit
        isVisible={isEditModalOpen}
        onClose={handleEditModalClose}
        product={selectedProduct}
        refreshProducts={getProducts}
      />

      {/* // TODO : Delete Product Modal */}
      <ProductDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        refreshProducts={getProducts}
        refreshCount={handleRefresh}
      />
    </div>
  );
}
