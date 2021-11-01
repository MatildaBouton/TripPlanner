export { routes };
import * as tripPlanner from '../controllers/TripPlannerController.js';

const routes = function(app) {

 /*
  * Call first to populate the database with Country information from 
  * the world bank API.
  * ISO, Country name, Capital city, latitude, and longitude stored 
 */
  app.route('/tripPlanner')
    .post(tripPlanner.initializeDB);

  /*
   * Returns country name and capital city associated with the three letter
   * ISO code provided. 
   * Example parameter: /tripPlanner/USA
  */
  app.route('/tripPlanner/:id')
    .get(tripPlanner.findCountryByID);

  /* Return all cities within specified coordinates
   * Parameters: 
   *    - minLat
   *    - maxLat
   *    - minLon
   *    - maxLon
  */
  app.route('/getCities')
    .get(tripPlanner.getCitiesByLatLon);
 
  /* Return most optimal route between 4 cities 
   * Parameters: 
   *    - startCity
   *    - endCity
   *    - visitCities
  */
  app.route('/getCityRoute')
    .get(tripPlanner.getCityRoute);
};

