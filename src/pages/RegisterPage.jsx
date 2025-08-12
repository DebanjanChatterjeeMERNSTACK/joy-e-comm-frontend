import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { Link } from "react-router-dom";
const URL = import.meta.env.VITE_URL;
const paymentKey = import.meta.env.VITE_PAYMENT_KEY;
export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "admin",
    adminName: "",
    email: "",
    password: "",
    phoneNumber: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: null,
    panImage: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "aadharImage" || name === "panImage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Admin Name validation
    if (!formData.adminName.trim()) {
      newErrors.adminName = "Admin Name Is Required";
    } else if (formData.adminName.length < 3) {
      newErrors.adminName = "Admin Name Should Be At Least 3 Characters";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.adminName)) {
      newErrors.adminName = "Admin Name Must Be Alphanumeric";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email Is Required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid Email Address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password Is Required";
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number Is Required";
    } else if (!/^[6-9]{1}[0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Invalid Phone Number (10 digits starting with 6-9)";
    }

    // Aadhar validation
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar Number Is Required";
    }

    // PAN validation
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN Number Is Required";
    }

    // Document validation
    if (!formData.aadharImage) {
      newErrors.aadharImage = "Aadhar Image Is Required";
    }
    if (!formData.panImage) {
      newErrors.panImage = "PAN Image Is Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerdata = async (paymentVerificationData) => {
    console.log(paymentVerificationData);
    try {
      const formPayload = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formPayload.append(key, value);
        }
      });

      // Append payment verification data
      formPayload.append(
        "razorpay_payment_id",
        paymentVerificationData.razorpay_paymentID
      );
      formPayload.append(
        "razorpay_order_id",
        paymentVerificationData.razorpay_orderID
      );
      formPayload.append(
        "razorpay_signature",
        paymentVerificationData.razorpay_signature
      );

      const response = await fetch(`${URL}/admin_register`, {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();

      if (result.mess === "success") {
        setIsLoading(false);
        Swal.fire({
          title: result.text,
          icon: result.mess,
          confirmButtonText: "Continue to Login",
        }).then(() => {
          navigate("/login");
        });
      } else {
        setIsLoading(false);
        Swal.fire({
          title: result.text,
          icon: result.mess,
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRazorpay = async (data) => {
    setIsLoading(false);
    const options = {
      key: paymentKey,
      amount: Number(data.amount),
      currency: data.currency,
      order_id: data.id,
      name: "E-COMMERCE", //
      description: "The shop fast", //
      handler: async function (response) {
        const verificationResponse = await fetch(
          `${URL}/admin_register_verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_paymentID: response.razorpay_payment_id,
              razorpay_orderID: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              email: formData.email,
            }),
          }
        );

        const result = await verificationResponse.json();

        if (result.mess === "success") {
          registerdata(result.data);
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      },
      prefill: {
        name: formData.adminName,
        email: formData.email,
        contact: formData.phoneNumber,
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        // Simulate API call
        const regResponse = await fetch(`${URL}/admin_register_payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 100,
          }),
        });
        const regData = await regResponse.json();
        console.log(regData);
        if (regData.mess === "success") {
          handleOpenRazorpay(regData.data);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Admin Registration
            </h1>
            <p className="text-indigo-100 mt-1">
              Fill in your details to create an account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Role (hidden) */}
            <input type="hidden" name="role" value="admin" />

            {/* Admin Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="adminName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Admin Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="adminName"
                  required
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.adminName
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="John Doe"
                />
              </div>
              {errors.adminName && (
                <p className="mt-1 text-sm text-red-500">{errors.adminName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Aadhar Number */}
            <div>
              <label
                htmlFor="aadharNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Aadhar Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="aadharNumber"
                  required
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.aadharNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="1234 5678 9012"
                />
              </div>
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.aadharNumber}
                </p>
              )}
            </div>

            {/* PAN Number */}
            <div>
              <label
                htmlFor="panNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                PAN Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="panNumber"
                  required
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.panNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="ABCDE1234F"
                  maxLength="10"
                />
              </div>
              {errors.panNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.panNumber}</p>
              )}
            </div>

            {/* Aadhar Image */}
            <div>
              <label
                htmlFor="aadharImage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Aadhar Card Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="aadharImage"
                  required
                  name="aadharImage"
                  onChange={handleChange}
                  accept="image/*"
                  className={`block w-full rounded-lg border ${
                    errors.aadharImage
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-gray-200`}
                />
              </div>
              {errors.aadharImage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.aadharImage}
                </p>
              )}
              {formData.aadharImage && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {formData.aadharImage.name}
                </p>
              )}
            </div>

            {/* PAN Image */}
            <div>
              <label
                htmlFor="panImage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                PAN Card Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="panImage"
                  required
                  name="panImage"
                  onChange={handleChange}
                  accept="image/*"
                  className={`block w-full rounded-lg border ${
                    errors.panImage
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-600 dark:file:text-gray-200`}
                />
              </div>
              {errors.panImage && (
                <p className="mt-1 text-sm text-red-500">{errors.panImage}</p>
              )}
              {formData.panImage && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {formData.panImage.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Wait For Few Sec...
                  </>
                ) : (
                  "Pay Now - 100/-"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="md:col-span-2 text-center mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to={"/login"}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Login here
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
