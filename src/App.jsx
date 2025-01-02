import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./page/auth/Login";
import AppLayout from "./ui/AppLayout";
import { NavBarItemProvider } from "./context/NavBarItemContext";
import AccountList from "./page/account/AccountList";
import CategoryList from "./page/category/CategoryList";
import ManufacturerList from "./page/manufacturer/ManufacturerList";
import OrderList from "./page/order/OrderList";
import EditProduct from "./page/product/EditProduct";
import ProductList from "./page/product/ProductList";
import AddProduct from "./page/product/AddProduct";
import AdminProfile from "./page/profile/AdminProfile";
import RevenueReport from "./page/report/RevenueReport";
import TopRevenueProduct from "./page/report/TopRevenueProduct";
// import { AuthProvider } from "./hook/useAuth";

function App() {
  return (
        <BrowserRouter>
          <NavBarItemProvider>
            <Routes>
              {/* Trang login không có NavBar */}
              {/* <Route path="/" element={<LogIn />} /> */}

              {/* Các route có AppLayout và NavBar */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<AccountList />} />
                <Route path="/manufacturer" element={<ManufacturerList />} />
                <Route path="/category" element={<CategoryList />} />
                <Route path="/order" element={<OrderList />} />
                <Route path="/product" element={<ProductList />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/admin-profile" element={<AdminProfile />} />
                <Route path="/revenue-product" element={<RevenueReport />} />
                <Route path="/top-revenue-product" element={<TopRevenueProduct />} />


              </Route>
            </Routes>
          </NavBarItemProvider>
        </BrowserRouter>
  );
}


export default App
