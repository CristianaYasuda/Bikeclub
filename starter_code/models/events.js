const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventDate: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  member: { type: Schema.Types.ObjectId, ref: 'User' }
});

eventSchema.set('timestamps', true);

const Events = mongoose.model('Events', eventSchema);

module.exports = Events;

//const mongoose = require('mongoose');

//const Schema = mongoose.Schema;
//
//const laundryPickupSchema = new Schema({
//  pickupDate: Date,
//  user: { type: Schema.Types.ObjectId, ref: 'User' },
//  launderer: { type: Schema.Types.ObjectId, ref: 'User' }
//});
//
//laundryPickupSchema.set('timestamps', true);
//
//const LaundryPickup = mongoose.model('LaundryPickup', laundryPickupSchema);
//
//module.exports = LaundryPickup;