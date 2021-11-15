# TripPlanner
To run the API locally, Node and MongoDB will need to be installed. Install steps for each can be found at the following links: 
https://github.com/nvm-sh/nvm#installing-and-updating
https://docs.mongodb.com/manual/installation/

Then, install Node v16.13.0:
nvm install v16.13.0

Once everything is installed, navigate to the project and start the server with the following command: 
npm run start

In a seperate terminal window, start the database with the following command: 
mongod --dbpath=<path to /data/db>

Note: it defaults to /data/db, but in the newest version of MacOS it does not allow this to be created in the root directory. I had to create it in my user directory. 

After the server and database are running, the API calls can be tested using PostMan at http://localhost:3000

API EndPoints: 

http://localhost:3000/tripPlanner 
Call first to populate the database with Country information from the world bank API.
ISO, Country name, Capital city, latitude, and longitude stored

http://localhost:3000/tripPlanner/:id
Returns country name and capital city associated with the three letter ISO code provided. 
Example parameter: /tripPlanner/USA

http://localhost:3000/getCities
Return all cities within specified coordinates.
   Query parameters: 
      - minLat
      - maxLat
      - minLon
      - maxLon

http://localhost:3000/getCityRoute
Return most optimal route between 4 cities 
   Query parameters: 
      - startCity
      - endCity
      - visitCities
      