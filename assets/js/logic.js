fetch()
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