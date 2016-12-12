import {
  DEFAULT_DEBOUNCE_TIMER,
  APP_TARGET_DIV_ID,
  PLACE_TYPES,
  AUTOCOMPLETE_PLACEHOLDER,
  TITLE_API_KEY,
  TITLE_COLORS,
  UNFOCUS_KEY,
  TITLE_COLORS_ORDER
} from '../config/settings.js';

//text-coloring function
const googleColor = str => {
  let spaceOffset = 0;
  return str.split('').map((letter, i) => {
    if(letter !== ' ') {
      return `<span style="color:#${
        TITLE_COLORS[
          TITLE_COLORS_ORDER[
            (i - spaceOffset) % TITLE_COLORS_ORDER.length
          ]
        ]
      }">${letter}</span>`;
    } else {
      spaceOffset++;
      return letter;
    }
  }).join('');
};

//appends initial app HTML to the DOM
export const renderDefaults = () => {
    const app = document.querySelector(`#${APP_TARGET_DIV_ID}`);
    app.innerHTML += `
      <div id="sidebar">
        <div id="siteTitle"> 
          ${googleColor('Google Map App')}
        </div>
        <div id="controls">
          <div class="titleText">
            Find...
          </div>
          <select id="type" multiple>
            ${
              Object.keys(PLACE_TYPES).map(type =>  `<option class="typeOption" value="${type}" ${
                PLACE_TYPES[type] ? 'selected' : ''
              }>${
                type.length ?
                  type.replace(/_/g, ' ').replace(/\b[a-z]/g,c=>c.toUpperCase())
                  : 'Any'
              }</option>`)
            }
          </select>
          <div class="titleText">
            Near...
          </div>
          <div id="locationField">
            <input id="autocomplete" placeholder="${AUTOCOMPLETE_PLACEHOLDER}" type="text" />
          </div>
          <button id="searchButton">Search</button>
        </div>
        <div id="listing">
          <table id="resultsTable">
            <tbody id="results"></tbody>
          </table>
        </div>
      </div>
      <div id="mapContainer">
        <div id="map">
          <div id="loadingContainer">
            <div id="loadingText">Getting location, please wait.</div>
            <div id="mapLoader"></div>
          </div>
        </div>

        <div style="display: none">
          <div id="info-content">
            <table>
              <tr id="iw-url-row" class="iw_table_row">
                <td id="iw-icon" class="iw_table_icon"></td>
                <td id="iw-url"></td>
              </tr>
              <tr id="iw-address-row" class="iw_table_row">
                <td class="iw_attribute_name">Address:</td>
                <td id="iw-address"></td>
              </tr>
              <tr id="iw-phone-row" class="iw_table_row">
                <td class="iw_attribute_name">Telephone:</td>
                <td id="iw-phone"></td>
              </tr>
              <tr id="iw-rating-row" class="iw_table_row">
                <td class="iw_attribute_name">Rating:</td>
                <td id="iw-rating"></td>
              </tr>
              <tr id="iw-website-row" class="iw_table_row">
                <td class="iw_attribute_name">Website:</td>
                <td id="iw-website"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `;
    document.addEventListener('keydown', e => {
      if(e.keyCode === UNFOCUS_KEY) {
        document.querySelector('#type').blur();
        document.querySelector('#autocomplete').blur();
      }
    });
    const {c1, c2, c3, c4} = TITLE_COLORS;
    document.querySelector('#mapLoader').style = `
      border-left: 10px solid #${c1};
      border-top: 10px solid #${c2};
      border-right: 10px solid #${c3};
      border-bottom: 10px solid #${c4};
    `;
    return app;
  },

  //debounce function to limit searches
  debounce = (func, wait = DEFAULT_DEBOUNCE_TIMER) => {
    let timeout, args, timestamp, result;
    const later = () => {
      let last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        result = func.apply(args);
        if (!timeout) args = null;
      }
    };
    return function() {
      args = arguments;
      timestamp = Date.now();
      let callNow = !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      else if (callNow) {
        result = func.apply(args);
        args = null;
      }
      return result;
    };
  };

export class CoordinatePair {
  constructor(lat, lng){
    this.lat = lat;
    this.lng = lng;
  }
};


