// Generated by CoffeeScript 1.3.3
var Controller, View, View_Connection, View_Episode, View_EpisodeComments, View_Member, View_MemberNotifications, View_MemberPlanning, View_MemberShows, View_MemberTimeline, View_Menu, View_MyEpisodes, View_Registration, View_Search, View_Show, View_ShowEpisodes, menu,
  __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

menu = {
  show: function() {
    return $('.action').show();
  },
  hide: function() {
    return $('.action').hide();
  },
  hideStatus: function() {
    return $('#status').hide();
  },
  hideMenu: function() {
    return $('#menu').hide();
  }
};

Controller = (function() {

  function Controller() {}

  Controller.prototype.currentView = null;

  Controller.prototype.start = function() {
    DB.init();
    Fx.checkVersion();
    if (bgPage.logged()) {
      return BS.load("MyEpisodes");
    } else {
      return BS.load("Connection");
    }
  };

  Controller.prototype.load = function() {
    var force, o, outdated, params, sameView, time, view, views;
    view = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    o = new window['View_' + view];
    if (o.init != null) {
      o.init.apply(this, params);
    }
    sameView = (this.currentView != null) && o.id === this.currentView.id;
    this.currentView = o;
    if (!sameView) {
      this.display();
    }
    if (o.update != null) {
      $('#sync').show();
      time = (new Date().getDate()) + '.' + (new Date().getFullYear());
      views = DB.get('views', {});
      outdated = views[o.id] != null ? views[o.id].time !== time : true;
      force = views[o.id] != null ? views[o.id].force : true;
      if (outdated || force) {
        return this.update();
      }
    } else {
      return $('#sync').hide();
    }
  };

  Controller.prototype.update = function() {
    var o, params,
      _this = this;
    o = this.currentView;
    params = o.params || '';
    if (o.url != null) {
      return ajax.post(o.url, params, function(data) {
        var cache, time, views;
        cache = data.root[o.root];
        Cache.maintenance(data.root.code);
        time = (new Date().getDate()) + '.' + (new Date().getFullYear());
        views = DB.get('views', {});
        views[o.id] = {
          time: time,
          force: false
        };
        DB.set('views', views);
        o.update(cache);
        return _this.display();
      });
    } else {
      return o.update();
    }
  };

  Controller.prototype.display = function() {
    var o;
    o = this.currentView;
    if (bgPage.logged()) {
      Historic.save();
    }
    $('#page').html('');
    if (o.content) {
      $('#page').html(o.content());
    }
    $('#title').text(__('title_' + o.name));
    $('#page').removeClass().addClass(o.name);
    return Fx.updateHeight();
  };

  Controller.prototype.refresh = function() {
    var args;
    Fx.toUpdate(this.currentView.id);
    args = this.currentView.id.split('.');
    return this.load.apply(this, args);
  };

  return Controller;

})();

View = (function() {

  function View() {}

  View.prototype.id = null;

  View.prototype.name = null;

  View.prototype.url = null;

  View.prototype.params = null;

  View.prototype.root = null;

  return View;

})();

View_Show = (function(_super) {
  var _ref;

  __extends(View_Show, _super);

  function View_Show() {
    this.init = __bind(this.init, this);
    return View_Show.__super__.constructor.apply(this, arguments);
  }

  View_Show.prototype.init = function(url) {
    this.id = 'Show.' + url;
    this.url = '/shows/display/' + url;
    return this.show = url;
  };

  View_Show.prototype.name = 'Show';

  View_Show.prototype.root = 'show';

  View_Show.prototype.login = (_ref = DB.get('session')) != null ? _ref.login : void 0;

  View_Show.prototype.update = function(data) {
    data.is_in_account = data.is_in_account === "1";
    data.archive = data.archive === "1";
    return DB.set('show.' + this.show, data);
  };

  View_Show.prototype.content = function() {
    var data, genres, i, k, note, output, v, _i, _ref1, _ref2;
    data = DB.get('show.' + this.show, null);
    if (!data) {
      return Fx.needUpdate();
    }
    output = '<div class="title">';
    output += '<div class="fleft200">' + data.title + '</div>';
    output += '<div class="fright200 aright">';
    if (data.note != null) {
      note = Math.floor(data.note.mean);
      for (i = _i = 1; 1 <= note ? _i <= note : _i >= note; i = 1 <= note ? ++_i : --_i) {
        output += '<img src="../img/star.gif" /> ';
      }
    }
    output += '</div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    output += '<div>';
    output += '<div class="fleft200">';
    genres = [];
    _ref1 = data.genres;
    for (k in _ref1) {
      v = _ref1[k];
      genres.push(v);
    }
    output += genres.join(', ') + ' | ';
    if (data.status != null) {
      output += __(data.status.toLowerCase());
    }
    output += '</div>';
    output += '<div class="fright200 aright">';
    if (((_ref2 = data.note) != null ? _ref2.mean : void 0) != null) {
      output += data.note.mean + '/5 (' + data.note.members + ')';
    }
    output += '</div>';
    output += '</div>';
    if (data.banner != null) {
      output += '<img src="' + data.banner + '" width="290" height="70" alt="banner" style="margin-top: 10px;" />';
    }
    if (data.description != null) {
      output += '<div class="title2">' + __('synopsis') + '</div>';
      output += '<div style="margin-right:5px; text-align:justify;">' + data.description + '</div>';
    }
    output += '<div class="title2">' + __('actions') + '</div>';
    output += '<a href="" class="link display_episodes" url="' + data.url + '"><span class="imgSyncNo"></span>Voir les épisodes</a>';
    if (data.is_in_account && data.archive) {
      output += '<a href="#' + data.url + '" id="showsUnarchive" class="link">' + '<span class="imgSyncOff"></span>' + __('show_unarchive') + '</a>';
    } else if (data.is_in_account && !data.archive) {
      output += '<a href="#' + data.url + '" id="showsArchive" class="link">' + '<span class="imgSyncOff"></span>' + __('show_archive') + '</a>';
    }
    if (data.is_in_account) {
      output += '<a href="#' + data.url + '" id="showsRemove" class="link">' + '<span class="imgSyncOff"></span>' + __('show_remove') + '</a>';
    } else {
      output += '<a href="#' + data.url + '" id="showsAdd" class="link">' + '<span class="imgSyncOff"></span>' + __('show_add') + '</a>';
    }
    return output;
  };

  return View_Show;

})(View);

