fetch(`http://api.openweathermap.org/geo/1.0/direct?q=washington&limit=1&appid=64c061c7a143e44714946379a0b46c02`)
  .then(function(response){
    if(response.ok){
        console.log(response);
        response.json().then(function (data){
            console.log(data)
            const latitude = data[0].lat;
        console.log(latitude);
        })
    }
  })