import React from 'react';
import { useState } from 'react';

const Home = (props) => {

    const [city, addCity] = useState('')
    function sendit() {

        props.sendCity(city)
    }

    return (
        <div>



            <input onChange={(e) => {
                let temp = e.target.value
                addCity(temp)

            }} type="text" placeholder='City Search' /> <br />


            <button onClick={() => { sendit() }} >Go </button>

            <br />

            <div id='anscontainer' >

            </div>

        </div>
    );
}

export default Home;
