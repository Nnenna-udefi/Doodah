import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './layout.scss'
import { useToken } from '../context/tokenContext';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const { token } = useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products/');
        if (!response.ok) {
          console.error('API response does not indicate success');
          return;
        }
  
        const data = await response.json();
  
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
  
    fetchData();
  }, []);

  const truncateName = (name) => {
    const words = name.split(' ');
    if (words.length > 4) {
        return words.slice(0, 3).join(' ') + '...';
    }
    return name;
  }

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:4000/api/products/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response.ok) {
        // If the deletion was successful, update the product list in the frontend
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        window.alert('Product deleted successfully')
      } else {
        console.error('Failed to delete the product');
      }
    })
    .catch((error) => {
      console.error('Error deleting the product', error);
    });
  }
  return (
    <div className='container-fluid'>

      <div className="admin-welcome">
        {user ? (
          <h2>Welcome, {user.firstname} (Admin) </h2>
        ) : (
          <h2>Welcome, Admin</h2>
        )}
            <Link to='/admin/add-product' className='active'>
              Create Product
            </Link>
        </div>

      <div className="product-table">
        <h3>Available Products</h3>
        <table className='product-list'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Stock Quantity</th>
              <th>Price</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{truncateName(product.name)}</td>
                <td>{product.brand}</td>
                <td>{product.stock_quantity}</td>
                <td>₦{product.price}</td>
                <td>
                  <Link to={`/admin/edit-product/${product._id}`}>Edit</Link>
                </td>
                <td>
                  <button className='delete-btn' onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
};

export default AdminLayout;