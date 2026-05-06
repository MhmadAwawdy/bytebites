import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    {
      path: '/add',
      icon: assets.add_icon,
      label: 'Add Items',
    },
    {
      path: '/list',
      icon: assets.order_icon,
      label: 'List Items',
    },
    {
      path: '/orders',
      icon: assets.order_icon,
      label: 'Orders',
    },
  ]

  return (
    <aside className='sidebar'>
      <div className='sidebar-header'>
        <span>Menu</span>
      </div>

      <nav className='sidebar-options'>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-option active' : 'sidebar-option'
            }
          >
            <span className='sidebar-icon'>
              <img src={item.icon} alt='' />
            </span>
            <p>{item.label}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar