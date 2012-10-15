// Generated by CoffeeScript 1.3.3
var Content;

Content = {
  show: function(s, nbrEpisodesTotal) {
    var output, titleIcon, visibleIcon;
    visibleIcon = s.hidden ? '../img/arrow_right.gif' : '../img/arrow_down.gif';
    titleIcon = s.hidden ? __('maximise') : __('minimise');
    output = '';
    output += '<div class="showtitle">';
    output += '<div class="left">';
    output += '<img src="' + visibleIcon + '" class="toggleShow" title="' + titleIcon + '" />';
    output += '<a href="" url="' + s.url + '" class="showtitle display_show">' + Fx.subFirst(s.title, 25) + '</a>';
    output += ' <span class="remain remain-right">' + nbrEpisodesTotal + ' </span>';
    output += '</div>';
    output += '<div class="right"></div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    return output;
  },
  season: function(n, nbrEpisodesTotal, hidden) {
    var output, remain, remainHidden, titleIcon, visibleIcon;
    visibleIcon = hidden ? '../img/arrow_right.gif' : '../img/arrow_down.gif';
    titleIcon = hidden ? __('maximise') : __('minimise');
    remain = hidden ? nbrEpisodesTotal : 0;
    remainHidden = remain <= 0 ? ' hidden' : '';
    output = '';
    output += '<div class="title2">';
    output += '<div class="left">';
    output += '<img src="' + visibleIcon + '" class="toggleSeason" title="' + titleIcon + '" />';
    output += 'Saison ' + n + ' <span class="remain remain-right' + remainHidden + '">' + remain + ' </span>';
    output += '</div>';
    output += '<div class="right"></div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    return output;
  },
  episode: function(e, s) {
    var date_0, dlSrtLanguage, empty, hidden, imgDownloaded, jours, lang, nbSubs, newShow, output, quality, stitle, sub, subs, texte2, texte3, time, title, url;
    output = '';
    time = Math.floor(new Date().getTime() / 1000);
    jours = Math.floor(time / (24 * 3600));
    date_0 = (24 * 3600) * jours - 2 * 3600;
    newShow = e.date >= date_0 ? ' new' : '';
    hidden = s.hidden ? ' hidden' : '';
    output += '<div class="episode e' + e.global + newShow + hidden + '" number="' + e.number + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '">';
    title = DB.get('options').display_global ? '#' + e.global + ' ' + e.title : e.title;
    stitle = title + ' (' + date('D d F', e.date) + ')';
    texte2 = __('mark_as_seen');
    output += '<div class="left">';
    output += '<img src="../img/empty.png" class="watched action icon-4" title="' + texte2 + '" /> ';
    output += Fx.displayNote(e.note);
    output += '<span class="num">' + Fx.displayNumber(e.number) + '</span> ';
    output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + stitle + '" class="epLink display_episode">';
    output += Fx.subFirst(title, 19) + '</a>';
    if (newShow) {
      output += ' <span class="new">' + __('new') + '</span>';
    }
    output += '</div>';
    subs = e.subs;
    nbSubs = 0;
    url = "";
    quality = -1;
    lang = "";
    for (sub in subs) {
      dlSrtLanguage = DB.get('options').dl_srt_language;
      if ((dlSrtLanguage === "VF" || dlSrtLanguage === 'ALL') && subs[sub]['language'] === "VF" && subs[sub]['quality'] > quality) {
        quality = subs[sub]['quality'];
        url = subs[sub]['url'];
        lang = subs[sub]['language'];
        nbSubs++;
      }
      if ((dlSrtLanguage === "VO" || dlSrtLanguage === 'ALL') && subs[sub]['language'] === "VO" && subs[sub]['quality'] > quality) {
        quality = subs[sub]['quality'];
        url = subs[sub]['url'];
        lang = subs[sub]['language'];
        nbSubs++;
      }
    }
    quality = Math.floor((quality + 1) / 2);
    if (e.downloaded) {
      imgDownloaded = "folder";
      texte3 = __('mark_as_not_dl');
    } else {
      imgDownloaded = "folder_off";
      texte3 = __('mark_as_dl');
    }
    output += '<div class="right">';
    empty = '<img src="../img/empty.png" alt="hidden" /> ';
    if (e.comments > 0) {
      output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + __('nbr_comments', [e.comments]) + '" class="invisible display_comments">';
      output += '<img src="../img/comments.png" class="comments action" /> ';
      output += '</a>';
    } else {
      output += empty;
    }
    output += '	<img src="../img/' + imgDownloaded + '.png" class="downloaded action" title="' + texte3 + '" /> ';
    if (nbSubs > 0) {
      output += '<img src="../img/page_white_text.png" class="subs action" link="' + url + '" quality="' + quality + '" title="' + __('srt_quality', [lang, quality]) + '" /> ';
    }
    output += '</div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    return output;
  },
  episode2: function(e, hidden, start) {
    var date_0, dlSrtLanguage, empty, imgDownloaded, jours, lang, nbSubs, newShow, output, plot, quality, stitle, sub, subs, texte2, texte3, time, title, url;
    output = '';
    time = Math.floor(new Date().getTime() / 1000);
    jours = Math.floor(time / (24 * 3600));
    date_0 = (24 * 3600) * jours - 2 * 3600;
    newShow = e.date >= date_0 ? ' new' : '';
    hidden = hidden ? ' hidden' : '';
    output += '<div class="episode e' + e.global + newShow + hidden + '" number="' + e.number + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '">';
    title = DB.get('options').display_global ? '#' + e.global + ' ' + e.title : e.title;
    stitle = title + ' (' + date('D d F', e.date) + ')';
    texte2 = __('mark_as_seen');
    plot = parseInt(e.global) < start ? 'tick' : 'empty';
    output += '<div class="left">';
    output += '<img src="../img/' + plot + '.png" class="watched action icon-4" title="' + texte2 + '" /> ';
    output += '<span class="num">' + Fx.displayNumber(e.number) + '</span> ';
    output += '<a href="#" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + stitle + '" class="epLink display_episode">';
    output += Fx.subFirst(title, 20) + '</a>';
    if (newShow) {
      output += ' <span class="new">' + __('new') + '</span>';
    }
    output += '</div>';
    subs = e.subs;
    nbSubs = 0;
    url = "";
    quality = -1;
    lang = "";
    for (sub in subs) {
      dlSrtLanguage = DB.get('options').dl_srt_language;
      if ((dlSrtLanguage === "VF" || dlSrtLanguage === 'ALL') && subs[sub]['language'] === "VF" && subs[sub]['quality'] > quality) {
        quality = subs[sub]['quality'];
        url = subs[sub]['url'];
        lang = subs[sub]['language'];
        nbSubs++;
      }
      if ((dlSrtLanguage === "VO" || dlSrtLanguage === 'ALL') && subs[sub]['language'] === "VO" && subs[sub]['quality'] > quality) {
        quality = subs[sub]['quality'];
        url = subs[sub]['url'];
        lang = subs[sub]['language'];
        nbSubs++;
      }
    }
    quality = Math.floor((quality + 1) / 2);
    if (e.downloaded) {
      imgDownloaded = "folder";
      texte3 = __('mark_as_not_dl');
    } else {
      imgDownloaded = "folder_off";
      texte3 = __('mark_as_dl');
    }
    output += '<div class="right">';
    empty = '<img src="../img/empty.png" alt="hidden" /> ';
    if (e.comments > 0) {
      output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + __('nbr_comments', [e.comments]) + '" class="invisible display_comments">';
      output += '<img src="../img/comments.png" class="comments action" /> ';
      output += '</a>';
    } else {
      output += empty;
    }
    output += '	<img src="../img/' + imgDownloaded + '.png" class="downloaded action" title="' + texte3 + '" /> ';
    if (nbSubs > 0) {
      output += '<img src="../img/page_white_text.png" class="subs action" link="' + url + '" quality="' + quality + '" title="' + __('srt_quality', [lang, quality]) + '" /> ';
    }
    output += '</div>';
    output += '<div class="clear"></div>';
    output += '</div>';
    return output;
  }
};
