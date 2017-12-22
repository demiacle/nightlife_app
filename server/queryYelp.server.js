var graphql = require('graphql-request')
var bars = require('../models/bars.js')


var client = new graphql.GraphQLClient(
    'https://api.yelp.com/v3/graphql',
    {
        headers: {
            'Authorization': 'Bearer ' + process.env.YELP_KEY
        }
    }
)

async function queryYelp(query) {
    var graphQuery = `{
    search(location: "${query}", categories: "bars", limit: 10) {
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
    return await new Promise(function (fullfilled, rejected) {
        client.request(graphQuery).then(data => {
            var queryBarIds = []
            var response = data.search.business.map((i) => {
                // Remove unused text
                i.reviews = i.reviews[0];
                queryBarIds.push(i.id)
                return i;
            })
            // Find bars previously searched for
            bars.find({ yelpId: queryBarIds }, function (err, doc) {
                if (err)
                    console.log(err)

                //console.log(doc)
                // Check if bar has been previously queried > if doc exists set the correct peopleGoing > if not create new
                var barsToCreate = response.reduce((barsNotFound, item) => {
                    for (var i = 0; i < doc.length; i++) {
                        if (doc[i].yelpId == item.id) {
                            item.peopleGoing = doc[i].peopleGoing.length;
                            //console.log(doc[i])
                            return barsNotFound;
                        }
                    }
                    item.peopleGoing = 0;
                    barsNotFound.push({ yelpId: item.id })
                    return barsNotFound;
                }, [])
                bars.create(barsToCreate, (err) => {
                    if (err)
                        console.log(err)
                    fullfilled( response );
                });
            })
        }).catch(err => console.log(err))
    })
}

module.exports = queryYelp;

