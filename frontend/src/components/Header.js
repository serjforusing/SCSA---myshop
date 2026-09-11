import { Link, NavLink } from 'react-router-dom';
import Logout from './Logout';
import "../styles/Header.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header(){
    const { isAuthenticated } = useContext(AuthContext);    
        return (
        <header className="header">
            <div className="header-inner">
                <Link className="header-logo" to="/" aria-label="MyShop — მთავარი გვერდი">
                    <span>My</span>Shop
                </Link>

                <nav className="header-links" aria-label="მთავარი ნავიგაცია">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>მთავარი</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>პროდუქტები</NavLink>
                    {isAuthenticated && <NavLink to="/create-product" className={({ isActive }) => isActive ? "active" : ""}>დამატება</NavLink>}
                    {isAuthenticated && <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>შეკვეთები</NavLink>}
                </nav>

                <div className="header-auth">
                    {!isAuthenticated && <Link to="/register">რეგისტრაცია</Link>}
                    {!isAuthenticated && <Link className="login-link" to="/login">შესვლა</Link>}
                    {isAuthenticated && <Link className="cart-link" to="/cart">კალათა</Link>}
                    {isAuthenticated && <Logout />}
                </div>
            </div>
        </header>
        )
    }

export default Header   
