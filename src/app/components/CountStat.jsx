import { useState, useEffect } from "react";
import { HeartHandshake, User, Ruler, Package } from "lucide-react";

function CountStat({ refresh, shouldRefresh }) {
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const getUsers = async () => {
    try {
      const res_get = await fetch("/api/User", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch User");
      const newUsers = await res_get.json();
      const uniqueUsers = newUsers.filter(
        (user, index, self) => index === self.findIndex((t) => t.email === user.email)
      );
      const sortedUsers = uniqueUsers.sort((a, b) => a.email.localeCompare(b.email));
      setUsers(sortedUsers);
    } catch (error) {
      console.log("Error loading Users: ", error);
    }
  };

  const getUnits = async () => {
    try {
      const res_get = await fetch("/api/Unit", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Units");
      const newUnits = await res_get.json();
      const uniqueUnits = newUnits.filter(
        (unit, index, self) => index === self.findIndex((t) => t.unitId === unit.unitId)
      );
      const sortedUnits = uniqueUnits.sort((a, b) => a.unitId.localeCompare(b.unitId));
      setUnits(sortedUnits);
    } catch (error) {
      console.log("Error loading Units: ", error);
    }
  };

  const getProducts = async () => {
    try {
      const res_get = await fetch("/api/Product", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Product");
      const newProducts = await res_get.json();
      const uniqueProducts = newProducts.filter(
        (product, index, self) => index === self.findIndex((t) => t.productId === product.productId)
      );
      const sortedProducts = uniqueProducts.sort((a, b) => a.productId.localeCompare(b.productId));
      setProducts(sortedProducts);
    } catch (error) {
      console.log("Error loading Products: ", error);
    }
  };

  const getVendors = async () => {
    try {
      const res_get = await fetch("/api/addVendor", { cache: "no-store" });
      if (!res_get.ok) throw new Error("Failed to fetch Vendor");
      const newVendors = await res_get.json();
      const uniqueVendors = newVendors.filter(
        (vendor, index, self) => index === self.findIndex((t) => t.vendorId === vendor.vendorId)
      );
      const sortedVendors = uniqueVendors.sort((a, b) => a.vendorId.localeCompare(b.vendorId));
      setVendors(sortedVendors);
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  useEffect(() => {
    getUsers();
    getUnits();
    getProducts();
    getVendors();
  }, [refresh, shouldRefresh ]);

  return (
    <div className="flex justify-between items-center mb-6 space-x-5">
      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Users</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <User size={32} />
          <span className="text-2xl font-bold">{users.length}</span>
        </div>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Units</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <Ruler size={32} />
          <span className="text-2xl font-bold">{units.length}</span>
        </div>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Products</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <Package size={32} />
          <span className="text-2xl font-bold">{products.length}</span>
        </div>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <div className="text-lg font-semibold text-gray-600 my-1">Vendors</div>
        <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
          <HeartHandshake size={32} />
          <span className="text-2xl font-bold">{vendors.length}</span>
        </div>
      </div>
    </div>
  );
}

export default CountStat;
