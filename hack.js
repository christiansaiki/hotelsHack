const airbnb = require('airbnbapi-enhanced')
const to = require('await-to-js').default;
module.exports = async function (ctx, cb) {
  const checkin = ctx.data.checkin.replace(/-/g, '/')
  const checkout = ctx.data.checkout.replace(/-/g, '/')
  const location = ctx.data.location
  const guests = ctx.data.guests
  const [airbnbErr, token] = await to(airbnb.newAccessToken({username: ctx.data.AIRBNB_USER, password: ctx.data.AIRBNB_PASS}))
  if (airbnbErr) return cb(airbnbErr)
  const airbnbOptions = {
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
  }
  const [airbnbErr2, values] = await to(airbnb.listingSearch(airbnbOptions))
  if (airbnbErr2) return cb(airbnbErr)
  const response = values.search_results.map(home => {
    return {
      url: `https://www.airbnb.com/rooms/${home.listing.id}?check_in=${checkin}&check_out=${checkout}&guests=${guests}`,
      price: home.pricing_quote.localized_total_price,
      rating: home.listing.star_rating,
      type: 'Airbnb'
    }
  })
  cb(null, response)
}


