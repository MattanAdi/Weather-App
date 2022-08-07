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
        <div>
            <div id='navbar'>



                <div id="home" onClick={() => { navHome() }}>
                    <p>Home</p>
                </div>

                <div id="favorites" onClick={() => { navFav() }} >
                    <p>Favorites</p>
                </div>



            </div>
        </div>
    );
}

export default Navbar;