View_ShowEpisodes = (function(_super) {
  var _ref;

  __extends(View_ShowEpisodes, _super);

  function View_ShowEpisodes() {
    this.init = __bind(this.init, this);
    return View_ShowEpisodes.__super__.constructor.apply(this, arguments);
  }

  View_ShowEpisodes.prototype.init = function(url) {
    this.id = 'ShowEpisodes.' + url;
    this.url = '/shows/episodes/' + url;
    this.episodes = DB.get('show.' + url + '.episodes');
    return this.show = url;
  };

  View_ShowEpisodes.prototype.name = 'ShowEpisodes';

  View_ShowEpisodes.prototype.params = '&summary=1&hide_notes=1';

  View_ShowEpisodes.prototype.root = 'seasons';

  View_ShowEpisodes.prototype.login = (_ref = DB.get('session')) != null ? _ref.login : void 0;

  View_ShowEpisodes.prototype.update = function(data) {
    var e, i, j, n, seasons, showEpisodes, shows, _ref1;
    shows = DB.get('member.' + this.login + '.shows', {});
    if (this.show in shows) {
      shows[this.show].archive = false;
    } else {
      shows[this.show] = {
        url: this.show,
        archive: false,
        hidden: false
      };
    }
    showEpisodes = DB.get('show.' + this.show + '.episodes', {});
    for (i in data) {
      seasons = data[i];
      _ref1 = seasons.episodes;
      for (j in _ref1) {
        e = _ref1[j];
        n = Fx.splitNumber(e.number);
        showEpisodes[e.global] = {
          comments: e.comments,
          date: e.date,
          downloaded: e.downloaded === '1',
          episode: n.episode,
          global: e.global,
          number: e.number,
          season: n.season,
          title: e.title,
          show: this.show,
          url: this.show
        };
      }
    }
    DB.set('show.' + this.show + '.episodes', showEpisodes);
    return DB.set('member.' + this.login + '.shows', shows);
  };

  View_ShowEpisodes.prototype.content = function() {
    var classHidden, data, e, episodes, hidden, i, lastSeason, nbrEpisodes, output, s, season, seasons, shows, start;
    data = DB.get('show.' + this.show + '.episodes', null);
    if (!data) {
      return Fx.needUpdate();
    }
    episodes = DB.get('member.' + this.login + '.episodes', null);
    if (!episodes) {
      return Fx.needUpdate();
    }
    shows = DB.get('member.' + this.login + '.shows', null);
    if (!shows) {
      return Fx.needUpdate();
    }
    s = shows[this.show];
    seasons = {};
    lastSeason = -1;
    nbrEpisodes = 0;
    for (i in data) {
      e = data[i];
      nbrEpisodes++;
      lastSeason = e.season;
      if (e.season in seasons) {
        seasons[e.season]++;
      } else {
        seasons[e.season] = 1;
      }
    }
    start = this.show in episodes ? episodes[this.show].start : nbrEpisodes;
    output = '<div id="' + this.show + '" class="show" start="' + start + '">';
    season = -1;
    for (i in data) {
      e = data[i];
      hidden = e.season !== lastSeason;
      classHidden = hidden ? ' hidden' : '';
      if (e.season !== season) {
        if (season !== -1) {
          output += '</div>';
        }
        output += '<div class="season' + classHidden + '" id="season' + e.season + '">';
        output += Content.season(e.season, seasons[e.season], hidden);
        season = e.season;
      }
      output += Content.episode(e, s.title, hidden, start);
    }
    output += '</div></div>';
    return output;
  };

  return View_ShowEpisodes;

})(View);

