import './Navbar.css'
import { assets } from './../../assets/assets'

const Navbar = () => {
  return (
    <header className='navbar'>
      <div className='navbar-left'>
        <img className='navbar-logo' src={assets.logo} alt='ByteBites Logo' />
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage food, orders, and menu data</p>
        </div>
      </div>

      <div className='navbar-right'>
        <button className='navbar-action'>Admin</button>
        <img src={assets.profile_image} alt='Admin profile' className='navbar-profile' />
      </div>
    </header>
  )
}

export default Navbar