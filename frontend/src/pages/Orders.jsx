import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [trackingClicked, setTrackingClicked] = useState(null); 
  const currency = 'Rs'; 

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user-orders?userId=${userId}`);
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    setTrackingClicked(orderId); 
  };

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-container mb-6 p-4 border-2 border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order #{order._id}</h3>

            {order.items.map((item, index) => {
              const product = item.product;
              const date = new Date(order.createdAt);
              const formattedDate = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div key={item._id || index} className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between'>
                  <div className='flex items-start gap-6 text-sm'>
                    <img className='w-16 sm:w-20' src={product.image[0]} alt={product.name} />
                    <div>
                      <p className='font-medium sm:text-base'>{product.name}</p>
                      <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                        <p className='text-lg'>
                          {currency}&nbsp;{(product.price).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>Quantity:&nbsp;{item.quantity}</p>
                        <p>Size:&nbsp;{item.size}</p>
                      </div>
                      <p className='mt-2'>Date:&nbsp;<span className='text-gray-400'>{formattedDate}</span></p>
                    </div>
                  </div>
                </div>
              );
            })}

            
            <div className='flex justify-between md:w-1/2 mt-4'>
              {trackingClicked === order._id ? (
                <>
                  <p><strong>Order Status</strong></p>
                  <p className='text-sm md:text-base'>{order.status}</p> 
                </>
              ) : (
                <button 
                  className='px-4 py-2 text-sm font-medium border rounded-sm' 
                  onClick={() => handleTrackOrder(order._id)}
                >
                  TRACK ORDER
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
