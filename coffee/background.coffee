# START
chrome.runtime.onInstalled.addListener (details) ->
	DB.init()
	Badge.init()

chrome.alarms.create 'badge_update', 
	delayInMinutes: 0
	periodInMinutes: 30

chrome.alarms.onAlarm.addListener (alarm) ->
	if alarm.name is 'badge_update' && Fx.logged()
		Badge.update()