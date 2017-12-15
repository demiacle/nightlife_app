var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
var passport = require('passport');
var graphql = require('graphql-request')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { SITE_URL: process.env.SITE_URL });
});
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/' }), function(req,res) {
    res.redirect('/')
})

router.get('/search/:query', function(req, res ){
  console.log('searching: ' + req.params.query)
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
  console.log(query)
  client.request(query).then( data =>{ 
      console.log(data) 
      res.json(data)
    }).catch(err => console.log(err))
})
module.exports = router;
