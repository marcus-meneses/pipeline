'use strict';

class Errors {

    constructor() {
   
        this.databaseConnectionError = 'Cannot connect to database';
        this.databaseError = 'Error writing or accessing data';
        this.authenticationError = 'Invalid User or Password';
        this.credentialsError = 'User not authorized';
        this.authorizationError = 'Invalid or expired Token';

        this.undefinedClientError = 'Undefined Client parameter';
        this.undefinedSizeError = 'Undefined Size parameter';
        this.defectiveSizeError = 'Size parameter must be a posivite integer';
        this.undefinedSmError = 'Undefined Sm parameter';
        this.defectiveSmError = 'Sm parameter must be a positive integer';
        this.undefinedMacroError = 'Undefined Macro parameter';
        this.defectiveMacroError = 'Macro parameter must have more than 3 characters';
  
    }

}

module.exports = new Errors();