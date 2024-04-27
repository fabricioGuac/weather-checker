// Creates a variable to store the api key
const Apikey = "64c061c7a143e44714946379a0b46c02";
// Function to get the lat and lon from the city name 
const  latLonGetter = async (city) => {
    try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${Apikey}`);
    if(!response.ok){
        throw new Error('Failed to fetch coodinates'); 
    }
    const data = await response.json();
    const lat = data[0].lat;
    const lon = data[0].lon;

    console.log(lat, lon);
    return{lat,lon};
    }catch(error){
        console.log(error);
    }
    
};

const weatherGetter = async (lat,lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Apikey}&units=imperial`);
        if(!response.ok){
            throw new Error('Failed to fetch weather condition');
        }
        const data = await response.json();
        const weather = data.list;
        return weather;
    }catch(error){
        console.log(error);
    }
}



latLonGetter('davenport').then(({lat, lon}) => {
    weatherGetter(lat,lon).then((weather) => {
        console.log(weather);
    });
})

