/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"MT/SMT_Managment/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});