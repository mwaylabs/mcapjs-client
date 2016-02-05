var PasscodePolicy = mCAP.Model.extend({

  defaults: function(){
    return {
      allowSimplePassword: false,
      maximumPasswordAge: 0,
      minimumNumbersOfDigits: 0,
      minimumNumbersOfLowerCaseLetters: 0,
      minimumNumbersOfUpperCaseLetters: 0,
      minimumPasswordLength: 8,
      requiredNumbersOfSymbols: 0
    };
  },

  _test: function(val, regex, amount){
    if(amount === 0){
      return true;
    } else if(val){
      var match = val.match(regex);
      return !!(match && match.length>=amount);
    } else {
      //empty strings, undefined values etc. are not valid
      return false;
    }
  },

  hasEnoughLowerCaseLetters: function(val){
    var minLowerCase = this.get('minimumNumbersOfLowerCaseLetters');
    return this._test(val,/[a-z]/g,minLowerCase);
  },
  hasEnoughUpperCaseLetters: function(val){
    var minUpperCase = this.get('minimumNumbersOfUpperCaseLetters');
    return this._test(val,/[A-Z]/g,minUpperCase);
  },
  hasEnoughDigits: function(val){
    var minDigits = this.get('minimumNumbersOfDigits');
    return this._test(val,/[0-9]/g,minDigits);
  },
  hasEnoughSymbols: function(val){
    var minSymbols = this.get('requiredNumbersOfSymbols');
    return this._test(val,/\W/g,minSymbols);
  },
  isLongEnough: function(val){
    var minLength = this.get('minimumPasswordLength');
    return val && val.length>=minLength;
  },
  isSimple: function(val, user, organisation){
    var checkOrganisation = organisation || window.mCAP.currentOrganization,
      checkUser = user || window.mCAP.authenticatedUser;

    if(checkOrganisation.get('uniqueName') && checkUser.get('name')){
      var orgaName = checkOrganisation.get('uniqueName'),
        userName = checkUser.get('name');

      return val === orgaName || val === userName;
    } else {
      return false;
    }
  },
  violatesSimpleRestriction: function(val, checkUser, checkOrganisation){
    if(!this.get('allowSimplePassword')){
      return this.isSimple(val, checkUser, checkOrganisation);
    } else {
      return false;
    }
  },
  getExamplePassword: function () {
    var letters = 'abcdefghijklmnopqrstuvwxyz',
      numbers = '0123456789',
      symbols = '!"§$%&/()=?€@+*#,;-',
      minNumOfDigits = this.get('minimumNumbersOfDigits'),
      minNumOfLowerCaseLetters = this.get('minimumNumbersOfLowerCaseLetters'),
      minNumOfUpperCaseLetters = this.get('minimumNumbersOfUpperCaseLetters'),
      minNumOfSymbols = this.get('requiredNumbersOfSymbols'),
      minLength = this.get('minimumPasswordLength'),
      password = '';

    for (var a = 0; a < minNumOfDigits; a++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    for (var b = 0; b < minNumOfSymbols; b++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    for (var c = 0; c < minNumOfUpperCaseLetters; c++) {
      password += letters.charAt(Math.floor(Math.random() * letters.length)).toUpperCase();
    }

    for (var d = 0; d < minNumOfLowerCaseLetters; d++) {
      password += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    if (password.length < minLength) {
      var fillUpLength = minLength - password.length;
      for (var e = 0; e < fillUpLength; e++) {
        password += letters.charAt(Math.floor(Math.random() * letters.length));
      }
    }

    return _.shuffle(password.split('')).join('');
  }
});

mCAP.PasscodePolicy = PasscodePolicy;
