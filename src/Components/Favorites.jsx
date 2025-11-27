import React from 'react';
import './fav.css'
import { useNavigate } from 'react-router-dom'

const Favorites = (props) => {
    const navigate = useNavigate();

    function clickFavorite(id) {
        props.clickFavoritedCity(id)
        navigate('/')
    }

    function deleteFavorite(event, id) {
        event.stopPropagation()
        props.deleteFavorite(id)
    }

    const hasFavorites = Boolean(props.favorite.length)

    return (
        <div className='favorites-root'>
            <section className='favorites-panel'>
                <div className='favorites-headline'>
                    <h1>Favorites</h1>
                    <p>Tap a card to load it back into the explorer.</p>
                </div>
                {hasFavorites ? (
                    <div className='favorites-grid'>
                        {props.favorite.map((val) => (
                            <article className='favorite-card' key={val.id} onClick={() => clickFavorite(val.id)}>
                                <div className='favorite-row'>
                                    <p className='favorite-label'>City</p>
                                    <p className='favorite-value'>{val.cityname}</p>
                                </div>
                                <div className='favorite-row'>
                                    <p className='favorite-label'>Weather</p>
                                    <p className='favorite-value'>{val.currentweather}</p>
                                </div>
                                <div className='favorite-row'>
                                    <p className='favorite-label'>Temp</p>
                                    <p className='favorite-value'>{val.temperature}°C</p>
                                </div>
                                <button type='button' className='delete-button' onClick={(event) => deleteFavorite(event, val.id)}>
                                    Delete
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className='empty-state'>Save a city from the home view to revisit it later.</p>
                )}
            </section>
        </div>
    );
}

export default Favorites;
