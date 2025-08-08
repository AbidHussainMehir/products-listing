import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock variant data - in real app this would come from product data
  const variants = product.variants || [
    { id: 1, name: "Small", price: product.price },
    { id: 2, name: "Medium", price: product.price + 5 },
    { id: 3, name: "Large", price: product.price + 10 },
  ];

  const isOutOfStock = product.id%2 === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    if (!selectedVariant && variants.length > 1) {
      toast.error("Please select a variant!");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productToAdd = {
      ...product,
      selectedVariant: selectedVariant || variants[0]?.name,
      variantPrice: selectedVariant 
        ? variants.find(v => v.name === selectedVariant)?.price 
        : product.price
    };

    dispatch(addCart(productToAdd));
    toast.success("Added to cart!");
    setIsLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="product-card__image"
            loading="lazy"
          />
        </Link>
        {isOutOfStock && (
          <div className="product-card__out-of-stock">
            <span>Out of Stock</span>
          </div>
        )}
        {product.discount && (
          <div className="product-card__discount">
            <span>-{product.discount}%</span>
          </div>
        )}
      </div>

      <div className="product-card__content">
        <Link to={`/product/${product.id}`} className="product-card__title-link">
          <h3 className="product-card__title">
            {product.title.length > 50 
              ? `${product.title.substring(0, 50)}...` 
              : product.title
            }
          </h3>
        </Link>

        <div className="product-card__rating">
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < Math.floor(product.rating?.rate || 0) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count">
            ({product.rating?.count || 0})
          </span>
        </div>

        <div className="product-card__price">
          <span className="current-price">
            {formatPrice(selectedVariant 
              ? variants.find(v => v.name === selectedVariant)?.price 
              : product.price
            )}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {variants.length > 1 && (
          <div className="product-card__variants">
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="product-card__variant-select"
              disabled={isOutOfStock}
            >
              <option value="">Select Size</option>
              {variants.map((variant) => (
                <option key={variant.id} value={variant.name}>
                  {variant.name} (+{formatPrice(variant.price - product.price)})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="product-card__actions">
          {isOutOfStock ? (
            <button 
              className="product-card__button product-card__button--disabled"
              disabled
            >
              Out of Stock
            </button>
          ) : (
            <button
              className="product-card__button product-card__button--primary"
              onClick={handleAddToCart}
              disabled={isLoading || (variants.length > 1 && !selectedVariant)}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
          
          <Link
            to={`/product/${product.id}`}
            className="product-card__button product-card__button--secondary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
