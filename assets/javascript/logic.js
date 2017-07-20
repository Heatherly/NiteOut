$(document).ready(function() {

var mapLocations = [];

$('select').material_select(); //FOR MATERIALIZE FORMS
$('.collapsible').collapsible(); //FOR MATERIALIZE COLLAPSIBLE LISTS

//HIDE DIVs FOR THE RESULTS
$("#eventList").hide();
$("#map_wrapper").hide();
$('#meals').hide();
$("#deals").hide();
$("#noResults").hide();
$("#weather").hide();

//comment form validation functions 


//SEARCH FORM VALIDATION FUNCTION CALLs
$("input").on("change", function(){
    validateInput();
    commentFormValidate();
});

$("select").on("change", function(){
    validateInput();
});
$("#textarea1").on("change", function(){
     commentFormValidate();
});
$("#searchBtn").prop("disabled",true);
$("#contactFormBtn").prop("disabled",true);

//SEARCH BUTTON ON-CLICK EVENT HANDLER
$("#searchBtn").on("click", function(event) {
	event.preventDefault();

    mapLocations = [];

//WEATHER API
$("#weather").empty();

    var weatherBitAPIKey='9d04fdfc085648c084e567384eea5e60'; //weatherBil
    var cityCapital = $("#city").val().trim();
    var city = capitalize(cityCapital);
    console.log(city);
    var state = $("#state").val().trim();


    //to get lat and long from city input
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': city }, function(results, status) {
        var lat=results[0].geometry.location.lat();
        var long=results[0].geometry.location.lng();
        
    var queryURL = "https://api.weatherbit.io/v1.0/forecast/3hourly?lat="+lat+"&lon="+long+"&key="+weatherBitAPIKey;
      $.ajax({
          url: queryURL,
          method: "GET",
        })
        .done(function(response) {
            $("#weather").show();

            
            var day1 = moment().format('dddd');
            var day2 = moment().add(1, 'day').format('dddd');
            var day3 = moment().add(2, 'day').format('dddd');
            var day4 = moment().add(3, 'day').format('dddd');
            var day5 = moment().add(4, 'day').format('dddd');

            
            var capCity = capitalize(cityCapital);
            var weatherDiv = $("<div class='weather'>");
            var row1 = ("<h5>Forecast for "+capCity+"</h5><table><tr><th>"+day1+"</th><th>"+day2+"</th><th>"+day3+"</th><th>"+day4+"</th><th>"+day5+"</th></tr>");


            var forecast1 = ("<td>" + parseInt((9*(response.data[0].temp/5)+32)) + "&#8457;<br><img src='../NiteOut/assets/images/weather_icons/" + response.data[0].weather.icon + ".png' style='width:50%'><br>" + parseInt(response.data[0].rh)+'% humidity <br>' + response.data[0].pop + " ppt</td>");
            var forecast2 = ("<td>" + parseInt((9*(response.data[7].temp/5)+32)) + "&#8457;<br><img src='../NiteOut/assets/images/weather_icons/" + response.data[7].weather.icon + ".png' style='width:50%'><br>" + parseInt(response.data[7].rh)+'% humidity <br>' + response.data[7].pop + " ppt</td>")
            var forecast3 = ("<td>" + parseInt((9*(response.data[15].temp/5)+32)) + "&#8457;<br><img src='../NiteOut/assets/images/weather_icons/" + response.data[15].weather.icon + ".png' style='width:50%'><br>" + parseInt(response.data[15].rh)+'% humidity <br>' + response.data[15].pop + " ppt</td>")
            var forecast4 = ("<td>" + parseInt((9*(response.data[23].temp/5)+32)) + "&#8457;<br><img src='../NiteOut/assets/images/weather_icons/" + response.data[23].weather.icon + ".png' style='width:50%'><br>" + parseInt(response.data[23].rh)+'% humidity <br>'+ response.data[23].pop + " ppt</td>")
            var forecast5 = ("<td>" + parseInt((9*(response.data[31].temp/5)+32)) + "&#8457;<br><img src='../NiteOut/assets/images/weather_icons/" + response.data[31].weather.icon + ".png' style='width:50%'><br>" + parseInt(response.data[31].rh)+'% humidity <br>'+ response.data[31].pop + " ppt</td></table>")

            weatherDiv.append(row1, forecast1, forecast2, forecast3, forecast4, forecast5);
            $('#weather').append(weatherDiv);
            

        });//response function call
        });//geocoder ending

//EventfulAPI SECTION
	$("#eventList").empty();
    $("#eventList").prepend("<h5>Local Events</h5>")
    
	var authKey = '2KM3cdbtGDddJHzb';
	var queryURLbase = "https://api.eventful.com/json/events/search?app_key="+ authKey

	var keyword = $("#eventCategory").find(":selected").data("event");
	var date =  $("#date").val().trim();
	var cityCapital = $("#city").val().trim();
    var location = capitalize(cityCapital);
    console.log(location);

	        $.ajax({
	            url: queryURLbase + "&location=" + location + "&c=" + keyword + "&date=" + date +"&include=categories&page_size=5",
                method: "GET",
	            dataType: 'jsonp'
	        }).done(function(response) {
	            console.log(response);		

                if (response.events === null) {
                   $("#eventList").append("<p><strong>No Event results found. Please search again.</p>");
                    document.getElementById("searchForm").reset();
                
                } else {
				    
                    $("#eventList").show();             
                    var results = response.events.event;

    				for (var i = 0; i < results.length; i++) {
    		            var eventItem = $("<li>");
    		            var title = results[i].title;
    		            var venueName = results[i].venue_name
    		            var street = results[i].venue_address
    		            var city = results[i].city_name
    		            var state = results[i].region_abbr
    		            var description = results[i].description ? results[i].description : ""
    		            //ternary operator
    		            	if (description.length > 300){
    		            		description = description.substr(0, 300) + "..."
    		            	};

    		            var lat = results[i].latitude
    		            var long = results[i].longitude
                        var type = 'icon18.png'

    		            var eventTLatLong = {'title': title, 'latitude': lat, 'longitude': long, 'type': type};

    		            mapLocations.push(eventTLatLong);

		        //display eventfulAPI results in the html div
                        var l = eventItem.html("<div class='collapsible-header'>" + title + "</div><div class='collapsible-body'><span><em>" + venueName + "</em><br>" + street + "<br>" + city + ", " + state + "<br>" + description +"</span></div>");
                    
                        $("#eventList").append(l);
                    };
              		document.getElementById("searchForm").reset();
    	            initializeMap(mapLocations); //call Google Map
                };
	        });

//OPENTABLE API
        $('#meals').show();
    // build the query for the ajax call
        var cityCapital = $("#city").val().trim();
        var city = capitalize(cityCapital);
        var price = $('#foodCategory').find(':selected').val();
        console.log(price);
        var queryURL = "https://opentable.herokuapp.com/api/restaurants?&per_page=5";

        var foodLocation = []; //empty array to hold restaurant location data

    // make the ajax call
            $.ajax({
                url: queryURL + "&city=" + city + "&price=" + price,
                method: "GET",
                success: function(response){
                    console.log(response);
                    for (var i = 0; i < response.restaurants.length; i++) {
                        //Grab address details for mapping purpose
                        var name = response.restaurants[i].name; 
                        var address = response.restaurants[i].address;
                        var zip = response.restaurants[i].postal_code;
                        var foodAddress = {'title': name, 'street': address, 'zipcode': zip};
                        foodLocation.push(foodAddress);
                        
                        //display results on html page
                        $('#eats' + [i]).find('.restName').html("<span><b>Restaurant: </b>" + response.restaurants[i].name + "</span>");
                        $('#eats' + [i]).find('.restAddress').html("<span><b>Address: </b>" + response.restaurants[i].address + "</span>");
                        $('#eats' + [i]).find('.restPhone').html("<span><b>Phone Number: </b>" + response.restaurants[i].phone.substr(0,10) + "</span>");  
                        $('#eats' + [i]).find('.restCity').html("<span><b>City: </b>" + response.restaurants[i].city + "</span>");  
                        $('#eats' + [i]).find('.reservLink').html("<span><a href="+response.restaurants[i].reserve_url+" target='_blank'>Make reservation here</a></span>");  
                    }
                    
                
                    // console.log("foodLoc array: " + JSON.stringify(foodLocation));
                        convertAddress(foodLocation);
                },
                error: function(error){
                    document.getElementById("searchForm").reset();
                    $("#searchBtn").prop("disabled",true);
                    $("#meals").hide();
                    //$("#noResults").html("<p>No results to display. Please try again.</p>");
                }

            }); 
//GROUPON API
    $("#noResults").empty();
    $("#deals").show();
    $("#noResults").show();


    var tsToken = "US_AFF_0_201236_212556_0";
    var queryURL = "https://partner-api.groupon.com/deals.json?tsToken=";
    var cityCapital = $("#city").val().trim();
    var divisionID = capitalize(cityCapital);
    console.log(divisionID);
    var category = $("#eventCategory").find(":selected").data("groupon");
    
        $.ajax({
            url: queryURL + tsToken +"&division_id="+ divisionID +"&filters=category:"+ category +"&offset=0&limit=5",
            method: "GET",
            dataType: "jsonp",
            success: function(response){
            console.log(response);

                for(i=0;i<response.deals.length;i++) {

                    $("#card"+[i]).find(".card-content").html("<span>"+response.deals[i].announcementTitle+"</span>");
                    $("#card"+[i]).find(".card-image").html("<img src="+response.deals[i].largeImageUrl+">");
                    $("#card"+[i]).find(".card-action").html("<span><a href="+response.deals[i].dealUrl+" target='_blank'>Claim offer here</a></span>");
                }
                document.getElementById("searchForm").reset();
                $("#searchBtn").prop("disabled",true);
            },
            error: function(error){
                document.getElementById("searchForm").reset();
                $("#searchBtn").prop("disabled",true);
                $("#deals").hide();
                $("#noResults").html('<div class="card-panel"><h5 class="header">Groupon Deals</h5><p>No results to display. Please try again.</p></div>');
            }
        })

                
}); //ending on button click bracket

