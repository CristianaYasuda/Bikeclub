const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  description: String,
  eventDate: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  member: { type: Schema.Types.ObjectId, ref: 'User' },
  location: { type: { type: String }, coordinates: [Number] },
  locationEnd: { type: { type: String }, coordinates: [Number] }
});
 
eventSchema.index({ location: '2dsphere' });
eventSchema.index({ locationEnd: '2dsphere' });

const Events = mongoose.model('Event', eventSchema);

module.exports = Events;
