const Event = require("../../models/event");
const User = require("../../models/user");
const {dateToString} = require('../../helpers/date')
const {transformEvent} = require('./merge');


module.exports = {
    events: async () => {
      try {
        const events = await Event.find().populate("creator");
  
       return events.map((event) => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
  
    createEvent: async (args,req) => {
      if(!req.isAuth){
        throw new Error('Unauthenticated');
      }
      const event = {
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: dateToString(args.eventInput.date),
        creator: req.userId,
      };
      //  events.push(event)
      let createdEvent;
      try {
        const newEvent = new Event(event);
        const result = await newEvent.save();
  
        createdEvent = transformEvent(result);
        const creator = await User.findById(req.userId);
  
        if (!creator) {
          throw new Error("User Not Found");
        }
        creator.createdEvents.push(newEvent);
        const userSaveResult = await creator.save();
  
        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
 
  
  };