import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ForgotPasswordPage from "./pages/ForgetpasswordPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetpasswordPage";
import DashboardPage from "./pages/DashboardPage";
import Protected from "./utils/Protected";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgetpassword" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:id" element={<ResetPasswordPage />} />
          <Route element={<Protected allowedRoles={["admin","superadmin"]} />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Layout/> */}
    </>
  );
};

export default App;
