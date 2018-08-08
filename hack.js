const airbnb = require('airbnbapi-enhanced')
module.exports = function (ctx, cb) {
  console.log(ctx)
  const checkin = ctx.data.checkin.replace(/-/g, '/')
  const checkout = ctx.data.checkout.replace(/-/g, '/')
  const location = ctx.data.location
  const guests = ctx.data.guests
  airbnb.newAccessToken({username:'christian.saiki@thevelops.com', password:'thevelops123!'})
  .then(token => {
  airbnb.listingSearch({
    token: token.token,
    location,
    offset: 0,
    limit: 20,
    maxPrice: 280,
    language: 'en-US',
    currency: 'BRL',
    checkin,
    checkout,
    roomTypes: ['Entire home/apt'],
    guests,
    sortDirection: 1
  }).then(values => {
    const response = values.search_results.map(home => {
      return {
        url: `https://www.airbnb.com/rooms/${home.listing.id}?check_in=${checkin}&check_out=${checkout}&guests=${guests}`,
        price: home.pricing_quote.localized_total_price,
        rating: home.listing.star_rating,
        number_of_reviews: home.listing.reviews
      }
    })
    cb(null, response)
  })
  })
}


