/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"MT/SMT_Managment/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});