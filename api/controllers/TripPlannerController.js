export { initializeDB, findCountryByID, getCitiesByLatLon, getCityRoute }

import mongoose from 'mongoose';
import fetch from 'node-fetch';
const Country = mongoose.model('Country');


const initializeDB = function (req, res) {
  const url = 'https://api.worldbank.org/v2/country?format=json&per_page=299';
  fetch(url)
    .then(response => response.text())
    .then(text => {
      // clear database before repopulating 
      Country.collection.drop();
      const data = JSON.parse(text)[1];
      data.forEach(function(country) {
        new Country(country).save();
      });
      res.json('Success: Database Initialized');
    });
};

const findCountryByID = function(req, res) {
  Country.find({ id: req.params.id }, { name: 1, capitalCity: 1, _id: 0 }, function(err, data) {
    if (err)
      res.send(err);
      res.json(data);
  });
};


const getCitiesByLatLon = function(req, res) {
  Country.find({longitude: {$lte: req.query.maxLon, $gte: req.query.minLon},
                latitude: {$lte: req.query.maxLat, $gte: req.query.minLat}},
                {capitalCity: 1, _id: 0}, 
                function (err, data) {
                  if (err)
                    res.send(err);
                    res.json(data);
                });
};

const getCityRoute = function (req, res) { 
  let startCity, endCity, visitCities;

  // find start city 
  Country.findOne({capitalCity: req.query.startCity},
    {capitalCity: 1, latitude: 1, longitude: 1, _id: 0},
    function(err, data) {
      if (err) { 
        res.send(err);
        res.json(task);
      } else {
        startCity = data;

        // find end city 
        Country.findOne({capitalCity: req.query.endCity},
        {capitalCity: 1, latitude: 1, longitude: 1, _id: 0},
        function (err, data) {
          if (err) { 
            res.send(err);
            res.json(task);
          } else {
            endCity = data;

            // find visiting cities 
            Country.find({capitalCity: {$in: req.query.visitCities.split(',')}},
            {capitalCity: 1, latitude: 1, longitude: 1, _id: 0},
            function (err, data) {
              if (err) { 
                res.send(err);
                res.json(task);
              } else {
                visitCities = data; 

                // add first route 
                // start city -> first visit -> second visit -> end city 
                let distance1 = distance(startCity.latitude, startCity.longitude, visitCities[0].latitude, visitCities[0].longitude);
                let distance2 = distance(visitCities[0].latitude, visitCities[0].longitude, visitCities[1].latitude, visitCities[1].longitude);
                let distance3 = distance(visitCities[1].latitude, visitCities[1].longitude, endCity.latitude, endCity.longitude);
                const firstTotal = distance1 + distance2 + distance3;

                // add second route 
                // start city -> second visit -> first visit -> end city 
                distance1 = distance(startCity.latitude, startCity.longitude, visitCities[1].latitude, visitCities[1].longitude);
                distance2 = distance(visitCities[1].latitude, visitCities[1].longitude, visitCities[0].latitude, visitCities[0].longitude);
                distance3 = distance(visitCities[0].latitude, visitCities[0].longitude, endCity.latitude, endCity.longitude);
                const secondTotal = distance1 + distance2 + distance3;

                // return route with the least total distance 
                const route = new Object(); 
                if (firstTotal < secondTotal) {
                  route.firstStop = startCity;
                  route.secondStop = visitCities[0];
                  route.thirdStop = visitCities[1];
                  route.fourthStop = endCity;

                } else if (secondTotal < firstTotal) {
                  route.firstStop = startCity;
                  route.secondStop = visitCities[0];
                  route.thirdStop = visitCities[1];
                  route.fourthStop = endCity;
                }

                res.json(route);
                res.end();
              }
            });
          }
        });
      }
    });
};

const distance = function (lat1, lon1, lat2, lon2) {
    const radLat1 = Math.PI * lat1/180;
    const radLat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radTheta = Math.PI * theta/180;
    let distance = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  
    if (distance > 1) {
      distance = 1;
    }
  
    distance = Math.acos(distance);
    distance = distance * 180/Math.PI;
    distance = distance * 60 * 1.1515;
  
    return distance;
};