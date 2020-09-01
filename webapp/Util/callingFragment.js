sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent"
	],
	function (Controller, UIComponent) {
		"use strict";
		return Controller.extend("MT.SMT_Managment.Util.callingFragment", {
			callFragment: {
				createEvent: function () {

					var that = this.that;
					var id = this.id;
					if (!that.managementEventAddFragment) {
						that.managementEventAddFragment = new sap.ui.xmlfragment(that.getView().getId(id),
							"MT.SMT_Managment.fragments.addmanagementEvents",
							that);
						that.getView().addDependent(that.managementEventAddFragment);
					}

					that.managementEventAddFragment.open();
					var emploee = that.getOwnerComponent().getModel("DOB").getProperty("/Event") || [];
					that.getView().byId("addEventsMangFragementId").setValue("Event0" + emploee.length);
				},
				addEmployee: function () {
					var that = this.that;
					var id = this.id;
					if (!that.empAddFragment) {
						that.empAddFragment = new sap.ui.xmlfragment(that.getView().getId(id), "MT.SMT_Managment.fragments.addEmp",
							that);
						that.getView().addDependent(that.empAddFragment);
					} //this the end

					that.empAddFragment.open();
					var emploee = that.getView().getModel("DOB").getProperty("/Employee");
					that.getView().byId("empAddFId").setValue("Emp0" + emploee.length);
				}
			}

		});
	});