//to accept only letters in city input field

$('#city').keypress(function(event){

    var inputValue = event.charCode;
    if ((inputValue > 47 && inputValue < 58) && (inputValue != 32)){
        event.preventDefault();
    } 
});

//to accept only letters in state input field

// $("#state").on("keydown", function(event){
//   // Ignore controls such as backspace
//   var arr = [8,9,16,17,20,35,36,37,38,39,40,45,46];

//   // Allow letters
//   for(var i = 65; i <= 90; i++){
//     arr.push(i);
//   }

//   if(jQuery.inArray(event.which, arr) === -1){
//     event.preventDefault();
//   }
// });

// $("#state").on("input", function(){
//     var regexp = /[^a-zA-Z]/g;
//     if($(this).val().match(regexp)){
//       $(this).val( $(this).val().replace(regexp,'') );
//     }
// });


//SEARCH FORM VALIDATION
function validateInput() {
    
    var valid = true;

    if ($("#city").val().trim() === "") {
        valid = false; 
    }

    if ($("#state").val().trim() === "") {
        valid = false; 
    }
    
    if ($("#eventCategory").find(":selected").index() === 0) {
        valid = false; 
    }
    if ($("#foodCategory").find(":selected").index() === 0) {
        valid = false; 
    }
    
$("#searchBtn").prop("disabled",!valid);

}

