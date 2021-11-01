import express from 'express';
import mongoose from 'mongoose';
import {Country} from './api/models/CountryModel.js';
import bodyParser from 'body-parser';
const app = express();
const port = process.env.PORT || 3000;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tripPlannerDB'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import {routes} from './api/routes/TripPlannerRoutes.js';
routes(app); 

app.listen(port);
console.log('TripPlanner API listening at port ' + port);