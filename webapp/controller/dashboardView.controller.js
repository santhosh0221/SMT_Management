sap.ui.define([
	/*	"sap/ui/core/mvc/Controller",*/
	"./BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("MT.SMT_Managment.controller.dashboardView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MT.SMT_Managment.view.dashboardView
		 */
		onInit: function () {
			// debugger;

			this.Router = sap.ui.core.UIComponent.getRouterFor(this);
			this.Router.attachRoutePatternMatched(this.oNloadOfView, this);
			// debugger;

		},
		oNloadOfView: function () {
			// debugger;
			var DOB = this.getOwnerComponent().getModel("DOB").getProperty("/Employee");

			var birthDay = [];
			var Relieving = [];
			var anualData = [];
			var temp = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().setModel(temp, "thisMonth");
			for (var i = 0; i < DOB.length; i++) {
				var month = DOB[i].date.slice(3, 5);
				if (month == "08") {
					birthDay.push(DOB[i]);
				}
				// debugger;
				var year = DOB[i].endDate.slice(6);
				if (year == "2020") {
					Relieving.push(DOB[i]);
				}
				var anual = DOB[i].startDate.slice(3, 5);
				if (anual == "08") {
					anualData.push(DOB[i]);
				}

			}
			// debugger;
			this.getOwnerComponent().getModel("DOB").setProperty("/anualData", anualData);

			this.getOwnerComponent().getModel("DOB").setProperty("/Relieving", Relieving);

			this.getOwnerComponent().getModel("DOB").setProperty("/birthDay", birthDay);

		},
		onSearchEmployeeCard: function (oEvent) {
			var search = oEvent.getParameter("newValue");
			var oFilterName = new sap.ui.model.Filter(
				"empName",
				sap.ui.model.FilterOperator.Contains,
				search);

			var oFilter = new sap.ui.model.Filter({
				// filters: [oFilterName, oFilterId],
				filters: [oFilterName],
				and: false
			});
			var aFilter = [oFilter];
			// var aFilterId = [oFilterId];
			var oList = this.getView().byId("totalEmpTable");
			oList.getBinding("items").filter(aFilter);
		},
		// empSalayaNavToFinance: function (oEvent) {
		// 	debugger;
		// 	var emp = oEvent.getSource().getBindingContext("DOB").getObject();
		// 	var financeSalaryCalObj = {
		// 		Standarddays: emp.EmpId,
		// 		workeddays: emp.WorkedDays,
		// 		LOP: emp.LOP,
		// 		OvertimeHrs: 72
		// 	};
		// 	var ocrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
		// 	// var oAppState = ocrossAppNav.createEmptyAppState(this.getOwnerComponent());
		// 	// oAppState.setData(financeSalaryCalObj);
		// 	// oAppState.save();

		// 	ocrossAppNav.isIntentSupport(["smtfinance-Display"])
		// 		.donw(function (aResponses) {

		// 		})
		// 		.fail(function () {

		// 		});
		// 	var hash = (ocrossAppNav && ocrossAppNav.hrefForExternal({
		// 		target: {
		// 			semanticObject: "smtfinance", //fiori app semantic obj financeSalaryCalObj
		// 			action: "Display"
		// 		},
		// 		params: {
		// 			"semanticData": financeSalaryCalObj
		// 		}
		// 		// appStateKey: oAppState.getKey()
		// 	})) || "";

		// 	//Generate URL for the second application

		// 	var url = window.location.href.split("#")[0] + hash;

		// 	//navigate to second app

		// 	sap.m.URLHelper.redirect(url, true);
		// },

		// navigating to finance application
		empSalayaNavToFinance: function (oEvent) {
			debugger;
			var emp = oEvent.getSource().getBindingContext("DOB").getObject();
			var financeSalaryCalObj = {
				empId: emp.EmpId,
				Standarddays: emp.StandardDays,
				workeddays: emp.WorkedDays,
				LOP: emp.LOP,
				OvertimeHrs: 72
			};
			var finacenavData = JSON.stringify(financeSalaryCalObj);
			// var ocrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
			// var oAppState = ocrossAppNav.createEmptyAppState(this.getOwnerComponent());
			// oAppState.setData(financeSalaryCalObj);
			// oAppState.save();
			// this.getCrossAppNav();
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					semanticObject: "smtfinance", //fiori app semantic obj financeSalaryCalObj
					action: "Display"
				},
				params: {
					"semanticData": finacenavData
				}
				// appStateKey: oAppState.getKey()
			});
		},
		onManagementCardClick: function () {
			// debugger;
			this.getRouter().navTo("RouteManagementView");
		},
		onLeaveAsset: function () {

			this.getRouter().navTo("RouteLeaveAssetView");
		},
		onDataBasePress: function () {

			this.getRouter().navTo("worklist");
		},

		// onClickRelievingButton: function (oEvent) {
		// 	debugger;

		// 	var newData = oEvent.getSource().getBindingContext("DOB").getObject();
		// 	var tempNewsCardModel = new sap.ui.model.json.JSONModel();
		// 	this.getOwnerComponent().setModel(tempNewsCardModel, "/Event");
		// 	var tempNewsCardArray = [];
		// 	tempNewsCardArray.push(newData);
		// 	// this.getOwnerComponent().getModel("DOB").setProperty("Event", tempNewsCardArray);

		// 	this.getOwnerComponent().getModel("DOB").setProperty("/Event", tempNewsCardArray);
		// 	var relievingEventFragmentId = this.createId("relievingEventFragmentId");
		// 	if (!this.relievingEventFragment) {
		// 		this.relievingEventFragment = new sap.ui.xmlfragment(this.getView().getId(relievingEventFragmentId),
		// 			"MT.SMT_Managment.fragments.addEvents",
		// 			this);
		// 		this.getView().addDependent(this.relievingEventFragment);
		// 	}
		// 	this.relievingEventFragment.open();
		// },

		onClickRelievingButton: function (oEvent) {
			// debugger;

			var newData = oEvent.getSource().getBindingContext("DOB").getObject();
			var tempNewsCardModel = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().setModel(tempNewsCardModel, "/Event");
			var tempNewsCardArray = [];
			tempNewsCardArray.push(newData);
			// this.getOwnerComponent().getModel("DOB").setProperty("Event", tempNewsCardArray);

			this.getOwnerComponent().getModel("DOB").setProperty("/Event", tempNewsCardArray);
			var relievingEventFragmentId = this.createId("relievingEventFragmentId");
			if (!this.relievingEventFragment) {
				this.relievingEventFragment = new sap.ui.xmlfragment(this.getView().getId(relievingEventFragmentId),
					"MT.SMT_Managment.fragments.addEvents",
					this);
				this.getView().addDependent(this.relievingEventFragment);
			}
			this.relievingEventFragment.open();
		},
		onCloseFragmentAddEmp: function () {
			// debugger;
			var tempNewsCardArray = [];
			this.getOwnerComponent().getModel("DOB").setProperty("/Event", tempNewsCardArray);

			this.relievingEventFragment.close();
		},
		onPressThisMonthBirthDay: function () {
			var birthdayFragmentId = this.createId("birthdayFragmentId");
			if (!this.birthdayFragment) {
				this.birthdayFragment = new sap.ui.xmlfragment(this.getView().getId(birthdayFragmentId), "MT.SMT_Managment.fragments.Birthday",
					this);
				this.getView().addDependent(this.birthdayFragment);
			}
			this.birthdayFragment.open();
		},
		onPressTotalNumOfRelievingEmp: function () {
			var TotalNumOfRelievingEmpFragmentId = this.createId("TotalNumOfRelievingEmpFragmentId");
			if (!this.RelievingEmpFragment) {
				this.RelievingEmpFragment = new sap.ui.xmlfragment(this.getView().getId(TotalNumOfRelievingEmpFragmentId),
					"MT.SMT_Managment.fragments.relieving",
					this);
				this.getView().addDependent(this.RelievingEmpFragment);
			}
			this.RelievingEmpFragment.open();
		},
		onPressAnniversaryEmp: function () {
			var AnniversaryEmpFragmentId = this.createId("TAnniversaryEmpFragmentId");
			if (!this.AnniversaryEmpFragment) {
				this.AnniversaryEmpFragment = new sap.ui.xmlfragment(this.getView().getId(AnniversaryEmpFragmentId),
					"MT.SMT_Managment.fragments.Anniversary",
					this);
				this.getView().addDependent(this.AnniversaryEmpFragment);
			}

			this.AnniversaryEmpFragment.open();
		},
		onClickAddEvents: function () {

			var oModelEvent = this.getOwnerComponent().getModel("DOB").getProperty("/Events") || [];
			var oModelNotifi = this.getOwnerComponent().getModel("DOB").getProperty("/notificationData") || [];
			var EmpId = this.getView().byId("addEventsEmpFragementId").getValue();
			var name = this.getView().byId("addEventsEmpFragementName").getValue();
			var date = this.getView().byId("addEventsEmpFragementDate").getValue();
			var eveName = this.getView().byId("addEventsEmpFragementEvent").getValue();
			var reg_eveName = /[A-Za-z]/;

			if (reg_eveName.test(eveName) == false) {
				this.getView().byId("addEventsEmpFragementEvent").focus();
				this.getView().byId("addEventsEmpFragementEvent").setValueState("Error");
				this.getView().byId("addEventsEmpFragementEvent").setValueStateText("Enter Event name");

				return;
			}
			var obj = {
				EmpId: EmpId,
				name: name,
				date: date,
				eveName: eveName
			};
			oModelEvent.push(obj);
			oModelNotifi.push(obj);
			this.getOwnerComponent().getModel("DOB").setProperty("/Events", oModelEvent);
			this.getOwnerComponent().getModel("DOB").setProperty("/notificationData", oModelNotifi);
			this.getView().byId("addEventsEmpFragementEvent").setValue();
			this.getView().byId("addEventsEmpFragementEvent").setValueState("None");
			this.relievingEventFragment.close();

		},
		onClickdeleteEvent: function (oEvent) {
			// debugger;

			var newData = oEvent.getSource().getBindingContext("DOB").getObject();
			var array = this.getOwnerComponent().getModel("DOB").getProperty("/Events");
			for (var i = 0; i < array.length; i++) {
				if (array[i].EmpId === newData.EmpId) {
					array.splice(i, 1);

					this.getOwnerComponent().getModel("DOB").setProperty("/Events", array);

					break;

				}
			}

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MT.SMT_Managment.view.dashboardView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MT.SMT_Managment.view.dashboardView
		 */
		// onAfterRendering: function () {
		// 	var DOB = this.getOwnerComponent().getModel("DOB").getProperty("/Employee");

		// 	var birthDay = [];
		// 	var Relieving = [];
		// 	var anualData = [];
		// 	var temp = new sap.ui.model.json.JSONModel();
		// 	this.getOwnerComponent().setModel(temp, "thisMonth");
		// 	for (var i = 0; i < DOB.length; i++) {
		// 		var month = DOB[i].date.slice(3, 5);
		// 		if (month == "08") {
		// 			birthDay.push(DOB[i]);
		// 		}
		// 		// debugger;
		// 		var year = DOB[i].endDate.slice(6);
		// 		if (year == "2020") {
		// 			Relieving.push(DOB[i]);
		// 		}
		// 		var anual = DOB[i].startDate.slice(3, 5);
		// 		if (anual == "08") {
		// 			anualData.push(DOB[i]);
		// 		}

		// 	}
		// 	// debugger;
		// 	this.getOwnerComponent().getModel("DOB").setProperty("/anualData", anualData);

		// 	this.getOwnerComponent().getModel("DOB").setProperty("/Relieving", Relieving);

		// 	this.getOwnerComponent().getModel("DOB").setProperty("/birthDay", birthDay);
		// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MT.SMT_Managment.view.dashboardView
		 */
		//	onExit: function() {
		//
		//	}

	});

});