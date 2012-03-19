var Badge, connected,
  __hasProp = Object.prototype.hasOwnProperty;

Badge = {
  init: function() {
    chrome.browserAction.setBadgeText({
      text: "?"
    });
    return chrome.browserAction.setBadgeBackgroundColor({
      color: [200, 200, 200, 255]
    });
  },
  update: function() {
    return ajax.post('/members/notifications', '&summary=yes', function(data) {
      var j, notifs;
      notifs = data.root.notifications;
      j = notifs.total;
      DB.set('badge', {
        value: j,
        type: 'membersNotifications'
      });
      if (j > 0) {
        return Badge.display(j, 'membersNotifications');
      } else {
        return ajax.post('/members/episodes/all', '', function(data) {
          var badgeNotificationType, episodes, i;
          episodes = data.root.episodes;
          j = 0;
          for (i in episodes) {
            if (!__hasProp.call(episodes, i)) continue;
            badgeNotificationType = DB.get('options').badge_notification_type;
            if (badgeNotificationType === 'watched') j++;
            if (badgeNotificationType === 'downloaded' && episodes[i].downloaded !== "1") {
              j++;
            }
          }
          DB.set('badge', {
            value: j,
            type: 'membersEpisodes'
          });
          return Badge.display(j, 'membersEpisodes');
        }, function() {
          return Badge.updateCache();
        });
      }
    }, function() {
      return Badge.updateCache();
    });
  },
  updateCache: function() {
    var episodes, es, i, login, n;
    login = DB.get('session').login;
    episodes = DB.get('member.' + login + '.episodes');
    n = 0;
    for (i in episodes) {
      es = episodes[i];
      n += es.nbr_total;
    }
    return Badge.display(n, 'membersEpisodes');
  },
  display: function(value, type) {
    var colors;
    value = parseInt(value);
    if (value === 0) {
      return chrome.browserAction.setBadgeText({
        text: ""
      });
    } else {
      colors = {
        membersNotifications: [200, 50, 50, 255],
        membersEpisodes: [50, 50, 200, 255]
      };
      chrome.browserAction.setBadgeBackgroundColor({
        color: colors[type]
      });
      return chrome.browserAction.setBadgeText({
        text: '' + value
      });
    }
  },
  autoUpdate: function() {
    if (connected()) {
      this.update();
      return setTimeout(this.update, 1000 * 3600);
    }
  }
};

connected = function() {
  return DB.get('session', null) != null;
};

DB.init();

Badge.init();

Badge.autoUpdate();
