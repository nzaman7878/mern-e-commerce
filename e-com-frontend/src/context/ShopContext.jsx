import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({}); 
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems); 
    
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData); 
  }

  const getCartCount = () => {
    let totalCount = 0;
    for(const items in cartItems){
      for(const item in cartItems[items]){
        try {
          if (cartItems[items][item] > 0){
            totalCount += cartItems[items][item];
          }
        } catch (error){
          console.error(error);
        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    // Handle quantity validation
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      delete cartData[itemId][size];
      // If no sizes left for this item, remove the item entirely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      // Update quantity
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);
  }
  
  const getCartAmount = () => {
    let totalAmount = 0;
    for(const items in cartItems){
      let itemInfo = products.find((product) => product._id === items);
      for(const item in cartItems[items]){
        try {
          if (cartItems[items][item] > 0 && itemInfo) { 
            totalAmount += cartItems[items][item] * itemInfo.price;
          }
        } catch (error) { 
          console.error(error);
        }
      }
    }
    return totalAmount;
  }

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]); 

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
