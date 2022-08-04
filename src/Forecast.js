const key = '6b7MnAVRBQylZyNnnJkqeFQ9ehBu5Tzm'

const getCity = async (city) => {

    const baseurl = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete'
    const query = `?apikey=${key}&q=${city} `

    const response = await fetch(base + query);

    const data = await response.json()
    console.log(data)

}

getCity('manchester')
