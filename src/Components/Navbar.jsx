import React from 'react';
import { useNavigate } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
    let nav = useNavigate()


    function navHome() {
        nav('/')
    }
    function navFav() {
        nav('/favorites')
    }


    return (
        <div className='navbar-shell'>
            <div id='navbar'>
                <div className='brand' onClick={() => { navHome() }}>
                    Weather Studio
                </div>
                <div className='nav-actions'>
                    <button type='button' className='nav-link' onClick={() => { navHome() }}>Home</button>
                    <button type='button' className='nav-link' onClick={() => { navFav() }}>Favorites</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
