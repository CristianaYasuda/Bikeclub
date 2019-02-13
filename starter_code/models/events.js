const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  description: String,
  eventDate: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  member: { type: Schema.Types.ObjectId, ref: 'User' }
  
});

eventSchema.set('timestamps', true);

const Events = mongoose.model('Event', eventSchema);

module.exports = Events;
