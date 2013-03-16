// Generated by CoffeeScript 1.3.3
var DB;

chrome.runtime.getBackgroundPage(function(bg) {
  return window.bgPage = bg;
});

DB = {
  init: function() {
    var badge, options, version;
    badge = {};
    options = {
      nbr_episodes_per_serie: 5,
      badge_notification_type: 'watched',
      dl_srt_language: 'VF',
      display_global: false,
      enable_ratings: false,
      max_height: 200,
      display_mean_note: true,
      display_copy_episode: false,
      period_search_notifications: 0,
      display_notifications_icon: true,
      mark_notifs_episode_as_seen: true,
      menu_order: [
        {
          name: 'MemberTimeline',
          img_path: '../img/timeline.png',
          visible: true
        }, {
          name: 'MemberPlanning',
          img_path: '../img/planning.png',
          visible: true
        }, {
          name: 'MyEpisodes',
          img_path: '../img/episodes.png',
          visible: true
        }, {
          name: 'MemberShows',
          img_path: '../img/episodes.png',
          visible: true
        }, {
          name: 'Member',
          img_path: '../img/infos.png',
          img_style: 'margin-right: 9px;',
          visible: true
        }, {
          name: 'MemberNotifications',
          img_path: '../img/notifications2.png',
          visible: true
        }, {
          name: 'Search',
          img_path: '../img/search.png',
          visible: true
        }, {
          name: 'Blog',
          img_path: '../img/blog.png',
          visible: true
        }, {
          name: 'Options',
          img_path: '../img/options.png',
          visible: true
        }, {
          name: 'Logout',
          img_path: '../img/close.png',
          visible: true
        }
      ]
    };
    this.set('badge', badge, true);
    this.set('historic', [], false);
    this.set('options', options, true);
    this.set('views', {}, true);
    Fx.verifyOptions(options);
    version = this.get('version', null);
    if (version === null) {
      return this.set('version', Fx.getVersion(), true);
    }
  },
  get: function(field, defaultValue) {
    if ((localStorage[field] != null) && localStorage[field] !== 'undefined') {
      return JSON.parse(localStorage[field]);
    } else {
      return defaultValue;
    }
  },
  getAll: function() {
    return localStorage;
  },
  set: function(field, value, init) {
    if (!init || (init && !localStorage[field])) {
      return localStorage[field] = JSON.stringify(value);
    }
  },
  size: function(key) {
    if (key != null) {
      return Math.floor(JSON.stringify(localStorage[key]).length);
    } else {
      return Math.floor(JSON.stringify(localStorage).length);
    }
  },
  remove: function(field) {
    return localStorage.removeItem(field);
  },
  removeAll: function() {
    return localStorage.clear();
  },
  restart: function() {
    this.removeAll();
    return this.init();
  }
};
