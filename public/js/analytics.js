'use strict';

$('.glyphicon.glyphicon-chevron-left').click(backClicked);
$('.btn.btn-sm.btn-warning').click(sharesongClicked);
$('.btn.btn-sm.btn-danger').click(rmfriendClicked);
$('.btn btn-sm btn-info').click(pickedSong);
$('.glyphicon.glyphicon-home').click(returnedHome);

function backClicked(event) {
	ga("send", "event", "back", "click");
}

function sharesongClicked(event) {
	ga("send", "event", "share", "click");
}

function rmfriendClicked(event) {
	ga("send", "event", "removefriend", "click");
}

function pickedSong(event) {
	ga("send", "event", "pick song", "click");
}

function returnedHome(event) {
	ga("send", "event", "return home", "click");
}