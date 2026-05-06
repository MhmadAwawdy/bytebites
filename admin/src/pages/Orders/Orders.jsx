import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list')

    if (response.data.success) {
      setOrders(response.data.data)
    } else {
      toast.error('Error')
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + '/api/order/status', {
      orderId,
      status: event.target.value,
    })

    if (response.data.success) {
      await fetchAllOrders()
      toast.success('Order status updated')
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className='page order'>
      <div className='page-header'>
        <div>
          <h1>Orders</h1>
          <p>Track customer orders and update delivery status.</p>
        </div>
        <span className='count-badge'>{orders.length} Orders</span>
      </div>

      <div className='order-list'>
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <div className='order-icon'>
              <img src={assets.parcel_icon} alt='' />
            </div>

            <div className='order-details'>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' x ' + item.quantity
                  } else {
                    return item.name + ' x ' + item.quantity + ', '
                  }
                })}
              </p>

              <p className='order-item-name'>
                {order.address.firstName + ' ' + order.address.lastName}
              </p>

              <div className='order-item-address'>
                <p>{order.address.city + ', ' + order.address.state}</p>
                <p>{order.address.country + ', ' + order.address.zipcode}</p>
              </div>

              <p className='order-item-phone'>{order.address.phone}</p>
            </div>

            <div className='order-meta'>
              <span>Items</span>
              <b>{order.items.length}</b>
            </div>

            <div className='order-meta'>
              <span>Total</span>
              <b>${order.amount}</b>
            </div>

            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value='Food Processing'>Food Processing</option>
              <option value='Out for delivery'>Out for delivery</option>
              <option value='Delivered'>Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

Orders.propTypes = {
  url: PropTypes.string.isRequired,
}

export default Orders