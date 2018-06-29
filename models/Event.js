'use strict';
const mongoose = require( 'mongoose' );

var eventSchema = mongoose.Schema( {
  name: String,
  description: String
} );

module.exports = mongoose.model( 'Event', eventSchema );
