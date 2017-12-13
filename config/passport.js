'use strict'

var TwitterStrategy = require('passport-twitter').Strategy
var User = require( '../models/users.js')
var configAuth = require('./auth')

module.exports = function( passport ) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	passport.use(new TwitterStrategy({
			consumerKey: process.env.TWITTER_KEY,
			consumerSecret: process.env.TWITTER_SECRET,
			callbackURL: process.env.SITE_URL + 'auth/twitter/callback'
		}, 
		function(token, tokenSecret, profile, done) {
			process.nextTick(function () {
				User.findOne({ 'twitter.id': profile.id }, function (err, user) {
					if (err) {
						return done(err);
					}
				
					if (user) {
						return done(null, user);
					} else {
						var newUser = new User();
						console.log(profile)
						newUser.twitter.id = profile.id;
						newUser.twitter.userName = profile.username;
						newUser.twitter.displayName = profile.displayName;
						
						// maybe have to initialize? unsure
	
						newUser.save(function (err) {
							if (err) {
								throw err;
							}
	
							return done(null, newUser);
						});
					}
				});
			});
		}
	))
}