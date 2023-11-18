import React, {useEffect, useState} from 'react';
import { useToken } from '../context/tokenContext';
import { useParams } from 'react-router-dom';
import './layout.scss'

const EditProduct = () => {
  const { token } = useToken();
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    price: 0,
    brand: '',
    stock_quantity: 0,
    label: 'popular',
    photo1: '',
    photo2: '',
    photo3: '',
    images: []
  });
    
    // const [imagePreviews, setImagePreviews] = useState();
    const { productId } = useParams();
    

    useEffect(() => {
      async function fetchProductDetails() {
        try {
          const response = await fetch(`http://localhost:4000/api/products/${productId}`);
          if (!response.ok) {
            console.error('API response does not indicate success');
            return;
          }
    
          const data = await response.json();
          console.log('Data:', data);
    
          // Check if data.product.images is an array and has at least three items
          const images = data.product.images;
          const photo1 = images && images.length > 0 ? images[0] : '';
          const photo2 = images && images.length > 1 ? images[1] : '';
          const photo3 = images && images.length > 2 ? images[2] : '';
    
          // Set the state of the form inputs to the product details
          setEditedProduct({
            ...data.product,
            photo1,
            photo2,
            photo3,
          });
        } catch (error) {
          console.error('Error fetching product', error);
        }
      }
    
      fetchProductDetails();
    }, [productId]);
    
    
      console.log('Edited product', editedProduct);


      const handleInputChange = (e) => {
        if (e.target) {
            const { name, value } = e.target;
            setEditedProduct({
                ...editedProduct,
                [name]: value,
            });
        }
    };

    if (editedProduct) {
        console.log('Edited product', editedProduct);
      } else {
        console.log('Edited product is undefined');
      }
      

    const handlePhotoChange = (e) => {
        const { name, files } = e.target;
        const reader = new FileReader();

        reader.onload = (event) => {
            setEditedProduct({
                ...editedProduct,
                [name]: event.target.result,
            });
        };

        if (files[0]) {
            reader.readAsDataURL(files[0]);
        }
    };

      const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editedProduct) {
            return;
        }

        const formData = new FormData();
        formData.append('name', editedProduct.name);
        formData.append('description', editedProduct.description);
        formData.append('price', editedProduct.price);
        formData.append('brand', editedProduct.brand);
        formData.append('stock_quantity', editedProduct.stock_quantity);
        formData.append('label', editedProduct.label);

        if (editedProduct.photo1) {
          formData.append('photo1', editedProduct.photo1);
        }

        if (editedProduct.photo2) {
          formData.append('photo2', editedProduct.photo2);
        }

        if (editedProduct.photo3) {
          formData.append('photo3', editedProduct.photo3);
        }

        console.log('modified edited product:', editedProduct)
        const headers = {
          'Authorization': token,
      };
      console.log('headers', headers)

        try {
            
            const response = await fetch(`http://localhost:4000/api/products/update/${productId}`,{
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(editedProduct),
            })
            
            if (response.ok) {
                console.log('Product updated successfully');
                window.alert('Product Updated Successfully')
            } else {
                console.error('Error updating product:', response.statusText)
            }
        } catch (error) {
            console.error('Error updating products', error);
        }
      }
    return (
        <div className='editedForm'>
            <form onSubmit={handleEditSubmit}>
            <label htmlFor='name'>Product name:</label><br />
            <input type='text' name='name' value={editedProduct?.name} onChange={handleInputChange} required/><br />

            <label htmlFor='description'>Product Description</label><br />
            <textarea name='description' value={editedProduct?.description} onChange={handleInputChange} required/><br />

            <label htmlFor='price'>Price:</label><br />
            <input type='number' name='price' value={editedProduct?.price} onChange={handleInputChange} required/><br />


            <label htmlFor='brand'>Brand Name:</label><br />
            <input type='text' name='brand' value={editedProduct?.brand} onChange={handleInputChange} /><br />

            <label htmlFor='stock_quantity'>Number of Items in stock:</label><br />
            <input type='number' name='stock_quantity' value={editedProduct?.stock_quantity} onChange={handleInputChange} required/><br />
 
            <label htmlFor="photo1">Product Photo 1:</label>
            <br />
            <input type="file" name="photo1" accept="image/*" onChange={handlePhotoChange} required/>
            {editedProduct.photo1 && editedProduct.photo1 !== 'null' && (
                <img src={editedProduct.photo1} alt="preview" style={{ maxWidth: '200px' }} />
            )}
            <br />

            <label htmlFor="photo2">Product Photo 2:</label>
            <br />
            <input type="file" name="photo2" accept="image/*" onChange={handlePhotoChange} />
            {editedProduct.photo2 && editedProduct.photo2 !== 'null' && (
                <img src={editedProduct.photo2} alt='preview' style={{ maxWidth: '200px' }} />
            )}
            <br />

            <label htmlFor="photo3">Product Photo 3:</label>
            <br />
            <input type="file" name="photo3" accept="image/*" onChange={handlePhotoChange} />
            {editedProduct.photo3 && editedProduct.photo3 !== 'null' && (
                <img src={editedProduct.photo3} alt='preview' style={{ maxWidth: '200px' }} />
            )} 
            <br />
            
            <label htmlFor="label">Label:</label>
            {/* <br /> */}
            {/* <input type="text" name="label" value={product.label} onChange={handleInputChange} /> */}
            <select
                className="label-select"
                name="label"
                value={editedProduct?.label}
                onChange={handleInputChange}
                required
                >
                <option >popular</option>
                <option >hot</option>
                <option >regular</option>
                </select>
            <br />
            {/* Other input fields for brand, stock quantity, price, etc. */}
            <button type="submit">Save Changes</button>
            </form>

        </div>
    )
}
export default EditProduct;