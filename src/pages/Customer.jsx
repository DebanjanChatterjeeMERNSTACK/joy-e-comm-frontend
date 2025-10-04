import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_URL;

export default function Customer() {
  const navigate=useNavigate()
  const [customers, setcustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingcustomer, setEditingcustomer] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletecustomer, setDeletecustomer] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    gstNumber: "",
    phoneNumber: "",
    address: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages ,settotalPages]=useState(1)
  // Calculate total pages
  // const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${URL}/get_customer?search=${search}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
      
      if (data.data) {
        setcustomers(data.data);
        setTotalItems(data.total || 0);
        settotalPages(data.totalPages)
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      Swal.fire({
        title: "Error fetching customers",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when page/search changes
  useEffect(() => {
    fetchData();
  }, [currentPage, search]); // Refetch when page or search changes

  // Open dialog for Add/Edit
  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingcustomer(customer);
      setFormData(customer);
    } else {
      setEditingcustomer(null);
      setFormData({
        companyName: "",
        email: "",
        gstNumber: "",
        phoneNumber: "",
        address: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Save customer
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      if (editingcustomer) {
        // Edit existing customer
        const response = await fetch(`${URL}/upadata_customer/${editingcustomer._id || editingcustomer.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.mess === "success") {
          Swal.fire({
            title: data.text || "customer updated successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          fetchData(); // Refresh data
        } else {
          Swal.fire({
            title: data.text || "Failed to update customer",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else {
        // Add new customer
        const response = await fetch(`${URL}/add_customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.mess === "success") {
          Swal.fire({
            title: data.text || "customer added successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
          fetchData(); // Refresh data
        } else {
          Swal.fire({
            title: data.text || "Failed to add customer",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      Swal.fire({
        title: "Failed to save customer",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const confirmDelete = (customer) => {
    setDeletecustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  // Delete customer
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/delete_customer/${deletecustomer._id || deletecustomer.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.mess === "success") {
        Swal.fire({
          title: data.text || "customer deleted successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
        fetchData(); // Refresh data
      } else {
        Swal.fire({
          title: data.text || "Failed to delete customer",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      Swal.fire({
        title: "Failed to delete customer",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeletecustomer(null);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle search change - reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Customer Management</h1>
        {/* <button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          disabled={isLoading}
        >
          <Plus size={18} /> Add customer
        </button> */}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Customer name..."
        value={search}
        onChange={handleSearchChange}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline focus:ring focus:border-indigo-500"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading customers...</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#432DD7] text-white">
                <tr>
                  <th className="px-4 py-2">Store Name</th>
                  <th className="px-4 py-2">Customer Name</th>
                  <th className="px-4 py-2">Email</th>
                
                  <th className="px-4 py-2">Phone Number</th>
                  <th className="px-4 py-2">Address</th>
                  {/* <th className="px-4 py-2 text-center">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, idx) => (
                    <tr key={customer._id || customer.id || idx} className="border-t border-gray-200">
                       <td className="px-4 py-2">{customer?.adminId?.storeName}</td>
                      <td className="px-4 py-2">{customer.customerName}</td>
                      <td className="px-4 py-2">{customer.email}</td>
                     
                      <td className="px-4 py-2">{customer.phoneNumber}</td>
                      <td className="px-4 py-2">{customer.address}</td>
                      {/* <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenDialog(customer)}
                          className="p-2 text-blue-600 bg-blue-200 hover:bg-blue-100 rounded-full"
                          disabled={isLoading}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(customer)}
                          className="p-2 text-red-600 bg-red-200 hover:bg-red-100 rounded-full"
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-gray-600 font-bold"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700 font-bold">
                Page {currentPage} of {totalPages || 1} (Total: {totalItems} customers)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 border bg-[#312B8A] text-white rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 border bg-[#312B8A] text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingcustomer ? "Edit customer" : "Add customer"}
            </h2>
            <div className="space-y-3">
              {[
                { key: "companyName", label: "Company Name" },
                { key: "email", label: "Email", type: "email" },
                { key: "gstNumber", label: "GST Number" },
                { key: "phoneNumber", label: "Phone Number", type: "tel" },
                { key: "address", label: "Address" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.label}
                    value={formData[field.key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline focus:ring focus:border-indigo-500"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletecustomer?.companyName}</span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}