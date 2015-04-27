app.service('MainService', function(base) {


    this.registerUser = function(firstname, lastname, email, password) {
        var user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            pass: password
        };

        console.log(user);
    }

});