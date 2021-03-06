/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  static get DATABASE_RESTAURANTS_URL () {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`
  }

  static get DATABASE_REVIEWS_URL () {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants (callback, id) {
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
    // xhr.onload = () => {
    //   if (xhr.status === 200) { // Got a success response from server!
    //     const json = JSON.parse(xhr.responseText);
    //     const restaurants = json.restaurants;
    //     callback(null, restaurants);
    //   } else { // Oops!. Got an error from server.
    //     const error = (`Request failed. Returned status of ${xhr.status}`);
    //     callback(error, null);
    //   }
    // };
    // xhr.send();
    let restaurantFetchURL
    if (!id) {
      restaurantFetchURL = DBHelper.DATABASE_RESTAURANTS_URL
    } else {
      restaurantFetchURL = `${DBHelper.DATABASE_RESTAURANTS_URL}/${id}`
    }
    fetch(restaurantFetchURL, { method: 'GET' })
      .then(response => {
        // console.log(`// DBHelper Fetch. Response is:`)
        // console.log(response.clone())
        // console.log(`// Convert to JSON`)
        // console.log(response.clone().json())
        if (response.status === 200) { // Got a success response from server!
          response.json().then(restaurants => {
            callback(null, restaurants)
          })
        }
      }).catch(error => callback(`Error: ${error}`, null))
    // fetch('http://localhost:1337/restaurants', { method: 'get' })
    //   .then(response => response.json()
    //     .then(data => console.log(data)))
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById (id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // const restaurant = restaurants.find(r => r.id == id)
        const restaurant = restaurants // fetchRestaurants now uses id to fetch JSON for individual restaurants
        if (restaurant) { // Got the restaurant
          callback(null, restaurant)
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null)
        }
      }
    }, id) // id here was missing. It is now passed to fetchRestaurants which uses id in DB
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine (cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood (neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood)
        callback(null, results)
      }
    })
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood (cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood)
        }
        callback(null, results)
      }
    })
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods (callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods)
      }
    })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines (callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null)
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines)
      }
    })
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant (restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant (restaurant) {
    if (restaurant.photograph) {
      return (`/img/build/${restaurant.photograph}`)
    } else {
      return (`/img/build/${restaurant.id}`) // bug fix since the new DB has a restaurant with a missing 'photograph' property
    }
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant (restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap)
    return marker
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

  // Reviews functions

  static fetchReviews (callback, id) {
    let reviewFetchURL
    if (!id) {
      reviewFetchURL = DBHelper.DATABASE_REVIEWS_URL
    } else {
      reviewFetchURL = `${DBHelper.DATABASE_REVIEWS_URL}/?restaurant_id=${id}`
    }
    fetch(reviewFetchURL, { method: 'GET' })
      .then(response => {
        console.log(`// DBHelper Fetched reviews`)
        console.log(response.clone())
        if (response.status === 200) { // Got a success response from server!
          response.json().then(reviews => {
            callback(null, reviews)
          })
        }
      }).catch(error => callback(`Error: ${error}`, null))
  }

  static fetchReviewsById (id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null)
      } else {
        const reviews = reviews
        if (reviews) {
          callback(null, restaurant)
        } else { // Restaurant does not exist in the database
          callback('Review does not exist', null)
        }
      }
    }, id) // id here was missing. It is now passed to fetchRestaurants which uses id in DB
  }
}
