var lastResponse = false;
var city = config.CITY;
var country = config.COUNTRY;
var api = config.APIKEY;
var units = config.UNITS;
var successful_request = true;
var modehour = false;

// offset for Ann Arbor
var unix_time_zone_offset = -14400;

var last_city = "";

function updateTime(unix_time_zone_offset_f) {
	var currentDate = new Date();
	var utcDate = new Date(Date.UTC(currentDate.getUTCFullYear(), 
                   currentDate.getUTCMonth(), 
                   currentDate.getUTCDate(), 
                   currentDate.getUTCHours(), 
                   currentDate.getUTCMinutes(), 
                   currentDate.getUTCSeconds(), 
                   currentDate.getUTCMilliseconds()));

	// weather offset			   
	var timeZoneOffset = unix_time_zone_offset_f;

	// user browser offset 	
	var user_browser_offset = new Date().getTimezoneOffset()/-60 * 3600;

	var unix_time = utcDate.getTime() + timeZoneOffset * 1000 - user_browser_offset * 1000;
	var d = new Date(unix_time);
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();

	var ampm = modehour ? "" : (h < 12 ? " AM" : " PM");

	if (h > 12 && !modehour) {
		h = h - 12;
	}

	if (h == 0 && !modehour) {
		h = 12;
	}

	if (m < 10) {
		m = "0"+m;
	}

	if (s < 10) {
		s = "0"+s;
	}

	var month = d.getMonth();
	var day = d.getDate();
	var year = d.getFullYear();
	var weekday = d.getDay();

	var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
	var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

	var output = ""+days[weekday]+"  &nbsp; / &nbsp;  "+months[month] + " "+day+" &nbsp; / &nbsp; "+year+"";

	$('#time-title').html(h + ":" + m + ":" + s + ampm);
	$('#time-subtitle').html(output);
}

function updateWeather(lastResponse, request_status) {
	console.log("weather update");
	if (request_status) {
		console.log("good request")
		console.log(lastResponse);
		var main = lastResponse.weather[0].description;
		var temp = lastResponse.main.temp;
		var low = lastResponse.main.temp_min;
		var high = lastResponse.main.temp_max;
		unix_time_zone_offset = lastResponse.timezone;

		var tchar = "";
		if (units == "imperial") {
			tchar = "F";
		}
		else{
			tchar = "C";
		}

		main = main.substr(0,1).toUpperCase() + main.substr(1);
    	

		$('#wtext').html(main.toUpperCase() + " &nbsp; / &nbsp; " + temp + "&deg;" + tchar + " &nbsp; / &nbsp; " + low + "&deg;" + tchar + " - " + high + "&deg;" + tchar);
		$('#wtext').css("color", "#32CD32");
		$('#city-input').css("color", "#32CD32");
		setTimeout(function(){ 
			$('#wtext').css("color", "#FFFFFF");
			$('#city-input').css("color", "#FFFFFF");
		}, 300);

		document.getElementById("city-input").placeholder = last_city.toUpperCase();
    	document.getElementById("city-form").reset();


	}
	else{
		console.log("bad request");
    	document.getElementById("city-form").reset();

		
		setTimeout(function(){ 
			$('#wtext').css("color", "#FFFFFF");
			$('#city-input').css("color", "FFFFFF");
		}, 300);

		$('#wtext').css("color", "FF0000");
		$('#city-input').css("color", "FF0000");

	}
}

function getCity(units, api){
	// Get user's location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
	
	// Success callback function
	function success(position) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
	
		// Make a request to reverse geocoding service
		const apiUrl = 'https://api.openweathermap.org/geo/1.0/reverse?lat='+latitude+'&lon='+longitude+'&limit=1&appid='+ api;
		
		fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			city = data[0].name;
			country = data[0].country;
			
			console.log(`City: ${city}`);
			console.log(`Country: ${country}`);
			getWeather(city, country, units, api);
		})
		.catch(error => console.log(error));
	}
	
	// Error callback function
	function error() {
		console.log("Unable to retrieve your location.");
		getWeather(city, country, units, api);
	}
}

function getWeather(city, country, units, api) {
	last_city = city;
	req = $.getJSON('https://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&units=' +units +'&appid=' + api,
	function(resp) {
		lastResponse = resp;
		successful_request = true;
		console.log("successful request in get_weather");
		updateWeather(lastResponse, successful_request);
	})
	.fail(function() { 
		successful_request = false;
		console.log("failed request in get_weather");
		updateWeather(lastResponse, successful_request);
	});
}


function change_city(city_name_from_form) {
	getWeather(city_name_from_form, country, units, api);
	console.log("change city weather called");
};

$(document).ready(function() {
	var modehour = false;
	
	getCity(units, api);

	$('input[name="city"]').attr("placeholder",city.toUpperCase());

	particlesJS('particles-js', {
		"particles": {
			"number": {
				"value": 40,
				"density": {
					"enable": false,
					"value_area": 800
				}
			},
			"color": {
				"value": "#FFFFFF"
			},
			"shape": {
				"type": "circle",
				"stroke": {
					"width": 0,
					"color": "#000000"
				},
				"polygon": {
					"nb_sides": 5
				}
			},
			"opacity": {
				"value": 1,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 1,
					"opacity_min": 0.1,
					"sync": false
				}
			},
			"size": {
				"value": 5,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 10,
					"size_min": 0.1,
					"sync": false
				}
			},
			"line_linked": {
				"enable": true,
				"distance": 150,
				"color": "#ffffff",
				"opacity": 0.4,
				"width": 1
			},
			"move": {
				"enable": true,
				"speed": 0.5,
				"direction": "top",
				"random": false,
				"straight": false,
				"out_modehour": "out",
				"attract": {
					"enable": false,
					"rotateX": 600,
					"rotateY": 1200
				}
			}
		},
		"interactivity": {
			"detect_on": "window",
			"events": {
				"onhover": {
					"enable": true,
					"modehour": "repulse"
				},
				"onclick": {
					"enable": true,
					"modehour": "push"
				},
				"resize": true
			},
			"modehours": {
				"grab": {
					"distance": 400,
					"line_linked": {
						"opacity": 1
					}
				},
				"bubble": {
					"distance": 400,
					"size": 40,
					"duration": 2,
					"opacity": 8,
					"speed": 3
				},
				"repulse": {
					"distance": 200
				},
				"push": {
					"particles_nb": 4
				},
				"remove": {
					"particles_nb": 2
				}
			}
		},
		"retina_detect": true,
		"config_demo": {
			"hide_card": false,
			"background_color": "#b61924",
			"background_image": "",
			"background_position": "50% 50%",
			"background_size": "100%"
		}
	});



	setInterval(function() {
		updateTime(unix_time_zone_offset);
	}, 1000);

	setInterval(function() {
		getWeather(city, country, units, api);
	}, (1000 * 60 * 5));
	
});