View_Episode = (function(_super) {

  __extends(View_Episode, _super);

  function View_Episode() {
    this.init = __bind(this.init, this);
    return View_Episode.__super__.constructor.apply(this, arguments);
  }

  View_Episode.prototype.init = function(url, season, episode, global) {
    this.id = 'Episode.' + url + '.' + season + '.' + episode + '.' + global;
    this.url = '/shows/episodes/' + url;
    this.params = '&season=' + season + '&episode=' + episode;
    this.episodes = DB.get('show.' + url + '.episodes');
    this.show = url;
    return this.global = global;
  };

  View_Episode.prototype.name = 'Episode';

  View_Episode.prototype.root = 'seasons';

  View_Episode.prototype.update = function(data) {
    var e, ep, eps;
    e = data['0']['episodes']['0'];
    eps = this.episodes != null ? this.episodes : {};
    ep = this.global in eps ? eps[this.global] : {};
    if (e.comments != null) {
      ep.comments = e.comments;
    }
    if (e.date != null) {
      ep.date = e.date;
    }
    if (e.description != null) {
      ep.description = e.description;
    }
    if (e.downloaded != null) {
      ep.downloaded = e.downloaded;
    }
    if (e.episode != null) {
      ep.episode = e.episode;
    }
    if (e.global != null) {
      ep.global = e.global;
    }
    if (e.number != null) {
      ep.number = e.number;
    }
    if (e.screen != null) {
      ep.screen = e.screen;
    }
    if (e.show != null) {
      ep.show = e.show;
    }
    if (e.subs != null) {
      ep.subs = e.subs;
    }
    if (e.title != null) {
      ep.title = e.title;
    }
    ep.url = this.show;
    eps[this.global] = ep;
    DB.set('show.' + this.show + '.episodes', eps);
    return this.episodes = eps;
  };

  View_Episode.prototype.content = function() {
    var dl, e, i, n, nbr_subs, note, output, sub, title, _i, _ref, _ref1;
    if (!(((_ref = this.episodes) != null ? _ref[this.global] : void 0) != null)) {
      return Fx.needUpdate();
    }
    e = this.episodes[this.global];
    title = DB.get('options').display_global ? '#' + e.global + ' ' + e.title : e.title;
    output = '<div class="title">';
    output += '<div class="fleft200"><a href="" url="' + this.show + '" class="showtitle display_show">' + e.show + '</a></div>';
    output += '<div class="fright200 aright">';
    if (e.note != null) {
      note = Math.floor(e.note.mean);
      for (i = _i = 1; 1 <= note ? _i <= note : _i >= note; i = 1 <= note ? ++_i : --_i) {
        output += '<img src="../img/star.gif" /> ';
      }
    }
    output += '</div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    output += '<div>';
    output += ' <div class="fleft200">';
    output += '  <span class="num">' + Fx.displayNumber(e.number) + '</span> ' + e.title;
    output += ' </div>';
    if (((_ref1 = e.note) != null ? _ref1.mean : void 0) != null) {
      output += ' <div class="fright200 aright">' + e.note.mean + '/5 (' + e.note.members + ')' + '</div>';
    }
    output += ' <div class="clear"></div>';
    output += '</div>';
    if (e.screen != null) {
      output += '<div style="height: 70px; overflow: hidden; margin-top: 10px;"><img src="' + e.screen + '" style="width: 290px; margin-top: -15px;" /></div>';
    }
    if (e.description != null) {
      output += '<div class="title2">' + __('synopsis') + '</div>';
      output += '<div style="text-align: justify; margin-right: 5px;">' + e.description + '</div>';
    }
    if ((e.subs != null) && Object.keys(e.subs).length > 0) {
      output += '<div class="title2">' + __('subtitles') + '</div>';
      nbr_subs = 0;
      for (n in e.subs) {
        sub = e.subs[n];
        output += '[' + sub.quality + '] ' + sub.language + ' <a href="" class="subs" title="' + sub.file + '" link="' + sub.url + '">' + Fx.subLast(sub.file, 20) + '</a> (' + sub.source + ')<br />';
        nbr_subs++;
      }
    }
    output += '<div class="title2">' + __('actions') + '</div>';
    output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" class="link display_comments">';
    output += '<span class="imgSyncNo"></span>' + __('see_comments', e.comments) + '</a>';
    dl = e.downloaded ? 'mark_as_not_dl' : 'mark_as_dl';
    output += '<a href="" show="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" class="link downloaded">';
    output += '<span class="imgSyncOff"></span>' + __(dl) + '</a>';
    return output;
  };

  return View_Episode;

})(View);

