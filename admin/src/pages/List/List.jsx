import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({ url }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)

    if (response.data.success) {
      setList(response.data.data)
    } else {
      toast.error('Error')
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      await fetchList()

      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        throw new Error(response.data.message || 'Error occurred while removing food.')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.'
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='page list'>
      <div className='page-header'>
        <div>
          <h1>Food Items</h1>
          <p>View and manage all menu items.</p>
        </div>
        <span className='count-badge'>{list.length} Items</span>
      </div>

      <div className='table-card'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt={item.name} />
            <p className='item-name'>{item.name}</p>
            <p><span className='category-pill'>{item.category}</span></p>
            <p className='price'>${item.price}</p>
            <button onClick={() => removeFood(item._id)} className='delete-btn'>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

List.propTypes = {
  url: PropTypes.string.isRequired,
}

export default List