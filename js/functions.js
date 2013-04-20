// Generated by CoffeeScript 1.3.3
var Fx, __;

__ = function(msgname, placeholders) {
  if (msgname) {
    return chrome.i18n.getMessage(msgname, placeholders);
  }
};

Fx = {
  openTab: function(url, active) {
    if (active == null) {
      active = false;
    }
    chrome.tabs.create({
      "url": url,
      "active": active
    });
    return false;
  },
  clean: function(node) {
    var episode, es, global, login, nbr, nbr_episodes_per_serie, s, show, showName;
    show = node.closest('.show');
    node.slideToggle('slow', function() {
      return $(this).remove();
    });
    nbr = parseInt($(show).find('.remain').text()) - 1;
    if (nbr === 0) {
      $(show).slideToggle('slow', function() {
        return $(this).remove();
      });
    } else {
      $(show).find('.remain').text(nbr);
    }
    nbr_episodes_per_serie = DB.get('options').nbr_episodes_per_serie;
    if (nbr + 1 > nbr_episodes_per_serie) {
      global = parseInt($(show).find('.episode').last().attr('global')) + 1;
      login = DB.get('session').login;
      showName = $(show).attr('id');
      s = DB.get('member.' + login + '.shows')[showName];
      es = DB.get('show.' + showName + '.episodes');
      episode = Content.episode(es[global], s);
      $(show).append(episode);
    }
    Fx.updateHeight();
    return true;
  },
  concatNotifications: function(old_notifs, new_notifs) {
    var res;
    res = old_notifs.concat(new_notifs);
    res = res.slice(0, 20);
    return res;
  },
  formatNotifications: function(notifs) {
    var i, j, res;
    res = [];
    for (i in notifs) {
      j = notifs[i];
      j.seen = j.type === 'episode' && DB.get('options').mark_notifs_episode_as_seen;
      res.push(j);
    }
    return res;
  },
  sortNotifications: function(notifs) {
    return notifs.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
  },
  checkNotifications: function() {
    var i, login, nbr, notifs, time, _i, _len;
    login = DB.get('session').login;
    notifs = DB.get('member.' + login + '.notifs', []);
    time = Math.floor(new Date().getTime() / 1000);
    nbr = 0;
    for (_i = 0, _len = notifs.length; _i < _len; _i++) {
      i = notifs[_i];
      if (time > i.date && !i.seen) {
        nbr++;
      }
    }
    return nbr;
  },
  verifyOptions: function(opt) {
    var i, j, options, res;
    options = DB.get('options');
    res = [];
    for (i in options) {
      j = options[i];
      res.push(i);
    }
    for (i in opt) {
      j = opt[i];
      if (!(i in options)) {
        options[i] = opt[i];
      }
    }
    return DB.set('options', options);
  },
  subFirst: function(str, nbr) {
    var strLength, strSub;
    strLength = str.length;
    strSub = str.substring(0, nbr);
    if (strSub.length < strLength) {
      strSub += '..';
    }
    return strSub;
  },
  subLast: function(str, nbr) {
    var strLength, strSub;
    strLength = str.length;
    strSub = str.substring(strLength, Math.max(0, strLength - nbr));
    if (strSub.length < strLength) {
      strSub = '..' + strSub;
    }
    return strSub;
  },
  updateHeight: function(top) {
    if (top == null) {
      top = false;
    }
    return setTimeout((function() {
      var maxHeight, params;
      maxHeight = DB.get('options').max_height;
      $('#about').height(maxHeight);
      params = top ? {
        scroll: 'top'
      } : {};
      return $('.nano').nanoScroller(params);
    }), 500);
  },
  toUpdate: function(view) {
    var views;
    views = DB.get('views');
    if (views[view] != null) {
      views[view].force = true;
      return DB.set('views', views);
    }
  },
  getVersion: function() {
    return chrome.app.getDetails().version;
  },
  getBrowserVersion: function() {
    return window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1];
  },
  getOS: function() {
    return navigator.platform;
  },
  getNewUserAgent: function() {
    return 'ChromeSeries/' + this.getVersion() + ' Chrome/' + this.getBrowserVersion() + ' OS/' + this.getOS();
  },
  getNumber: function(season, episode) {
    var number;
    number = 'S';
    if (season <= 9) {
      number += '0';
    }
    number += season;
    number += 'E';
    if (episode <= 9) {
      number += '0';
    }
    number += episode;
    return number;
  },
  displayNumber: function(number) {
    var res;
    res = '';
    if (number[1] !== '0') {
      res += number[1];
    }
    res += number[2];
    res += 'x';
    res += number[4];
    res += number[5];
    return res;
  },
  displayNote: function(note) {
    var color, n, res;
    n = note ? Math.round(note * 10) / 10 : 0;
    color = 'green';
    if (n < 4) {
      color = 'orange';
    }
    if (n < 3) {
      color = 'red';
    }
    if (n === 0) {
      n = '';
    }
    res = '<span class="note ' + color + '">' + n + '</span>';
    return res;
  },
  splitNumber: function(number) {
    var episode, season;
    season = '';
    if (number[1] !== '0') {
      season += number[1];
    }
    season += number[2];
    episode = '';
    if (number[4] !== '0') {
      episode += number[4];
    }
    episode += number[5];
    return {
      season: season,
      episode: episode
    };
  },
  needUpdate: function() {
    return __('no_data_found');
  },
  checkVersion: function() {
    var currVersion, newVersion, version;
    version = DB.get('version', 0);
    currVersion = Fx.getVersion();
    newVersion = version !== currVersion;
    $('#versionLink').text(Fx.getVersion());
    if (newVersion) {
      DB.set('version', currVersion);
      return this.message(__('new_version'));
    }
  },
  message: function(content) {
    $('#message .content').html(content);
    $('#message').fadeIn();
    return this.highlight($('#message'));
  },
  highlight: function(selector) {
    var bgColor;
    bgColor = selector.css('background-color');
    selector.animate({
      backgroundColor: '#FAFA97'
    }, 500);
    return selector.animate({
      backgroundColor: bgColor
    }, 500);
  },
  logged: function() {
    return DB.get('session', null) != null;
  },
  logout: function() {
    ajax.post('/members/destroy', '');
    DB.restart();
    Badge.init();
    return BS.load('Connection');
  },
  search_episodes: function() {
    chrome.alarms.clear('search_episodes');
    return chrome.alarms.create('search_episodes', {
      delayInMinutes: 5,
      periodInMinutes: 60
    });
  },
  search_notifications: function() {
    var period_search_notifications, _ref;
    chrome.alarms.clear('search_notifications');
    period_search_notifications = parseInt(((_ref = DB.get('options')) != null ? _ref.period_search_notifications : void 0) != null);
    if (period_search_notifications && period_search_notifications > 0) {
      return chrome.alarms.create('search_notifications', {
        delayInMinutes: 5,
        periodInMinutes: period_search_notifications
      });
    }
  }
};
