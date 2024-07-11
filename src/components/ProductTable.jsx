"use client";

import { useState, useEffect, Fragment } from "react";
import {
  Edit,
  Search,
  Trash2,
  Package,
  Filter,
  Check,
  AlertTriangle,
} from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo, orange, teal } from "@mui/material/colors";
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
  const [brand, setBrand] = useState("");
  const [amount, setAmount] = useState("0");
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
  const [searchType, setSearchType] = useState("productId");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  //TODO < Function to fetch units to table >
  const getUnits = async () => {
    try {
      const resGetUnit = await fetch("/api/Unit", {
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

  //! Table Fetch Data
  //? <Function Search Document Id / Date Export
  const filterData = (products, searchTerm, searchType) => {
    if (!searchTerm) return products; // Return all products if searchTerm is empty
    return products.filter((product) => {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      if (searchType === "productId") {
        return product.productId.toLowerCase().includes(lowercaseSearchTerm);
      } else if (searchType === "productName") {
        return product.productName.toLowerCase().includes(lowercaseSearchTerm);
      }
      return false;
    });
  };
  //? Filter Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (isFilterDropdownOpen && !event.target.closest(".filter-dropdown")) {
        setIsFilterDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterDropdownOpen]);
  //? <Function Search Document Id / Date Export >

  //? Sorted Data Table
  const sortExportsByDate = (exports) => {
    return exports.sort((a, b) => {
      const dateA = parse(a.dateExport, "yyyy-MM-dd", new Date());
      const dateB = parse(b.dateExport, "yyyy-MM-dd", new Date());
      return compareAsc(dateA, dateB);
    });
  };
  //! Table Fetch Data >

  //TODO < Function Get Product by Id send to ProductEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getProducts();
  };

  const getProductById = async (id) => {
    try {
      const res_byid = await fetch(`/api/Product/${id}`, {
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
    if (isSubmitting) return;

    if (!productId || !productName || !productUnit || !storeHouse || !amount) {
      setError("Please complete Product details!");
      return;
    }

    setIsSubmitting(true);

    try {
      const resCheckProduct = await fetch("/api/checkProduct", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const { product } = await resCheckProduct.json();
      if (product) {
        setError("Product ID already exists!");
        return;
      }

      //* Add Product to DB
      const res_add = await fetch("/api/Product", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          productUnit,
          brand,
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
        setBrand("");
        setAmount("");
        setRefresh(!refresh);
        setError("");
      }, 1500);
    } catch (error) {
      console.log(error);
      setError("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO < Function Delete Product >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`/api/Product/${id}`, {
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
            <div className="flex items-center max-w-2xl w-full">
              <div className="flex items-center px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden w-full font-[sans-serif] relative">
                <Search size={16} className="text-gray-600 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${
                    searchType === "productId" ? "Product ID" : "Product Name"
                  }...`}
                  className="w-full outline-none bg-transparent text-gray-600 text-sm"
                  value={searchID}
                  onChange={(event) => setSearchID(event.target.value)}
                />
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full border-2 border-gray-200"
                >
                  <Filter size={16} className="text-gray-600" />
                </button>
                {isFilterDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 filter-dropdown">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => {
                          setSearchType("productId");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Product ID
                        {searchType === "productId" && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSearchType("productName");
                          setIsFilterDropdownOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                      >
                        Product Name
                        {searchType === "productName" && (
                          <Check size={16} className="text-indigo-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                <th className="py-3 pr-4 pl-10 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-3/12">
                  Product ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-4/12">
                  Product Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  Brand
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  Unit
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-1/12">
                  WareHouse
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
              {filterData(products, searchID, searchType).map((product) => (
                <tr key={product.productId} className="border-t">
                  <td className="py-4 pr-4 pl-10 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: teal[400], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {product.productId.charAt(0).toUpperCase()}
                    </Avatar>
                    {product.productId}
                  </td>
                  <td className="py-4 px-4">{product.productName}</td>
                  <td className="py-4 px-4">{product.brand}</td>
                  <td className="py-4 px-4">{product.productUnit}</td>
                  <td className="py-4 px-4">{product.storeHouse}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      {Number(product.amount) <= 10 && (
                        <AlertTriangle
                          size={18}
                          strokeWidth={2.5}
                          className={
                            Number(product.amount) === 0
                              ? "text-red-500"
                              : "text-yellow-500"
                          }
                        />
                      )}
                      <span
                        className={
                          Number(product.amount) === 0
                            ? "text-red-500 font-bold"
                            : Number(product.amount) <= 10
                            ? "text-yellow-500 font-bold"
                            : ""
                        }
                      >
                        {product.amount}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => getValue(product._id)}
                        type="button"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => getDelValue(product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
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
                          Brand
                        </label>
                        <input
                          onChange={(e) => setBrand(e.target.value)}
                          value={brand}
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
                            min="0"
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add Product"}
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
