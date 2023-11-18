import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './details.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const PriceRange = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const minPrice = queryParams.get('minPrice');
  const maxPrice = queryParams.get('maxPrice');

  const [productsInPriceRange, setProductsInPriceRange] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Construct the URL with query parameters for minPrice and maxPrice
    const apiUrl = `http://localhost:4000/api/products?price[gte]=${minPrice}&price[lte]=${maxPrice}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Filtered products can be accessed from data
        const filteredProducts = data.products;
        setProductsInPriceRange(filteredProducts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  }, [minPrice, maxPrice]);

  const truncateName = (name) => {
    const words = name.split(' ');
    if (words.length > 3) {
        return words.slice(0, 15).join(' ') + '...';
    }
    return name;
};

  return (
    <div className='price'>
      {isLoading && <div>Loading...</div>}
      {!isLoading && productsInPriceRange.length === 0 && (
        <div>
          <h2>No products available within this price range.</h2>
        </div>
      )}
      {!isLoading && productsInPriceRange.length > 0 && (
        <div className='priceRange-block'>
          {/* Display the products within the price range */}
          <h2>Products in the Price Range: ₦{minPrice} - ₦{maxPrice}</h2>
          <div className='priceDiv'>
            {productsInPriceRange.map((product) => (
              <Link to={`/products/${product._id}`} className='product-link' key={product._id}>
              <div key={product._id} className='price-block'>
                 <img src={product.images[0]} alt='product preview' />
                 <div className='review'>
                  {[...Array(5)].map((_, index) => (

                    <FontAwesomeIcon key={index} icon={faStar} className={index < 4 ? 'star' : ''}/>
                  ))}
                </div>
                <h3>{truncateName(product.name)} </h3>

                <p>Price: ₦{product.price}</p>
              </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRange;
