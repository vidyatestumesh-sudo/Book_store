import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import AboutAuthorPage from "../pages/AboutAuthorPage/AboutAuthorPage";
import Publications from "../pages/publications/Publications";
import LetterFromLangshott from "../pages/letters/letter-from-langshott";
import ManageLetters from "../pages/dashboard/manageLetters/ManageLetters";
import BlogsPage from "../pages/blogs/BlogsPage";
import AddBlogs from "../pages/dashboard/manageblogs/AddBlogs";
import BlogDetailPage from "../pages/blogs/BlogDetailPage";
import AdminOrderPage from "../pages/dashboard/orders/AdminOrderPage";
import BillingDownload from "../pages/dashboard/billing-download/BillingDownload";
import InventoryPage from "../pages/dashboard/inventory/InventoryPage";
import Contact from "../pages/contact/contact";
import AdminBanner from "../pages/dashboard/CMS module/AdminBanner";
import CMSModule from "../pages/dashboard/CMS module/CMSModule";
import AdminReaderThoughts from "../pages/dashboard/CMS module/AdminReaderThoughts";
import AdminAuthorEdit from "../pages/dashboard/CMS module/AdminAuthorEdit";
import InspirationBoard from "../pages/blogs/inspirationboard/inspirationboard";
import AdminCorners from "../pages/dashboard/CMS module/AdminCorners";
import SufiCornerpage from "../pages/SufiCorner/SufiCornerpage";
import Foundation from "../pages/Foundation/Foundation";
import AdminSufiCorner from "../pages/dashboard/CMS module/AdminSufiCorner";
import AdminInspirationBoard from "../pages/dashboard/manageInspiration/InspirationBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/contact", element: <Contact /> },
      { path: "/inspiration-board", element: <InspirationBoard /> },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      { path: "/aboutauthorpage", element: <AboutAuthorPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/books/:id", element: <SingleBook /> },
      {
        path: "/user-dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      { path: "/blogs", element: <BlogsPage /> },
      { path: "/blogs/:id", element: <BlogDetailPage /> },
      { path: "/publications", element: <Publications /> },
      { path: "/letters", element: <LetterFromLangshott /> },
      { path: "/sufi-corner", element: <SufiCornerpage /> },
      { path: "/foundation", element: <Foundation /> },
      { path: "/admin-sufi-corner", element: <AdminSufiCorner /> },
    ],
  },
  { path: "/admin", element: <AdminLogin /> },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <AdminRoute><Dashboard /></AdminRoute> },
      { path: "manage-books", element: <AdminRoute><ManageBooks /></AdminRoute> },
      { path: "manage-letters", element: <AdminRoute><ManageLetters /></AdminRoute> },
      { path: "add-blogs", element: <AdminRoute><AddBlogs /></AdminRoute> },
      { path: "orders", element: <AdminRoute><AdminOrderPage /></AdminRoute> },
      { path: "billing-download", element: <AdminRoute><BillingDownload /></AdminRoute> },
      { path: "inventory", element: <AdminRoute><InventoryPage /></AdminRoute> },
      { path: "cms", element: <AdminRoute><CMSModule /></AdminRoute> },
      { path: "admin-Banner", element: <AdminRoute><AdminBanner /></AdminRoute> },
      { path: "reader-thoughts", element: <AdminRoute><AdminReaderThoughts /></AdminRoute> },
      { path: "edit-author", element: <AdminRoute><AdminAuthorEdit /></AdminRoute> },
      { path: "admin-corners", element: <AdminRoute><AdminCorners /></AdminRoute> },
      { path: "admin-sufi-corner", element: <AdminRoute><AdminSufiCorner /></AdminRoute> },
      { path: "manage-inspiration", element: <AdminRoute><AdminInspirationBoard /></AdminRoute> },
    ],
  },
]);

// 🚨 Monkey patch: force hard reload on every navigation
const originalNavigate = router.navigate;
router.navigate = (...args) => {
  const to = args[0];
  if (typeof to === "string") {
    window.location.replace(to); // faster, skips history push overhead
  } else if (to && to.pathname) {
    window.location.replace(to.pathname);
  } else {
    originalNavigate(...args);
  }
};


export default router;
