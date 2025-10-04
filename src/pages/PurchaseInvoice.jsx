import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const URL = import.meta.env.VITE_URL;

export default function PurchaseInvoice() {
  const navigate = useNavigate();
  const [vendor, setVendors] = useState([]);
  const [units, setUnits] = useState([
    { name: "box" },
    { name: "liter" },
    { name: "kg" },
  ]);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date(),
    companyName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gstNumber: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [transportCharge, setTransportCharge] = useState(0);

  const [items, setItems] = useState([
    {
      productName: "",
      units: "",
      quantity: 0,
      purchasePrice: 0,
      gst: 0,
      taxAmount: 0,
      discountPercent: 0,
      discount: 0,
      amount: 0,
    },
  ]);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Convert to numbers for calculation
    const qty = parseFloat(newItems[index].quantity) || 0;
    const price = parseFloat(newItems[index].purchasePrice) || 0;
    const gst = parseFloat(newItems[index].gst) || 0;
    const discountPercent = parseFloat(newItems[index].discountPercent) || 0;

    const base = qty * price;
    const taxAmount = (base * gst) / 100;
    const discount = (base * discountPercent) / 100;
    const amount = base + taxAmount - discount;

    newItems[index].taxAmount = taxAmount.toFixed(2);
    newItems[index].discount = discount.toFixed(2);
    newItems[index].amount = amount.toFixed(2);

    setItems(newItems);
  };

  // ✅ Add new row
  const handleAdd = () => {
    setItems([
      ...items,
      {
        productName: "",
        units: "",
        quantity: 0,
        purchasePrice: 0,
        gst: 0,
        taxAmount: 0,
        discountPercent: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  // ✅ Delete row
  const handleDelete = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  // const fetchUnits = async () => {
  //   try {
  //     const response = await fetch(`${URL}/units`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       setUnits(data.data); // assume API returns [{_id:"1", name:"KG"}, ...]
  //     }
  //   } catch (error) {
  //     console.error("Error fetching units:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchUnits();
  // }, []);

  const fetchData = async () => {
    try {
      if (!formData.companyName) {
        setVendors([]);
        return;
      }

      const response = await fetch(
        `${URL}/vendor_search?search=${formData.companyName}`,
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
        setVendors(data.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      Swal.fire({
        title: "Error fetching vendors",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400); // debounce to avoid too many API calls
    return () => clearTimeout(delayDebounce);
  }, [formData.companyName]);

  const VendorhandleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "companyName") {
      setShowSuggestions(true);
    }
  };

  const handleSelectVendor = (vendorData) => {
    setFormData({
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      companyName: vendorData.companyName,
      phoneNumber: vendorData.phoneNumber,
      email: vendorData.email,
      address: vendorData.address,
      gstNumber: vendorData.gstNumber,
    });
    setShowSuggestions(false);
  };

  const totalTax = items.reduce(
    (sum, i) => sum + parseFloat(i.taxAmount || 0),
    0
  );
  const totalDiscount = items.reduce(
    (sum, i) => sum + parseFloat(i.discount || 0),
    0
  );
  const grandTotal =
    items.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0) +
    parseFloat(transportCharge || 0);

  const roundOff = Math.round(grandTotal) - grandTotal;

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Construct payload
    const payload = {
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      companyName: formData.companyName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      gstNumber: formData.gstNumber,
      item: items.map((item) => ({
        productName: item.productName.toUpperCase(),
        units: item.units,
        quantity: parseFloat(item.quantity) || 0,
        purchesPrice: parseFloat(item.purchasePrice) || 0,
        gst: parseFloat(item.gst) || 0,
        taxAmount: parseFloat(item.taxAmount) || 0,
        discountPercent: parseFloat(item.discountPercent) || 0,
        discount: parseFloat(item.discount) || 0,
        amount: parseFloat(item.amount) || 0,
      })),
      totalTaxAmount: parseFloat(totalTax.toFixed(2)),
      totalDiscountAmount: parseFloat(totalDiscount.toFixed(2)),
      transportCharge: parseFloat(transportCharge) || 0,
      roundOff: parseFloat(roundOff.toFixed(2)),
      grandTotal: parseFloat((grandTotal + roundOff).toFixed(2)),
    };

    console.log("🚀 Final Payload:", payload);

    // ✅ Send to backend
    fetch(`${URL}/add_purchaseinvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.mess==="success") {
          Swal.fire("Success", "Invoice Saved!", "success");
          // navigate("/purchase-invoice-list");
        } else {
          Swal.fire("Error", data.message || "Something went wrong", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to save invoice", "error");
      });
  };

  return (
    <div className="max-w-8xl p-5 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">Purchase Invoice</h1>
      <form
        onSubmit={handleSubmit}
        // className="grid grid-cols-1 md:grid-cols-3 gap-4 relative"
      >
        {/* Company Name with suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative mb-2">
          <input
            type="text"
            name="invoiceNumber"
            placeholder="Invoice Number"
            value={formData.invoiceNumber}
            onChange={VendorhandleChange}
            required={true}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 col-span-1 md:col-span-2"
          />
          <input
            type="date"
            name="invoiceDate"
            placeholder="Invoice Date"
            value={formData.invoiceDate}
            onChange={VendorhandleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 col-span-1 md:col-span-1"
            required={true}
          />
          <div className="relative col-span-1">
            <input
              type="text"
              name="companyName"
              placeholder="Search Vendor"
              value={formData.companyName}
              onChange={VendorhandleChange}
              onFocus={() => setShowSuggestions(true)}
              required={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            />
            {showSuggestions && vendor.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {vendor.map((v, idx) => {
                  console.log(v); // 👈 log each vendor object here
                  return (
                    <li
                      key={idx}
                      onClick={() => handleSelectVendor(v)}
                      className="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                    >
                      {v.companyName}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Phone Number */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={VendorhandleChange}
            disabled={true}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={VendorhandleChange}
            disabled={true}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={VendorhandleChange}
            disabled={true}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500 col-span-1 md:col-span-2"
          />

          {/* GST Number */}
          <input
            type="text"
            name="gstNumber"
            placeholder="GST Number"
            value={formData.gstNumber}
            onChange={VendorhandleChange}
            disabled={true}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />
        </div>

        <div className="">
          <table className="min-w-full  bg-white rounded-lg ">
            <thead className="bg-indigo-600 text-white ">
              <tr className="text-sm">
                <th className="px-1 py-2 text-center border border-gray-300">
                  Product Name
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Units
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Quantity
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Purchase Price
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  GST
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Tax Amount
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Discount %
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Discount
                </th>
                <th className="px-1 py-2 text-center border border-gray-300">
                  Amount
                </th>
                <th className="px-1 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="text"
                      value={v.productName}
                      onChange={(e) =>
                        handleChange(idx, "productName", e.target.value)
                      }
                      required={true}
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-2 py-2  border border-gray-300 ">
                    <select
                      value={v.units}
                      onChange={(e) =>
                        handleChange(idx, "units", e.target.value)
                      }
                      required={true}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Select Unit</option>
                      {units.map((u, id) => (
                        <option key={id} value={u.name}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.quantity}
                      onChange={(e) =>
                        handleChange(idx, "quantity", e.target.value)
                      }
                      required={true}
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.purchasePrice}
                      onChange={(e) =>
                        handleChange(idx, "purchasePrice", e.target.value)
                      }
                      required={true}
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.gst}
                      onChange={(e) => handleChange(idx, "gst", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.taxAmount}
                      onChange={(e) =>
                        handleChange(idx, "taxAmount", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.discountPercent}
                      onChange={(e) =>
                        handleChange(idx, "discountPercent", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.discount}
                      onChange={(e) =>
                        handleChange(idx, "discount", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-2 border border-gray-300">
                    <input
                      type="number"
                      value={v.amount}
                      onChange={(e) =>
                        handleChange(idx, "amount", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 "
                    />
                  </td>
                  <td className="px-1 py-4 flex justify-center border-r border-b border-gray-300 gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Plus />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ✅ Summary Footer */}
        <div className="mt-6 p-4  space-y-3">
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium text-indigo-600">Total Tax Amount:</span>
            <span className="font-semibold">{totalTax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium text-indigo-600">Total Discount:</span>
            <span className="font-semibold">{totalDiscount.toFixed(2)}</span>
          </div>
         
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium text-indigo-600">Transport Charges:</span>
            <input
              type="number"
              value={transportCharge}
              onChange={(e) => setTransportCharge(e.target.value)}
              className="w-32 border border-gray-300 rounded px-2 py-1 "
            />
          </div>
        
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium text-indigo-600">Round Off:</span>
            <span className="font-semibold">{roundOff.toFixed(2)}</span>
          </div>
        
          <div className="flex justify-end items-center gap-2 text-lg">
            <span className="font-bold">Grand Total:</span>
            <span className="font-bold text-indigo-600">
              {(grandTotal + roundOff).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-end text-lg">
            <button
              type="submit"
              class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[10px] bg-gradient-to-t from-[#4F39F6] to-[#4F39F6] active:scale-95"
            >
              <span class="w-full h-full flex items-center gap-2 px-6 py-1 bg-[#4F39F6] text-white rounded-[10px] bg-gradient-to-t from-[#4F39F6] to-[#4F39F6]">
                Save Invoice
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
