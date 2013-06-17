# Gumtree Enhancement Suite
(Chrome Extension)

## Why?
GumTree's website is missing a few "modern" features. This makes trawling through their site a little bit of a pain. When looking for rooms, they can be gone within a couple of hours, especially in busy cities where demand is high.

## What?
This Chrome extension/plugin will has the following features:

- [x] Infinite Scroll/Never Ending Adverts
- [x] Map location of adverts
- [x] Notifications (in browser) of new adverts
- [x] Works with the current search functionality
- [x] Per week pricing calculates to Per-calendar-month pricing (price * 52) / 12
- [ ] Improved captions when a user clicks on the map
- [ ] Colour of marker to show how expensive/how old the listing is

## How?
GumTree has no API. This is a Pain. This plugin uses jQuery and AJAX to screen-scrape the relevent pages for information. As the extension works in-page, it is not Cross Domain. The chrome extension uses the following:
- Google Maps V3 API
- MarkerClusterer Google Utility
- Chrome Etensionizer http://extensionizr.com/
- jQuery Library


## Disclaimer
Gumtree, I'm really sorry to have to develop this. Your site just didn't have the features I needed. The plugin is in a really early stage and 'hacked' together in an afternoon. 

## Issues?
Current Issues:
- [ ] It can take a while to get all the locations on the map, this is due to the lack of Gumtree API as each result needs to scrape the actual listings page
- [ ] No Options, everything is on by default
- [ ] UI Issues. There are some UI Issues, hopefully will be fixed soon
- [ ] Most of the new listings seem to be "featured" this is because the "featured listings" are on a rotation.
- [ ] "Saving" an advert doesn't work.
- [x] Works with the current search functionality
- [x] Per week pricing calculates to Per-calendar-month pricing (price * 52) / 12