View_MemberPlanning = (function(_super) {

  __extends(View_MemberPlanning, _super);

  function View_MemberPlanning() {
    this.init = __bind(this.init, this);
    return View_MemberPlanning.__super__.constructor.apply(this, arguments);
  }

  View_MemberPlanning.prototype.init = function(login) {
    var _ref;
    if (login == null) {
      login = (_ref = DB.get('session')) != null ? _ref.login : void 0;
    }
    this.id = 'MemberPlanning.' + login;
    this.url = '/planning/member/' + login;
    return this.login = login;
  };

  View_MemberPlanning.prototype.name = 'MemberPlanning';

  View_MemberPlanning.prototype.params = "&view=unseen";

  View_MemberPlanning.prototype.root = 'planning';

  View_MemberPlanning.prototype.update = function(data) {
    return DB.set('member.' + this.login + '.planning', data);
  };

  View_MemberPlanning.prototype.content = function() {
    var actualWeek, data, diffWeek, e, hidden, nbrEpisodes, output, plot, titleIcon, today, todayWeek, visibleIcon, w, week;
    output = '';
    week = 100;
    nbrEpisodes = 0;
    data = DB.get('member.' + this.login + '.planning', null);
    if (!data) {
      return Fx.needUpdate();
    }
    for (e in data) {
      today = Math.floor(new Date().getTime() / 1000);
      todayWeek = parseFloat(date('W', today));
      actualWeek = parseFloat(date('W', data[e].date));
      diffWeek = actualWeek - todayWeek;
      plot = data[e].date < today ? "tick" : "empty";
      if (diffWeek < -2 || diffWeek > 2) {
        continue;
      }
      if (actualWeek !== week) {
        week = actualWeek;
        if (diffWeek < -1) {
          w = __('weeks_ago', [Math.abs(diffWeek)]);
          hidden = true;
        } else if (diffWeek === -1) {
          w = __('last_week');
          hidden = true;
        } else if (diffWeek === 0) {
          w = __('this_week');
          hidden = false;
        } else if (diffWeek === 1) {
          w = __('next_week');
        } else if (diffWeek > 1) {
          w = __('next_weeks', [diffWeek]);
          hidden = false;
        }
        if (nbrEpisodes > 0) {
          output += '</div>';
        }
        visibleIcon = hidden ? '../img/arrow_right.gif' : '../img/arrow_down.gif';
        titleIcon = hidden ? __('maximise') : __('minimise');
        hidden = hidden ? ' hidden' : '';
        output += '<div class="week' + hidden + '">';
        output += '<div class="title"> ';
        output += '<img src="' + visibleIcon + '" class="toggleWeek" title="' + titleIcon + '" />';
        output += w + '</div>';
      }
      output += '<div class="episode ' + date('D', data[e].date).toLowerCase() + hidden + '">';
      output += '<div class="td wrapper-seen">';
      output += '<img src="../img/' + plot + '.png" width="11" />';
      output += '</div>';
      output += '<div class="td wrapper-title" style="width: 186px;">';
      output += '<span class="num">' + Fx.displayNumber(data[e].number) + '</span> ';
      output += '<a href="" url="' + data[e].url + '" season="' + data[e].season + '" episode="' + data[e].episode + '" global="' + data[e].global + '" title="' + data[e].show + '" class="epLink display_episode">';
      output += data[e].show + '</a>';
      output += '</div>';
      output += '<div class="td wrapper-date">';
      output += '<span class="date">' + date('D d F', data[e].date) + '</span>';
      output += '</div>';
      output += '</div>';
      nbrEpisodes++;
    }
    return output;
  };

  return View_MemberPlanning;

})(View);

View_Member = (function(_super) {

  __extends(View_Member, _super);

  function View_Member() {
    this.init = __bind(this.init, this);
    return View_Member.__super__.constructor.apply(this, arguments);
  }

  View_Member.prototype.init = function(login) {
    var _ref;
    if (login == null) {
      login = (_ref = DB.get('session')) != null ? _ref.login : void 0;
    }
    this.id = 'Member.' + login;
    this.url = '/members/infos/' + login;
    return this.login = login;
  };

  View_Member.prototype.name = 'Member';

  View_Member.prototype.root = 'member';

  View_Member.prototype.update = function(data) {
    var member;
    member = DB.get('member.' + this.login + '.infos', {});
    member.login = data.login;
    member.is_in_account = data.is_in_account;
    member.avatar = data.avatar;
    member.stats = data.stats;
    return DB.set('member.' + this.login + '.infos', member);
  };

  View_Member.prototype.content = function() {
    var avatar, data, output;
    data = DB.get('member.' + this.login + '.infos', null);
    if (!data) {
      return Fx.needUpdate();
    }
    if ((data.avatar != null) && data.avatar !== '') {
      avatar = new Image;
      avatar.src = data.avatar;
      avatar.onload = function() {
        return $('#avatar').attr('src', data.avatar);
      };
    }
    output = '';
    output += '<div class="title">' + data.login + '</div>';
    output += '<img src="../img/avatar.png" width="50" id="avatar" style="position:absolute; right:0;" />';
    output += '<div class="episode lun"><img src="../img/infos.png" class="icon"> ' + __('nbr_friends', [data.stats.friends]) + ' </div>';
    output += '<div class="episode lun"><img src="../img/medal.png" class="icon"> ' + __('nbr_badges', [data.stats.badges]) + ' </div>';
    output += '<div class="episode lun"><img src="../img/episodes.png" class="icon"> ' + __('nbr_shows', [data.stats.shows]) + ' </div>';
    output += '<div class="episode lun"><img src="../img/report.png" class="icon"> ' + __('nbr_seasons', [data.stats.seasons]) + ' </div>';
    output += '<div class="episode lun"><img src="../img/script.png" class="icon"> ' + __('nbr_episodes', [data.stats.episodes]) + ' </div>';
    output += '<div class="episode lun"><img src="../img/location.png" class="icon">' + data.stats.progress + ' <small>(' + __('progress') + ')</small></div>';
    if (data.is_in_account != null) {
      output += '<div class="title2">' + __('actions') + '</div>';
      if (data.is_in_account) {
        output += '<a href="#' + data.login + '" id="friendsRemove" class="link">' + '<span class="imgSyncOff"></span>' + __('remove_to_friends', [data.login]) + '</a>';
      } else {
        output += '<a href="#' + data.login + '" id="friendsAdd" class="link">' + '<span class="imgSyncOff"></span>' + __('add_to_friends', [data.login]) + '</a>';
      }
    }
    return output;
  };

  return View_Member;

})(View);

