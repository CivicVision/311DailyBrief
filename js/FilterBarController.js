var FilterBarController = function (appController) {
  this.app = appController;
  
  // update the Ward/Neighborhood/BoundaryTitle
  $('#boundaryTitle').html(Config.boundaryTitle);
  
  this.element = document.getElementById("filters");
  // this.areaSelector = document.getElementById("filters_area");
  // this.serviceSelector = document.getElementById("filters_service");
  // this.statusSelector = document.getElementById("filters_status");
  this.statusSelector = new MultiSelector(document.getElementById("filters_status"));
  this.areaSelector = new MultiSelector(document.getElementById("filters_area"));
  this.serviceSelector = new MultiSelector(document.getElementById("filters_service"));
  this.statusSelector.subscribe("change", this);
  this.areaSelector.subscribe("change", this);
  this.serviceSelector.subscribe("change", this);
  
  this.applyButton = document.getElementById("filters_apply");
  
  this._initializeFilters();
  
  this.applyButton.addEventListener("click", this, false);
};

FilterBarController.prototype = {
  constructor: FilterBarController,
  
  _initializeFilters: function () {
    // this._setSelectOptions(this.statusSelector, [
    //   {name: "Currently Open", value: "open"},
    //   {name: "Opened Yesterday", value: "opened"},
    //   {name: "Closed Yesterday", value: "closed"}
    // ]);
    this.statusSelector.setOptions([
      {name: "Currently Open", value: "open"},
      {name: "Opened Yesterday", value: "opened"},
      {name: "Closed Yesterday", value: "closed"}
    ]);
    this.statusSelector.setValue(null);
    
    this.updateFilters();
  },

  // need a public way to update the filters so that they can get populated with
  // data after the API callback returns
  updateFilters: function() {
    // this._setSelectOptions(this.areaSelector, this.app.areas.map(function (area) {
    //   return {name: area.name};
    // }));
    this.areaSelector.setOptions(this.app.areas.map(function (area) {
      return {name: area.name};
    }));
    this.areaSelector.setValue(null);
    // this._setSelectOptions(this.serviceSelector, this.app.services.map(function (service) {
    //   return {
    //     name: service.service_name,
    //     value: service.service_code
    //   };
    // }));
    this.serviceSelector.setOptions(this.app.services.map(function (service) {
      return {
        name: service.service_name,
        value: service.service_code
      };
    }));
    this.serviceSelector.setValue(null);
  },
  
  _setSelectOptions: function (selectElement, options) {
    for (var i = 0, len = options.length; i < len; i++) {
      var optionElement = document.createElement("option");
      console.log(options[i].name);
      optionElement.value = options[i].value || options[i].name;
      optionElement.appendChild(document.createTextNode(options[i].name));
      selectElement.appendChild(optionElement);
    }
  },
  
  handleEvent: function (event) {
    if (event.type === "change") {
      $(this.applyButton).addClass("unapplied-changes");
      return;
    }
    // this will all change when we have a more complicated multiselect control
    // var selectedService = this.serviceSelector.value;
    // var selectedState = this.statusSelector.value;
    var selectedService = this.serviceSelector.getValue();
    var selectedState = this.statusSelector.getValue();
    var selectedArea = this.areaSelector.getValue();
    
    // TODO: should have something around default values
    var filters = {
      area: selectedArea || null,
      services: selectedService ? selectedService : null,
      states: selectedState ? selectedState : ["open", "opened", "closed"],
      dateRange: this.app.filterConditions.dateRange
    };
    
    // dispatch an event that the filter conditions have changed
    this.dispatchEvent("filtersChanged", filters);
    $(this.applyButton).removeClass("unapplied-changes");
  }
};

eventManager.mix(FilterBarController);
