var express = require('express');
var router = express.Router();
var fetch = require('node-fetch')
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { SITE_URL: process.env.SITE_URL });
});
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/' }), function(req,res) {
    res.redirect('/')
})

router.get('/search/:query', function(req, res ){
  console.log( process.env.YELP_KEY)
 fetch('https://api.yelp.com/v3/businesses/search?location='+ encodeURIComponent( req.params.query ) + '&categories=bars', {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + process.env.YELP_KEY
        }
      }).then(function(response) {
        return response.json();
      }).then(function(data) {

        console.log(data)
        res.json(data)
      }).catch(function(err) {
        alert('Error requesting yelp api')
      });
})
module.exports = router;
