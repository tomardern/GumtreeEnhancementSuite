chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);


		/* --------------------------------------------------
		Inject This JavaScript
		-----------------------------------------------------*/
		function injectJs(link) {
		        var scr = document.createElement("script");
		        scr.type="text/javascript";
		        scr.src=link;
		        (document.head || document.body || document.documentElement).appendChild(scr);
		}

		injectJs(chrome.extension.getURL("src/lib/markerclusterer_compiled.js"));
		injectJs(chrome.extension.getURL("src/inject/gmaps.js"));


		console.log("GES: LOADED");
		//loadScript();


	}
	}, 10);
});