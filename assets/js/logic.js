let history =  JSON.parse(localStorage.getItem("history")) || [];
const today = $('#today');
const forecast = $('#forecast');
const historylist = $('#history');
const h1 =$('h1');
let h1error = false;
// Creates a variable to store the api key
const Apikey = "64c061c7a143e44714946379a0b46c02";

// Function to display the error message in the h1 and the console
const errorMsg = (error) => {
    console.error(error);
    if (!h1error) {
        h1error= true;
        
        const h1 = $('h1');
        const h1a = h1.text();
        
        h1.text(`${error}, Please try again.`).addClass('text-danger');
        
        setTimeout(() => {
            h1.text(h1a).removeClass('text-danger');
            h1error= false; 
        }, 10000);
    }
};



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
        errorMsg(error);
        throw error;
    }
    
};

// Function to get the weather information 
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
        errorMsg(error);
        throw error;
    }
};

// Function to use latLon and weather getter together
const latLonWeather = (city) => {
    latLonGetter(city)
        .then(({ lat, lon }) => {
            return weatherGetter(lat, lon); // Return the promise here
        })
        .then((weather) => {
            console.log(weather);
        })
        .catch(error => {
            errorMsg(error);
        });
};


// Function to create and render the history buttons on the page
const renderHistory = (city) => {
    const  historyelcont = $('<li>');
    const  historyel = $('<button>');
    historyel.text(city);
    historyel.attr('class', 'btn btn-outline-info');
    historyelcont.append(historyel);
    historylist.append(historyelcont);
    localStorage.setItem('history', JSON.stringify(history));
};

// Function to handle the new searches 
const weatherSearcher = (event) => {
    event.preventDefault();
    const city = $('#city').val().trim();
    $('#city').val('');
    if(!history.includes(city)){
        history.push(city);
        renderHistory(city);
    };
    latLonWeather(city);
}

// Function to get the weather from the history buttons
const historybtn = (event) => {
    event.preventDefault();
    latLonWeather(event.target.textContent);
}

// When the page is fully loaded adds event listeners and loops over the history to get the history buttuns on the page
$(document).ready(function () {
    $('#search').on('click', weatherSearcher);

    history.forEach(search => {
        renderHistory(search);
    });

    historylist.on('click', historybtn)
})
