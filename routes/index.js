var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
var passport = require('passport');
var graphql = require('graphql-request')

function isLoggedIn(req, res, next){
  if( req.user ){
    res.locals.renderVars.isLoggedIn = true;
    res.locals.renderVars.userName = req.user.twitter.userName;
    console.log('loged in')
  } 
  next();
}

function setRenderVars(req, res, next){
  res.locals.renderVars = {
    SITE_URL: process.env.SITE_URL, 
  }
  next();
}

router.get('/', setRenderVars, isLoggedIn, function(req, res, next) {
  console.log( res.locals.renderVars )
  res.render('index', res.locals.renderVars );
});

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
    search(location: "${req.params.query}", categories: "bars") {
      business{
        name
        id
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
      //console.log(data) 
      res.json(data)
    }).catch(err => console.log(err))
})
module.exports = router;
