import React from 'react';


const Weather = (props) => {

    let x = props.city
    console.log(x)



    return (
        <div>
            <p>Weather:</p>
            <p>City:{props.city}</p>
            <p>{props.temp}</p>
            <p>{props.weather}</p>
        </div>
    );
}

export default Weather;