View_MemberShows = (function(_super) {

  __extends(View_MemberShows, _super);

  function View_MemberShows() {
    this.init = __bind(this.init, this);
    return View_MemberShows.__super__.constructor.apply(this, arguments);
  }

  View_MemberShows.prototype.init = function(login) {
    var _ref;
    if (login == null) {
      login = (_ref = DB.get('session')) != null ? _ref.login : void 0;
    }
    this.id = 'MemberShows.' + login;
    this.url = '/members/infos/' + login;
    return this.login = login;
  };

  View_MemberShows.prototype.name = 'MemberShows';

  View_MemberShows.prototype.root = 'member';

  View_MemberShows.prototype.update = function(data) {
    var i, s, shows, _ref;
    shows = DB.get('member.' + this.login + '.shows', {});
    _ref = data.shows;
    for (i in _ref) {
      s = _ref[i];
      if (s.url in shows) {
        shows[s.url].archive = s.archive;
      } else {
        shows[s.url] = {
          url: s.url,
          title: s.title,
          archive: s.archive,
          hidden: false
        };
      }
    }
    return DB.set('member.' + this.login + '.shows', shows);
  };

  View_MemberShows.prototype.content = function() {
    var data, i, output, show;
    data = DB.get('member.' + this.login + '.shows', null);
    if (!data) {
      return Fx.needUpdate();
    }
    output = '';
    for (i in data) {
      show = data[i];
      output += '<div class="episode" id="' + show.url + '">';
      if (show.archive === '1') {
        output += '<img src="../img/folder_off.png" class="icon-3" /> ';
      } else {
        output += '<img src="../img/folder.png" class="icon-3" /> ';
      }
      output += '<a href="" url="' + show.url + '" class="epLink display_show">' + show.title + '</a>';
      output += '</div>';
    }
    return output;
  };

  return View_MemberShows;

})(View);

