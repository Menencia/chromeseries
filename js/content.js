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
  episode: function(e, hidden, start) {
    var dlSrtLanguage, i, imgDownloaded, lang, nbSubs, newShow, output, plot, quality, stitle, sub, subs, tag, texte2, texte3, time, titleWidth, url, _i;
    output = '';
    time = Math.floor(new Date().getTime() / 1000);
    newShow = time - e.date < 2 * 24 * 3600 ? ' new' : '';
    hidden = hidden ? ' hidden' : '';
    plot = start && parseInt(e.global) < start ? 'tick' : 'empty';
    tag = DB.get('options').display_global ? '#' + e.global : Fx.displayNumber(e.number);
    stitle = tag + ' ' + title + ' (' + date('D d F', e.date) + ')';
    texte2 = __('mark_as_seen');
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
    titleWidth = 140;
    if (!DB.get('options').display_mean_note) {
      titleWidth += 26;
    }
    if (!DB.get('options').display_copy_episode) {
      titleWidth += 20;
    }
    output += '<div class="episode e' + e.global + newShow + hidden + '" number="' + e.number + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '">';
    output += '<div class="td wrapper-watched">';
    output += '<img src="../img/' + plot + '.png" class="watched action icon-4" title="' + texte2 + '" /> ';
    output += '</div>';
    if (DB.get('options').display_mean_note) {
      output += '<div class="td wrapper-mean-note">';
      output += Fx.displayNote(e.note);
      output += '</div>';
    }
    if (DB.get('options').display_copy_episode) {
      output += '<div class="td wrapper-copy-clipboard">';
      output += '<a href="" title="' + title + '" class="invisible copy_episode">';
      output += '<textarea style="display:none;">' + s.title + ' ' + e.number + '</textarea>';
      output += '<img src="../img/link.png" class="copy" />';
      output += '</a>';
      output += '</div>';
    }
    output += '<div class="td wrapper-title" style="width: ' + titleWidth + 'px">';
    output += '<span class="num">' + tag + '</span> ';
    output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + stitle + '" class="epLink display_episode">';
    output += e.title + '</a>';
    output += '</div>';
    output += '<div class="td wrapper-new">';
    if (newShow) {
      output += '<span class="new">' + __('new') + '</span>';
    }
    output += '</div>';
    output += '<div class="td wrapper-comments">';
    if (e.comments > 0) {
      output += '<a href="" url="' + e.url + '" season="' + e.season + '" episode="' + e.episode + '" global="' + e.global + '" title="' + __('nbr_comments', [e.comments]) + '" class="invisible display_comments">';
      output += '<img src="../img/comments.png" class="comments action" />';
      output += '</a>';
    } else {
      output += '<img src="../img/empty.png" alt="hidden" />';
    }
    output += '</div>';
    output += '<div class="td wrapper-recover">';
    output += '<img src="../img/' + imgDownloaded + '.png" class="downloaded action" title="' + texte3 + '" />';
    output += '</div>';
    output += '<div class="td wrapper-subtitles">';
    if (nbSubs > 0) {
      output += '<img src="../img/page_white_text.png" class="subs action" link="' + url + '" quality="' + quality + '" title="' + __('srt_quality', [lang, quality]) + '" />';
    } else {
      output += '<img src="../img/empty.png" alt="hidden" />';
    }
    output += '</div>';
    output += '<div class="td wrapper-rate">';
    for (i = _i = 1; _i <= 5; i = ++_i) {
      output += '<img src="../img/star_off.gif" width="10" id="star' + i + '" class="star" title="' + i + ' /5" />';
    }
    output += '<img src="../img/close3.png" width="10" class="close_stars" title="' + __('do_not_rate') + '" />';
    output += '</div>';
    output += '</div>';
    return output;
  }
};
