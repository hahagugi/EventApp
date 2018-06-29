'use strict';
const Event = require( '../models/event' );
console.log("loading the events Controller")


// this displays all of the skills
exports.getAllEvents = ( req, res ) => {
  console.log('in getAllEvents')
  Event.find( {} )
    .exec()
    .then( ( events ) => {
      res.render( 'events', {
        events: events
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'event promise complete' );
    } );
};




exports.saveEvent = ( req, res ) => {
  console.log("in saveEvent!")
  console.dir(req)
  let newEvent = new Event( {
    name: req.body.name,
    location: req.body.location,
    time: req.body.location,
    date: req.body.date,
    type: req.body.type,
    description: req.body.description
  } )

  console.log("event = "+newEvent)

  newEvent.save()
    .then( () => {
      res.redirect( '/events' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteEvent = (req, res) => {
  console.log("in deleteEvent")
  let eventName = req.body.deleteName
  if (typeof(eventName)=='string') {
      Event.deleteOne({name:eventName})
           .exec()
           .then(()=>{res.redirect('/events')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(eventName)=='object'){
      Event.deleteMany({name:{$in:eventName}})
           .exec()
           .then(()=>{res.redirect('/events')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(eventName)=='undefined'){
      console.log("This is if they didn't select a event")
      res.redirect('/events')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown eventName: ${eventName}`)
  }

};