function commentFormValidate() {

    var valid = true;

    if ($("#email").val().trim() === "") {
       
        valid = false; 
    }

    if ($("#userName").val().trim() === "") {
       
        valid = false; 
    }

    if ($("#textarea1").val().trim() === "") {
       
        valid = false; 
    }
$("#contactFormBtn").prop("disabled",!valid);

}

//function to capitalize input for city
function capitalize(text) {
    var i, words, w, result = '';

    words = text.split(' ');

    for (i = 0; i < words.length; i += 1) {
        w = words[i];
        result += w.substr(0,1).toUpperCase() + w.substr(1);
        if (i < words.length - 1) {
            result += ' ';    // Add the spaces back in after splitting
        }
    }

    return result;
}

//COMMENT FORM
// Initialize Firebase
 var config = {
    apiKey: "AIzaSyCVNNoiEr2fcQjgwqOdgHoyFQceNS2soPw",
    authDomain: "niteout-f2f6c.firebaseapp.com",
    databaseURL: "https://niteout-f2f6c.firebaseio.com",
    projectId: "niteout-f2f6c",
    storageBucket: "niteout-f2f6c.appspot.com",
    messagingSenderId: "467238925963"
  };
  firebase.initializeApp(config);

  var niteOutDatabase = firebase.database();

  $("#contactFormBtn").on("click", function(event){

    $("#contactFormBtn").prop("disabled",true);
    event.preventDefault();



    var newFirstName = $("#first_name").val().trim();
    var newLastName = $("#last_name").val().trim();
    var newEmail = $("#email").val().trim();
    var newUserName = $("#userName").val().trim();
    var newComment = $("#textarea1").val().trim();

    var newUser = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        userName: newUserName,
        comment: newComment
    }

    niteOutDatabase.ref().push(newUser);

    $("#contact-form").trigger("reset");

  });

  niteOutDatabase.ref().on("child_added", function(snapshot){

    var firstName = snapshot.val().firstName;
    var lastName = snapshot.val().lastName;
    var email = snapshot.val().email;
    var userName = snapshot.val().userName;
    var comment = snapshot.val().comment;

    $("#reviewsReveal").append('<p><strong>'+userName+': </strong>"'+comment+'"</p><br>');

  });

