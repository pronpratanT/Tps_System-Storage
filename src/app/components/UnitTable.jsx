"use client";

import { useState, useEffect, Fragment } from "react";
import {
  Edit,
  Search,
  Trash2,
  HeartHandshake,
  User,
  Ruler,
  Package,
} from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { indigo } from "@mui/material/colors";
import { Dialog, Transition } from "@headlessui/react";
import UnitEdit from "./UnitEdit";
import UnitDel from "./UnitDel";

export default function UnitTable(session, children) {
  //? session

  //? State
  const [unitId, setUnitId] = useState("");
  const [unitName, setUnitName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  //TODO < Function to fetch units to table >
  const getUnits = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/Unit", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Vendor");
      }

      const newUnits = await res_get.json();

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

  //TODO <Function Search Unit Id
  const filterUnitsByID = (units, searchID) => {
    if (!searchID) return units; // Return all units if searchID is empty

    // Filter unique units based on searchID
    const filteredUnits = units.filter(
      (unit, index, self) =>
        unit.unitId.toLowerCase().includes(searchID.toLowerCase()) &&
        index === self.findIndex((t) => t.unitId === unit.unitId)
    );

    return filterUnitsByID;
  };

  //TODO < Function Get Unit by Id send to UnitEdit >
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    getUnits();
  };

  const getUnitById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/Unit/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Unit");
      }

      const data = await res_byid.json();
      return data.unit; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Unit:", error);
    }
  };

  const getValue = async (id) => {
    try {
      const unit = await getUnitById(id);
      setSelectedUnit(unit); // Set the selected unit
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to get unit:", error);
    }
  };

  //TODO < Function Add Unit >
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    getUnits();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!unitId || !unitName) {
      setError("Please complete Unit details!");
      return;
    }

    try {
      const resCheckUnit = await fetch(
        "http://localhost:3000/api/checkUnit",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ unitId }),
        }
      );
      const { unit } = await resCheckUnit.json();
      if (unit) {
        setError("Unit ID already exists!");
        return;
      }

      //* Add Unit to DB
      const res_add = await fetch("http://localhost:3000/api/Unit", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ unitId, unitName }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add Unit");
      }

      setError("");
      setSuccess("Unit has been added successfully!");
      getUnits();

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setUnitId("");
        setUnitName("");
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add unit");
    }
  };

  //TODO < Function Delete Unit >
  const getDelById = async (id) => {
    try {
      const res_byid = await fetch(`http://localhost:3000/api/Unit/${id}`, {
        cache: "no-store",
      });

      if (!res_byid.ok) {
        throw new Error("Failed to fetch Unit");
      }

      const data = await res_byid.json();
      return data.unit; // Ensure you return the correct data structure
    } catch (error) {
      console.error("Failed to fetch Unit:", error);
    }
  };

  const getDelValue = async (id) => {
    try {
      const unit = await getDelById(id);
      setSelectedUnit(unit);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to get unit:", error);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-6 space-x-5">
        {/* //? Stat */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="text-lg font-semibold text-gray-600 my-1">Users</div>
          <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
            <User size={32} />
            <span className="text-2xl font-bold">12</span>{" "}
          </div>
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="text-lg font-semibold text-gray-600 my-1">Units</div>
          <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
            <Ruler size={32} />
            <span className="text-2xl font-bold">{units.length}</span>{" "}
          </div>
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="text-lg font-semibold text-gray-600 my-1">
            Products
          </div>
          <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
            <Package size={32} />
            <span className="text-2xl font-bold">12</span>{" "}
          </div>
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
          <div className="text-lg font-semibold text-gray-600 my-1">
            Vendors
          </div>
          <div className="flex items-center space-x-2 text-2xl font-bold text-indigo-800">
            <HeartHandshake size={32} />
            <span className="text-2xl font-bold">
              {/* {vendors.length} */}
            </span>{" "}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold leading-6 text-gray-800 py-3">
            กำหนดรหัสหน่วยนับสินค้า
          </h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 hover:border-indigo-800 overflow-hidden max-w-2xl w-full font-[sans-serif]">
              <input
                type="text"
                placeholder="Search Unit ID..."
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
              <Ruler size={20} className="mr-2" />
              Add Unit
            </button>
          </div>

          {/* //? Table */}
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 pr-4 pl-20 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left rounded-tl-md w-2/6">
                  Unit ID
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left w-3/6">
                  Unit Name
                </th>
                <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filterUnitsByID(units, searchID).map((unit) => (
                <tr key={unit.unitId} className="border-t">
                  <td className="py-4 pr-4 pl-20 flex items-center w-auto">
                    <Avatar
                      sx={{ bgcolor: indigo[800], marginRight: "20px" }}
                      variant="rounded-md"
                    >
                      {unit.unitId.charAt(0).toUpperCase()}
                    </Avatar>
                    {unit.unitId}
                  </td>
                  <td className="py-4 px-4">{unit.unitName}</td>
                  <td className="py-4 px-4 text-center flex justify-center items-center space-x-2">
                    <button
                      onClick={() => getValue(unit._id)}
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={23} />
                    </button>
                    <button
                      onClick={() => getDelValue(unit._id)}
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
                      Add Unit Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Unit below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Unit ID
                        </label>
                        <input
                          onChange={(e) => setUnitId(e.target.value)}
                          value={unitId}
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
                          Unit Name
                        </label>
                        <input
                          onChange={(e) => setUnitName(e.target.value)}
                          value={unitName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
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
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 w-full"
                      >
                        Add Unit
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        </Dialog>
      </Transition>

      {/* // TODO : Edit Unit Modal */}
      <UnitEdit
        isVisible={isEditModalOpen}
        onClose={handleEditModalClose}
        unit={selectedUnit}
        refreshUnits={getUnits}
      />

      {/* // TODO : Delete Unit Modal */}
      <UnitDel
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        unit={selectedUnit}
        refreshUnits={getUnits}
      />
    </div>
  );
}
