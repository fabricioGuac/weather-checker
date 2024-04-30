// Gets the history of searches from local storage if there are no searches initializes an empty array
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
const weatherGetter = async (lat,lon, city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${Apikey}&units=imperial`);
        if(!response.ok){
            throw new Error('Failed to fetch weather condition');
        }
        const data = await response.json();
        const weather = data.list;
        return {city,weather};
    }catch(error){
        errorMsg(error);
        throw error;
    }
};

// Function to use latLon and weather getter together and send the information to the createWeatherCard function
const latLonWeather = (city) => {
    const cardInfo = [];
    latLonGetter(city)
        .then(({ lat, lon}) => {
            return weatherGetter(lat, lon, city); 
        })
        .then(({ city, weather }) => {
            console.log(weather);
            console.log(city)
            console.log(weather[0]);
            for (let i = weather.length - 1; i >= 0; i -= 8) {
                cardInfo.unshift(weather[i])
                console.log(weather[i].dt_txt);
            };
            cardInfo.unshift(weather[0]);
            console.log(cardInfo);
            createWeatherCard(city, cardInfo);
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
};

const createWeatherCard = (city, weather) => {

    // Loops over the array to get the information in the cards 
    for(let i = 0; i < weather.length; i++){

        // Sets the classes that will be applied if it is the first element or not
    const colClass = i === 0 ? 'col-md-8 col-g-6 col-xl-4': 'col-md-8 col-lg-6 col-xl-2'
    const cardBodyClass = i === 0 ? 'card-body p-4' : 'card-body p-2'
    const headerClass = i === 0 ? 'd-flex' : 'd-flex text-center'
    const dateClass = i === 0 ? '' : 'me-3'
    const tempCondclass = i === 0 ? 'd-flex flex-column text-center mt-5 mb-4' : 'd-flex flex-column text-center mt-3 mb-2'
    const imgclass = i === 0 ? 'bigone' : ''
    const degrees = i === 0 ? 'display-4 mb-0 font-weight-bold' : 'display-6 mb-0 font-weight-bold'

        // Creates the html elements 
    const col = $('<div>').addClass(colClass); 
    const card = $('<div>').addClass('card'); 
    const cardBody = $('<div>').addClass(cardBodyClass); 
    const header = $('<div>').addClass(headerClass); 
    const cityname = $('<h6>').addClass('flex-grow-1').text(city); 
    const date = $('<h6>').text(dayjs(weather[i].dt_txt).format('M/D/YY')).addClass(dateClass); 
    const tempcond = $('<div>').addClass(tempCondclass); 
    const temp = $('<h6>').addClass(degrees).text(`${weather[i].main.temp} ºF`);
    const cond = $('<span>').addClass('small').text(weather[i].weather[0].main);
    const humWindicon = $('<div>').addClass('d-flex align-items-center'); 
    const humWind = $('<div>').addClass('flex-grow-1'); 
    const wind = $('<div>'); 
    const windi = $('<i>').addClass('fas fa-wind fa-fw');
    const windSpan = $('<span>').text(`${weather[i].wind.speed} km/h`).addClass('ms-1'); 
    const hum = $('<div>'); 
    const humi = $('<i>').addClass('fas fa-tint fa-fw');
    const humSpan = $('<span>').text(`${weather[i].main.humidity} %`).addClass('ms-1');
    const icondiv = $('<div>');
    const icon = $('<img>').attr('src', `http://openweathermap.org/img/w/${weather[i].weather[0].icon}.png`).addClass(imgclass);
    
    // Appents the html elements to form the card
    header.append(cityname, date);
    tempcond.append(temp, cond);
    wind.append(windi, windSpan);
    hum.append(humi, humSpan);
    humWind.append(wind, hum);
    icondiv.append(icon);
    humWindicon.append(humWind, icondiv);
    cardBody.append(header, tempcond, humWindicon);
    card.append(cardBody);
    col.append(card);

    // Appends the first card to a different div
    if(i === 0){
        today.append(col);
    }else{forecast.append(col);}
    };
};


// Function to get the weather from the history buttons
const historybtn = (event) => {
    event.preventDefault();
    latLonWeather(event.target.textContent);
};



// When the page is fully loaded adds event listeners and loops over the history to get the history buttuns on the page
$(document).ready(function () {
    $('#search').on('click', weatherSearcher);

    history.forEach(search => {
        renderHistory(search);
    });

    historylist.on('click', historybtn)
})
