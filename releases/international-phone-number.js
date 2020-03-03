(function() {
  angular.module('internationalPhoneNumber', []).directive('internationalPhoneNumber', function($timeout) {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        var options, _read, _toArray;
        _read = function() {
          var currentText;
          if (intlTelInputUtils) {
            currentText = element.intlTelInput('getNumber', intlTelInputUtils.numberFormat.E164);
            if (typeof currentText === 'string') {
              element.intlTelInput('setNumber', currentText);
            }
          }
          return ctrl.$setViewValue(element.val());
        };
        _toArray = function(value) {
          if (Array.isArray(value)) {
            return value;
          }
          return value.toString().replace(/\s/g, '').split(',');
        };
        options = {
          allowDropdown: true,
          autoHideDialCode: true,
          autoPlaceholder: 'aggressive',
          dropdownContainer: '',
          formatOnDisplay: true,
          initialCountry: 'fr',
          nationalMode: false,
          numberType: '',
          onlyCountries: void 0,
          preferredCountries: ['fr', 'us', 'gb', 'br']
        };
        Object.keys(options).forEach(function(key) {
          var option;
          option = eval("attrs." + key);
          if (!angular.isDefined(option)) {
            return;
          }
          if (key === 'preferredCountries') {
            return options.preferredCountries = _toArray(option);
          } else if (key === 'onlyCountries') {
            return options.onlyCountries = _toArray(option);
          } else if (typeof options[key] === 'boolean') {
            return options[key] = option === 'true';
          } else {
            return options[key] = option;
          }
        });
        $timeout(function() {
          return element.intlTelInput(options);
        }, 500);
        ctrl.$parsers.push(function(value) {
          if (!value) {
            return value;
          }
          if (attrs.hasOwnProperty('keepModelClean')) {
            return element.intlTelInput('getNumber');
          }
          return value.replace(/[^\d]/g, '');
        });
        ctrl.$parsers.push(function(value) {
          if (value) {
            ctrl.$setValidity('international-phone-number', element.intlTelInput('isValidNumber'));
          } else {
            value = '';
            ctrl.$setValidity('international-phone-number', true);
          }
          return value;
        });
        element.on('blur keyup change', function() {
          return $timeout(_read);
        });
        return element.on('$destroy', function() {
          return element.off('blur keyup change');
        });
      }
    };
  });

}).call(this);
