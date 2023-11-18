import './details.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faStar, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import { useContext, useState, useEffect } from 'react';
import CartPopup from '../cart/CartPopup';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';


const ProductDetails = () => {
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const { isLoggedIn } = useContext(AuthContext);
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    
    
    useEffect(() => {
        // Fetch product data based on the productId
        fetch(`http://localhost:4000/api/products/${productId}`)
          .then((response) => response.json())
          .then((data) => setProduct(data))
          .catch((error) => console.error('Error fetching product', error));
      }, [productId]);

      if (!product) {
        return <div>Loading...</div>;
      }


    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert('Please log in before adding to cart.');
            return;
        }
        
        const selectedItem = {
            productId: product._id,
            img: product.images[1], 
            name: product.name,
            price: product.price,
            quantity,
            details: product.details,
          };
            setShowPopup(true);
          addToCart(selectedItem);
        }

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const truncateName = (name) => {
        const words = name.split(' ');
        if (words.length > 3) {
            return words.slice(0, 14).join(' ') + '...';
        }
        return name;
    }

    return(
        <div className='productDetails'>
            {showPopup && <CartPopup />}
            <div className='product-block'>
            <img src={product.images[1]} alt='product preview' />
                <div className='details-block'>
                    <div className='cartLinks'>
                        <Link to="/" className='cart-link'>Home</Link>
                        <FontAwesomeIcon icon={faGreaterThan} size='xs' className='caret-icon' />
                        <Link to='/products' className='cart-link'>Product</Link>
                        < FontAwesomeIcon icon={faGreaterThan} size='xs' className='caret-icon' />
                        <Link to='/products' className='cart-link'>{truncateName(product.name)}</Link>
                    </div>
                    <div className='main-details'>
                        <h2>{truncateName(product.name)}</h2>
                        <div className='review'>
                            {[...Array(5)].map((_, index) => (
                                <FontAwesomeIcon key={index} icon={faStar} className='star'/>
                            ))}
                        <span>2 Reviews</span>
                        </div>
                        <p className='details'>
                            {product.description}
                        </p>
                        <div className='quantity'>
                            <p>Quantity</p>
                            <div className='items'>
                                <button onClick={decreaseQuantity}>-</button>
                                <span>{quantity}</span>
                                <button onClick={increaseQuantity}>+</button> 
                            </div>
                        </div>
                        <p className='strike'>NGN {product.price}</p>
                        <p>NGN {product.price}</p>
                        <button className='addCart' onClick={handleAddToCart}>
                            <FontAwesomeIcon icon={faCartShopping} size='xs' color='#fff' className='cart-icon'/>
                            Add To Cart
                        </button>

                        
                    </div>
                </div>
            </div>

       
            
        
    </div>
    )
};

export default ProductDetails
