import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import Products from './components/products/Products';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/SignUp';
import './app.scss';
import initFontAwesome from './fontAwesome';
import Payment from './components/payment/Payment';
import Cart from './components/cart/Carts';
import Account from './components/myaccount/Account';
import ProductDetails from './components/products/ProductDetails'
import { CartProvider } from './components/context/CartContext';
import { AuthProvider } from './components/context/AuthContext';
import CreateProduct from './components/admin/CreateProduct';
// import AdminRouteGuard from './components/RouteGuard';
import AdminLayout from './components/admin/AdminLayout.js';
import { TokenProvider } from './components/context/tokenContext';
import EditProduct from './components/admin/EditProduct';
import PriceRange from './components/products/ProductsByPriceRange';

initFontAwesome();

function App() {

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <TokenProvider>
          <Header />
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/products' element={<Products />} exact/>
            <Route path='/products/price' element={<PriceRange />} />
            <Route path='/products/:productId' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/my-account' element={<Account />} />

            <Route path='/admin/add-product' element={<CreateProduct />} />
            <Route path='/admin' element={<AdminLayout />} />
            <Route path="/admin/edit-product/:productId" element={<EditProduct />} />
            {/* <Route path='/admin' element={<AdminRouteGuard><AdminLayout /></AdminRouteGuard>} /> */}

          </Routes>
          {/* Render the Footer only if isAdmin is false */}
          {/* {!isAdmin && <Footer />} */}

        </TokenProvider>
        
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
