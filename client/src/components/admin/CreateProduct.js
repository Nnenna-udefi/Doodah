import React, { useState } from 'react';
import './admin.scss';
import { useToken } from '../context/tokenContext';

const CreateProduct = () => {
    const { token } = useToken();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        brand: '',
        stock_quantity: 0,
        photo1: null,
        photo2: null,
        photo3: null,
        reviews: [],
        label: 'popular',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
          }));
    };

    const handlePhotoChange = (e) => {
        const { name, files } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: files[0],
          }));
        
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('brand', product.brand);
        formData.append('stock_quantity', product.stock_quantity);
        formData.append('label', product.label);
        formData.append('photo1', product.photo1);
        formData.append('photo2', product.photo2);
        formData.append('photo3', product.photo3);
       
        const headers = {
            'Authorization': token,
        };
        console.log('headers', headers)
    
        const response = await fetch('http://localhost:4000/api/products/add', {
            method: 'POST',
            headers,
            body: formData,
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log('Product added successfully', data);
            window.alert('Product added successfully');
        } else {
            console.error('Error adding product:', response.statusText)
        }

        // Clear form data after submit
        setProduct({
            name: '',
            description: '',
            price: 0,
            brand: '',
            stock_quantity: 0,
            photo1: null,
            photo2: null,
            photo3: null,
            reviews: [],
            label: '',
        });
    };

    return (
        <div className='dashboard'>
            
        <form onSubmit={handleSubmit}>
            <h1>Add Products</h1>
            <label htmlFor='name'>Product name:</label><br />
            <input type='text' name='name' value={product.name} onChange={handleInputChange} required/><br />

            <label htmlFor='description'>Product Description</label><br />
            <textarea name='description' value={product.description} onChange={handleInputChange} required/><br />

            <label htmlFor='price'>Price:</label><br />
            <input type='number' name='price' value={product.price} onChange={handleInputChange} required/><br />


            <label htmlFor='brand'>Brand Name:</label><br />
            <input type='text' name='brand' value={product.brand} onChange={handleInputChange} /><br />

            <label htmlFor='stock_quantity'>Number of Items in stock:</label><br />
            <input type='number' name='stock_quantity' value={product.stock_quantity} onChange={handleInputChange} required/><br />

            <label htmlFor="photo1">Product Photo 1:</label>
            <br />
            <input type="file" name="photo1" accept="image/*" onChange={handlePhotoChange} required/>
            <br />

            <label htmlFor="photo2">Product Photo 2:</label>
            <br />
            <input type="file" name="photo2" accept="image/*" onChange={handlePhotoChange} />
            <br />

            
            <label htmlFor="label">Label:</label>
            {/* <br /> */}
            {/* <input type="text" name="label" value={product.label} onChange={handleInputChange} /> */}
            <select
                className="label-select"
                name="label"
                value={product.label}
                onChange={handleInputChange}
                required
                >
                <option >popular</option>
                <option >hot</option>
                <option >regular</option>
                </select>
            <br />

            <button type='submit' className='submit'>Add Product</button>
        </form>
        </div>  
    )
}

export default CreateProduct;