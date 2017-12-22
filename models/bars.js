var mongoose = require('mongoose');

var Bars = new mongoose.Schema({
    yelpId: { type: String, index: { unique: true } },
    peopleGoing: [String],
})

Bars.statics.toggleGoing = function(userId, businessId){
  //console.log( businessId)
  //console.log( userId)
  var model = this;
    return model.find({ yelpId: businessId, peopleGoing: userId }, {}, function(err, doc){
        if(doc.length > 0){
            console.log( 'pulling user ' + userId )
            return model.update( { yelpId:businessId}, { $pull: { peopleGoing:userId } }, {}, logError )
        } else {
            console.log( 'adding user ' + userId )
            return model.update( { yelpId:businessId}, { $push: { peopleGoing:userId } },{}, logError )
        }
    })
}

function logError(err, doc, test){
  if(err)
    console.log(err)
  return doc;
}

module.exports = mongoose.model('bars', Bars)