export { Country };
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  capitalCity: {
    type: String,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
});

const Country = mongoose.model('Country', CountrySchema);