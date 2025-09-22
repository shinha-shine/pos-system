import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from "./pages/Homepage.js";
import ItemPage from "./pages/ItemPage.js";
import CartPage from './pages/CartPage.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import BillPage from './pages/BillPage.js';
import CustomerPage from './pages/CustomerPage.js';
import SettingPage from './pages/SettingPage';
import HelpCenter from './pages/HelpCenter';
import OrderPage from './pages/OrderPage.js';
import CashierPage from './pages/CashierPage.js';

import 'antd/dist/reset.css';

function App() {
  

  return (
      <BrowserRouter>
        <Routes>
 {/* Default route goes to login */}
          <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
         
          

          {/* Routes accessible by customer only */}
          <Route path="/dashboard" element={
            <RoleBasedRoute allowedRoles={['customer','cashier', 'admin']}>
              <Homepage />
            </RoleBasedRoute>
          } />

          <Route path="/cashier" element={
            <RoleBasedRoute allowedRoles={['cashier', 'admin']}>
              <CashierPage />
            </RoleBasedRoute>
          } />

          <Route path="/help" element={
            <RoleBasedRoute allowedRoles={['customer', 'cashier', 'admin']}>
              <HelpCenter />
            </RoleBasedRoute>
          } />

          {/* Routes accessible by cashier only */}
          <Route path="/customer" element={
            <RoleBasedRoute allowedRoles={['cashier', 'admin']}>
              <CustomerPage />
            </RoleBasedRoute>
          } />
          <Route path="/order" element={
          <RoleBasedRoute allowedRoles={['admin','cashier','customer']}>
            <OrderPage />
          </RoleBasedRoute>
        } />


          <Route path="/cart" element={
            <RoleBasedRoute allowedRoles={['customer','cashier', 'admin']}>
              <CartPage />
            </RoleBasedRoute>
          } />

          {/* Routes accessible by admin only */}
          <Route path="/items" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <ItemPage />
            </RoleBasedRoute>
          } />

          <Route path="/bills" element={
            <RoleBasedRoute allowedRoles={['cashier','admin']}>
              <BillPage />
            </RoleBasedRoute>
          } />

          <Route path="/setting" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <SettingPage />
            </RoleBasedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;

// New RoleBasedRoute component
export function RoleBasedRoute({ children, allowedRoles }) {
  const authDataString = localStorage.getItem('auth');
  if (!authDataString) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(authDataString);
  } catch (err) {
    // Corrupt auth data
    localStorage.removeItem('auth');
    return <Navigate to="/login" replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    // Unauthorized role, redirect to homepage or login
    // You can redirect to a "not authorized" page if you want
    return <Navigate to="/" replace />;
  }

  return children;
}

