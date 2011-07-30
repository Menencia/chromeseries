$(document).ready(function(){

	var bgPage = chrome.extension.getBackgroundPage();
	
	/**
	 * Internationalisation
	 */
	var __ = function(msgname){
		return chrome.i18n.getMessage(msgname);
	};
	
	// Internationalisation
	$('#dl_srt_language').text(__("dl_srt_language"));
	$('#nbr_episodes_per_serie').text(__("nbr_episodes_per_serie"));
	$('#badge_notification_type').text(__("badge_notification_type"));
	$('#display_global').text(__("display_global"));
	
	// Remplissage des champs
	$('select[name=badge_notification_type]').val(DB.get('options.badge_notification_type'));
	$('select[name=dl_srt_language]').val(DB.get('options.dl_srt_language'));
	$('input[name=nbr_episodes_per_serie]').attr('value', DB.get('options.nbr_episodes_per_serie'));
	$('select[name=display_global]').val(DB.get('options.display_global'));
	
	$('#save').click(function(){
		DB.set('options.badge_notification_type', $('select[name=badge_notification_type] :selected').val());
		DB.set('options.dl_srt_language', $('select[name=dl_srt_language] :selected').val());
		DB.set('options.nbr_episodes_per_serie', $('input[name=nbr_episodes_per_serie]').attr('value'));
		DB.set('options.display_global', $('select[name=display_global] :selected').val());
		bgPage.badge.update();
		$(this).html('Sauvegardé !');
		$(this).css('background-color', '#eafedf');
		$('#save').css('color', '#999');
		setTimeout(init_save, 1000*5);
	});
	
	var init_save = function(){
		$('#save').html('Sauvegarder');
		$('#save').css('background-color', '#a6e086');
		$('#save').css('color', '#fff');
	};
	
	$('.menu a').click(function(){
		var menu = $(this).attr('id');
		showPart(menu);
		return false;
	});
	
	var showPart = function(menu){
		$('.content div.part').hide();
		$('.content div#'+menu).slideDown();
		
		$('li#'+menu).css('opacity', '0.7');
		$('li#'+menu).css('margin-left', '5px');
		
		if (currentMenu){
			$('li#'+currentMenu).css('opacity', '1');
			$('li#'+currentMenu).css('margin-left', '0px');
		}
		
		currentMenu = menu;
	};
	
	var currentMenu = "";
	showPart("general");
	
});