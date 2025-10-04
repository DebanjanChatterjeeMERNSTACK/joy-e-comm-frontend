import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Eye, ScrollText } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SellInvoicePDF from "../components/SellInvoicePDF";

const URL = import.meta.env.VITE_URL;

export default function SellInvoiceList() {
  const navigate = useNavigate();
  const [sellinvoice, setsellinvoice] = useState([]);
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletesellinvoices, setDeletesellinvoices] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, settotalPages] = useState(1);
  // Calculate total pages
  // const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleOpenDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  // Fetch data function
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${URL}/get_customerinvoice?search=${search}&page=${currentPage}&limit=${itemsPerPage}&startDate=${startDate}&endDate=${endDate}`,
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
        setsellinvoice(data.data);
        setTotalItems(data.total || 0);
        settotalPages(data.totalPages);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      Swal.fire({
        title: "Error fetching invoice",
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

  // Save sellinvoices

  const confirmDelete = (sellinvoices) => {
    setDeletesellinvoices(sellinvoices);
    setIsDeleteDialogOpen(true);
  };

  // Delete sellinvoices
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${URL}/delete_sellinvoices/${
          deletesellinvoices._id || deletesellinvoices.id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.mess === "success") {
        Swal.fire({
          title: data.text || "sellinvoices deleted successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
        fetchData(); // Refresh data
      } else {
        Swal.fire({
          title: data.text || "Failed to delete sellinvoices",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error deleting sellinvoices:", error);
      Swal.fire({
        title: "Failed to delete sellinvoices",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeletesellinvoices(null);
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
        <h1 className="text-xl font-bold">Sell Invoice List</h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 my-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by Customer name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline focus:ring focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline focus:ring focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline focus:ring focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading Sell...</p>
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
                  <th className="px-4 py-2">Invoice No.</th>
                  <th className="px-4 py-2">Invoice Date</th>
                  <th className="px-4 py-2">Customer Name</th>

                  <th className="px-4 py-2">Phone Number</th>

                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellinvoice.length > 0 ? (
                  sellinvoice.map((sellinvoices, idx) => (
                    <tr
                      key={sellinvoices._id || sellinvoices.id || idx}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2">
                        {sellinvoices?.adminId?.storeName}
                      </td>
                      <td className="px-4 py-2">
                        {sellinvoices.invoiceNumber}
                      </td>
                      <td className="px-4 py-2">{`${new Date(
                        sellinvoices.invoiceDate
                      ).toLocaleDateString("en-GB")}`}</td>
                      <td className="px-4 py-2">{sellinvoices.customerName}</td>

                      <td className="px-4 py-2">{sellinvoices.phoneNumber}</td>

                      <td className="px-4 py-2">{sellinvoices.address}</td>
                      <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenDialog(sellinvoices)}
                          className="p-2 text-green-600 bg-green-200 hover:bg-green-100 rounded-full"
                        >
                          <Eye size={16} />
                        </button>
                        <PDFDownloadLink
                          document={<SellInvoicePDF invoice={sellinvoices} />}
                          fileName={`SellInvoice-${sellinvoices.invoiceNumber}.pdf`}
                        >
                          {({ loading }) => (
                            <button className="p-2 text-blue-600 bg-blue-200 hover:bg-blue-100 rounded-full">
                              {loading ? "..." : <ScrollText size={16} />}
                            </button>
                          )}
                        </PDFDownloadLink>
                        {/* <button
                          onClick={() => handleOpenDialog(sellinvoices)}
                          className="p-2 text-blue-600 bg-blue-200 hover:bg-blue-100 rounded-full"
                        >
                          <Pencil size={16} />
                        </button> */}
                        {/* <button
                          onClick={() => confirmDelete(sellinvoices)}
                          className="p-2 text-red-600 bg-red-200 hover:bg-red-100 rounded-full"
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-6 text-center text-gray-600 font-bold"
                    >
                      No Sell invoice found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sellinvoice.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700 font-bold">
                Page {currentPage} of {totalPages || 1} (Total: {totalItems}{" "}
                Invoice)
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
                  disabled={
                    currentPage === totalPages || totalPages === 0 || isLoading
                  }
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

      {isViewDialogOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              Invoice Details - {selectedInvoice.invoiceNumber}
            </h2>

            {/* sellinvoices Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p>
                  <span className="font-semibold">Customer Name:</span>{" "}
                  {selectedInvoice.customerName}
                </p>
                <p>
                  <span className="font-semibold">Phone Number:</span>{" "}
                  {selectedInvoice.phoneNumber}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {selectedInvoice.address}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Store: </span>{" "}
                  {selectedInvoice?.adminId?.storeName}
                </p>
                <p>
                  <span className="font-semibold">Invoice Date: </span>
                  {new Date(selectedInvoice.invoiceDate).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <p>
                  <span className="font-semibold">Email: </span>
                  {selectedInvoice.email}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border border-gray-300 rounded">
                <thead className="bg-indigo-600 text-white text-sm">
                  <tr>
                    <th className="px-3 py-2 border border-gray-300">
                      Product
                    </th>
                    <th className="px-3 py-2 border border-gray-300">Units</th>
                    <th className="px-3 py-2 border border-gray-300">Qty</th>
                    <th className="px-3 py-2 border border-gray-300">
                      Sell Price
                    </th>
                    <th className="px-3 py-2 border border-gray-300">GST %</th>
                    <th className="px-3 py-2 border border-gray-300">
                      Tax Amt
                    </th>
                    <th className="px-3 py-2 border border-gray-300">
                      Discount
                    </th>
                    <th className="px-3 py-2 border border-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.item.length > 0 ? (
                    selectedInvoice.item?.map((item, idx) => (
                      <tr key={idx} className="text-sm">
                        <td className="px-3 py-2 border border-gray-300">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.units}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.sellPrice}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.gst}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.taxAmount}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.discount}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          {item.amount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-gray-600 font-bold"
                      >
                        No Sell invoice found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t pt-4 space-y-2">
              <p>
                <span className="font-semibold">Total Tax Amount:</span>{" "}
                {selectedInvoice?.totalTaxAmount}
              </p>
              <p>
                <span className="font-semibold">Total Discount Amount:</span>{" "}
                {selectedInvoice?.totalDiscountAmount}
              </p>
              <p>
                <span className="font-semibold">Transport Charge:</span>{" "}
                {selectedInvoice?.transportCharge}
              </p>
              <p>
                <span className="font-semibold">Round Off:</span>{" "}
                {selectedInvoice?.roundOff}
              </p>
              <p className="text-lg font-bold">
                <span className="text-indigo-600"> Grand Total: </span>
                {selectedInvoice?.grandTotal}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
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
              <span className="font-semibold">
                {deletesellinvoices?.companyName}
              </span>
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
