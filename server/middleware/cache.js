const nodeCache = require('node-cache');

const cache = new nodeCache();


module.exports = duration => (req, res, next) => {
  // Is the request a GET request? If not, skip caching, call next and end execution.
  if (req.method !== "GET") {
    console.log("Cannot cache non-GET methods!");
    return next();
  }
  //Use the path of the request as the cache key.
  // Check if the key exists in the cache
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  // If it does, send the cached result as a response. End execution, don't call next
  if (cachedResponse) {
    console.error(`Cache hit for ${key}`);
    res.send(cachedResponse);
  } else {
    //If it's not in the cache, replace Express's send method with a new method
    //that will put the response body into the cache. Call next.
    console.log(`Cache miss for ${key}`);
    res.originalSend = res.send;
    res.send = body => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};