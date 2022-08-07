import React from 'react';
import Fav from './Fav';
import './fav.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Favorites = (props) => {

    const navigate = useNavigate();

    function clickFavorite(id) {
        props.clickFavoritedCity(id) // sends id of selected favorite back to app js to be used
        navigate('/')
    }

    function deleteFavorite(event, id) {
        event.stopPropagation()
        props.deleteFavorite(id)  //sends id of selected favorite back to app js to be used 
    }


    return (
        <div style={{ textAlign: 'center' }} >
            <h1>Favorites</h1>

            <br /><br />
            <div id='bigcont' >

                {props.favorite.map((val) => {
                    return <div id="favoritescontainer" key={val.id} onClick={() => clickFavorite(val.id)}>

                        <p>City:{val.cityname}</p>
                        <p>Weather:{val.currentweather}</p>
                        <p>Temperature:{val.temperature}</p>
                        <p>Id:{val.id}</p>

                        <button className='deletebutton' onClick={(event) => deleteFavorite(event, val.id)} >Delete</button>
                    </div>
                })}


            </div>

        </div>
    );
}

export default Favorites;
