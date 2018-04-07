const mongoose = require('mongoose');

const PlaceSchema = mongoose.Schema({
  name: String,
  votedUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

const Place = module.exports = mongoose.model('Place', PlaceSchema);

module.exports.addPlace = function(newPlace, cb){
  newPlace.save(cb)
}