View_MyEpisodes = (function(_super) {
  var _ref;

  __extends(View_MyEpisodes, _super);

  function View_MyEpisodes() {
    this.init = __bind(this.init, this);
    return View_MyEpisodes.__super__.constructor.apply(this, arguments);
  }

  View_MyEpisodes.prototype.init = function(lang) {
    if (lang == null) {
      lang = 'all';
    }
    this.id = 'MyEpisodes.' + lang;
    return this.url = '/members/episodes/' + lang;
  };

  View_MyEpisodes.prototype.name = 'MyEpisodes';

  View_MyEpisodes.prototype.root = 'episodes';

  View_MyEpisodes.prototype.login = (_ref = DB.get('session')) != null ? _ref.login : void 0;

  View_MyEpisodes.prototype.update = function(data) {
    var d, e, j, memberEpisodes, showEpisodes, shows, time, today;
    shows = DB.get('member.' + this.login + '.shows', {});
    memberEpisodes = {};
    time = Math.floor(new Date().getTime() / 1000);
    j = 0;
    for (d in data) {
      e = data[d];
      if (time - e.date < 24 * 3600) {
        continue;
      }
      if (e.url in shows) {
        shows[e.url].archive = false;
      } else {
        shows[e.url] = {
          url: e.url,
          title: e.show,
          archive: false,
          hidden: false
        };
      }
      showEpisodes = DB.get('show.' + e.url + '.episodes', {});
      showEpisodes[e.global] = {
        comments: e.comments,
        date: e.date,
        downloaded: e.downloaded === '1',
        episode: e.episode,
        global: e.global,
        number: e.number,
        season: e.season,
        title: e.title,
        show: e.show,
        url: e.url,
        subs: e.subs,
        note: e.note.mean
      };
      DB.set('show.' + e.url + '.episodes', showEpisodes);
      if (e.url in memberEpisodes) {
        today = Math.floor(new Date().getTime() / 1000);
        if (e.date <= today) {
          memberEpisodes[e.url].nbr_total++;
        }
      } else {
        memberEpisodes[e.url] = {
          start: e.global,
          nbr_total: 1
        };
      }
      j++;
    }
    DB.set('member.' + this.login + '.shows', shows);
    DB.set('member.' + this.login + '.episodes', memberEpisodes);
    return bgPage.Badge.set('total_episodes', j);
  };

  View_MyEpisodes.prototype.content = function() {
    var data, e, global, i, j, nbr, nbr_episodes_per_serie, output, s, showEpisodes, shows, today;
    data = DB.get('member.' + this.login + '.episodes', null);
    if (!data) {
      return Fx.needUpdate();
    }
    shows = DB.get('member.' + this.login + '.shows', null);
    if (!shows) {
      return Fx.needUpdate();
    }
    if (bgPage.logged()) {
      if (DB.get('options').display_notifications_icon) {
        nbr = Fx.checkNotifications();
        if (nbr > 0) {
          $('.notif').html(nbr).show();
        }
      } else {
        $('#notifications').hide();
      }
    }
    bgPage.Badge.set('new_episodes', 0);
    DB.set('new_episodes_checked', date('Y.m.d'));
    output = '<div id="shows">';
    for (i in data) {
      j = data[i];
      s = shows[i];
      output += '<div id="' + i + '" class="show">';
      output += Content.show(s, j.nbr_total);
      nbr_episodes_per_serie = DB.get('options').nbr_episodes_per_serie;
      showEpisodes = DB.get('show.' + i + '.episodes');
      global = j.start;
      while (global in showEpisodes && global - j.start < nbr_episodes_per_serie) {
        e = showEpisodes[global];
        today = Math.floor(new Date().getTime() / 1000);
        global++;
        if (e.date <= today) {
          output += Content.episode(e, s.title, s.hidden);
        }
      }
      output += '</div>';
    }
    /*
    		output += '<div id="noEpisodes">'
    		output += __('no_episodes_to_see') 
    		output += '<br /><br /><a href="#" onclick="BS.load(\'searchForm\').display(); return false;">'
    		output += '<img src="../img/film_add.png" class="icon2" />' + __('add_a_show') + '</a>'
    		output += '</div>'
    */

    output += '</div>';
    return output;
  };

  return View_MyEpisodes;

})(View);

View_MemberNotifications = (function(_super) {
  var _ref;

  __extends(View_MemberNotifications, _super);

  function View_MemberNotifications() {
    return View_MemberNotifications.__super__.constructor.apply(this, arguments);
  }

  View_MemberNotifications.prototype.id = 'MemberNotifications';

  View_MemberNotifications.prototype.name = 'MemberNotifications';

  View_MemberNotifications.prototype.url = '/members/notifications';

  View_MemberNotifications.prototype.root = 'notifications';

  View_MemberNotifications.prototype.login = (_ref = DB.get('session')) != null ? _ref.login : void 0;

  View_MemberNotifications.prototype.update = function(data) {
    var n, new_notifs, old_notifs;
    old_notifs = DB.get('member.' + this.login + '.notifs', []);
    new_notifs = Fx.formatNotifications(data);
    n = Fx.concatNotifications(old_notifs, new_notifs);
    n = Fx.sortNotifications(n);
    DB.set('member.' + this.login + '.notifs', n);
    return bgPage.Badge.set('notifs', 0);
  };

  View_MemberNotifications.prototype.content = function() {
    var currDate, data, n, nbrNotifications, newDate, output, time, _i, _len;
    output = '';
    nbrNotifications = 0;
    currDate = '';
    data = DB.get('member.' + this.login + '.notifs', null);
    if (!data) {
      return Fx.needUpdate();
    }
    time = Math.floor(new Date().getTime() / 1000);
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      n = data[_i];
      if (time < n.date) {
        continue;
      }
      newDate = date('D d F', n.date);
      if (newDate !== currDate) {
        currDate = newDate;
        output += '<div class="showtitle">' + currDate + '</div>';
      }
      output += '<div class="event ' + date('D', n.date).toLowerCase() + '">';
      if (!n.seen) {
        output += '<span class="new">' + __('new') + '</span> ';
      }
      output += n.html;
      output += '</div>';
      n.seen = true;
      nbrNotifications++;
    }
    DB.set('member.' + this.login + '.notifs', data);
    $('.notif').html(0).hide();
    if (nbrNotifications === 0) {
      output += __('no_notifications');
    }
    return output;
  };

  return View_MemberNotifications;

})(View);

