/**
 * Orandus Modern Search & Filter Engine
 * External cached script for ultra-fast, $<3ms client-side search across 1000+ campus items.
 * Pre-indexes items to eliminate regex parsing and memory allocations on keystrokes.
 */

(function () {
  'use strict';

  window.getThumbnailUrl = function (rawUrl, size) {
    if (!rawUrl) return '/placeholder-food.svg';
    size = size || 128;
    if (rawUrl.indexOf('res.cloudinary.com') !== -1) {
      var uploadIdx = rawUrl.indexOf('/upload/');
      if (uploadIdx !== -1) {
        var prefix = rawUrl.slice(0, uploadIdx + 8);
        var suffix = rawUrl.slice(uploadIdx + 8).replace(/^([a-zA-Z0-9_,]+)\//, '');
        return prefix + 'f_auto,q_auto,w_' + size + ',c_limit/' + suffix;
      }
    }
    if (rawUrl.indexOf('images.unsplash.com') !== -1) {
      try {
        var u = new URL(rawUrl);
        u.searchParams.set('auto', 'format');
        u.searchParams.set('fit', 'crop');
        u.searchParams.set('w', String(size));
        u.searchParams.set('q', '75');
        return u.toString();
      } catch (e) {
        return rawUrl;
      }
    }
    return rawUrl;
  };

  var STOP_WORDS = new Set(['in', 'on', 'at', 'to', 'of', 'for', 'with', 'a', 'an', 'the', 'and', 'or', 'is', 'by', 'as']);

  function normalizePhonetics(str) {
    return (str || '').toLowerCase()
      .replace(/aa/g, 'a')
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u')
      .replace(/nn/g, 'n')
      .replace(/tt/g, 't')
      .replace(/pp/g, 'p')
      .replace(/rr/g, 'r')
      .replace(/ll/g, 'l')
      .replace(/mm/g, 'm')
      .replace(/kk/g, 'k')
      .replace(/ss/g, 's')
      .replace(/zz/g, 'z')
      .replace(/ph/g, 'f')
      .replace(/bh/g, 'b')
      .replace(/dh/g, 'd')
      .replace(/th/g, 't')
      .replace(/sh/g, 's')
      .replace(/[^a-z0-9]/g, '');
  }

  function isFuzzyTokenMatch(queryToken, targetWords, fullText) {
    if (!queryToken) return false;
    if (fullText.indexOf(queryToken) !== -1) return true;
    if (queryToken.endsWith('s') && fullText.indexOf(queryToken.slice(0, -1)) !== -1) return true;
    if (queryToken.endsWith('es') && fullText.indexOf(queryToken.slice(0, -2)) !== -1) return true;

    var normQuery = normalizePhonetics(queryToken);

    for (var k = 0; k < targetWords.length; k++) {
      var word = targetWords[k];
      if (!word || word.length < 2 || STOP_WORDS.has(word)) continue;
      if (word === queryToken) return true;
      if (word.indexOf(queryToken) !== -1) return true;
      if (queryToken.length >= 4 && word.length >= 4 && word.length >= queryToken.length * 0.75) {
        if (queryToken.indexOf(word) === 0) return true;
      }
      var normWord = normalizePhonetics(word);
      if (normWord && normQuery && (normWord === normQuery || normWord.indexOf(normQuery) !== -1 || normQuery.indexOf(normWord) !== -1)) {
        return true;
      }
    }
    return false;
  }

  function detectDiet(item) {
    if (!item) return 'veg';
    var name = (item.name || '').toLowerCase();
    var desc = (item.description || '').toLowerCase();
    var rawTags = Array.isArray(item.tags)
      ? item.tags
      : (typeof item.tags === 'string' ? [item.tags] : []);
    var tagsText = rawTags.join(' ').toLowerCase();
    var full = name + ' ' + desc + ' ' + tagsText;

    var isMeat = /chicken|mutton|fish|prawn|kebab|kabab|keema|meat|tangri|kalmi|seekh|basa/i.test(full);
    var hasEgg = /\b(egg|eggs|anda|omelet|omelette|french toast|boiled egg)\b/i.test(full) || /\b(egg\s+bhurji|anda\s+bhurji)\b/i.test(full);
    var isExplicitlyVeg = /\b(paneer|soya|tofu|dal|mushroom|aloo|gobi|chole|rajma|veg)\b/i.test(name) && !/\b(egg|eggs|anda|chicken|mutton|fish|meat)\b/i.test(name);

    if (isExplicitlyVeg && !isMeat && !hasEgg) return 'veg';
    if (hasEgg && !isMeat) return 'egg';
    if (isMeat || item.isVeg === false || item.isVeg === 0) {
      return isMeat ? 'nonveg' : (hasEgg ? 'egg' : 'nonveg');
    }
    return 'veg';
  }

  function fairInterleaveByVendor(items) {
    if (!items || items.length <= 1) return items;
    var vendorBuckets = {};
    var vendorKeys = [];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var key = item.vendorSlug || item.vendorName || String(item.vendorId) || 'unknown';
      if (!vendorBuckets[key]) {
        vendorBuckets[key] = [];
        vendorKeys.push(key);
      }
      vendorBuckets[key].push(item);
    }

    for (var j = vendorKeys.length - 1; j > 0; j--) {
      var rand = Math.floor(Math.random() * (j + 1));
      var tmp = vendorKeys[j];
      vendorKeys[j] = vendorKeys[rand];
      vendorKeys[rand] = tmp;
    }

    var bucketIndices = {};
    for (var b = 0; b < vendorKeys.length; b++) {
      bucketIndices[vendorKeys[b]] = 0;
    }

    var result = [];
    var added = true;
    while (added) {
      added = false;
      for (var k = 0; k < vendorKeys.length; k++) {
        var vKey = vendorKeys[k];
        var bucket = vendorBuckets[vKey];
        var idx = bucketIndices[vKey];
        if (bucket && idx < bucket.length) {
          result.push(bucket[idx]);
          bucketIndices[vKey] = idx + 1;
          added = true;
        }
      }
    }
    return result;
  }

  function fairInterleaveRankedEntries(entries) {
    if (!entries || entries.length === 0) return [];
    if (entries.length === 1) return [entries[0].item];

    entries.sort(function (a, b) { return b.score - a.score; });

    var scoreBands = {};
    var scores = [];
    for (var i = 0; i < entries.length; i++) {
      var sc = entries[i].score;
      if (!scoreBands[sc]) {
        scoreBands[sc] = [];
        scores.push(sc);
      }
      scoreBands[sc].push(entries[i].item);
    }

    var finalResult = [];
    for (var k = 0; k < scores.length; k++) {
      var band = scoreBands[scores[k]];
      var interleavedBand = fairInterleaveByVendor(band);
      for (var m = 0; m < interleavedBand.length; m++) {
        finalResult.push(interleavedBand[m]);
      }
    }
    return finalResult;
  }

  var _cachedCurrentMinute = -1;
  var _lastCurTotal = 0;

  function getCurrentIstMinutes() {
    var nowMinute = Math.floor(Date.now() / 60000);
    if (nowMinute === _cachedCurrentMinute) {
      return _lastCurTotal;
    }
    try {
      var istFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
      var parts = istFormatter.format(new Date()).split(':');
      _lastCurTotal = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } catch (e) {
      var d = new Date();
      var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      var ist = new Date(utc + (3600000 * 5.5));
      _lastCurTotal = ist.getHours() * 60 + ist.getMinutes();
    }
    _cachedCurrentMinute = nowMinute;
    return _lastCurTotal;
  }

  var VIBE_PATTERNS = {
    protein: /paneer|egg|chicken|soya|bhurji|protein|whey|chana|tofu|peanut/i,
    'late-night': /maggi|roll|fries|sandwich|canteen|coffee|tea|burger/i,
    spicy: /spicy|peri|schezwan|chilli|momo|kurkure|crispy|tandoori/i,
    cheese: /cheese|cheesy|mozzarella|pizza|loaded|garlic bread|pasta/i,
    shakes: /shake|smoothie|coffee|cold coffee|boba|oreo|kitkat|mojito/i,
    healthy: /juice|fruit|salad|sprouts|green tea|coconut|curd/i,
    bestseller: /bestseller|popular|top-rated|chef-special/i
  };

  function preIndexItem(item) {
    var name = (item.name || '').toLowerCase();
    var cat = (item.categoryName || item.categorySlug || '').toLowerCase();
    var rawTags = Array.isArray(item.tags)
      ? item.tags
      : (typeof item.tags === 'string' ? [item.tags] : []);
    var tagsText = rawTags.join(' ').toLowerCase();
    var vName = (item.vendorName || '').toLowerCase();
    var desc = (item.description || '').toLowerCase();

    var full = name + ' ' + cat + ' ' + tagsText + ' ' + vName + ' ' + desc;
    item._searchTokens = full;
    item._words = full.split(/[\s,()\/+-]+/).filter(Boolean);
    item._normTokens = normalizePhonetics(full);
    item._diet = detectDiet(item);
    item.price = item.price != null ? Number(item.price) : 0;
    item._catSlug = (item.categorySlug || '').toLowerCase();
    item._catName = (item.categoryName || '').toLowerCase();

    // Pre-calculate vibe flags for O(1) instant tag filtering
    var vibeMap = {};
    for (var vKey in VIBE_PATTERNS) {
      if (vKey === 'shakes' && item._catSlug.indexOf('beverage') !== -1) {
        vibeMap[vKey] = true;
      } else if (VIBE_PATTERNS[vKey].test(full)) {
        vibeMap[vKey] = true;
      }
    }
    item._vibeMap = vibeMap;
    return item;
  }

  function formatTime12h(timeStr) {
    if (!timeStr) return '';
    var clean = String(timeStr).trim();
    var parts = clean.split(':');
    if (parts.length < 2) return clean;
    var hour = parseInt(parts[0], 10);
    var minute = parts[1].slice(0, 2).padStart(2, '0');
    if (isNaN(hour)) return clean;
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return hour + ':' + minute + ' ' + ampm;
  }

  function getVendorTimingStatus(opensAt, closesAt) {
    if (!opensAt || !closesAt) {
      return { isOpen: true, statusText: 'Open Today', isUrgent: false };
    }
    var currentTotal = getCurrentIstMinutes();
    var oParts = String(opensAt).split(':');
    var cParts = String(closesAt).split(':');
    var openTotal = parseInt(oParts[0], 10) * 60 + parseInt(oParts[1], 10);
    var closeTotal = parseInt(cParts[0], 10) * 60 + parseInt(cParts[1], 10);
    if (isNaN(openTotal) || isNaN(closeTotal)) {
      return { isOpen: true, statusText: 'Open Today', isUrgent: false };
    }

    var openTimeFormatted = formatTime12h(opensAt);
    var closeTimeFormatted = formatTime12h(closesAt);

    // Normal same-day hours (e.g., 08:00 to 23:00)
    if (openTotal < closeTotal) {
      var isOpen = currentTotal >= openTotal && currentTotal < closeTotal;
      if (isOpen) {
        var minutesUntilClose = closeTotal - currentTotal;
        if (minutesUntilClose <= 45) {
          return { isOpen: true, statusText: 'Closing soon', isUrgent: true };
        }
        if (minutesUntilClose <= 75) {
          return { isOpen: true, statusText: 'Closes in ~1 hour', isUrgent: true };
        }
        return { isOpen: true, statusText: 'Until ' + closeTimeFormatted, isUrgent: false };
      } else {
        var minutesUntilOpen;
        if (currentTotal < openTotal) {
          minutesUntilOpen = openTotal - currentTotal;
        } else {
          minutesUntilOpen = (1440 - currentTotal) + openTotal;
        }
        if (minutesUntilOpen <= 60) {
          return { isOpen: false, statusText: 'Opens in an hour', isUrgent: false };
        }
        return { isOpen: false, statusText: 'Opens at ' + openTimeFormatted, isUrgent: false };
      }
    }

    // Overnight hours (e.g., 18:00 to 02:00 next day)
    if (openTotal > closeTotal) {
      var isOpenOvernight = currentTotal >= openTotal || currentTotal < closeTotal;
      if (isOpenOvernight) {
        var minutesUntilCloseOvernight = currentTotal >= openTotal
          ? (1440 - currentTotal) + closeTotal
          : closeTotal - currentTotal;
        if (minutesUntilCloseOvernight <= 45) {
          return { isOpen: true, statusText: 'Closing soon', isUrgent: true };
        }
        if (minutesUntilCloseOvernight <= 75) {
          return { isOpen: true, statusText: 'Closes in ~1 hour', isUrgent: true };
        }
        return { isOpen: true, statusText: 'Until ' + closeTimeFormatted, isUrgent: false };
      } else {
        var minutesUntilOpenOvernight = openTotal - currentTotal;
        if (minutesUntilOpenOvernight <= 60) {
          return { isOpen: false, statusText: 'Opens in an hour', isUrgent: false };
        }
        return { isOpen: false, statusText: 'Opens at ' + openTimeFormatted, isUrgent: false };
      }
    }

    return { isOpen: true, statusText: 'Open 24 Hours', isUrgent: false };
  }

  window.getVendorTimingStatus = getVendorTimingStatus;
  window.formatTime12h = formatTime12h;

  // Global search component definition for Alpine.js
  window.searchPage = function (config) {
    config = config || {};
    var rawItems = Array.isArray(config.initialItems) ? config.initialItems : [];
    for (var i = 0; i < rawItems.length; i++) {
      preIndexItem(rawItems[i]);
    }

    return {
      activeTab: (config.initialTab === 'stalls' || config.initialTab === 'vendors') ? 'vendors' : 'dishes',
      query: config.initialQuery || '',
      activeCat: config.initialCategory || 'all',
      vibeTag: config.initialTag || 'all',
      priceBracket: config.initialMaxPrice ? (
        config.initialMaxPrice === '50' ? 'under-50' :
        config.initialMaxPrice === '100' ? '50-100' :
        config.initialMaxPrice === '150' ? '100-150' :
        config.initialMaxPrice === '150+' ? 'above-150' : config.initialMaxPrice
      ) : 'all',
      vegFilter: (config.initialIsVeg === 'true' || config.initialIsVeg === 'veg') ? 'veg' :
                 (config.initialIsVeg === 'egg' || config.initialIsVeg === 'eggs') ? 'egg' :
                 ((config.initialIsVeg === 'false' || config.initialIsVeg === 'nonveg' || config.initialIsVeg === 'non-veg') ? 'nonveg' : 'all'),
      displayLimit: 20,
      expandedVendors: {},
      allVendors: Array.isArray(config.initialVendors) ? config.initialVendors : [],
      allItems: rawItems,
      selectedItem: null,
      showDetailModal: false,
      loadingReviews: false,

      formatCount: function (count) {
        var num = Number(count) || 0;
        return num > 99 ? '99+' : String(num);
      },

      toggleVendorExpand: function (vendorName) {
        this.expandedVendors[vendorName] = !this.expandedVendors[vendorName];
      },

      loadMore: function () {
        this.displayLimit += 20;
      },

      switchTab: function (tab) {
        this.activeTab = tab;
        this.syncUrl();
      },

      openDetail: function (item) {
        this.selectedItem = item;
        this.showDetailModal = true;
        if (item && !item.reviews && item.id) {
          var self = this;
          self.loadingReviews = true;
          fetch('/api/reviews?menuItemId=' + encodeURIComponent(item.id))
            .then(function (res) { return res.json(); })
            .then(function (data) {
              if (self.selectedItem && self.selectedItem.id === item.id) {
                self.selectedItem.reviews = data.reviews || [];
              }
              item.reviews = data.reviews || [];
            })
            .catch(function () {
              if (self.selectedItem && self.selectedItem.id === item.id) {
                self.selectedItem.reviews = [];
              }
            })
            .finally(function () {
              self.loadingReviews = false;
            });
        }
      },

      getItemDiet: function (item) {
        return (item && item._diet) ? item._diet : detectDiet(item);
      },

      getTelHref: function (phone) {
        if (!phone) return '#';
        var digits = String(phone).replace(/[^0-9]/g, '');
        if (digits.length === 10) return 'tel:+91' + digits;
        if (digits.length > 10 && digits.startsWith('91')) return 'tel:+' + digits;
        return 'tel:+91' + digits.slice(-10);
      },

      isPureVeg: function (vendor) {
        if (!vendor) return false;
        if (typeof vendor.isPureVeg === 'boolean') return vendor.isPureVeg;
        var slug = (vendor.slug || '').toLowerCase();
        var name = (vendor.name || '').toLowerCase();
        if (
          slug === 'apna-fast-food' ||
          slug === 'apna-fresh-fast-food' ||
          slug === 'bakers-bite-kkr' ||
          slug === 'bakers-bite' ||
          slug === 'yummy-tummy-foods' ||
          slug === 'yummy-tummy' ||
          slug === 'pizza-king'
        ) {
          return true;
        }
        if (
          name.indexOf('apna') !== -1 ||
          name.indexOf('bakers bite') !== -1 ||
          name.indexOf('yummy tummy') !== -1 ||
          name.indexOf('pizza king') !== -1
        ) {
          return true;
        }
        return false;
      },

      getWhatsAppHref: function (phone) {
        if (!phone) return '#';
        var digits = String(phone).replace(/[^0-9]/g, '');
        var full = digits.length === 10 ? '91' + digits : (digits.startsWith('91') ? digits : '91' + digits.slice(-10));
        return 'https://wa.me/' + full;
      },

      _syncTimer: null,
      syncUrl: function () {
        var self = this;
        clearTimeout(this._syncTimer);
        this._syncTimer = setTimeout(function () {
          try {
            var url = new URL(window.location.href);
            if (self.query && self.query.trim()) {
              url.searchParams.set('q', self.query.trim());
            } else {
              url.searchParams.delete('q');
            }

            if (self.activeCat && self.activeCat !== 'all') {
              url.searchParams.set('category', self.activeCat);
            } else {
              url.searchParams.delete('category');
            }

            if (self.vibeTag && self.vibeTag !== 'all') {
              url.searchParams.set('tag', self.vibeTag);
            } else {
              url.searchParams.delete('tag');
            }

            if (self.priceBracket && self.priceBracket !== 'all') {
              url.searchParams.set('maxPrice', self.priceBracket);
            } else {
              url.searchParams.delete('maxPrice');
            }

            if (self.vegFilter && self.vegFilter !== 'all') {
              url.searchParams.set('isVeg', self.vegFilter);
            } else {
              url.searchParams.delete('isVeg');
            }

            if (self.activeTab === 'vendors') {
              url.searchParams.set('tab', 'vendors');
            } else {
              url.searchParams.delete('tab');
            }

            var cleanUrl = url.pathname + (url.search ? url.search : '');
            window.history.replaceState(null, '', cleanUrl);
          } catch (e) {}
        }, 120);
      },

      init: function () {
        var self = this;
        if (this.$watch) {
          this.$watch('query', function () { self.syncUrl(); });
          this.$watch('activeCat', function () { self.syncUrl(); });
          this.$watch('vibeTag', function () { self.syncUrl(); });
          this.$watch('priceBracket', function () { self.syncUrl(); });
          this.$watch('vegFilter', function () { self.syncUrl(); });
        }

        window.addEventListener('review-updated', function (e) {
          var detail = e.detail || {};
          var menuItemId = detail.menuItemId;
          var rating = detail.rating;
          if (!menuItemId) return;
          var target = self.allItems.find(function (i) { return Number(i.id) === Number(menuItemId); });
          if (target) {
            var currentCount = Number(target.reviewCount) || 0;
            var currentAvg = Number(target.avgRating) || Number(rating) || 5;
            var newCount = currentCount + 1;
            var newAvg = ((currentAvg * currentCount + Number(rating)) / newCount).toFixed(1);
            target.reviewCount = newCount;
            target.avgRating = newAvg;
            if (self.selectedItem && Number(self.selectedItem.id) === Number(menuItemId)) {
              self.selectedItem.reviewCount = newCount;
              self.selectedItem.avgRating = newAvg;
            }
          }
        });

        // Dual-Layer Offline Persistence:
        // 1. Instant 0ms hydration from localStorage snapshot if available
        if (!window.__SEARCH_INDEX_CACHE__) {
          try {
            var localCached = localStorage.getItem('orandus_search_catalog_v1');
            if (localCached) {
              var parsed = JSON.parse(localCached);
              if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
                window.__SEARCH_INDEX_CACHE__ = parsed.items;
                for (var idx = 0; idx < parsed.items.length; idx++) {
                  preIndexItem(parsed.items[idx]);
                }
                self.allItems = parsed.items;
                if (Array.isArray(parsed.vendors) && parsed.vendors.length > 0) {
                  self.allVendors = parsed.vendors;
                  self._vendorMap = null;
                }
              }
            }
          } catch (e) {}
        } else {
          self.allItems = window.__SEARCH_INDEX_CACHE__;
        }

        // 2. Fetch fresh catalog from network / Service Worker cache in background
        fetch('/api/search-index.json')
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && data.items && data.items.length > 0) {
              window.__SEARCH_INDEX_CACHE__ = data.items;
              for (var k = 0; k < data.items.length; k++) {
                preIndexItem(data.items[k]);
              }
              self.allItems = data.items;
              if (data.vendors && data.vendors.length > 0) {
                self.allVendors = data.vendors;
                self._vendorMap = null;
              }
              try {
                localStorage.setItem('orandus_search_catalog_v1', JSON.stringify({
                  items: data.items,
                  vendors: data.vendors,
                  savedAt: Date.now()
                }));
              } catch (e) {}
            }
          })
          .catch(function () {});
      },

      _vendorMap: null,
      _getVendorMap: function () {
        if (!this._vendorMap) {
          var map = {};
          var list = this.allVendors || [];
          for (var idx = 0; idx < list.length; idx++) {
            var ven = list[idx];
            if (ven.id) map[ven.id] = ven;
            if (ven.slug) map[ven.slug.toLowerCase()] = ven;
          }
          this._vendorMap = map;
        }
        return this._vendorMap;
      },



      isVendorOpen: function (opensAt, closesAt) {
        return getVendorTimingStatus(opensAt, closesAt).isOpen;
      },

      getVendorTiming: function (vendor) {
        if (!vendor) return { isOpen: true, statusText: 'Open Today', isUrgent: false };
        return getVendorTimingStatus(vendor.opensAt, vendor.closesAt);
      },

      getVendorTimingBadgeClass: function (vendor) {
        var t = this.getVendorTiming(vendor);
        if (t && t.isOpen) {
          return t.isUrgent ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
        return 'bg-slate-100 text-slate-600 border-slate-200';
      },

      getVendorTimingDotClass: function (vendor) {
        var t = this.getVendorTiming(vendor);
        return (t && t.isOpen) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400';
      },

      getVendorTimingText: function (vendor) {
        var t = this.getVendorTiming(vendor);
        return t ? t.statusText : 'Open Today';
      },

      getVendorTimingUrgentClass: function (vendor) {
        var t = this.getVendorTiming(vendor);
        return (t && t.isUrgent) ? 'text-amber-600 font-semibold' : 'text-slate-500';
      },

      getMatchingVendorBadgeClass: function (vendor) {
        var t = this.getVendorTiming(vendor);
        if (t && t.isOpen) {
          return t.isUrgent ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300';
        }
        return 'bg-slate-200 text-slate-700 border-slate-300';
      },

      isItemVendorOpen: function (item) {
        if (!item) return false;
        if (item.vendorOpensAt && item.vendorClosesAt) {
          return this.isVendorOpen(item.vendorOpensAt, item.vendorClosesAt);
        }
        var map = this._getVendorMap();
        var v = (item.vendorId && map[item.vendorId]) ||
                (item.vendorSlug && map[item.vendorSlug.toLowerCase()]);
        if (v) {
          return this.isVendorOpen(v.opensAt, v.closesAt);
        }
        return true;
      },

      get openItemsCount() {
        var self = this;
        return this.allItems.filter(function (i) {
          return self.isItemVendorOpen(i);
        }).length;
      },

      getVendorMatchCount: function (vendorId) {
        if (!vendorId) return 0;
        this.filteredItems;
        return (this._vendorMatchCounts && this._vendorMatchCounts[vendorId]) || 0;
      },

      get matchingVendor() {
        if (!this.query.trim()) return null;
        var q = this.query.trim().toLowerCase();
        var matches = this.filteredVendors;
        for (var i = 0; i < matches.length; i++) {
          var v = matches[i];
          if (v.name && v.name.toLowerCase().indexOf(q) !== -1) return v;
        }
        return null;
      },

      get matchingStall() {
        return this.matchingVendor;
      },

      _lastFilterKey: '',
      _cachedFilteredItems: null,
      _vendorMatchCounts: {},

      get filteredVendors() {
        var self = this;
        // Ensure cache is updated
        this.filteredItems;
        var counts = this._vendorMatchCounts || {};

        var vList = this.allVendors;

        if (this.query.trim()) {
          var rawQuery = this.query.toLowerCase().trim();
          var tokens = rawQuery.split(/\s+/).filter(Boolean);

          vList = vList.filter(function (v) {
            var nameLower = (v.name || '').toLowerCase();
            var addrLower = (v.address || '').toLowerCase();
            var full = nameLower + ' ' + addrLower;
            var words = full.split(/[\s,()\/+-]+/).filter(Boolean);

            var directMatch = tokens.every(function (t) {
              return isFuzzyTokenMatch(t, words, full);
            });

            var hasMatchingItems = Boolean(counts[v.id]);
            return directMatch || hasMatchingItems;
          });
        }

        return vList.slice().sort(function (a, b) {
          var aOpen = self.isVendorOpen(a.opensAt, a.closesAt) ? 1 : 0;
          var bOpen = self.isVendorOpen(b.opensAt, b.closesAt) ? 1 : 0;
          return bOpen - aOpen;
        });
      },

      get filteredItems() {
        var key = (this.query || '').trim().toLowerCase() + '|' +
                  this.activeCat + '|' +
                  this.vibeTag + '|' +
                  this.priceBracket + '|' +
                  this.vegFilter + '|' +
                  this.allItems.length;

        if (this._lastFilterKey === key && this._cachedFilteredItems) {
          return this._cachedFilteredItems;
        }

        var self = this;
        var hasQuery = Boolean(this.query && this.query.trim());
        var rawQuery = hasQuery ? this.query.toLowerCase().trim() : '';
        var tokens = hasQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

        var catFilter = (this.activeCat && this.activeCat !== 'all') ? this.activeCat.toLowerCase() : null;
        var vibeFilter = (this.vibeTag && this.vibeTag !== 'all') ? this.vibeTag.toLowerCase() : null;
        var priceBracket = (this.priceBracket && this.priceBracket !== 'all') ? this.priceBracket : null;
        var vegFilter = (this.vegFilter && this.vegFilter !== 'all') ? this.vegFilter : null;

        var matchingEntries = hasQuery ? [] : null;
        var filteredList = [];

        for (var idx = 0; idx < this.allItems.length; idx++) {
          var item = this.allItems[idx];

          // 0. Exclude closed vendors (O(1) cached lookup)
          if (!self.isItemVendorOpen(item)) continue;

          // 1. Category Filter (Direct string comparison)
          if (catFilter) {
            if (item._catSlug !== catFilter && item._catName !== catFilter) continue;
          }

          // 2. Vibe Filter (Instant O(1) boolean check)
          if (vibeFilter) {
            if (item._vibeMap) {
              if (!item._vibeMap[vibeFilter] && item._searchTokens.indexOf(vibeFilter) === -1) continue;
            } else if (item._searchTokens.indexOf(vibeFilter) === -1) {
              continue;
            }
          }

          // 3. Price Filter (Direct numeric comparison)
          if (priceBracket) {
            var p = item.price;
            if (p == null) continue;
            if ((priceBracket === 'under-50' || priceBracket === '50') && p > 50) continue;
            if ((priceBracket === '50-100' || priceBracket === '100') && (p <= 50 || p > 100)) continue;
            if ((priceBracket === '100-150' || priceBracket === '150') && (p <= 100 || p > 150)) continue;
            if ((priceBracket === 'above-150' || priceBracket === '150+') && p <= 150) continue;
          }

          // 4. Diet Filter
          if (vegFilter) {
            if (item._diet !== vegFilter) continue;
          }

          // 5. Keyword Matching
          if (hasQuery) {
            var searchTokens = item._searchTokens || '';
            var words = item._words || [];
            var allMatch = true;

            for (var t = 0; t < tokens.length; t++) {
              if (!isFuzzyTokenMatch(tokens[t], words, searchTokens)) {
                allMatch = false;
                break;
              }
            }
            if (!allMatch) continue;

            var nameLower = (item.name || '').toLowerCase();
            var score = 0;
            if (nameLower === rawQuery) score += 100;
            else if (nameLower.indexOf(rawQuery) === 0) score += 50;
            else if (nameLower.indexOf(rawQuery) !== -1) score += 30;

            for (var k = 0; k < tokens.length; k++) {
              var tok = tokens[k];
              if (nameLower.indexOf(tok) !== -1) score += 15;
              else if (searchTokens.indexOf(tok) !== -1) score += 8;
            }

            matchingEntries.push({ item: item, score: score });
          } else {
            filteredList.push(item);
          }
        }

        var result = hasQuery ? fairInterleaveRankedEntries(matchingEntries) : fairInterleaveByVendor(filteredList);

        // Precompute vendor match counts once in O(N) for fast O(1) lookups
        var countsMap = {};
        for (var m = 0; m < result.length; m++) {
          var vId = result[m].vendorId || result[m].stallId;
          if (vId) countsMap[vId] = (countsMap[vId] || 0) + 1;
        }
        this._vendorMatchCounts = countsMap;
        this._lastFilterKey = key;
        this._cachedFilteredItems = result;
        return result;
      },

      get visibleItems() {
        return this.filteredItems.slice(0, this.displayLimit);
      },

      get hasActiveFilters() {
        return Boolean(
          (this.query && this.query.trim()) ||
          (this.activeCat && this.activeCat !== 'all') ||
          (this.vibeTag && this.vibeTag !== 'all') ||
          (this.priceBracket && this.priceBracket !== 'all') ||
          (this.vegFilter && this.vegFilter !== 'all')
        );
      },

      get activeFilterCount() {
        var count = 0;
        if (this.query && this.query.trim()) count++;
        if (this.activeCat && this.activeCat !== 'all') count++;
        if (this.vibeTag && this.vibeTag !== 'all') count++;
        if (this.priceBracket && this.priceBracket !== 'all') count++;
        if (this.vegFilter && this.vegFilter !== 'all') count++;
        return count;
      },

      resetAllFilters: function () {
        this.query = '';
        this.activeCat = 'all';
        this.vibeTag = 'all';
        this.priceBracket = 'all';
        this.vegFilter = 'all';
        this.displayLimit = 20;
        this.syncUrl();
      },

      get groupedDishesByVendor() {
        var grouped = [];
        var map = {};
        var list = this.filteredItems;
        for (var k = 0; k < list.length; k++) {
          var itm = list[k];
          var vName = itm.vendorName || 'Campus Food Spot';
          if (!map[vName]) {
            map[vName] = {
              name: vName,
              slug: itm.vendorSlug || '',
              vendorId: itm.vendorId,
              address: itm.vendorAddress || 'NIT Kurukshetra Campus',
              items: []
            };
            grouped.push(map[vName]);
          }
          map[vName].items.push(itm);
        }
        return grouped;
      }
    };
  };

  // Vendor category tabs component definition
  window.categoryTabsComponent = function (config) {
    config = config || {};
    var rawItems = Array.isArray(config.initialMenuItems) ? config.initialMenuItems : [];
    for (var i = 0; i < rawItems.length; i++) {
      preIndexItem(rawItems[i]);
    }

    return {
      activeCat: 'all',
      searchQuery: '',
      searchExpanded: false,
      categories: Array.isArray(config.initialCategories) ? config.initialCategories : [],
      menuItems: rawItems,
      selectedItem: null,
      showDetailModal: false,
      displayLimit: 20,

      // Single-Vendor WhatsApp Cart State (Full-Screen Checkout)
      vendorInfo: {
        slug: config.vendorSlug || '',
        name: config.vendorName || '',
        phone: config.vendorPhone || '',
        whatsapp: config.vendorWhatsApp || ''
      },
      cartItems: [],
      showCartScreen: false,
      orderPlaced: false,
      placedOrder: null,
      lastWhatsAppUrl: '',
      deliveryLocation: 'Back Gate', // Quick chips: 'Back Gate', 'Front Gate', 'Girls Hostel', or custom manual input
      cookingNotes: '',
      studentName: '',
      studentPhone: '',
      phoneError: '',

      loadMore: function () {
        this.displayLimit += 20;
      },

      lockScroll: function (isLocked) {
        if (typeof document === 'undefined') return;
        if (isLocked) {
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          document.documentElement.classList.add('overflow-hidden');
          document.body.classList.add('overflow-hidden');
        } else {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.documentElement.classList.remove('overflow-hidden');
          document.body.classList.remove('overflow-hidden');
        }
      },

      init: function () {
        this.initCart();
        var self = this;
        // Listen for browser back button to smoothly close cart screen
        if (typeof window !== 'undefined') {
          window.addEventListener('popstate', function (e) {
            if (self.showCartScreen) {
              self.showCartScreen = false;
              self.lockScroll(false);
            }
          });
          if (window.location.hash === '#cart') {
            this.showCartScreen = true;
            this.lockScroll(true);
          }
        }
      },

      openCartScreen: function () {
        this.showCartScreen = true;
        this.lockScroll(true);
        if (typeof window !== 'undefined') {
          if (window.location.hash !== '#cart') {
            window.history.pushState({ cart: true }, '', '#cart');
          }
        }
      },

      closeCartScreen: function () {
        this.showCartScreen = false;
        this.lockScroll(false);
        if (typeof window !== 'undefined' && window.location.hash === '#cart') {
          window.history.back();
        }
      },

      initCart: function () {
        try {
          var savedPhone = localStorage.getItem('orandus_student_phone');
          if (savedPhone) this.studentPhone = savedPhone;
          var savedName = localStorage.getItem('orandus_student_name');
          if (savedName) this.studentName = savedName;
          var savedLoc = localStorage.getItem('orandus_delivery_loc');
          if (savedLoc) {
            this.deliveryLocation = savedLoc;
          }

          var raw = localStorage.getItem('orandus_vendor_cart');
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && parsed.vendorSlug === this.vendorInfo.slug && Array.isArray(parsed.items)) {
              this.cartItems = parsed.items;
            }
          }
        } catch (e) {}
      },

      saveCart: function () {
        try {
          if (this.cartItems.length === 0) {
            localStorage.removeItem('orandus_vendor_cart');
          } else {
            localStorage.setItem('orandus_vendor_cart', JSON.stringify({
              vendorSlug: this.vendorInfo.slug,
              vendorName: this.vendorInfo.name,
              vendorPhone: this.vendorInfo.phone,
              vendorWhatsApp: this.vendorInfo.whatsapp,
              items: this.cartItems,
              updatedAt: Date.now()
            }));
          }
        } catch (e) {}
      },

      getItemCartQuantity: function (itemId) {
        if (!itemId || !this.cartItems || this.cartItems.length === 0) return 0;
        var found = this.cartItems.find(function (it) { return it.id === itemId; });
        return found ? found.quantity : 0;
      },

      addToCart: function (item) {
        if (!item) return;
        try {
          var raw = localStorage.getItem('orandus_vendor_cart');
          if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && parsed.vendorSlug && parsed.vendorSlug !== this.vendorInfo.slug && parsed.items && parsed.items.length > 0) {
              var proceed = confirm(
                'Your cart contains items from ' + (parsed.vendorName || 'another stall') + 
                '. Clear it and start an order from ' + (this.vendorInfo.name || 'this stall') + '?'
              );
              if (!proceed) return;
              this.cartItems = [];
              localStorage.removeItem('orandus_vendor_cart');
            }
          }
        } catch (e) {}

        var existing = this.cartItems.find(function (it) { return it.id === item.id; });
        if (existing) {
          existing.quantity += 1;
        } else {
          this.cartItems.push({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: 1,
            diet: this.getItemDiet(item)
          });
        }
        this.orderPlaced = false;
        this.saveCart();
      },

      decrementCartItem: function (itemId) {
        var idx = this.cartItems.findIndex(function (it) { return it.id === itemId; });
        if (idx !== -1) {
          if (this.cartItems[idx].quantity > 1) {
            this.cartItems[idx].quantity -= 1;
          } else {
            this.cartItems.splice(idx, 1);
          }
          this.saveCart();
        }
      },

      removeCartItem: function (itemId) {
        this.cartItems = this.cartItems.filter(function (it) { return it.id !== itemId; });
        this.saveCart();
      },

      clearCart: function () {
        this.cartItems = [];
        this.orderPlaced = false;
        this.placedOrder = null;
        this.saveCart();
      },

      setDeliveryLocation: function (loc) {
        this.deliveryLocation = loc;
        try {
          localStorage.setItem('orandus_delivery_loc', loc);
        } catch (e) {}
      },

      addQuickNote: function (noteText) {
        if (!this.cookingNotes) {
          this.cookingNotes = noteText;
        } else if (this.cookingNotes.indexOf(noteText) === -1) {
          this.cookingNotes += ', ' + noteText;
        }
      },

      get cartTotalCount() {
        var sum = 0;
        for (var i = 0; i < this.cartItems.length; i++) {
          sum += this.cartItems[i].quantity;
        }
        return sum;
      },

      get cartTotalPrice() {
        var sum = 0;
        for (var i = 0; i < this.cartItems.length; i++) {
          sum += this.cartItems[i].price * this.cartItems[i].quantity;
        }
        return sum;
      },

      get isPhoneValid() {
        var clean = (this.studentPhone || '').replace(/\D/g, '');
        return clean.length === 10 && /^[6-9]/.test(clean);
      },

      sendWhatsAppOrder: function () {
        var cleanPhone = (this.studentPhone || '').replace(/\D/g, '');
        if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
          this.phoneError = 'Please enter a valid 10-digit mobile number';
          return;
        }
        this.phoneError = '';

        var finalLoc = (this.deliveryLocation || '').trim() || 'Back Gate';

        try {
          localStorage.setItem('orandus_student_phone', cleanPhone);
          if (this.studentName) {
            localStorage.setItem('orandus_student_name', this.studentName.trim());
          }
          localStorage.setItem('orandus_delivery_loc', finalLoc);
        } catch (e) {}

        var whatsappNum = (this.vendorInfo.whatsapp || '').replace(/\D/g, '');
        if (!whatsappNum) {
          whatsappNum = (this.vendorInfo.phone || '').replace(/\D/g, '');
        }
        if (whatsappNum.length === 10) {
          whatsappNum = '91' + whatsappNum;
        }

        var lines = [];
        lines.push('*New Order* 🍽️');
        if (this.studentName && this.studentName.trim()) {
          lines.push('👤 ' + this.studentName.trim() + ' • +91' + cleanPhone);
        } else {
          lines.push('📱 +91' + cleanPhone);
        }
        lines.push('📍 *Location:* ' + finalLoc);
        if (this.cookingNotes && this.cookingNotes.trim()) {
          lines.push('📝 *Instructions:* ' + this.cookingNotes.trim());
        }
        lines.push('');
        lines.push('*Items:*');
        for (var i = 0; i < this.cartItems.length; i++) {
          var it = this.cartItems[i];
          lines.push('• ' + it.quantity + 'x ' + it.name + ' — ₹' + (it.price * it.quantity));
        }
        lines.push('');
        lines.push('*Total:* ₹' + this.cartTotalPrice + ' (Cash / UPI)');
        lines.push('_Sent via Orandus_');

        var text = encodeURIComponent(lines.join('\n'));
        var waUrl = 'https://wa.me/' + whatsappNum + '?text=' + text;

        this.lastWhatsAppUrl = waUrl;
        this.placedOrder = {
          items: JSON.parse(JSON.stringify(this.cartItems)),
          totalPrice: this.cartTotalPrice,
          totalCount: this.cartTotalCount,
          location: finalLoc,
          name: (this.studentName || '').trim(),
          phone: cleanPhone,
          notes: (this.cookingNotes || '').trim(),
          vendorName: this.vendorInfo.name || 'Vendor',
          vendorPhone: this.vendorInfo.phone || '',
          waUrl: waUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.orderPlaced = true;

        window.open(waUrl, '_blank');
      },

      get totalCount() {
        return this.menuItems.length;
      },

      _lastSearchedQuery: null,
      _cachedSearchedItems: null,
      _catCountMap: null,

      get searchedItems() {
        var queryStr = (this.searchQuery || '').trim().toLowerCase();
        if (this._lastSearchedQuery === queryStr && this._cachedSearchedItems) {
          return this._cachedSearchedItems;
        }

        var res;
        if (!queryStr) {
          res = this.menuItems;
        } else {
          var tokens = queryStr.split(/\s+/).filter(Boolean);
          var normTokens = tokens.map(normalizePhonetics);
          res = [];

          for (var i = 0; i < this.menuItems.length; i++) {
            var item = this.menuItems[i];
            var sTokens = item._searchTokens || '';
            var nTokens = item._normTokens || '';
            var matchesAll = true;

            for (var t = 0; t < tokens.length; t++) {
              var tok = tokens[t];
              var nTok = normTokens[t];
              if (sTokens.indexOf(tok) === -1 && (!nTok || nTokens.indexOf(nTok) === -1)) {
                matchesAll = false;
                break;
              }
            }
            if (matchesAll) res.push(item);
          }
        }

        var counts = { all: res.length };
        for (var k = 0; k < res.length; k++) {
          var it = res[k];
          if (it.categorySlug) counts[it.categorySlug] = (counts[it.categorySlug] || 0) + 1;
          if (it.categoryId) counts[String(it.categoryId)] = (counts[String(it.categoryId)] || 0) + 1;
        }

        this._catCountMap = counts;
        this._lastSearchedQuery = queryStr;
        this._cachedSearchedItems = res;
        return res;
      },

      get displayedItems() {
        var list = this.searchedItems;
        if (this.activeCat === 'all') return list;
        var active = this.activeCat;
        return list.filter(function (i) {
          return i.categorySlug === active || String(i.categoryId) === active;
        });
      },

      get visibleItems() {
        return this.displayedItems.slice(0, this.displayLimit);
      },

      get visibleCategories() {
        var self = this;
        var active = this.categories.filter(function (cat) {
          return self.getCatCount(cat.slug) > 0;
        });
        return active.slice().sort(function (a, b) {
          var countA = self.getCatCount(a.slug);
          var countB = self.getCatCount(b.slug);
          if (countB !== countA) {
            return countB - countA; // Decreasing order: categories with more items first
          }
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });
      },

      getCatCount: function (slug) {
        this.searchedItems;
        return (this._catCountMap && this._catCountMap[slug]) || 0;
      },

      openDetail: function (item) {
        this.selectedItem = item;
        this.showDetailModal = true;
      },

      getItemDiet: function (item) {
        return (item && item._diet) ? item._diet : detectDiet(item);
      },

      shareVendor: async function () {
        var shareUrl = (typeof window !== 'undefined' && window.location.href) ? window.location.href : (config.shareUrlVal || '');
        if (navigator.share) {
          try {
            await navigator.share({
              title: config.shareTitleVal || 'Orandus',
              text: config.shareTextVal || 'Check out this menu on Orandus',
              url: shareUrl
            });
          } catch (e) {}
        } else {
          try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard: ' + shareUrl);
          } catch (e) {
            prompt('Copy link:', shareUrl);
          }
        }
      }
    };
  };
})();
