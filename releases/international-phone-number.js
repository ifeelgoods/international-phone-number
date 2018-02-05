(function() {
  "use strict";
  angular.module("internationalPhoneNumber", []).directive('internationalPhoneNumber', function($timeout) {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        var handleWhatsSupposedToBeAnArray, options, read;
        read = function() {
          var currentText;
          if (intlTelInputUtils) {
            currentText = telInput.intlTelInput('getNumber', intlTelInputUtils.numberFormat.E164);
            if (typeof currentText === 'string') {
              telInput.intlTelInput('setNumber', currentText);
            }
          }
          return ctrl.$setViewValue(element.val());
        };
        handleWhatsSupposedToBeAnArray = function(value) {
          if (typeof value === "object") {
            return value;
          } else {
            return value.toString().replace(/[ ]/g, '').split(',');
          }
        };
        options = {
          allowDropdown: true,
          autoHideDialCode: true,
          autoPlaceholder: 'aggressive',
          dropdownContainer: '',
          formatOnDisplay: true,
          initialCountry: '',
          nationalMode: false,
          numberType: '',
          onlyCountries: void 0,
          preferredCountries: ['us', 'gb', 'fr']
        };
        options.geoIpLookup = scope.geoIpLookup;
        angular.forEach(options, function(value, key) {
          var option;
          option = eval("attrs." + key);
          if (angular.isDefined(option)) {
            if (key === 'preferredCountries') {
              return options.preferredCountries = handleWhatsSupposedToBeAnArray(option);
            } else if (key === 'onlyCountries') {
              return options.onlyCountries = handleWhatsSupposedToBeAnArray(option);
            } else if (typeof value === "boolean") {
              return options[key] = option === "true";
            } else {
              return options[key] = option;
            }
          }
        });
        $timeout(function() {
          return element.intlTelInput(options);
        }, 500);
        ctrl.$parsers.push(function(value) {
          if (!value) {
            return value;
          }
          if (options.keepModelClean) {
            return element.intlTelInput('getNumber');
          } else {
            return value.replace(/[^\d]/g, '');
          }
        });
        ctrl.$parsers.push(function(value) {
          if (value) {
            ctrl.$setValidity('international-phone-number', element.intlTelInput("isValidNumber"));
          } else {
            value = '';
            delete ctrl.$error['international-phone-number'];
          }
          return value;
        });
        element.on('blur keyup change', function(event) {
          return scope.$apply(read);
        });
        return element.on('$destroy', function() {
          return element.off('blur keyup change');
        });
      }
    };
  });

}).call(this);
