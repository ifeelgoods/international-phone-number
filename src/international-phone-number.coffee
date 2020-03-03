angular.module('internationalPhoneNumber', [])
.directive 'internationalPhoneNumber', ($timeout) ->
  restrict: 'A'
  require: '^ngModel'
  scope: true
  link: (scope, element, attrs, ctrl) ->
    _read = ->
      if intlTelInputUtils
        currentText = element.intlTelInput('getNumber', intlTelInputUtils.numberFormat.E164)
        if typeof currentText is 'string'
          element.intlTelInput('setNumber', currentText)
      ctrl.$setViewValue element.val()

    _toArray = (value) ->
      return value if Array.isArray(value)
      return value.toString().replace(/\s/g, '').split(',')

    options =
      allowDropdown: true
      autoHideDialCode: true
      autoPlaceholder: 'aggressive'
      dropdownContainer: ''
      formatOnDisplay: true
      initialCountry: 'fr'
      nationalMode: false
      numberType: ''
      onlyCountries: undefined
      preferredCountries: ['fr', 'us', 'gb', 'br']

    Object.keys(options).forEach (key) ->
      option = eval("attrs.#{key}")
      return unless angular.isDefined(option)
      if key is 'preferredCountries'
        options.preferredCountries = _toArray option
      else if key is 'onlyCountries'
        options.onlyCountries = _toArray option
      else if typeof options[key] is 'boolean'
        options[key] = option is 'true'
      else options[key] = option

    # timeout so that the angular content has time to execute
    $timeout ->
      element.intlTelInput(options)
    , 500

    ctrl.$parsers.push (value) ->
      return value unless value
      if attrs.hasOwnProperty('keepModelClean')
        return element.intlTelInput('getNumber')
      return value.replace(/[^\d]/g, '')

    ctrl.$parsers.push (value) ->
      if value
        ctrl.$setValidity 'international-phone-number', element.intlTelInput('isValidNumber')
      else
        value = ''
        ctrl.$setValidity 'international-phone-number', true
      return value

    element.on 'blur keyup change', -> $timeout _read
    element.on '$destroy', -> element.off 'blur keyup change'
