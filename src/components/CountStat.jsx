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
        (user, index, self) =>
          index === self.findIndex((t) => t.email === user.email)
      );
      const sortedUsers = uniqueUsers.sort((a, b) =>
        a.email.localeCompare(b.email)
      );
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
        (unit, index, self) =>
          index === self.findIndex((t) => t.unitId === unit.unitId)
      );
      const sortedUnits = uniqueUnits.sort((a, b) =>
        a.unitId.localeCompare(b.unitId)
      );
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
        (product, index, self) =>
          index === self.findIndex((t) => t.productId === product.productId)
      );
      const sortedProducts = uniqueProducts.sort((a, b) =>
        a.productId.localeCompare(b.productId)
      );
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
        (vendor, index, self) =>
          index === self.findIndex((t) => t.vendorId === vendor.vendorId)
      );
      const sortedVendors = uniqueVendors.sort((a, b) =>
        a.vendorId.localeCompare(b.vendorId)
      );
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
  }, [refresh, shouldRefresh]);

  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-indigo-600">
            {users.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">Users</div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <User size={100} className="text-indigo-500" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-pink-600">
            {units.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">Units</div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <Ruler size={100} className="text-pink-500" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-orange-600">
            {products.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">
            Products
          </div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <Package size={100} className="text-orange-500" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden flex items-center">
        <div className="flex flex-col items-start relative z-10">
          <span className="text-4xl font-bold text-blue-600">
            {vendors.length}
          </span>
          <div className="text-lg font-semibold text-gray-600 mt-1">
            Vendors
          </div>
        </div>
        <div className="absolute right-4 inset-y-0 flex items-center justify-center opacity-10">
          <HeartHandshake size={100} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
}

export default CountStat;
