import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hero from '../../images/hero2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './product.scss';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products?page=${page}`);
        if (!response.ok) {
          console.error('API response does not indicate success');
          setNoResults(true);
          setIsLoading(false);
          return;
        }
  
        const data = await response.json();
  
        setProducts(data.products);
        setPageCount(data.totalPages);
        setIsLoading(false);
        // console.log(data.products);
      } catch (error) {
        console.error('Error fetching products', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [page]);
  

  const arrayBufferToBase64 = (buffer) => {
    const binary = [];
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => binary.push(String.fromCharCode(byte)));
    return window.btoa(binary.join(''));
  };

  if (isLoading) {
    return (
      <div className='products'>
        <FontAwesomeIcon icon={faSpinner} color='#78A962' size='4x' />
      </div>
    );
  }

  if (noResults) {
    return (
      <div className='products'>
        <h1>No products found</h1>
      </div>
    );
  }

  const priceRanges = [
    { label: 'Under ₦150,000', minPrice: 0, maxPrice: 150000 },
    { label: '₦155,000 - ₦250000', minPrice: 155000, maxPrice: 250000 },
    { label: '₦255,000 - ₦400,000', minPrice: 255000, maxPrice: 400000 },
    { label: '₦455,000 - ₦600,000', minPrice: 455000, maxPrice: 600000 },
    { label: '₦625,000 - ₦750,000', minPrice: 625000, maxPrice: 750000 },
    { label: '₦725,000 - ₦2,000,000', minPrice: 725000, maxPrice: 6000000 },
  ];


  const truncateName = (name) => {
    const words = name.split(' ');
    if (words.length > 3) {
        return words.slice(0, 15).join(' ') + '...';
    }
    return name;
};

// const handlePrevious = () => {
//   setPage((p) => {
//     if (p === 1) return p; // when you get to page 1 this allows you stay in page 1 cos there is no page 0
//     return p - 1;
//   })
// }

// const handleNext = () => {
//   setPage((p) => {
//     if (p === pageCount) return p;
//     return p + 1;
//   })
// }

const handlePageClick = (pageNumber) => {
  setPage(pageNumber);
};


// Function to generate an array of page numbers based on pageCount
const generatePageNumbers = () => {
  const max_visible_pages = 5;
  const pageNumbers = [];

  if (pageCount <= max_visible_pages) {
    // display all the page numbers
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={i === page ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
  } else {
    const middle = Math.floor(max_visible_pages / 2);
    const start = page <= middle ? 1 : page - middle;
    const end = page <= middle ? max_visible_pages : page + middle;

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button key={i} onClick={handlePageClick(i)}
        className={i === page ? 'active' : ''}>{i}</button>
      );
    }

    if (start !== 1) {
      pageNumbers.push(
        <button key='lt' onClick={() => handlePageClick(page - max_visible_pages)} disabled={page === 1}>
          &lt;
        </button>
      )
    }
    if (end !== pageCount) {
      pageNumbers.push(
        <button key='gt' onClick={() => handlePageClick(page + max_visible_pages)} disabled={page === pageCount}
        >&gt;</button>
      );
    }
  }
  
  return pageNumbers;
};

  return (
    <div className='products'>
      <img src={hero} alt='products hero im' />
      <div>
        <div className='product-title'>
          <h1>Products</h1>
          {/* <a href='/'>See all new products</a> */}
        </div>
        <div className='product-block'>

           {/* Render price range links */}
           <div className='price-ranges'>
            <h2>Filters</h2>
            <h3>Price ranges</h3>
            <hr />
            {priceRanges.map((range, index) => (
              <Link
                key={index}
                to={`/products/price?minPrice=${range.minPrice}&maxPrice=${range.maxPrice}`}
                className='price-range-link'
              >
                {range.label}
              </Link>
            ))}
          </div>

          <div className='badges'>
          {products.map((product) => (
            <div key={product._id} className='product-badge'>

              <Link to={`/products/${product._id}`} className='product-link'>
                <div>
                  <FontAwesomeIcon icon={faCheckCircle} color='#78A962'/>
                  <span className={`${product.stock_quantity > 0 ? 'stock' : 'red'}`}>
                    {product.stock_quantity > 0 ? 'In stock' : 'Not available'}
                  </span>
                </div>

                {product.photo1 ? ( // Check if photo1 exists
                  <img src={`data:image/jpeg;base64,${arrayBufferToBase64(product.photo1.data.data)}`} alt='product-img' />
                ) : (
                  <img src={product.images[1]} alt='product preview' />
                )}

                <p className='productName'>{truncateName(product.name)}</p>
                <p className='small'>Quantity: {product.stock_quantity}</p>

                <div className='review'>
                  {[...Array(5)].map((_, index) => (

                    <FontAwesomeIcon key={index} icon={faStar} className={index < 4 ? 'star' : ''}/>
                  ))}
                  <span>Review 1</span>
                </div>

                <p>₦{product.price}</p>
              </Link>

            </div>

          ))}

          
          </div>
        </div>
        <div className='pagination'>
            {/* disabled keyword disables the previous or next button if youre on the last page or first page */}
            {/* <button disabled={page === 1} onClick={handlePrevious}>Previous</button>
            <button disabled={page === pageCount} onClick={handleNext}>Next</button> */}
            Pages: {generatePageNumbers()}
          </div>
      </div>
    </div>
  );
};

export default Products;