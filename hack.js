const airbnb = require('airbnbapi-enhanced')
const to = require('await-to-js').default
const axios = require('axios')
const DateTime = require('luxon').DateTime

module.exports = async function (ctx, cb) {
  // Doing the replace in order to make it easier to pass the dates through querystring
  const checkin = ctx.data.checkin.replace(/-/g, '/')
  const checkout = ctx.data.checkout.replace(/-/g, '/')
  const location = ctx.data.location
  const guests = ctx.data.guests
  const [err, coordinates] = await to(getCoordinates(location, ctx.data.GOOGLE_KEY))
  if (err) return cb(err)

  const airbnbOptions = {
    location,
    offset: 0,
    limit: 10,
    maxPrice: 280,
    language: 'en-US',
    currency: 'BRL',
    checkin,
    checkout,
    roomTypes: ['Entire home/apt'],
    guests,
    sortDirection: 1
  }

  const [err2, result] = await to(Promise.all([
    getHotelsFromCoordinates(coordinates, checkin, checkout, ctx.data.AMADEUS_KEY),
    getAirbnbListing(airbnbOptions)
  ]))
  if (err2) return cb(err2)
  
  cb(null, [].concat(...result))
}


async function getCoordinates (location, apiKey) {
  const [err, response] = await to(axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`))
  if (err) return Promise.reject(err)
  return Promise.resolve(response.data.results[0].geometry.location)
}

async function getHotelsFromCoordinates ({lat, lng}, checkin, checkout, apiKey) {
  const check_in = DateTime.fromFormat(checkin, 'MM/dd/yyyy').toFormat('yyyy-MM-dd')
  const check_out = DateTime.fromFormat(checkout, 'MM/dd/yyyy').toFormat('yyyy-MM-dd')
  const url = `https://api.sandbox.amadeus.com/v1.2/hotels/search-circle?apikey=${apiKey}&latitude=${lat}&longitude=${lng}&radius=20&check_in=${check_in}&check_out=${check_out}&currency=BRL&number_of_results=10`
  const [err, response] = await to(axios.get(url))
  if (err) return Promise.reject(err)
  
  const result = response.data.results.map(hotel => {
    const hotelUrls = hotel.contacts.filter(el => el.type === 'URL')
    return {
      url: hotelUrls.length && hotelUrls[0].detail || hotel.property_name,
      price: Math.round(hotel.total_price.amount),
      type: 'Hotel',
      rating: hotel.awards && hotel.awards[0] && Math.round(hotel.awards[0].rating) || 'NA',
      reviews_count: 'NA'
    }
  })
  return Promise.resolve(result)
}

async function getAirbnbListing (airbnbOptions) {
  const [err, response] = await to(airbnb.listingSearch(airbnbOptions))
  if (err) return Promise.reject(err)
  
  const result = response.search_results.map(home => {
    return {
      url: `https://www.airbnb.com/rooms/${home.listing.id}?check_in=${airbnbOptions.checkin}&check_out=${airbnbOptions.checkout}&guests=${airbnbOptions.guests}`,
      price: home.pricing_quote.localized_total_price,
      rating: home.listing.star_rating,
      type: 'Airbnb',
      reviews_count: home.listing.reviews_count
    }
  })
  return Promise.resolve(result)
}