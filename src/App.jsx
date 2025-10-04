import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Protected from "./utils/Protected";
import VendorPage from "./pages/Vendor";
import PurchaseInvoice from "./pages/PurchaseInvoice";
import PurchaseInvoiceList from "./pages/PurchaseInvoiceList";
import Product from "./pages/Product";
import SellInvoice from "./pages/SellInvoice";
import SellInvoiceList from "./pages/SellInvoiceList";
import Customer from "./pages/Customer";
import Store from "./pages/Store";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<Protected allowedRoles={["admin", "ceo"]} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
          </Route>
        </Route>

        <Route element={<Protected allowedRoles={["admin"]} />}>
          <Route path="/" element={<Layout />}>
            <Route path="vendor" element={<VendorPage />} />
            <Route path="purchase_invoice" element={<PurchaseInvoice />} />
            <Route
              path="purchase_invoice_list"
              element={<PurchaseInvoiceList />}
            />
            <Route path="product" element={<Product />} />
            <Route path="sell_invoice" element={<SellInvoice />} />
            <Route path="sell_invoice_list" element={<SellInvoiceList />} />
            <Route path="customer" element={<Customer />} />
          </Route>
        </Route>

        {/* CEO Routes */}
        <Route element={<Protected allowedRoles={["ceo"]} />}>
          <Route path="/" element={<Layout />}>
            {/* <Route index element={<DashboardPage />} /> */}
            <Route path="store" element={<Store />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
