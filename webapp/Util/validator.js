sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent"
	],
	function (Controller, UIComponent) {
		"use strict";
		return Controller.extend("MT.SMT_Managment.Util.validator", {

			validateFragFields: {

				"lSid": ["fNameFId", "lNameFId", "empAdddepFId", "empAddposFId", "empAddEmailId", "empAddDOBId",
					"empAddStareId", "empAddEndId"
				],
				//Function to validate and set the maximum and minimum date.......................
				dateField: function () {
					var that = this.that;
					var curDate = new Date();
					var d = curDate.getDate();
					var m = curDate.getMonth();
					var y = curDate.getFullYear() - 21;
					var y1 = curDate.getFullYear() - 45;

					var maxDate = new Date(y, m, d);
					var minDate = new Date(y1, m, d);
					that.getView().byId("empAddDOBId").setMinDate(minDate);
					that.getView().byId("empAddDOBId").setMaxDate(maxDate);
				},
				joiningDate: function () {
					var that = this.that;
					var curDate = new Date();
					var d = curDate.getDate();
					var m = curDate.getMonth() + 1;
					var m2 = curDate.getMonth() + 2;
					var y = curDate.getFullYear();

					var maxDate = new Date(y, m2, d);
					var minDate = new Date(y, m, d);
					that.getView().byId("empAddStareId").setMinDate(minDate);
					that.getView().byId("empAddStareId").setMaxDate(maxDate);
				},
				releavingDate: function () {
					var that = this.that;
					var curDate = new Date();
					var d = curDate.getDate();
					var m = curDate.getMonth();
					var y2 = curDate.getFullYear() + 3;

					that.getView().byId("empAddEndId").setValue(m + ", " + d + ", " + y2);
				},
				errorValidator: function () {
					var that = this.that;
					var fielId = this.fielId;
					debugger;
					for (var i = 0; i < fielId.length; i++) {
						that.getView().byId(fielId[i]).setValueState("Error");
						that.getView().byId(fielId[0]).setValueState("Error").focus();
						if (fielId[i] !== "idServicParts") {
							that.getView().byId(fielId[i]).setValueState("Error").setValueStateText("This is Mandatory");
						}
					}
				},
				validFields: function () {
					var that = this.that;
					var vfilds = this.vfilds;
					debugger;
					for (var i = 0; i < vfilds.length; i++) {
						that.getView().byId(vfilds[i]).setValueState("None");
						//	that.getView().byId(vfilds[i]).showValueStateMessage(false);
					}

				},
				closeEmpForm: function () {
					var that = this.that;
					var closeMe = this.fragClose;
					var ids = this.ids;
					for (var i = 0; i < ids.length; i++) {
						that.getView().byId(ids[i]).setValueState("None");
						that.getView().byId(ids[i]).setValue("");

					}
					closeMe.close();
				}

				//......................................................................................
			},

			validatingFields: function (filId) {
				debugger;
				var valPromis = new Promise(function (resolve, reject) {

					if (filId.getValue() !== "") {
						resolve(filId);
					} else {
						reject(filId);
					}

				});
				valPromis.then(function (pass) {
					pass.setValueState("None");
					pass.showValueStateMessage(false);

				}).catch(function (faild) {
					faild.setValueState("Error").focus();
					//faild.showValueStateMessage(true);
					//	faild.setvalueStateText("Please fill the filed");
				});
				/*	if (filId.getValue() == "") {
						filId.setValueState("Error");

					} else {
						filId.setValueState("None");

					}*/
			},

			_reGEXemail: function (email) {
				var re =
					/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(email).toLowerCase());
			},

			emailValidation: function (filId) {
				debugger;
				var that = this;
				var valPromis = new Promise(function (resolve, reject) {
					var emailInput = filId.getValue();
					if (filId.getValue() !== "" && that._reGEXemail(emailInput)) {
						resolve(filId);
					} else {
						reject(filId);
					}

				});
				valPromis.then(function (pass) {
					pass.setValueState("None");
					pass.showValueStateMessage(false);

				}).catch(function (faild) {
					faild.setValueState("Error").focus();

				});

			},

			setInitial: function (frgID, vfilds) {
				for (var i = 0; i < vfilds.length; i++) {
					sap.ui.core.Fragment.byId(frgID, vfilds[i]).setValue("");
					sap.ui.core.Fragment.byId(frgID, vfilds[i]).setValueState("None").setValueStateText("");
				}

			}

		});

	});