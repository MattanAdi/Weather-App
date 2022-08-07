import React from 'react'
import {useState} from 'react'

function Fav(props) {

    const [get,take]=useState()


const del=()=>{

    take(props.i)


    props.delete(get)

}

  return (
    <div >

        <p>City:{props.city}</p>
        <p>Weather:{props.weather}</p>
        <p>Temperature:{props.temp}</p>
        <p>Id:{props.id}</p>


    </div>
  )
}

export default Fav