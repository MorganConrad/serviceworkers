# Example 3: A Realistic Fetch Handler

In this example, we have only one Service Worker, with one listener to the "fetch" event.
This is intended as a vaguely realistic Service Worker

See SW_03.js

There are many many fetching strategies.  Here we provide examples of

### cacheFirstThenNetwork()

Fast, best for content that doesn't change.

 1. Check for content already in cache.  If present, return it, **done**
 2. Fetch response from network
 3. Add cloned response to cache.  (there are cases where you don't want to cache)
 4. Return response.

**Downsides** Though **new** content will get added in steps 2-4, existing content is never updated.
 If it becomes necessary to update content:
  - Could update the Service Worker and "V" number on cache to delete old content.
  - There is an alternative strategy to check cache first, but then **always** perform steps 2-4 anyway.

### networkFirstThenCache()

Safest, as content will always be "fresh".  Easy to update.

 1. Fetch response from network.  (option - put on a timeout)
 2. Possibly update the cache so it is fresh.
 3. If network fails, read from cache.

**Downsides**  Slower, since always takes a time hit connecting to network.

### Various Hybrids
 - cache-first for assets, but network-first for html
   - single listener or multiple?
 - fetch only small changing parts and render/template client-side (see next exercise)


### See also - things to do in a real situation.

 - `shouldCacheThis()` : not all content should be cached
 - `shouldHandleFetch()` : some content (e.g. offsite) should just use the default fetch.
