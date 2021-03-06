/**
 * View of My Episodes - class
 * @class View_MyEpisodes
 * @constructor
 */
var View_MyEpisodes = function() {};

/**
 * Init this view
 * @method init
 * @param {string} lang Lang of the subtitles ?
 */
View_MyEpisodes.prototype.init = function(lang) {
	if (typeof lang === 'undefined') {
		lang = 'all';
	}

	this.id = 'MyEpisodes.' + lang;
	this.url = '/members/episodes/' + lang;
	this.name = 'MyEpisodes';
	this.root = 'episodes';
	this.login = DB.get('session') ? DB.get('session').login : '';
};

/**
 * Update logic for this view
 * @method update
 * @param  {object} data New datas
 */
View_MyEpisodes.prototype.update = function(data) {
	var d, e, j, memberEpisodes, showEpisodes, shows, time, today;

	shows = DB.get('member.' + this.login + '.shows', {});
	memberEpisodes = {};
	time = Math.floor(new Date().getTime() / 1000);
	j = 0;
	for (d in data) {
		e = data[d];
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
		if (e.downloaded !== '-1') {
			showEpisodes[e.global].downloaded = e.downloaded === '1';
		}
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
	Badge.set('total_episodes', j);
};

/**
 * Build content for this view
 * @method content
 * @return {string} HTML content ot this view
 */
View_MyEpisodes.prototype.content = function() {
	var data, e, global, i, j, nbr_episodes_per_serie, output, s, showEpisodes, shows, today;

	data = DB.get('member.' + this.login + '.episodes', null);
	if (!data) {
		return Fx.needUpdate();
	}
	shows = DB.get('member.' + this.login + '.shows', null);
	if (!shows) {
		return Fx.needUpdate();
	}
	Badge.set('new_episodes', 0);
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

/**
 * Add listeners for this view
 * @method listen
 */
View_MyEpisodes.prototype.listen = function() {
	$('.MyEpisodes').on('mouseenter', '.episode', function() {
		$(this)
			.find('.watched')
			.attr('src', '../img/arrow_right.png')
			.css('opacity', 0.5);
	});

	$('.MyEpisodes').on('mouseleave', '.episode', function() {
		var e, start;

		start = parseInt($(this).closest('.show').attr('start'), 10);
		e = $(this).closest('.episode');
		if (e.attr('global') < start) {
			e.find('.watched').attr('src', '../img/tick.png').css('opacity', 0.5);
		} else {
			e.find('.watched').attr('src', '../img/empty.png');
		}
	});

	$('.MyEpisodes').on('click', '.watched', function() {
		var e, enable_ratings, episode, es, login, nbr, params, s, season, show;

		s = $(this).closest('.show');
		show = s.attr('id');
		e = $(this).closest('.episode');
		season = e.attr('season');
		episode = e.attr('episode');
		login = DB.get('session').login;
		enable_ratings = DB.get('options').enable_ratings;
		es = DB.get('member.' + login + '.episodes');
		es[show].start = "" + (parseInt(e.attr('global'), 10) + 1);
		nbr = 0;
		while (e.hasClass('episode')) {
			nbr++;
			if (enable_ratings) {
				$(e).css('background-color', '#f5f5f5');
				$(e).find('.watched').removeClass('watched');
				$(e).find('.wrapper-comments').hide();
				$(e).find('.wrapper-recover').hide();
				$(e).find('.wrapper-subtitles').hide();
				$(e).find('.wrapper-rate').css('display', 'inline-block');
			} else {
				Fx.clean(e);
			}
			e = e.prev();
		}
		es[show].nbr_total -= nbr;
		if (es[show].nbr_total === 0) {
			delete es[show];
		}
		params = "&season=" + season + "&episode=" + episode;
		ajax.post("/members/watched/" + show, params, function() {
			var badge_notification_type, total_episodes;

			DB.set('member.' + login + '.episodes', es);
			Cache.force('MemberTimeline');
			badge_notification_type = DB.get('options').badge_notification_type;
			if (badge_notification_type === 'watched') {
				total_episodes = DB.get('badge').total_episodes;
				Badge.set('total_episodes', total_episodes - nbr);
			}
		}, function() {
			registerAction("/members/watched/" + show, params);
		});
	});

	$('.MyEpisodes').on('mouseenter', '.watched', function() {
		var e, _results;

		e = $(this).closest('.episode');
		_results = [];
		while (e.hasClass('episode')) {
			e.find('.watched').css('opacity', 1);
			_results.push(e = e.prev());
		}
		return _results;
	});

	$('.MyEpisodes').on('mouseleave', '.watched', function() {
		var e, _results;

		e = $(this).closest('.episode');
		_results = [];
		while (e.hasClass('episode')) {
			e.find('.watched').css('opacity', 0.5);
			_results.push(e = e.prev());
		}
		return _results;
	});

	$('.MyEpisodes').on('mouseenter', '.star', function() {
		var nodeStar, _results;

		nodeStar = $(this);
		_results = [];
		while (nodeStar.hasClass('star')) {
			nodeStar.attr('src', '../img/star.gif');
			_results.push(nodeStar = nodeStar.prev());
		}
		return _results;
	});

	$('.MyEpisodes').on('mouseleave', '.star', function() {
		var nodeStar, _results;

		nodeStar = $(this);
		_results = [];
		while (nodeStar.hasClass('star')) {
			nodeStar.attr('src', '../img/star_off.gif');
			_results.push(nodeStar = nodeStar.prev());
		}
		return _results;
	});

	$('.MyEpisodes').on('click', '.star', function() {
		var e, episode, params, rate, s, season, show;

		s = $(this).closest('.show');
		show = s.attr('id');
		e = $(this).closest('.episode');
		Fx.clean(e);
		season = e.attr('season');
		episode = e.attr('episode');
		rate = $(this).attr('id').substring(4);
		params = "&season=" + season + "&episode=" + episode + "&note=" + rate;
		ajax.post("/members/note/" + show, params, function() {
			Cache.force('MemberTimeline');
		}, function() {
			registerAction("/members/watched/" + show, params);
		});
	});

	$('.MyEpisodes').on('click', '.close_stars', function() {
		var e;

		e = $(this).closest('.episode');
		Fx.clean(e);
	});

	$('.MyEpisodes').on('click', '.downloaded', function() {
		var downloaded, e, episode, es, global, params, s, season, show;

		s = $(this).closest('.show');
		show = s.attr('id');
		e = $(this).closest('.episode');
		season = e.attr('season');
		episode = e.attr('episode');
		global = e.attr('global');
		es = DB.get('show.' + show + '.episodes');
		downloaded = es[global].downloaded;
		es[global].downloaded = !downloaded;
		DB.set('show.' + show + '.episodes', es);
		if (downloaded) {
			$(this).attr('src', '../img/folder_off.png');
		} else {
			$(this).attr('src', '../img/folder.png');
		}
		params = "&season=" + season + "&episode=" + episode;
		ajax.post("/members/downloaded/" + show, params, function() {
			var badge_notification_type, downloaded_episodes;

			badge_notification_type = DB.get('options').badge_notification_type;
			if (badge_notification_type === 'downloaded') {
				downloaded_episodes = DB.get('badge').downloaded_episodes;
				if (es[global].downloaded) {
					downloaded_episodes--;
				} else {
					downloaded_episodes++;
				}
				Badge.set('downloaded_episodes', downloaded_episodes);
			}
		}, function() {
			registerAction("/members/downloaded/" + show, params);
		});
	});

	$('.MyEpisodes').on('click', '.copy_episode', function() {
		var sanbox;

		event.preventDefault();
		sanbox = $(this).find('textarea');
		sanbox.show();
		sanbox.select();
		document.execCommand('copy');
		sanbox.hide();
		Fx.message(__('copied_to_clipboard'));
		$(this).focus();
	});

	$('.MyEpisodes').on('click', '.display_show', function() {
		var url;

		event.preventDefault();
		url = $(this).attr('url');
		app.view.load('Show', url);
	});

	$('.MyEpisodes').on('click', '.display_episode', function() {
		var episode, global, season, url;

		event.preventDefault();
		url = $(this).attr('url');
		season = $(this).attr('season');
		episode = $(this).attr('episode');
		global = $(this).attr('global');
		app.view.load('Episode', url, season, episode, global);
	});

	$('.MyEpisodes').on('click', '.display_episodes', function() {
		var url;

		event.preventDefault();
		url = $(this).attr('url');
		app.view.load('ShowEpisodes', url);
	});

	$('.MyEpisodes').on('click', '.display_comments', function() {
		var episode, global, season, url;

		event.preventDefault();
		url = $(this).attr('url');
		season = $(this).attr('season');
		episode = $(this).attr('episode');
		global = $(this).attr('global');
		app.view.load('EpisodeComments', url, season, episode, global);
	});

	$('.MyEpisodes').on('click', '.toggleShow', function() {
		var hidden, login, show, showName, shows;

		show = $(this).closest('.show');
		showName = $(show).attr('id');
		login = DB.get('session').login;
		shows = DB.get('member.' + login + '.shows');
		hidden = shows[showName].hidden;
		shows[showName].hidden = !hidden;
		DB.set('member.' + login + '.shows', shows);
		$(show).find('.episode').slideToggle();
		if (shows[showName].hidden) {
			$(this).attr('src', '../img/arrow_right.gif');
		} else {
			$(this).attr('src', '../img/arrow_down.gif');
		}
		Fx.updateHeight();
	});

	$('.MyEpisodes').on('click', '.subs', function() {
		Fx.openTab($(this).attr('link'));
		return false;
	});
};