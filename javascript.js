function searchCity(cityname) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=14e860d386b3eeb719b636566d47d1aa";
    var queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=14e860d386b3eeb719b636566d47d1aa";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        console.log(queryURL);
        $("#current").empty();
        var mainDate = moment().format('L');


        //creates html elements
        var cityNameH = $("<h2>").text(response.name);
        var displayDate = cityNameH.append(" " + mainDate);
        var tempP = $("<p>").text("Tempraturer: " + response.main.temp);
        var humP = $("<p>").text("Humidity: " + response.main.humidity);
        var windP = $("<p>").text("Wind Speed: " + response.wind.speed);
        var currentweather = response.weather[0].main;

        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }

        var makeDiv = $('<div>');
        makeDiv.append(displayDate, currentIcon, tempP, humP, windP);
        $("#current").html(makeDiv);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('#uvl-display').empty();
            var uvlresults = response.value;
            var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);

            $('#uvl-display').html(uvlEl);

        });
    });

    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function (response) {
        var results = response.list;
        $("#fiveday").empty();
        for (var i = 0; i < results.length; i += 8) {
            var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");

            var date = results[i].dt_txt;
            var setDate = date.substr(0, 10)
            var temp = results[i].main.temp;
            var hum = results[i].main.humidity;

            var hFiveDate = $("<h5 class='card-title'>").text(setDate);
            var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
            var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

            var weather = results[i].weather[0].main

            if (weather === "Rain") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clouds") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
            else if (weather === "Clear") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
            else if (weather === "Drizzle") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }
            else if (weather === "Snow") {
                var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

            fiveDayDiv.append(hFiveDate);
            fiveDayDiv.append(icon);
            fiveDayDiv.append(pTemp);
            fiveDayDiv.append(pHum);
            $("#fiveday").append(fiveDayDiv);
        }

    });

}
loadPage();

//to search city
$("#citysearch").on("click", function (event) {
    event.preventDefault();

    var cityText = $("#city-text").val().trim();

    //save search on local storage
    var textContent = $(this).siblings("input").val();
    var storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));

    searchCity(cityText);
    loadpage();
});

//to use stored cities
function loadPage() {
    var lastSearch = JSON.parse(localStorage.getItem("cityName"));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    var psearch = $("<div>");
    psearch.append(searchDiv)
    $("#history").prepend(psearch);
}

$("#history").on('click', '.btn', function (event) {
    event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());

});