var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
var passport = require('passport');
var mongoose = require('mongoose')

var queryYelp = require('../server/queryYelp.server.js')
var toggleGoing = require('../server/toggleGoing.server.js')

function isLoggedIn(req, res, next){
  if( req.user ){
    res.locals.renderVars.isLoggedIn = true;
    res.locals.renderVars.userName = req.user.twitter.userName;
    console.log('loged in')
  } 
  next();
}
function requireLoggedIn(req, res, next){
  if( req.user ){
    next();
    return; // Absolutely necessary for async middleware!!
  }
  res.redirect('/')
}
function setRenderVars(req, res, next){
  res.locals.renderVars = {
    SITE_URL: process.env.SITE_URL, 
  }
  next();
}

// Home
router.get('/', setRenderVars, isLoggedIn, function(req, res) {
  //console.log( res.locals.renderVars )
  res.render('index', res.locals.renderVars );
});
// Toggle going
router.post('/attend/:businessId', requireLoggedIn, toggleGoing, function(req, res){
  res.json( res.locals.response )
})
// Twitter OAuth
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/' }), function(req,res) {
    res.redirect('/')
})
router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/')
})
// Query
router.get('/search/:query', function(req, res ){
  queryYelp( req.params.query ).then( response => {
    res.json(response)
  })
})
module.exports = router; // unsure if needed
