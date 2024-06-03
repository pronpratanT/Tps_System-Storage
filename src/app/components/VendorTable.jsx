import { useState, useEffect, Fragment } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

function VendorTable() {
  const router = useRouter();

  //! < Add Vendor session >

  //? vendor db state
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //TODO modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  //TODO PUT Vendor by button click
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId || !vendorName) {
      setError("Please complete Vendor details!");
      return;
    }

    try {
      const res_add = await fetch("http://localhost:3000/api/addVendor", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ vendorId, vendorName }),
      });

      if (!res_add.ok) {
        throw new Error("Failed to add vendor");
      }

      setError("");
      setSuccess("Vendor has been added successfully!");

      setTimeout(() => {
        closeAddModal();
        setSuccess("");
        setVendorId("");
        setVendorName("");
        // getVendors(); // Refresh the vendor list
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Failed to add vendor");
    }
  };

  //! < Add Vendor session />

  //! < Get Vendor session />

  //? Vendor db state
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  //TODO Vendor count page
  const ITEMS_PER_PAGE = 5;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentVendors = vendors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  //TODO GET Vendor
  const getVendors = async () => {
    try {
      const res_get = await fetch("http://localhost:3000/api/addVendor", {
        cache: "no-store",
      });

      if (!res_get.ok) {
        throw new Error("Failed to fetch Vendor");
      }
      const data = await res_get.json();
      setVendors(data); // Set the vendors data directly
    } catch (error) {
      console.log("Error loading Vendors: ", error);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  //! < Get Vendor session />

  const [searchID, setSearchID] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    title: "",
    email: "",
    role: "",
    total: "",
  });
  const [userList, setUserList] = useState([]);

  const filteredUsers = searchID
    ? userList.filter((user) =>
        user.title.toLowerCase().includes(searchID.toLowerCase())
      )
    : userList;

  const [selectedUser, setSelectedUser] = useState(null);
  const [localUser, setLocalUser] = useState(selectedUser || {});

  useEffect(() => {
    setLocalUser(selectedUser || {});
  }, [selectedUser]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    const updatedUserList = userList.map((user) =>
      user === selectedUser ? localUser : user
    );
    setUserList(updatedUserList);
    closeEditModal();
  };

  const handleDeleteUser = () => {
    setUserList((prev) => prev.filter((user) => user !== selectedUser));
    closeDeleteModal();
  };

  return (
    <div className="flex-1 p-4">
      <div>
        <div className="flex justify-between items-center mb-6 space-x-5">
          <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <div className="text-lg font-semibold text-gray-600">
              Total Product
            </div>
            <div className="text-2xl font-bold text-[#8146FF]">total user</div>
          </div>
          <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <div className="text-lg font-bold">Avg. Open Rate</div>
            <div className="text-2xl font-bold text-green-500">
              58.16% <span className="text-sm text-green-500">▲ 5.4%</span>
            </div>
            <a href="#" className="text-indigo-600 hover:underline">
              View all
            </a>
          </div>
          <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <div className="text-lg font-bold">Avg. Click Rate</div>
            <div className="text-2xl font-bold text-red-500">
              24.57% <span className="text-sm text-red-500">▼ 3.2%</span>
            </div>
            <a href="#" className="text-indigo-600 hover:underline">
              View all
            </a>
          </div>
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
                  placeholder="Search Something..."
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
                <UserPlus size={20} className="mr-2" />
                Add User
              </button>
            </div>
            {/* Table */}
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tl-md">
                    Vendor ID
                  </th>
                  <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-left">
                    Vendor Name
                  </th>
                  <th className="py-3 px-4 bg-[#FAFAFA] text-[#5F6868] font-bold uppercase text-sm text-center rounded-tr-md">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVendors.map((vendor) => (
                  <tr key={vendor.vendorId} className="border-t">
                    <td className="py-4 px-4 text-center">{vendor.vendorId}</td>
                    <td className="py-4 px-4 flex items-center">
                      <Avatar
                        sx={{ bgcolor: deepOrange[500], marginRight: "20px" }}
                        variant="rounded-md"
                      >
                        {vendor.vendorName.charAt(0).toUpperCase()}
                      </Avatar>
                      {vendor.vendorName}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit size={23} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(vendor)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 size={23} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={handleNextPage}
                className="bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*TODO: Add Modal */}
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
                      Add Vendor Form
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add the details of the Vendor below.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          Vendor ID
                        </label>
                        <input
                          onChange={(e) => setVendorId(e.target.value)}
                          value={vendorId}
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
                          Vendor Name
                        </label>
                        <input
                          onChange={(e) => setVendorName(e.target.value)}
                          value={vendorName}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
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
                        Add Vendor
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

export default VendorTable;
