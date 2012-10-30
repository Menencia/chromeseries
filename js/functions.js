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
      if (j.type === 'episode' && DB.get('options').mark_notifs_episode_as_seen) {
        j.seen = true;
      }
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
    if (n < 2) {
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
      $('#message').html(__('new_version')).show();
      if (version <= '0.9.5') {
        return BS.logout();
      }
    }
  }
};
