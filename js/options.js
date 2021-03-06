$(function() {
	var menu, menu_order, options, selected, __, _i, _len,
		_this = this;
	
	__ = function(msgname) {
		return chrome.i18n.getMessage(msgname);
	};
	
	options = DB.get('options');
	$('.max_height span').text(__("max_height"));
	$('.max_height input').attr('value', options.max_height + '');
	$('.nbr_episodes_per_serie span').text(__("nbr_episodes_per_serie"));
	$('.nbr_episodes_per_serie input').attr('value', options.nbr_episodes_per_serie + '');
	
	$('.text input').keyup(function() {
		var attr, value;
		attr = $(this).attr('name');
		value = $(this).val();
		options[attr] = value;
		DB.set('options', options);
	});

	$('.badge_notification_type span').text(__('badge_notification_type'));
	$('#badge_notification_type option[value=watched]').text(__('episodes_not_seen'));
	$('#badge_notification_type option[value=downloaded]').text(__('episodes_not_dl'));
	$('#badge_notification_type').val(options.badge_notification_type);
	
	$('.dl_srt_language span').text(__('dl_srt_language'));
	$('#dl_srt_language option[value=VF]').text(__('vf'));
	$('#dl_srt_language option[value=VO]').text(__('vo'));
	$('#dl_srt_language option[value=ALL]').text(__('all'));
	$('#dl_srt_language').val(options.dl_srt_language);
	
	$('.period_search_notifications span').text(__('period_search_notifications'));
	$('#period_search_notifications option[value=psn0]').text(__('psn0'));
	$('#period_search_notifications option[value=psn30]').text(__('psn30'));
	$('#period_search_notifications option[value=psn60]').text(__('psn60'));
	$('#period_search_notifications option[value=psn120]').text(__('psn120'));
	$('#period_search_notifications option[value=psn240]').text(__('psn240'));
	$('#period_search_notifications').val('psn' + options.period_search_notifications);
	
	$('.select select').change(function() {
		var attr, value;
		attr = $(this).attr('id');
		value = $(this).val();

		// special case : psn option
		if (value.indexOf('psn') === 0) {
			value = parseInt(value.substring(3), 10);
			if (value > 0) {
				Fx.search_notifications();
			}
		}

		options[attr] = value;
		DB.set('options', options);

	});

	$('.checkbox').each(function() {
		var attr;
		attr = $(this).find('input').attr('id');
		$(this).find('input').attr('checked', options[attr]);
		return $(this).find('span').text(__(attr));
	});

	$('.checkbox input').click(function() {
		var attr, checked, params, value;
		attr = $(this).attr('id');
		checked = $(this).is(':checked');
		if (attr === 'bs_downloaded' || attr === 'bs_decalage') {
			value = checked ? '1' : '0';
			params = "&value=" + value;
			return ajax.post("/members/option/" + attr.substring(3), params, function(data) {
				checked = data.root.option.value === '1';
				options[attr] = checked;
				DB.set('options', options);
			});
		} else {
			options[attr] = checked;
			DB.set('options', options);
		}
	});

	$('#title_view_menu').text(__("title_view_menu"));
	$('#order_sections').text(__("order_sections"));
	$('#title_author').text(__('author'));
	$('#title_contributors').text(__('contributors'));
	$('#title_ext_page').text(__('extension_page'));
	$('#title_git_page').text(__('github_page'));
	$('#title_suggestions').text(__('suggestions_or_bugs'));
	menu_order = DB.get('options').menu_order;
	
	for (_i = 0, _len = menu_order.length; _i < _len; _i++) {
		menu = menu_order[_i];
		selected = menu.visible ? 'checked="checked" ' : '';
		$('#sections').append('<span id="' + menu.name + '">' + '<input type="checkbox" ' + selected + '/>' + '<img src="../img/grippy.png" /> ' + __('menu_' + menu.name) + '</span>');
	}
	
	$("#sections").dragsort({
		dragSelector: "img",
		dragEnd: saveMenu,
		dragBetween: false,
		placeHolderTemplate: false
	});
	
	$('#sections img').removeAttr('style');
	
	$('#sections input').click(function() {
		var checked;
		checked = $(this).is(':checked');
		saveMenu();
	});

	if (!options.bs_downloaded && !options.bs_decalage) {
		ajax.post("/members/option/downloaded", '', function(data) {
			var checked;
			checked = data.root.option.value === '1';
			$('#downloaded').attr('checked', checked);
			options.bs_downloaded = checked;
			return DB.set('options', options);
		});

		ajax.post("/members/option/decalage", '', function(data) {
			var checked;
			checked = data.root.option.value === '1';
			$('#decalage').attr('checked', checked);
			options.bs_decalage = checked;
			return DB.set('options', options);
		});
	}

	$('.menu a').click(function(ev) {
		var currentView;
		ev.preventDefault();
		selected = 'selected';
		$('.mainview > *').removeClass(selected);
		$('.menu li').removeClass(selected);
		
		setTimeout(function() {
			$('.mainview > *:not(.selected)').css('display', 'none');
		}, 100);
		
		$(ev.currentTarget).parent().addClass(selected);
		currentView = $($(ev.currentTarget).attr('href'));
		currentView.css('display', 'block');
		
		setTimeout(function() {
			currentView.addClass(selected);
		}, 0);
		
		setTimeout(function() {
			$('body')[0].scrollTop = 0;
		}, 200);
	});
	
	$('.mainview > *:not(.selected)').css('display', 'none');
	$('#numversion').text(Fx.getVersion());
	$('#useragent').text(Fx.getNewUserAgent());
});

function saveMenu() {
	var i, menu_order, options, visible, _i, _len;
	
	options = DB.get('options');
	menu_order = options.menu_order;
	
	for (_i = 0, _len = menu_order.length; _i < _len; _i++) {
		i = menu_order[_i];
		visible = $('#sections #' + i.name).find('input').is(':checked');
		i.visible = visible;
	}
	
	menu_order.sort(function(a, b) {
		if ($('#sections #' + a.name).index() < $('#sections #' + b.name).index()) {
			return -1;
		}
		if ($('#sections #' + a.name).index() > $('#sections #' + b.name).index()) {
			return 1;
		}
		return 0;
	});
	
	options.menu_order = menu_order;
	DB.set('options', options);
};