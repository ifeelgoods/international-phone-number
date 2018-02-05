# Author Marek Pietrucha
# https://github.com/mareczek/international-phone-number

"use strict"
angular.module("internationalPhoneNumber", []).directive 'internationalPhoneNumber', ($timeout) ->

  restrict:   'A'
  require: '^ngModel'
  scope: true

  link: (scope, element, attrs, ctrl) ->

    read = () ->
      if intlTelInputUtils
        currentText = telInput.intlTelInput('getNumber', intlTelInputUtils.numberFormat.E164)
        if typeof currentText is 'string'
          telInput.intlTelInput('setNumber', currentText)
      ctrl.$setViewValue element.val()

    handleWhatsSupposedToBeAnArray = (value) ->
      if typeof(value) == "object"
        value
      else
        value.toString().replace(/[ ]/g, '').split(',')

    options =
      allowDropdown: true
      autoHideDialCode: true
      autoPlaceholder: 'aggressive'
      dropdownContainer: ''
      formatOnDisplay: true
      initialCountry: ''
      nationalMode: false
      numberType: ''
      onlyCountries: undefined
      preferredCountries: ['us', 'gb', 'fr']

    options.geoIpLookup = scope.geoIpLookup

    angular.forEach options, (value, key) ->
      option = eval("attrs.#{key}")
      if angular.isDefined(option)
        if key == 'preferredCountries'
          options.preferredCountries = handleWhatsSupposedToBeAnArray option
        else if key == 'onlyCountries'
          options.onlyCountries = handleWhatsSupposedToBeAnArray option
        else if typeof(value) == "boolean"
          options[key] = (option == "true")
        else
          options[key] = option

    # timeout so that the angular content has time to execute
    $timeout ->
      element.intlTelInput(options)
    , 500

    ctrl.$parsers.push (value) ->
      return value if !value
      if options.keepModelClean
        element.intlTelInput('getNumber')
      else
        value.replace(/[^\d]/g, '')

    ctrl.$parsers.push (value) ->
      if value
        ctrl.$setValidity 'international-phone-number', element.intlTelInput("isValidNumber")
      else
        value = ''
        delete ctrl.$error['international-phone-number']
      value

    element.on 'blur keyup change', (event) ->
      scope.$apply read

    element.on '$destroy', () ->
      element.off 'blur keyup change'
