'use strict'

module.exports = {
    twitterAuth: {
		clientID: process.env.TWITTER_ID,
		clientSecret: process.env.TWITTER_SECRET,
		callbackURL: process.env.APP_URL + 'auth/twitter/callback'
	}
}