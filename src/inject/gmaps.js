

		getLocations = function(){
			locations = [];
			console.log($(".ad-listings li"));
				$listings = $(".ad-listings li");
				$listings.each(function(){
					loc = $(this).find(".location").text();
					locations.push(loc);
					link = $(this).find(".description").attr("href");
				});
			return locations;

		};






		initialize = function() {
		  geocoder = new google.maps.Geocoder();
		  var mapOptions = {
		    zoom: 8,
		    center: new google.maps.LatLng(-34.397, 150.644),
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  }
		  var map = new google.maps.Map(document.getElementById("ges"), mapOptions);

		  //Now get the locations
		  locations = getLocations();

		  //Now map
		  geoLocation();

		  function geoLocation(){

		  	if (locations.length){
		  		//Remove one
		  		geoLoc = locations.shift();

			  	//Now Geocode
			  	geocoder.geocode( { 'address': geoLoc}, function(results, status) {
			      if (status == google.maps.GeocoderStatus.OK) {
			        map.setCenter(results[0].geometry.location);
			        var marker = new google.maps.Marker({
			            map: map,
			            position: results[0].geometry.location
			        });
			        console.log("GES: Location " + geoLoc + " found");
			      } else {
			        console.log("GES: Geocode was not successful for the following reason: " + status);
			      }
				});

		  		//Recursive
		  		setTimeout(geoLocation,2000);
		  	}

		  }


		 for(i=0; i< locations.length;i++) {



		  }



		}

		function loadScript() {

		 $("#search-results").prepend("<div id='ges' style='width:400px;height:400px;'></div>");
		  var script = document.createElement("script");
		  script.type = "text/javascript";
		  script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
		  document.body.appendChild(script);
		}

		loadScript();