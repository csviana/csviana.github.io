/*
 Copyright 2015 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
    offline: 'offline-v' + CACHE_VERSION
};

function createCacheBustedRequest(url) {
    let request = new Request(url, { cache: 'reload' });
    // See https://fetch.spec.whatwg.org/#concept-request-mode
    // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
    // if the cache: 'reload' option had any effect.
    if ('cache' in request) {
        return request;
    }

    // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
    let bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
    return new Request(bustedUrl);
}

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CURRENT_CACHES).then(function (cache) {
            return cache.addAll([
             
                "https://csviana.github.io/logo.png",
                "https://csviana.github.io/venancio.html",
                "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.0/css/bootstrap.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.0/js/bootstrap.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.4.1/jspdf.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.3.4/jspdf.plugin.autotable.js"


            ]);
        })
    );
});

self.addEventListener('activate', event => {
    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names,
                        // then delete it.
                        //console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {

    if (event.request.mode === 'navigate' || (event.request.method === 'GET')) {

        if (
            event.request.url != "/" &&
            event.request.url != "https://csviana.ddns.net/" &&
            event.request.url != "https://csviana.github.io/logo.png" &&
            event.request.url != "https://csviana.github.io/venancio.html" &&
            event.request.url != "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.0/css/bootstrap.min.css" &&
            event.request.url != "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" &&
            event.request.url != "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.0/js/bootstrap.min.js" &&
            event.request.url !=  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.4.1/jspdf.min.js" &&
            event.request.url != "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.3.4/jspdf.plugin.autotable.js"
 
        ) {
            // console.log('Handling fetch event for', event.request.url); 
            return;
        }
        event.respondWith(
            caches.open(CURRENT_CACHES).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {

                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});