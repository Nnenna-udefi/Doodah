// CartPopup.js
import React from 'react';
import { Link } from 'react-router-dom';
import './cart.scss'

const CartPopup = () => {
  return (
    <div className="cart-popup">
      <p>Item has been added to cart</p>
      <div className="buttons">
        <Link to="/cart" className="view-cart-button">
          View Cart
        </Link>
        <Link to="/payment" className="checkout-button">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
