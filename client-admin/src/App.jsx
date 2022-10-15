import { useState } from "react";
import "./assets/styles/tailwind.css";
import LoginPage from "./Page/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminAuthContextProvider from "./context/AdminAuthContext";
import AdminHome from "./Page/Home/Home";
import AddPartner from "./Page/AddPartner/AddPartner";
import PrivateRoutes from "./components/PrivateRoutes";
import EditPartner from "./Page/EditPartner/EditPartner";
function App() {
  return (
    <AdminAuthContextProvider>
      <BrowserRouter>
        <Routes>
        
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="/admin" element={<AdminHome />}></Route>
            <Route path="/admin/partners/add" element={<AddPartner />}></Route>
            <Route path="/admin/partners/edit/:id" element={<EditPartner />}></Route>
          </Route>
          <Route path="/admin/login" element={<LoginPage />}></Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthContextProvider>
  );
}

export default App;
