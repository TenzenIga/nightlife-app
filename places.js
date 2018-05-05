const mongoose = require('mongoose');

const PlaceSchema = mongoose.Schema({
  name: String,
  id:String,
  votedUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]},
{timestamps: true});

PlaceSchema.index({createdAt: Date.now()},{expireAfterSeconds: 43200});
const Place = module.exports = mongoose.model('Place', PlaceSchema);

module.exports.addPlace = function(newPlace, cb){
  newPlace.save(cb)
}
