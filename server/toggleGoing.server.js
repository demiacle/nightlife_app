var bars = require('../models/bars.js')

async function toggleGoing(req, res, next){
  try {
    var peopleGoing = await bars.toggleGoing(req.user._id, req.params.businessId);
    // Hacky due to mongoose documentation being shotty on what update actually returns
    peopleGoing = peopleGoing.length == 1 ? -1 : 1;
    res.locals.response = { error: false, id: req.params.businessId, peopleGoing: peopleGoing }
    next();
  } catch(err) {
    console.error(err)
    res.locals.response = { error: true }
    next();
  }
}

module.exports = toggleGoing;