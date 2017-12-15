var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
var passport = require('passport');
var graphql = require('graphql-request')
var mongoose = require('mongoose')

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
  }
  res.redirect('/')
}

function setRenderVars(req, res, next){
  res.locals.renderVars = {
    SITE_URL: process.env.SITE_URL, 
  }
  next();
}

router.get('/', setRenderVars, isLoggedIn, function(req, res) {
  //console.log( res.locals.renderVars )
  res.render('index', res.locals.renderVars );
});

// Add user going to bar
router.get('/attend', requireLoggedIn, function(req, res){
  // add to db and if fail revert going
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

// Async query
router.get('/search/:query', function(req, res ){
  //console.log('searching: ' + req.params.query)
  var client = new graphql.GraphQLClient(
    'https://api.yelp.com/v3/graphql', 
    { 
      headers: {
        'Authorization': 'Bearer ' + process.env.YELP_KEY
      }
    }
  )
  var query = `{
    search(location: "${req.params.query}", categories: "bars", limit: 10) {
      business{
        name
        url
        location {
          formatted_address
        }
        photos
        reviews {
          text
        }
      }
    }
  }`
  //console.log(query)
  client.request(query).then( data =>{ 
    // Remove unused text
    var response = data.search.business.map((i)=>{
      i.reviews = i.reviews[0];
      return i;
    })
    // query goingto database
    res.json(response)
  }).catch(err => console.log(err))
})
module.exports = router;
