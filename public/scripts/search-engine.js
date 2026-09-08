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
    var hasEgg = /\b(egg|eggs|anda|omelet|omelette|bhurji|french toast|boiled egg)\b/i.test(full);

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

    var result = [];
    var added = true;
    while (added) {
      added = false;
      for (var k = 0; k < vendorKeys.length; k++) {
        var vKey = vendorKeys[k];
        if (vendorBuckets[vKey] && vendorBuckets[vKey].length > 0) {
          result.push(vendorBuckets[vKey].shift());
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
    return item;
  }

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

      getWhatsAppHref: function (phone) {
        if (!phone) return '#';
        var digits = String(phone).replace(/[^0-9]/g, '');
        var full = digits.length === 10 ? '91' + digits : (digits.startsWith('91') ? digits : '91' + digits.slice(-10));
        return 'https://wa.me/' + full;
      },

      syncUrl: function () {
        try {
          var url = new URL(window.location.href);
          if (this.query && this.query.trim()) {
            url.searchParams.set('q', this.query.trim());
          } else {
            url.searchParams.delete('q');
          }

          if (this.activeCat && this.activeCat !== 'all') {
            url.searchParams.set('category', this.activeCat);
          } else {
            url.searchParams.delete('category');
          }

          if (this.vibeTag && this.vibeTag !== 'all') {
            url.searchParams.set('tag', this.vibeTag);
          } else {
            url.searchParams.delete('tag');
          }

          if (this.priceBracket && this.priceBracket !== 'all') {
            url.searchParams.set('maxPrice', this.priceBracket);
          } else {
            url.searchParams.delete('maxPrice');
          }

          if (this.vegFilter && this.vegFilter !== 'all') {
            url.searchParams.set('isVeg', this.vegFilter);
          } else {
            url.searchParams.delete('isVeg');
          }

          if (this.activeTab === 'vendors') {
            url.searchParams.set('tab', 'vendors');
          } else {
            url.searchParams.delete('tab');
          }

          var cleanUrl = url.pathname + (url.search ? url.search : '');
          window.history.replaceState(null, '', cleanUrl);
        } catch (e) {}
      },

      init: function () {
        var self = this;
        var debounceTimer = null;
        if (this.$watch) {
          this.$watch('query', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
              self.syncUrl();
            }, 150);
          });
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

        // Fast background hydration of full catalog from cached /api/search-index.json
        if (!window.__SEARCH_INDEX_CACHE__) {
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
                }
              }
            })
            .catch(function () {});
        } else {
          self.allItems = window.__SEARCH_INDEX_CACHE__;
        }
      },

      isVendorOpen: function (opensAt, closesAt) {
        if (!opensAt || !closesAt) return true;
        try {
          var istFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
          var parts = istFormatter.format(new Date()).split(':');
          var curTotal = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          var oParts = opensAt.split(':');
          var cParts = closesAt.split(':');
          var openTotal = parseInt(oParts[0], 10) * 60 + parseInt(oParts[1], 10);
          var closeTotal = parseInt(cParts[0], 10) * 60 + parseInt(cParts[1], 10);
          if (openTotal < closeTotal) return curTotal >= openTotal && curTotal < closeTotal;
          if (openTotal > closeTotal) return curTotal >= openTotal || curTotal < closeTotal;
          return true;
        } catch (e) {
          return true;
        }
      },

      isItemVendorOpen: function (item) {
        if (!item) return false;
        if (item.vendorOpensAt && item.vendorClosesAt) {
          return this.isVendorOpen(item.vendorOpensAt, item.vendorClosesAt);
        }
        for (var i = 0; i < this.allVendors.length; i++) {
          var v = this.allVendors[i];
          if ((item.vendorId && v.id === item.vendorId) ||
              (item.vendorSlug && v.slug && v.slug.toLowerCase() === item.vendorSlug.toLowerCase())) {
            return this.isVendorOpen(v.opensAt, v.closesAt);
          }
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
        return this.filteredItems.filter(function (i) {
          return i.vendorId === vendorId || i.stallId === vendorId;
        }).length;
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

      get filteredVendors() {
        var self = this;
        var matchingItemVendorIds = new Set();
        var matchedItems = this.filteredItems;
        for (var j = 0; j < matchedItems.length; j++) {
          var itm = matchedItems[j];
          if (itm.vendorId) matchingItemVendorIds.add(itm.vendorId);
          if (itm.stallId) matchingItemVendorIds.add(itm.stallId);
        }

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

            var hasMatchingItems = matchingItemVendorIds.has(v.id);
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
        var self = this;
        var list = this.allItems;

        // 0. Exclude closed vendors
        list = list.filter(function (i) {
          return self.isItemVendorOpen(i);
        });

        // 1. Category Filter
        if (this.activeCat && this.activeCat !== 'all') {
          var catSlug = this.activeCat.toLowerCase();
          list = list.filter(function (i) {
            return (i.categorySlug && i.categorySlug.toLowerCase() === catSlug) ||
                   (i.categoryName && i.categoryName.toLowerCase() === catSlug);
          });
        }

        // 2. Vibe Filter
        if (this.vibeTag && this.vibeTag !== 'all') {
          var vibe = this.vibeTag.toLowerCase();
          list = list.filter(function (i) {
            var full = i._searchTokens || '';
            if (vibe === 'protein') {
              return /paneer|egg|chicken|soya|bhurji|protein|whey|chana|tofu|peanut/i.test(full);
            }
            if (vibe === 'late-night') {
              return /maggi|roll|fries|sandwich|canteen|coffee|tea|burger/i.test(full);
            }
            if (vibe === 'spicy') {
              return /spicy|peri|schezwan|chilli|momo|kurkure|crispy|tandoori/i.test(full);
            }
            if (vibe === 'cheese') {
              return /cheese|cheesy|mozzarella|pizza|loaded|garlic bread|pasta/i.test(full);
            }
            if (vibe === 'shakes') {
              return (i.categorySlug && i.categorySlug.indexOf('beverage') !== -1) ||
                     /shake|smoothie|coffee|cold coffee|boba|oreo|kitkat|mojito/i.test(full);
            }
            if (vibe === 'healthy') {
              return /juice|fruit|salad|sprouts|green tea|coconut|curd/i.test(full);
            }
            if (vibe === 'bestseller') {
              return /bestseller|popular|top-rated|chef-special/i.test(full);
            }
            return full.indexOf(vibe) !== -1;
          });
        }

        // 3. Price Filter
        if (this.priceBracket && this.priceBracket !== 'all') {
          var b = this.priceBracket;
          list = list.filter(function (i) {
            var p = Number(i.price);
            if (isNaN(p)) return false;
            if (b === 'under-50' || b === '50') return p <= 50;
            if (b === '50-100' || b === '100') return p > 50 && p <= 100;
            if (b === '100-150' || b === '150') return p > 100 && p <= 150;
            if (b === 'above-150' || b === '150+') return p > 150;
            return true;
          });
        }

        // 4. Diet Filter
        if (this.vegFilter !== 'all') {
          var targetDiet = this.vegFilter;
          list = list.filter(function (i) {
            return (i._diet || detectDiet(i)) === targetDiet;
          });
        }

        // 5. Keyword Matching
        if (!this.query.trim()) {
          return fairInterleaveByVendor(list);
        }

        var rawQuery = this.query.toLowerCase().trim();
        var tokens = rawQuery.split(/\s+/).filter(Boolean);

        var matchingEntries = [];
        for (var idx = 0; idx < list.length; idx++) {
          var item = list[idx];
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
        }

        return fairInterleaveRankedEntries(matchingEntries);
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

      loadMore: function () {
        this.displayLimit += 20;
      },

      get totalCount() {
        return this.menuItems.length;
      },

      get searchedItems() {
        var queryStr = (this.searchQuery || '').trim().toLowerCase();
        if (!queryStr) return this.menuItems;

        var tokens = queryStr.split(/\s+/).filter(Boolean);
        var normTokens = tokens.map(normalizePhonetics);
        var res = [];

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
        return this.categories.filter(function (cat) {
          return self.getCatCount(cat.slug) > 0;
        });
      },

      getCatCount: function (slug) {
        if (slug === 'all') return this.searchedItems.length;
        var count = 0;
        for (var i = 0; i < this.searchedItems.length; i++) {
          var item = this.searchedItems[i];
          if (item.categorySlug === slug || String(item.categoryId) === slug) {
            count++;
          }
        }
        return count;
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
