import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { cartItems, getCartAmount, clearCart, navigate, delivery_fee } = useContext(ShopContext);

  
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '',
    state: '', zip: '', country: '', mobile: '', coupon: ''
  });

  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponValidated, setIsCouponValidated] = useState(false); 
  const [discountPercentage, setDiscountPercentage] = useState(0); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'coupon') {
      setIsCouponValidated(false); 
      setDiscountApplied(false);
      setDiscountAmount(0);
      setDiscountPercentage(0);
    }
  };

  const validateFields = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zip', 'country', 'mobile'];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error('Please fill out all delivery fields.');
        return false;
      }
    }
    return true;
  };

  const validateCoupon = () => {
    if (form.coupon.trim() === '') {
      toast.error("Coupon field is empty.");
      return;
    }

    
    const couponCodes = {
      'WMD50': 50,
      'SAVE20': 20,
      'WELCOME10': 10,
    };

    const coupon = form.coupon.trim().toUpperCase();
    if (couponCodes[coupon]) {
      const discount = (getCartAmount() * couponCodes[coupon]) / 100;
      setDiscountAmount(discount);
      setDiscountPercentage(couponCodes[coupon]);
      setDiscountApplied(true);
      setIsCouponValidated(true);
      toast.success(`Coupon validated! ${couponCodes[coupon]}% Discount applied.`);
    } else {
      setDiscountAmount(0);
      setDiscountPercentage(0);
      setDiscountApplied(false);
      setIsCouponValidated(false);
      toast.error("Invalid Coupon Code.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) return;

    
    if (form.coupon.trim() !== '' && !isCouponValidated) {
      toast.error("Please validate your coupon before placing the order.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please log in.");
      return;
    }

    const orderItems = [];

    
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          orderItems.push({ product: productId, quantity, size });
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const baseTotal = getCartAmount();
    const finalTotal = baseTotal - discountAmount + delivery_fee;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/new`, {
        userId,
        items: orderItems,
        totalAmount: finalTotal,
        paymentMethod: method,
        deliveryDetails: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          mobile: form.mobile,
        },
      });

      if (response.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/orders");
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input name="firstName" value={form.firstName} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='First Name' />
          <input name="lastName" value={form.lastName} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Last Name' />
        </div>
        <input name="email" value={form.email} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="email" placeholder='Email Address' />
        <input name="street" value={form.street} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input name="city" value={form.city} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='City' />
          <input name="state" value={form.state} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input name="zip" value={form.zip} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Zip Code' />
          <input name="country" value={form.country} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="text" placeholder='Country' />
        </div>
        <input name="mobile" value={form.mobile} onChange={handleChange} className='w-full px-4 py-2 border border-gray-300 rounded' type="number" placeholder='Mobile' />

        
        <div className='flex items-center gap-3 mt-4'>
          <input
            name="coupon"
            value={form.coupon}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Coupon Code'
          />
          <button
            onClick={validateCoupon}
            className='px-4 py-2 text-sm text-white bg-black rounded hover:bg-gray-800'
          >
            Validate Coupon
          </button>
        </div>
      </div>

      
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal discountAmount={discountAmount} discountPercentage={discountPercentage} />
        </div>

        
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button
              onClick={handlePlaceOrder}
              className={`px-16 py-3 text-sm text-white bg-black active:bg-gray-800 ${!isCouponValidated && form.coupon.trim() !== '' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isCouponValidated && form.coupon.trim() !== ''}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