View_EpisodeComments = (function(_super) {

  __extends(View_EpisodeComments, _super);

  function View_EpisodeComments() {
    this.init = __bind(this.init, this);
    return View_EpisodeComments.__super__.constructor.apply(this, arguments);
  }

  View_EpisodeComments.prototype.init = function(url, season, episode, global) {
    this.id = 'EpisodeComments.' + url + '.' + season + '.' + episode + '.' + global;
    this.url = '/comments/episode/' + url;
    this.params = '&season=' + season + '&episode=' + episode;
    this.show = url;
    this.season = season;
    this.episode = episode;
    return this.global = global;
  };

  View_EpisodeComments.prototype.name = 'EpisodeComments';

  View_EpisodeComments.prototype.root = 'comments';

  View_EpisodeComments.prototype.update = function(data) {
    var comment, comments, i, nbrComments;
    comments = DB.get('show.' + this.show + '.' + this.global + '.comments', {});
    nbrComments = comments.length;
    for (i in data) {
      comment = data[i];
      if (i < nbrComments) {
        continue;
      } else {
        comments[i] = comment;
      }
    }
    return DB.set('show.' + this.show + '.' + this.global + '.comments', comments);
  };

  View_EpisodeComments.prototype.content = function() {
    var data, i, n, new_date, output, show, time;
    i = 1;
    time = '';
    show = '';
    output = '<div class="showtitle">' + show + '</div>';
    data = DB.get('show.' + this.show + '.' + this.global + '.comments', null);
    if (!data) {
      return Fx.needUpdate();
    }
    for (n in data) {
      new_date = date('D d F', data[n].date);
      if (new_date !== time) {
        time = new_date;
        output += '<div class="showtitle">' + time + '</div>';
      }
      output += '<div class="event ' + date('D', data[n].date).toLowerCase() + '">';
      output += '<b>' + date('H:i', data[n].date) + '</b> ';
      output += '<span class="login">' + data[n].login + '</span> ';
      output += '<small>#' + data[n].inner_id + '</small> ';
      if (data[n].in_reply_to !== '0') {
        output += '<small>en réponse à #' + data[n].in_reply_to + '</small> ';
      }
      output += '<a href="" id="addInReplyTo" commentId="' + data[n].inner_id + '">répondre</a><br />';
      output += data[n].text;
      output += '</div>';
      i++;
    }
    output += '<div class="postComment">';
    output += '<form method="post" id="postComment">';
    output += '<input type="hidden" id="show" value="' + this.show + '" />';
    output += '<input type="hidden" id="season" value="' + this.season + '" />';
    output += '<input type="hidden" id="episode" value="' + this.episode + '" />';
    output += '<input type="hidden" id="inReplyTo" value="0" />';
    output += '<textarea name="comment" placeholder="Votre commentaire.."></textarea>';
    output += '<input type="submit" name="submit" value="Poster">';
    output += '<div id="inReplyToText" style="display:none;">En réponse à #<span id="inReplyToId"></span> ';
    output += '(<a href="" id="removeInReplyTo">enlever</a>)</div>';
    output += '</form>';
    output += '<div class="clear"></div>\
				   </div>';
    if (i === 1) {
      output += __('no_comments');
    }
    return output;
  };

  return View_EpisodeComments;

})(View);

View_MemberTimeline = (function(_super) {
  var _ref;

  __extends(View_MemberTimeline, _super);

  function View_MemberTimeline() {
    return View_MemberTimeline.__super__.constructor.apply(this, arguments);
  }

  View_MemberTimeline.prototype.id = 'MemberTimeline';

  View_MemberTimeline.prototype.name = 'MemberTimeline';

  View_MemberTimeline.prototype.url = '/timeline/friends';

  View_MemberTimeline.prototype.params = '&number=10';

  View_MemberTimeline.prototype.root = 'timeline';

  View_MemberTimeline.prototype.login = (_ref = DB.get('session')) != null ? _ref.login : void 0;

  View_MemberTimeline.prototype.update = function(data) {
    return DB.set('member.' + this.login + '.timeline', data);
  };

  View_MemberTimeline.prototype.content = function() {
    var data, n, new_date, output, time;
    output = '';
    time = '';
    data = DB.get('member.' + this.login + '.timeline', null);
    if (!data) {
      return Fx.needUpdate();
    }
    for (n in data) {
      new_date = date('D d F', data[n].date);
      if (new_date !== time) {
        time = new_date;
        output += '<div class="title">' + time + '</div>';
      }
      output += '<div class="event ' + date('D', data[n].date).toLowerCase() + '">';
      output += '<b>' + date('H:i', data[n].date) + '</b> ';
      output += '<span class="login">' + data[n].login + '</span> ' + data[n].html;
      output += '</div>';
    }
    return output;
  };

  return View_MemberTimeline;

})(View);