//Converts address to latitude/longitude
function convertAddress(foodLocation) {
    console.log("foodLocation array: " + JSON.stringify(foodLocation))

    var foodGeoLocation = [];

    for (var i = 0; i < foodLocation.length; i++) {
    	(function(i) {
	        var searchURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
	        var APIkey = 'AIzaSyA2ccd8RZGhMmTyN2PZU8FKpzneH3LIld4'
	        var fAddress = foodLocation[i].street + ",+" + foodLocation[i].zipcode
	        var fName = foodLocation[i].title

	        $.ajax ({
	            url: searchURL + fAddress + "&key=" + APIkey,
	            method: 'GET'
	            }).done(function(response) {
	                // console.log(response);
	                var lat = response.results["0"].geometry.location.lat;
	                var long = response.results["0"].geometry.location.lng;
                    var type = 'icon40.png'
					var foodNameLatLong = {'title': fName, 'latitude': lat, 'longitude': long, 'type': type};
	                mapLocations.push(foodNameLatLong);             
	            });

           })(i);
        }    
}


//GOOGLE MAPS API
    function initializeMap(mapLocations) {
    	// console.log("mapLocations: " + JSON.stringify(mapLocations));
	            
        var map;
        var bounds = new google.maps.LatLngBounds();
        var iconBase = 'http://maps.google.com/mapfiles/kml/pal2/';
        
        var mapOptions = {
            mapTypeId: 'roadmap'
        };

        $("#map_wrapper").show();
        $("#map_wrapper").addClass("map_wrapper card-panel white");
        $("#map_canvas").empty();

        // Display a map on the page
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map.setTilt(45);
           
        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        
    // console.log("second check: " + JSON.stringify(mapLocations));
    // Loop through our array of markers & place each one on the map  
        for( i = 0; i < mapLocations.length; i++ ) {
            var position = new google.maps.LatLng(mapLocations[i].latitude, mapLocations[i].longitude);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: mapLocations[i].title,
                icon: iconBase + mapLocations[i].type
            });
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(mapLocations[i].title);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(9);
            google.maps.event.removeListener(boundsListener);
            });
        
    	};
    
});//ending document.on ready brackets