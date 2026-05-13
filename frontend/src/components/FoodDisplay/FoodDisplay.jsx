import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import './FoodDisplay.css'

const FoodDisplay = ({category}) => {

    const {food_list, searchQuery} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
       <h3>Top Dishes near you</h3>
       <div className="food-display-list">
        {food_list.map((item,index)=>{
          const matchesCategory = category==="All" || category===item.category;
          const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
          if(matchesCategory && matchesSearch){
            return <FoodItem key={index} id={item._id } name={item.name} description={item.description} price={item.price} image={item.image}/>
          }
        })}
       </div>
    </div>
  )
}

export default FoodDisplay
