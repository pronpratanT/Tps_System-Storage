import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const UnitEdit = ({ isVisible, onClose, unit, refreshUnits }) => {
  const [newUnitId, setNewUnitId] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (unit) {
      setNewUnitId(unit.unitId);
      setNewUnitName(unit.unitName);
    }
  }, [unit]);

  // TODO : Check update duplicate Unit
  const checkDuplicateUnitId = async (newUnitId, currentUnitId) => {
    try {
      const res = await fetch("/api/Unit");
      const units = await res.json();

      // Check if newUnitId already exists in the units list, excluding the current unit
      return units.some(
        (unit) => unit.unitId === newUnitId && unit._id !== currentUnitId
      );
    } catch (error) {
      console.error("Error checking duplicate unit ID:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUnitId || !newUnitName) {
      setError("Please complete Unit details!");
      return;
    }

    //? Check for duplicate Unit Id
    const isDuplicate = await checkDuplicateUnitId(newUnitId, unit?._id || "");
    if (isDuplicate) {
      setError("Unit ID already exists!");
      return;
    }

    try {
      //? Update Unit
      const res = await fetch(
        `/api/Unit/${unit?._id || ""}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newUnitId,
            newUnitName,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update Unit");
      }

      setError("");
      setSuccess("Unit has been updated successfully!");

      setTimeout(() => {
        onClose(); // Close the modal after successful update
        setSuccess("");
        refreshUnits(); // Refresh the unit list
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to update unit");
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
                    Update Unit Form
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the details of the Unit below.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="unitId"
                      >
                        Unit ID
                      </label>
                      <input
                        onChange={(e) => setNewUnitId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="unitId"
                        type="text"
                        value={newUnitId}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="unitName"
                      >
                        Unit Name
                      </label>
                      <input
                        onChange={(e) => setNewUnitName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="unitName"
                        type="text"
                        value={newUnitName}
                      />
                    </div>
                  </div>

                  {/* TODO: Error & Success */}
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
                      Update Unit
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
};

export default UnitEdit;
