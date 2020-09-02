/* global Quagga:true */
sap.ui.define([
	"./BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (BaseController, Controller, History, MessageBox) {
	"use strict";

	return BaseController.extend("MT.SMT_Managment.controller.leaveAndAssetView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MT.SMT_Managment.view.leaveAndAssetView
		 */
		onInit: function () {

		},
		onPressLogout: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("RouteDashboardView", {}, true);
			}
		},

		onCloseFragmentLeaveAction: function () {
			this.LeaveActionFragment.close();
		},
		onPressLeaveApprovel: function (oEvent) {
			var newData = oEvent.getSource().getBindingContext("DOB").getObject();
			if (newData.Status == "Pending") {
				var tempNewsCardModel = new sap.ui.model.json.JSONModel();
				this.getOwnerComponent().setModel(tempNewsCardModel, "/LeaveAction");
				var tempNewsCardArray = [];
				tempNewsCardArray.push(newData);

				this.getOwnerComponent().getModel("DOB").setProperty("/LeaveAction", tempNewsCardArray);
				var LeaveActionFragmentId = this.createId("LeaveActionFragmentId");
				if (!this.relievingEventFragment) {
					this.LeaveActionFragment = new sap.ui.xmlfragment(this.getView().getId(LeaveActionFragmentId),
						"MT.SMT_Managment.fragments.LeaveAction",
						this);
					this.getView().addDependent(this.LeaveActionFragment);
				}
				this.LeaveActionFragment.open();
			}

		},
		onAsseteApproval: function () {
			debugger;
			var oAssetModelData = this.getOwnerComponent().getModel("DOB").getProperty("/Asset");
			var empId = this.getView().byId("assetAssetIdId").getText();
			var barCodeValue = this.getView().byId("scannedValue").getValue();
			if (!barCodeValue) {

				this.getView().byId("scannedValue").setValueState("Error");
				this.getView().byId("scannedValue").setValueStateText("Please enter Barcode or scan it");
				this.getView().byId("scannedValue").focus();

			} else {
				for (var i = 0; i < oAssetModelData.length; i++) {
					if (oAssetModelData[i].empId == empId)
						oAssetModelData[i].Status = "Resolved";
					// dFlag = 1;
					this.getView().byId("scannedValue").setValue("");
					this.getOwnerComponent().getModel("DOB").setProperty("/Asset", oAssetModelData);
					this.assetActionFragment.close();

				}
			}

		},
		relievingEventFragment: null,
		onPressAssetApprovel: function (oEvent) {
			var newData = oEvent.getSource().getBindingContext("DOB").getObject();
			// debugger;
			if (newData.Status == "Pending") {
				var tempNewsCardModel = new sap.ui.model.json.JSONModel();
				this.getOwnerComponent().setModel(tempNewsCardModel, "/asset");
				var tempNewsCardArray = [];
				tempNewsCardArray.push(newData);

				this.getOwnerComponent().getModel("DOB").setProperty("/asset", tempNewsCardArray);

				this.oDialog = this.getView().byId("dialog");
				if (!this.oDialog) {
					this.assetActionFragment = new sap.ui.xmlfragment(this.getView().getId(this.oDialog),
						"MT.SMT_Managment.fragments.assetAction",
						this);

					this.getView().addDependent(this.assetActionFragment);
				}
				this.assetActionFragment.open();
				this.getView().byId("assetAssetNameId").setText(newData.AssetName);
				this.getView().byId("assetAssetIdId").setText(newData.empId);
				this.getView().byId("assetAsseDateeId").setText(newData.Tdate);
			}
		},
		onClickLeaveApprival: function () {
			var obj = this.getOwnerComponent().getModel("DOB").getProperty("/LeaveAction");
			var newData = this.getOwnerComponent().getModel("DOB").getProperty("/Leave");
			for (var i = 0; i < newData.length; i++) {
				if (obj[0].empId == newData[i].empId && obj[0].Fdate == newData[i].Fdate && obj[0].Status == newData[i].Status) {
					newData[i].Status = "approved";
				}
			}
			this.getOwnerComponent().getModel("DOB").setProperty("/Leave", newData);
			this.LeaveActionFragment.close();

		},
		onClickLeaveReject: function () {
			var obj = this.getOwnerComponent().getModel("DOB").getProperty("/LeaveAction");
			var newData = this.getOwnerComponent().getModel("DOB").getProperty("/Leave");
			for (var i = 0; i < newData.length; i++) {
				if (obj[0].empId == newData[i].empId && obj[0].Fdate == newData[i].Fdate && obj[0].Status == newData[i].Status) {
					newData[i].Status = "Rejected";
				}
			}

			this.getOwnerComponent().getModel("DOB").setProperty("/Leave", newData);
			this.LeaveActionFragment.close();
		},

		onClickAssetApprival: function () {
			var obj = this.getOwnerComponent().getModel("DOB").getProperty("/asset");
			var newData = this.getOwnerComponent().getModel("DOB").getProperty("/Asset");
			for (var i = 0; i < newData.length; i++) {
				if (obj[0].empId == newData[i].empId && obj[0].AssetName == newData[i].AssetName && obj[0].Status == newData[i].Status && obj[0].assetId ==
					newData[i].assetId) {
					newData[i].Status = "Resolved";
				}
			}
			this.getOwnerComponent().getModel("DOB").setProperty("/Asset", newData);
			this.assetActionFragment.close();
		},
		onCloseFragmentAsseteAction: function () {
			this.assetActionFragment.close();
		},
		onPressTimeSheetReject: function (oEvent) {

			var dltApprovedTimesheetEmployeeObject = oEvent.getSource().getBindingContext("DOB").getObject();
			var oModelTimeSheet = this.getOwnerComponent().getModel("DOB").getProperty("/TimeSheet");
			var dFlag;
			var that = this;
			MessageBox.warning("Do you Want To Reject", {
				title: "Reject",
				initialFocus: sap.m.MessageBox.Action.CANCEL,
				onClose: function (sButton) {
					if (sButton === MessageBox.Action.OK) {
						// Do something
						debugger;
						for (var i = 0; i < oModelTimeSheet.length; i++) {
							if (oModelTimeSheet[i].empId == dltApprovedTimesheetEmployeeObject.empId) {
								oModelTimeSheet.splice(i, 1);
								// dFlag = 1;

								that.getOwnerComponent().getModel("DOB").setProperty("/TimeSheet", oModelTimeSheet);
							}

						}
					} else if (sButton === MessageBox.Action.CANCEL) {
						// Do something
					}
				}
			});

		},
		onSearch: function (oEvent) {
			// debugger;
			var search = oEvent.getParameter("newValue");
			var oFilterName = new sap.ui.model.Filter(
				"Reason",
				sap.ui.model.FilterOperator.Contains,
				search);

			var oFilter = new sap.ui.model.Filter({
				// filters: [oFilterName, oFilterId],
				filters: [oFilterName],
				and: false
			});
			var aFilter = [oFilter];
			// var aFilterId = [oFilterId];
			var oList = this.getView().byId("idLeaveTable");
			oList.getBinding("items").filter(aFilter);
		},
		onScanForValue: function (oEvent) {
			if (!this._oScanDialog) {
				this._oScanDialog = new sap.m.Dialog({
					title: "Scan barcode",
					contentWidth: "640px",
					contentHeight: "480px",
					horizontalScrolling: false,
					verticalScrolling: false,
					stretchOnPhone: true,
					content: [new sap.ui.core.HTML({
						id: this.createId("scanContainer"),
						content: "<div />"
					})],
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function (oEvent) {
							this._oScanDialog.close();
						}.bind(this)
					}),
					afterOpen: function () {

						this._initQuagga(this.getView().byId("scanContainer").getDomRef()).done(function () {
							// Initialisation done, start Quagga
							Quagga.start();
						}).fail(function (oError) {

							MessageBox.error(oError.message.length ? oError.message : ("Failed to initialise Quagga with reason code " + oError.name), {
								onClose: function () {
									this._oScanDialog.close();
								}.bind(this)
							});
						}.bind(this));
					}.bind(this),
					afterClose: function () {
						// Dialog closed, stop Quagga
						Quagga.stop();
					}
				});

				this.getView().addDependent(this._oScanDialog);
			}

			this._oScanDialog.open();
		},

		_initQuagga: function (oTarget) {
			var oDeferred = jQuery.Deferred();

			// Initialise Quagga plugin - see https://serratus.github.io/quaggaJS/#configobject for details
			Quagga.init({
				inputStream: {
					type: "LiveStream",
					target: oTarget,
					constraints: {
						width: {
							min: 640
						},
						height: {
							min: 480
						},
						facingMode: "environment"
					}
				},
				locator: {
					patchSize: "medium",
					halfSample: true
				},
				numOfWorkers: 2,
				frequency: 10,
				decoder: {
					readers: [{
						format: "code_128_reader",
						config: {}
					}]
				},
				locate: true
			}, function (error) {
				if (error) {
					oDeferred.reject(error);
				} else {
					oDeferred.resolve();
				}
			});

			if (!this._bQuaggaEventHandlersAttached) {
				// Attach event handlers...

				Quagga.onProcessed(function (result) {
					var drawingCtx = Quagga.canvas.ctx.overlay,
						drawingCanvas = Quagga.canvas.dom.overlay;

					if (result) {
						// The following will attempt to draw boxes around detected barcodes
						if (result.boxes) {
							drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
							result.boxes.filter(function (box) {
								return box !== result.box;
							}).forEach(function (box) {
								Quagga.ImageDebug.drawPath(box, {
									x: 0,
									y: 1
								}, drawingCtx, {
									color: "green",
									lineWidth: 2
								});
							});
						}

						if (result.box) {
							Quagga.ImageDebug.drawPath(result.box, {
								x: 0,
								y: 1
							}, drawingCtx, {
								color: "#00F",
								lineWidth: 2
							});
						}

						if (result.codeResult && result.codeResult.code) {
							Quagga.ImageDebug.drawPath(result.line, {
								x: 'x',
								y: 'y'
							}, drawingCtx, {
								color: 'red',
								lineWidth: 3
							});
						}
					}
				}.bind(this));

				Quagga.onDetected(function (result) {
					// debugger;
					this.getView().byId("scannedValue").setValue(result.codeResult.code);
					this._oScanDialog.close();
				}.bind(this));

				this._bQuaggaEventHandlersAttached = true;
			}

			return oDeferred.promise();
		},
		onPress: function (oEvent) {
			try {
				// cordova.plugins.BarcodeScanner.scan(
				sap.ndc.BarcodeScanner.scan(
					function (mResult) {
						sap.m.MessageToast.show("We got a bar code\n" +
							"Result: " + mResult.text + "\n" +
							"Format: " + mResult.format + "\n" +
							"Cancelled: " + mResult.cancelled);
					},
					function (Error) {
						sap.m.MessageToast.show("Scanning failed: " + Error);
					},
					function (mParams) {
						sap.m.MessageToast.show("Value entered: " + mParams.newValue);
					}
				);
			} catch (e) {
				sap.m.MessageToast.show("Not Available");
			}
		},
		onPressTimeSheetApprovel: function (oEvent) {
				debugger;
				// var dltApprovedTimesheetEmployeeObject = oEvent.getSource().getBindingContext("DOB").getObject();
				// var oModelTimeSheet = this.getOwnerComponent().getModel("DOB").getProperty("/TimeSheet");
				// for (var i = 0; i < oModelTimeSheet.length; i++) {
				// 	if (oModelTimeSheet[i].EmpId == dltApprovedTimesheetEmployeeObject.EmpId)
				// 		oModelTimeSheet.splice(i, 1);
				// 	this.getOwnerComponent().getModel("DOB").setProperty("/TimeSheet", oModelTimeSheet);
				// }

				//with messagae box
				var dltApprovedTimesheetEmployeeObject = oEvent.getSource().getBindingContext("DOB").getObject();
				var oModelTimeSheet = this.getOwnerComponent().getModel("DOB").getProperty("/TimeSheet");
				var dFlag;
				var that = this;
				MessageBox.success("Do you Want To Accept", {
					title: "Accept",
					initialFocus: sap.m.MessageBox.Action.CANCEL,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							// Do something
							// debugger;
							for (var i = 0; i < oModelTimeSheet.length; i++) {
								if (oModelTimeSheet[i].EmpId == dltApprovedTimesheetEmployeeObject.EmpId)
									oModelTimeSheet.splice(i, 1);
								// dFlag = 1;

								that.getOwnerComponent().getModel("DOB").setProperty("/TimeSheet", oModelTimeSheet);
							}
						} else if (sButton === MessageBox.Action.CANCEL) {
							// Do something
						}
					}
				});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf MT.SMT_Managment.view.leaveAndAssetView
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf MT.SMT_Managment.view.leaveAndAssetView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf MT.SMT_Managment.view.leaveAndAssetView
		 */
		//	onExit: function() {
		//
		//	}

	});

});