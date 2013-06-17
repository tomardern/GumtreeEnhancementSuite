

/* ----------------------------
Variables Required
----------------------------*/
ges = {}; //Gumtree Enhancement Suite
ges.adverts = []; //Known and unknown locations
ges.advertsString = "|"; //String of all the adverts we have seen
ges.counter = 0;
ges.map = {};
ges.pageTitle = ""; //Default Page Title




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
Alert on new item
-----------------------------------------------------*/
ges.alertOnNew = function(){

	//Set interval on checks
	ges.interval = setInterval(function(){

		$element = $("<div />"); //Element trick again
		//Do a AJAX Load of this page
		$element.load(window.location.href + "  .ad-listings li",function(){
			counter = 0;
			//Scan through and check if it exists
			$("li",$element).each(function(){

				id = $("a",$(this)).attr("id");

				if (ges.advertsString.indexOf("|" + id + "|") == -1) {
					//Ladies, this is a new advert we haven't seen before! Oh my.
					counter++;

					//TODO: Cache then add to DOM
					$(".ad-listings").first().prepend($(this).addClass("ges-new").addClass("ges-added"));

					//Add to array to stop adding again
					ges.advertsString +=  id + "|";


				}
		});

		console.log("GES | ADDED " + counter + " MORE RESULTS");

		$gesNew = $(".ges-new");

		$gesNew.hover(function(){
			$(this).removeClass("ges-new");
		});

	 	document.title = "(" + $gesNew.length + ") " + ges.pageTitle;



	});


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

		adverts = ges.getLocations($(".ad-listings li",$element));

		//Do some tiding
		//1. Replace main Pagination with new one
		$("#pagination").replaceWith($("#pagination",$element).remove());


		//Insert into the main DOM
		$afterThis.after(adverts.$html);

		//Store into the strings
		ges.advertsString += adverts.asString;


		//Remove Adsense - I'm Sorry, it just looks neater! (Sneaky hack to remove all instances)
		$("div[id='js_adsense_footer']").remove();


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



	//Get the locations (already in the DOM)
	adverts = ges.getLocations($(".ad-listings li").clone());
	//console.log(adverts);


	ges.adverts = adverts.locations;
	ges.advertsString += adverts.asString;


	ges.pageTitle = document.title;

	//Update the locations with Longitude/Latitude
	//ges.updateLongLat(0);


	//Load in the infinate scroll functionality
	ges.initInfinateScroll();

	//Alert on new ones
	//ges.alertOnNew();


};




function loadScript() {
	//Do some style changes
	$("#main-content").css("padding-right","0px");

	//Add some CSS
	document.write("<style>.main-content-wrapper #search-results .ges-new {background:#DDFFBE;}#search-results .ges-added {background:#F5F5F5;}</style>");

	$("#search-results").prepend("<div id='ges' style='height:400px;'></div>");
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
	document.body.appendChild(script);
}

loadScript();