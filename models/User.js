'use strict';
const mongoose = require( 'mongoose' );

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = mongoose.Schema( {
  userName: String,
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  description: String,
  thumbnail: String

} );



module.exports = mongoose.model( 'user', userSchema );

/*
newUser.google.id    = profile.id;
newUser.google.token = token;
newUser.google.name  = profile.displayName;
newUser.google.email = profile.emails[0].value; // pull the first email
*/
