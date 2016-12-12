#MapApp - Version 1.1.0

## Application Overview 

Map App is a tool for users to view places of interest near locations of their choosing. It uses the Google places API.

###What's new in 1.1.0?
- Resolved bug causing map to go to last location when searching on an empty input box (should center on current view).
- Removed extraneous queue class. 
- Made title color settings more dynamic.
- Tied map loading spinner coloring to first four title color values from settings, instead of static CSS values. 
- Responsive design fixes and more dynamic scrolling on listings.
- Implemented Heroku and Git
- Moved settings file and api keys into `config` folder.
- Updated bad links in README.MD

##Hosting

A live version of this app can be found [here][0]

## Getting Started

### Viewing This Readme

Markdown formatting can be viewed in Chrome using [Markdown Preview Plus][1] or any other equivalent extension from the [Chrome store][2]. To view, simply install any such extension and open README.MD in Chrome. Otherwise, feel free to use your text editor of choice to view as plain text. 

This Readme can also be found on [Github][3].

###System Requirements
- A working internet connection
- [npm][4] package manager

###Compatibility
This applicaiton is compatible with most browsers and screen sizes. These installation instructions are intended for Mac OS X, and some steps may vary for other operating systems. 

Google Chrome 54 or later is recommended for an optimal experience.

### Installation

Run `$ npm run new` in the mapApp top folder. If you run into permission errors, you may need to include `sudo` at the beginning of the command. 

### Setup

#### Startup: Quick
After installing, access the app by opening `client/index.html` in your preferred browser. 

#### Startup: Advanced
Run `$ npm start` to start the application. A port can be specified by running `$ PORT={your port here} npm start` instead, otherwise the application will default to 1337. The application can then be opened by navigating to `localhost:{your port, or 1337}` or `127.0.0.1:{your port, or 1337}`. 

#### Startup: Development
When developing with this application, use `$ npm run dev`. To specify a port, see 'Startup: Advanced' above.

####Settings
Application settings may be found in `client/src/utils/settings.js`. Modifying these settings may prevent the application from working as intended, and is suggested only for advanced users. `$ webpack` must be run for any changes to take effect.

## User Guide
###Location Data
On startup, you may be prompted for permission to use your location data. This is used to determine the program's starting coordinates. If you do not give permission to use location data, the program will fall back on a default location. 

###Selecting a Place Type
You may select one or more place types in the selection box labelled 'Find...', and can execute a search by pressing `enter/return`, `double-clicking` on an option, or  by `clicking` the Search button. The expanded selection box may be exited by clicking outside of the box, or by pressing `esc`. 

###Setting a Location
A location may be supplied via the input field below 'Near...', which will prompt you to make a selection from a series of suggestions. Doing so will automatically fill the rest of the input. To search for places near your location, press `enter/return` or `click` the Search button. The input field may be exited by clicking outside of the box, or by pressing `esc`.

###Viewing Result Information
Detailed information for each result can be viewed by `clicking` on either an entry in the results table, or a marker on the map.

###Using Google Maps
For help with Google Maps, please refer to [Google Maps Help][5].

## Project Information

### Requirements
- A query box and search button that call the [Places Library for Google Maps][6]
- Format the results to give a good user experience
- A map with location markers/pins
- A list of locations 
- Some interactivity is between the two
- You should implement at least one of your own features to show off your abilities 
  For example: 
  - a build system
  - tests 
  - user accounts
  - cloud storage
  - other cool features... the sky is the limit!
- A Readme
- No Framework limitations
- Minimal server code.

###Submission
 
Please provide your program as a zip or tar archive, with an index.html file.


[Links]:_
[0]: https://map-app-coding-challenge.herokuapp.com
[1]: https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl
[2]: https://chrome.google.com/webstore/search/markdown%20viewer
[3]: https://github.com/bradlm/mapApp
[4]: https://www.npmjs.com/get-npm
[5]: https://support.google.com/maps/?hl=en#topic=3092425
[6]: https://developers.google.com/maps/documentation/javascript/places