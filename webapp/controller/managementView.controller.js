sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"MT/SMT_Managment/Util/validator",
	"sap/ui/core/routing/History",
	"MT/SMT_Managment/Util/callingFragment",
	"sap/m/MessageToast"
], function (BaseController, Controller, Fragment, JSONModel, validator, History, callFragment, MessageToast) {
	"use strict";

	return BaseController.extend("MT.SMT_Managment.controller.managementView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MT.SMT_Managment.view.managementView
		 */
		onInit: function () {

			//	this.Router = sap.ui.core.UIComponent.getRouterFor(this);
			// var mParameters = {
			// 	success: function (odata, oRetrievedResult) {
			// 		var oModel1 = new JSONModel(odata.results);
			// 		debugger;

			// 	},

			// 	error: function (oError) {
			// 		debugger;
			// 	}
			// };
			// var oModel = new sap.ui.model.odata.ODataModel("sap/opu/odata/sap/ZEMP_MANAGEMENT_SRV");
			// oModel.read("/EmployeeDetailSet", mParameters);
			// debugger;
			var DOB = this.getOwnerComponent().getModel("DOB").getProperty("/Leave");
			// this.getView().byId("dashboardTotalNumOfEmpButtonId").setProperty("text", DOB.length);

			var notificationData = [];
			var temp = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().setModel(temp, "notificationData");
			for (var i = 0; i < DOB.length; i++) {
				if (DOB.Status == "Pending") {
					notificationData.push(DOB[i]);
				}
				// debugger;

			}
			this.getOwnerComponent().getModel("DOB").setProperty("/notificationData", notificationData);
		},

		onNotificationTimeSheetPress: function (oEvent) {
			debugger;

			var RequestFileFragmentId = this.createId("RequestFileFragmentId");
			if (!this.RequestFileFragment) {
				this.RequestFileFragment = new sap.ui.xmlfragment(this.getView().getId(RequestFileFragmentId),
					"MT.SMT_Managment.fragments.requestResponse",
					this);
				this.getView().addDependent(this.RequestFileFragment);
			}
			this.RequestFileFragment.open();
			var notifiObj = oEvent.getSource().getBindingContext("DOB").getObject();
			this.getView().byId("RequestEmpiId").setText(notifiObj.EmpId);

			this.getView().byId("RequestEmpNameId").setText(notifiObj.empName);
			this.getView().byId("RequestFileId").setText(notifiObj.requestFile);
			this.getView().byId("RequestFileUploader").setValue("");

		},
		onCloseRequestFragment: function () {
			this.RequestFileFragment.close();

		},
		validateFileInput: function () {
			debugger;
			var path = this.getView().byId("RequestFileUploader").getValue();
			if (path == "") {

				this.getView().byId("RequestFileUploader").focus();
				this.getView().byId("RequestFileUploader").setValueState("Error");
				this.getView().byId("RequestFileUploader").setValueStateText("Please select the file");
				return false;
			} else {

				this.getView().byId("RequestFileUploader").setValueState("Success");
				return true;
			}
		},

		onUploadFile: function () {
			debugger;
			if (this.validateFileInput()) {
				this.File = this.getView().byId("RequestFileUploader").oFileUpload.files[0];
				this.filePath = URL.createObjectURL(this.File);
			}
		},
		onRequestFileSend: function () {
			// debugger;

			if (this.validateFileInput()) {
				var oModelRequests = this.getOwnerComponent().getModel("DOB").getProperty("/notificationDatas");
				var oModelTimeSheet = this.getOwnerComponent().getModel("DOB").getProperty("/TimeSheet") || [];
				var employeeId = this.getView().byId("RequestEmpiId").getText();
				var obj = {
					empId: employeeId,
					empName: this.getView().byId("RequestEmpNameId").getText(),
					TimesheetName: "TimeSheet",
					filePath: this.filePath
				};
				oModelTimeSheet.push(obj);
				this.getOwnerComponent().getModel("DOB").setProperty("/TimeSheet", oModelTimeSheet);
				debugger;
				for (var i = 0; i < oModelRequests.length; i++) {
					if (oModelRequests[i].EmpId == employeeId) {
						oModelRequests.splice(i, 1);
						this.getOwnerComponent().getModel("DOB").setProperty("/notificationDatas", oModelRequests);
					}
				}
				this.RequestFileFragment.close();
			}

		},

		onPressNotification: function (oEvent) {
			var oButton = oEvent.getSource();

			if (!this._oPopover) {
				Fragment.load({
					name: "MT.SMT_Managment.fragments.notification",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					// this._oPopover.bindElement("/ProductCollection/0");
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}

		},
		// calling the fragment to add new Employees................................................................
		onPressAddEmp: function () {

			var emiFragmentId = this.createId("emiFragmentId");
			var addEmpObj = { // An object to hold the id and the onject of the current controller...
				"that": this,
				"id": emiFragmentId
			};
			new callFragment().callFragment.addEmployee.apply(addEmpObj); // Creating the fragment and adding it to the Managment View...
		},
		onCloseFragmentAddEmp: function () {

			this.empAddFragment.close();
		},
		//New employeee fragment has ended..................................................................

		//calling A fragment view to add the events related to the organization.................................
		onPressAddEvent: function () {

			var addEventFragmentId = this.createId("addEventFragmentId");
			var eventObj = {
				"that": this,
				"id": addEventFragmentId
			};

			new callFragment().callFragment.createEvent.apply(eventObj); //Creating the fragment to add the events.     
		},

		onClickAddEvents: function () {

			var oModelEvent = this.getOwnerComponent().getModel("DOB").getProperty("/Events") || [];
			var oModelNotifi = this.getOwnerComponent().getModel("DOB").getProperty("/notificationData") || [];
			var EmpId = this.getView().byId("addEventsMangFragementId").getValue();
			var name = this.getView().byId("addEventsMangFragementName").getValue();
			var date = this.getView().byId("addEventsMangFragementDate").getValue();
			var eveName = this.getView().byId("addEventsMangFragementEvent").getValue();
			if (date == "") {
				this.getView().byId("addEventsMangFragementDate").focus();
				this.getView().byId("addEventsMangFragementDate").setValueState("Error");
				this.getView().byId("addEventsMangFragementDate").setValueStateText("Date required");

				return;
			}
			if (eveName == "") {
				this.getView().byId("addEventsMangFragementEvent").focus();
				this.getView().byId("addEventsMangFragementEvent").setValueState("Error");
				this.getView().byId("addEventsMangFragementEvent").setValueStateText("Event Name required");

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
			this.getView().byId("addEventsMangFragementDate").setValue("");
			this.getView().byId("addEventsMangFragementDate").setValueState("None");
			this.getView().byId("addEventsMangFragementEvent").setValue("");
			this.getView().byId("addEventsMangFragementEvent").setValueState("None");
			this.managementEventAddFragment.close();
			// this.getView().byId("addEventsEmpFragementDate").setValue("");
			// this.getView().byId("addEventsEmpFragementDate").setValueState("None");
			// this.getView().byId("addEventsEmpFragementEvent").setValue("");
			// this.getView().byId("addEventsEmpFragementEvent").setValueState("None");
		},
		// Function to close the event fragment...............................................
		onCloseFragmentEventEmp: function () {
			this.managementEventAddFragment.close();
		},

		//......................................................................................................................................	
		onPressLogout: function () {

			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("RouteDashboardView", {}, true);
			}
		},
		handleChangeDOB: function () {

			// var minDate: new Date(2019, 8, 15);
			var dob = {
				"that": this
			};
			new validator().validateFragFields.dateField.apply(dob);
		},
		//Function to validate the joining date field..........................
		handleChangeStartDate: function () {

			// var minDate: new Date(2019, 8, 15);
			var joinDate = {
				"that": this
			};

			new validator().validateFragFields.joiningDate.apply(joinDate);
		},
		onchangeLeavingDate: function () {

			var leaveDate = {
				"that": this
			};

			new validator().validateFragFields.releavingDate.apply(leaveDate);
		},

		onSave: function () {

			// Below is an array to store the ids for validation purpose.
			var lSid = new validator().validateFragFields.lSid;

			// Below is an array to stroe the data of the fields for the validation.......
			var container = [];
			//  a loop to store the data into the data array.............................
			for (var i = 0; i < lSid.length; i++) {
				container[i] = this.getView().byId(lSid[i]).getValue();
			}

			var valid = [];
			var emty = [];
			var vnex = 0;
			var enex = 0;

			// debugger;
			container.forEach(eVaild);

			function eVaild(ids, index) {
				if (!container.includes("")) {
					valid[vnex] = lSid[index];
					vnex++;
				} else {
					emty[enex] = lSid[index];
					enex++;

				}
			}

			var inputValidation = {
				"that": this,
				"fielId": emty

			};
			var validFields = {
				"that": this,
				"vfilds": valid
			};

			new validator().validateFragFields.validFields.apply(validFields);
			var preLen = lSid.length;
			if (valid.length >= preLen && valid != "") {
				var EmpId = this.getView().byId("empAddFId").getValue();
				var Name = this.getView().byId(valid[0]).getValue() + " " + this.getView().byId(valid[1]).getValue();
				// var LName = this.getView().byId("lNameFId").getValue();
				var image = "https://ga.berkeley.edu/wp-content/uploads/2015/08/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";
				var Department = this.getView().byId(valid[2]).getValue();
				var position = this.getView().byId(valid[3]).getValue();
				var Email = this.getView().byId(valid[4]).getValue();
				var date = this.getView().byId(valid[5]).getValue();

				var startDate = this.getView().byId(valid[6]).getValue();
				var endDate = this.getView().byId(valid[7]).getValue();
				// var empName = this.getView().byId("addEventsEmpFragementId").getValue();

				var obj = {
					EmpId: EmpId,
					image: image,
					Department: Department,
					position: position,
					Email: Email,
					startDate: startDate,
					endDate: endDate,
					empName: Name,
					date: date

				};

				var array = this.getView().getModel("DOB").getProperty("/Employee");
				array.push(obj);
				this.getView().getModel("DOB").setProperty("/Employee", array);
				// debugger;
				var closeEmpFrag = {
					"that": this,
					"fragClose": this.empAddFragment,
					"ids": lSid
				};
				new validator().validateFragFields.closeEmpForm.apply(closeEmpFrag);

			} else {
				MessageToast.show("Please Fill all the required Fields");
				new validator().validateFragFields.errorValidator.apply(inputValidation);
			}

		},

		onFname: function (oEvent) {
			// debugger;
			this._getFname = oEvent.getSource();
			new validator().validatingFields(this._getFname);
			//	this._getFildData(this._getFname);
		},
		onLname: function (oEvent) {
			// debugger;
			var getLname = oEvent.getSource();
			new validator().validatingFields(getLname);
		},
		onDepart: function (oEvent) {
			// debugger;
			var getDepart = oEvent.getSource();
			new validator().validatingFields(getDepart);
		},
		onPos: function (oEvent) {
			// debugger;
			var getPos = oEvent.getSource();
			new validator().validatingFields(getPos);
		},
		onEmail: function (oEvent) {
			// debugger;
			this._getEmail = oEvent.getSource();
			new validator().emailValidation(this._getEmail);
			//this._getFildData(this._getEmail);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf MT.SMT_Managment.view.managementView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MT.SMT_Managment.view.managementView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MT.SMT_Managment.view.managementView
		 */
		//	onExit: function() {
		//
		//	}

	});

});