View_Connection = (function(_super) {

  __extends(View_Connection, _super);

  function View_Connection() {
    return View_Connection.__super__.constructor.apply(this, arguments);
  }

  View_Connection.prototype.id = 'Connection';

  View_Connection.prototype.name = 'Connection';

  View_Connection.prototype.content = function() {
    var output;
    menu.hide();
    output = '<div style="height:10px;"></div>';
    output += '<form id="connect">';
    output += '<table><tr><td>' + __('login') + '</td><td><input type="text" name="login" id="login" /></td></tr>';
    output += '<tr><td>' + __('password') + '</td><td><input type="password" name="password" id="password" /></td></tr>';
    output += '</table>';
    output += '<div class="valid"><input type="submit" value="' + __('sign_in') + '"> ou ';
    output += '	<a href="" class="display_registration">' + __('sign_up') + '</a></div>';
    output += '</form>';
    return output;
  };

  return View_Connection;

})(View);

View_Registration = (function(_super) {

  __extends(View_Registration, _super);

  function View_Registration() {
    return View_Registration.__super__.constructor.apply(this, arguments);
  }

  View_Registration.prototype.id = 'Registration';

  View_Registration.prototype.name = 'Registration';

  View_Registration.prototype.content = function() {
    var output;
    menu.hide();
    output = '<div style="height:10px;"></div>';
    output += '<form id="register">';
    output += '<table><tr><td>' + __('login') + '</td><td><input type="text" name="login" id="login" /></td></tr>';
    output += '<tr><td>' + __('password') + '</td><td><input type="password" name="password" id="password" /></td></tr>';
    output += '<tr><td>' + __('repassword') + '</td><td><input type="password" name="repassword" id="repassword" /></td></tr>';
    output += '<tr><td>' + __('email') + '</td><td><input type="text" name="mail" id="mail" /></td></tr>';
    output += '</table>';
    output += '<div class="valid"><input type="submit" value="' + __('sign_up') + '"> ou ';
    output += '	<a href="#" class="display_connection">' + __('sign_in') + '</a></div>';
    output += '</form>';
    return output;
  };

  return View_Registration;

})(View);

View_Search = (function(_super) {

  __extends(View_Search, _super);

  function View_Search() {
    return View_Search.__super__.constructor.apply(this, arguments);
  }

  View_Search.prototype.id = 'Search';

  View_Search.prototype.name = 'Search';

  View_Search.prototype.content = function() {
    var output;
    output = '<div style="height:10px;"></div>';
    output += '<form id="search">';
    output += '<input type="text" name="terms" id="terms" /> ';
    output += '<input type="submit" value="chercher" />';
    output += '</form>';
    output += '<div id="suggests_shows"></div>';
    output += '<div id="suggests_members"></div>';
    output += '<div id="results_shows"></div>';
    output += '<div id="results_members"></div>';
    setTimeout((function() {
      return $('#terms').focus();
    }), 100);
    return output;
  };

  'blog: ->\nid: \'blog\'\nname: \'blog\'\nupdate: ->\n	$.ajax\n		type: \'GET\'\n		url: \'https://www.betaseries.com/blog/feed/\'\n		dataType: \'xml\'\n		async: false\n		success: (data) ->\n			items = $(data).find \'item\'\n			blog = []\n			for i in [0..(Math.min 10, items.length)]\n				item = $(items[i])\n				article = {}\n				article.title = item.find(\'title\').text()\n				article.description = item.find(\'description\').text()\n				article.link = item.find(\'link\').text()\n				blog.push article\n			# on met à jour le cache\n			DB.set \'blog\', blog\n			# on mets à jour l\'affichage\n			BS.display()\ncontent: ->\n	output = \'\'\n	\n	data = DB.get \'blog\', null\n	return Fx.needUpdate() if !data\n	\n	for article, i in data\n		title = article.title.substring 0, 40\n		title += \'..\' if article.title.length > 40\n		\n		output += \'<div class="showtitle">\' + title\n		#output += \' <span class="date">\'+date(\'D d F\', data[n].date)+\'</span>\';\n		output += \'</div>\'\n		\n		link = \'<a href="#" link="\' + article.link + \'" class="display_postblog">(\' + __(\'read_article\') + \')</a>\'\n		output += \'<div>\' + article.description.replace(/<a(.*)a>/, link) + \'</div>\'\n		\n		output += \'<div style="height:11px;"></div>\'\n				\n	return output';


  return View_Search;

})(View);

View_Menu = (function(_super) {

  __extends(View_Menu, _super);

  function View_Menu() {
    return View_Menu.__super__.constructor.apply(this, arguments);
  }

  View_Menu.prototype.id = 'Menu';

  View_Menu.prototype.name = 'Menu';

  View_Menu.prototype.content = function() {
    var m, menu_order, output, style, _i, _len;
    output = '';
    menu_order = DB.get('options').menu_order;
    for (_i = 0, _len = menu_order.length; _i < _len; _i++) {
      m = menu_order[_i];
      if (!m.visible) {
        continue;
      }
      style = '';
      if (m.img_style != null) {
        style = 'style="' + m.img_style + '" ';
      }
      output += '<a href="" id="menu-' + m.name + '" class="menulink">';
      output += '<img src="' + m.img_path + '" ' + style + '/>';
      output += __('menu_' + m.name) + '</a>';
    }
    return output;
  };

  return View_Menu;

})(View);
