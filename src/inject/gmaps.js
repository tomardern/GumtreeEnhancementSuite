

/* ----------------------------
Variables Required
----------------------------*/
ges = {}; //Gumtree Enhancement Suite
ges.advertsString = "|"; //String of all the adverts we have seen
ges.map = {};
ges.pageTitle = ""; //Default Page Title
ges.markerCluster = {};


/* --------------------------------------------------
General for getting locations and data from listing pages
-----------------------------------------------------*/
ges.getLocations = function($listings){
	locations = [];
	locationString = "";
	$html = $("<ul class='ges-page ad-listings ad-listings-style-row js_ads' />");

	$listings.each(function(){
		loc = $(this).find(".location").text();
		desc = $(this).find(".description");
		featured = $(this).find(".featured").length;


		//If we don't already know about the listing
		if (ges.advertsString.indexOf("|" + desc.attr("id") + "|") == -1){

			//Add to HTML DOM
			$html.append(this);

			//Add to string
			locationString += desc.attr("id") + "|";

			//Add to information
			locations.push({"id": desc.attr("id"), "location": loc, "featured": featured,
				"link" : desc.attr("href"), latLng: {} });
		}
	});


	return {locations: locations, asString: locationString, $html: $html};
};


/* --------------------------------------------------
Google Map Functionality
-----------------------------------------------------*/
ges.addToGoogleMap = function(locationObj,aniamtion){

	ganimation = "";
	if (aniamtion){
		ganimation = google.maps.Animation.DROP;
	}

	//Now create a marker
	var marker = new google.maps.Marker({
        position: locationObj.latLng,
        animation: ganimation,
        title: locationObj.location,
        link: locationObj.link
    });

	ges.markerCluster.addMarker(marker);

	google.maps.event.addListener(marker, 'click', function() {
	    window.open(marker.link,'_blank');
	  });
};



ges.addLocationsToMap = function(locations,animation){


	//If there is an advert with this index
	if (locations.length){
		advert = locations.shift(); //Get the first from the array

		$element = $("<div />");

  		// Scrape the Page for the location of the map
  		$element.load(advert.link + " .open_map", function(){

  			//We have injected the <a> link into the <div> - Now we have to find it again :S
	  		var $mapImg = $(this).find("a");

	  		//If we have a decent link
	  		if ($mapImg.length){

	  			//This is the link GumTree uses to load up the Google Map
	  			mapLink = $mapImg.data("target");

	  			//Find the Long/Lat from this
	  			centerMatch = mapLink.match(/center=([^&]*)/);

	  			//Coverts the link to an appropiate long/lat array
	  			latLng = centerMatch[1].split("%2C",2);

	  			//Create Lat/Long Object
	  			gLatLng = new google.maps.LatLng(parseFloat(latLng[0]), parseFloat(latLng[1]));

	  			//Now we need to update the array to say we have found one
	  			advert.latLng = gLatLng;
	  			//console.log("Location Found",latLng);

	  			//Now that it's been found - run the call back
	  			ges.addToGoogleMap(advert,animation);


	  		}	else {
	  			//TODO: Google GeoCode to find the required place
	  			//console.log("No Map",advert.link);
	  		}


  			//Now get the next one
  			ges.addLocationsToMap(locations); //Locations has been updated

  		});

		} else {
			//Added all the required to the map
		}
};

/* --------------------------------------------------
Alert on new item
-----------------------------------------------------*/
ges.alertOnNew = function(){
	console.log("GES","alert","New Items");

	//Set interval on checks
	ges.interval = setInterval(function(){

		$element = $("<div />"); //Element trick again
		//Do a AJAX Load of this page
		$element.load(window.location.href + "  .ad-listings li",function(){

			//Filter from what we have loaded into just the <li>s
			$locations = $("li", $element);

			//Filter the adverts to the ones we haven't seen yet
			adverts = ges.getLocations($locations);

			if (adverts.locations.length) {


				$(".ad-listings").first().before(adverts.$html);

				//Store into the strings
				ges.advertsString += adverts.asString;

				console.log("GES","alert", "added " + adverts.locations.length + " results");

				//Update the locations with Longitude/Latitude
				ges.addLocationsToMap(adverts.locations,true);
			}

		});


	 	/* document.title = "(" + $gesNew.length + ") " + ges.pageTitle; */

	}, 10000);


};





/* --------------------------------------------------
Time for never ending?
-----------------------------------------------------*/
ges.page = 1;
ges.loadTrigger = 0; //What position does the infinate load at
ges.nextPageLoading = false;

ges.loadInNextPage = function(){
	console.log("GES","infinate","Page Loaded");

	ges.page++; //Increase page count

	//Ok, firstly find out what the next page is
	nextPage = $(".pag-next a").attr("href");

	$afterThis = $("#search-results .ad-listings:not(.featured)").last();

	$element = $("<div />"); //Ye old empty element trick

	$element.load(nextPage + " #search-results", function(){

		//Go though and find the ones which are not here

		adverts = ges.getLocations($(".ad-listings li",$(this)));

		// Replace main Pagination with new one
		$("#pagination").replaceWith($("#pagination",$(this)));

		//Insert into the main DOM
		$afterThis.after(adverts.$html);

		//Store into the strings
		ges.advertsString += adverts.asString;

		//Update the locations with Longitude/Latitude
		ges.addLocationsToMap(adverts.locations,false);

		//Update the load Trigger
		ges.loadTrigger = $("#pagination").position().top - 1000;
		ges.nextPageLoading = false; //Wait for the next scroll

	});


};


ges.initInfinateScroll = function(){


	//Update the load Trigger
	ges.loadTrigger = $("#pagination").position().top - 1000;

	$(window).scroll(function(ev){
		if (!ges.nextPageLoading && $(this).scrollTop() > ges.loadTrigger){
			ges.nextPageLoading = true;
			ges.loadInNextPage();
		}

	});


};














/* --------------------------------------------------
Title
-----------------------------------------------------*/
initialize = function() {
	console.clear();
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(51.526, -0.067018),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	ges.map = new google.maps.Map(document.getElementById("ges"), mapOptions);

    ges.markerCluster = new MarkerClusterer(ges.map, ges.markers, {
    	 maxZoom: 13,
    });


	//Get the locations (already in the DOM)
	adverts = ges.getLocations($(".ad-listings li").clone());
	//console.log(adverts);


	ges.advertsString += adverts.asString;

	ges.pageTitle = document.title;

	//Update the locations with Longitude/Latitude
	ges.addLocationsToMap(adverts.locations,false);


	//Load in the infinate scroll functionality
	ges.initInfinateScroll();

	//Alert on new ones
	ges.alertOnNew();


};




function loadScript() {
	//Do some style changes
	$("#main-content").css("padding-right","0px");

	//Add some CSS
	document.write("<style>.main-content-wrapper #search-results .ges-new {background:#DDFFBE;}#search-results .ges-added {background:#F5F5F5;} .ges-page {border-top: 4px dotted #5C5C5C; }</style>");

	$("#search-results").prepend("<div id='ges' style='height:400px;'></div>");
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
	document.body.appendChild(script);
}

loadScript();