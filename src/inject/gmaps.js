

/* ----------------------------
Variables Required
----------------------------*/
ges = {}; //Gumtree Enhancement Suite
ges.adverts = []; //Known and unknown locations
ges.counter = 0;
ges.map = {};




ges.getLocations = function(){
	locations = [];
	$listings = $(".ad-listings li");
	$listings.each(function(){
		loc = $(this).find(".location").text();
		desc = $(this).find(".description");
		featured = $(this).find(".featured").length;
		locations.push({"id": desc.attr("id"), "location": loc, "featured": featured,
			"link" : desc.attr("href"), latLng: {} });
	});
	return locations;
};


//Now that a location has been found,
ges.onLocationFound = function(locationObj){

	//Now create a marker
	var marker = new google.maps.Marker({
        map: ges.map,
        position: locationObj.latLng,
        title: locationObj.location,
        link: locationObj.link
    });

    //Now add a click event to it
	google.maps.event.addListener(marker, 'click', function() {
	    window.open(marker.link,'_blank');
	  });
};



ges.updateLongLat = function(index){


	//If there is an advert with this index
	if (typeof ges.adverts[index] != "undefined"){
		advert = ges.adverts[index];

		$element = $("<div />");

  		// Scrape the Page for the location of the map
  		$element.load(advert.link + " .open_map", function(){
  			//console.log("GOT " + advert.location);

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
	  			ges.adverts[index].latLng = gLatLng;
	  			console.log(index,"Location Found",latLng);

	  			//Now that it's been found - run the call back

	  			ges.onLocationFound(ges.adverts[index]);


	  		}	else {
	  			//TODO: Google GeoCode to find the required place
	  			console.log(index,"No Map",advert.link);
	  		}


  			//Now get the next one
  			ges.updateLongLat(index+1);
  		});

		} else {
			console.log("...........DONE..................");
			console.log(ges.adverts);
		}
};



/* --------------------------------------------------
Time for never ending?
-----------------------------------------------------*/
ges.page = 1;
ges.loadInNextPage = function(){
	ges.page++; //Increase page count

	//Ok, firstly find out what the next page is
	nextPage = $(".pag-next a").attr("href");

	$afterThis = $("#search-results .ad-listings:not(.featured)");

	$element = $("<div />"); //Ye old empty element trick

	$element.load(nextPage + " #search-results", function(){

		//Do some tiding
		//1. Replace main Pagination with new one
		$("#pagination").replaceWith($("#pagination",$element).remove());
		//2. Add The page number to the heading
		$(".ad-group-header",$element).prepend("PAGE NUMBER " + ges.page + " || -------- || ");

		//Insert into the main DOM
		$afterThis.after($element);

		//Remove Adsense - I'm Sorry, it just looks neater! (Sneaky hack to remove all instances)
		$("div[id='js_adsense_footer']").remove();

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

	//Get the locations
	ges.adverts = ges.getLocations();

	//Update the locations with Longitude/Latitude
	//ges.updateLongLat(0);


	//Never Ending Time
	ges.loadInNextPage();





};




function loadScript() {
	//Do some style changes
	$("#main-content").css("padding-right","0px");


	$("#search-results").prepend("<div id='ges' style='height:400px;'></div>");
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
	document.body.appendChild(script);
}

loadScript();