PhonegapGoogleLogin
===================

Google Login Javascript module to be used within Phonegap projects. It implements the client side of the OAuth authentication protocol, following the authentication process as an installed application described here:

https://developers.google.com/accounts/docs/OAuth2InstalledApp

This module has been tested in Phonegap versions from 2.3 up to 3.3, and for Android and iOS platforms.

The only dependence required for this module InAppBrowser Phonegap plugin. It does not use any Javascript library such as jQuery.

To locally store access and refresh tokens, localStorage is used.

The module requests authorization for basic profile info and email. To request other permissions, authorization scope should be modified within the module implementation ('urlAuth' string within 'openAuthWindow' function).

Usage information:
------------------

To start using the module, it has to be initialized using its constructor with your app client id and secret as following:

     var clientId = "MY_CLIENT_ID";
     var clientSecret = "MY_CLIENT_SECRET";
     
     // Create login object and initialize it with your app client id and secret
     gl = new GoogleLogin(clientId, clientSecret);


This module has only three public methods described hereafter.

- startSignin(cb):

Method that starts an authentication process from scratch by requesting the user to input his/her credentials in order to request new refresh and access tokens. It requires to be passed a callback as an argument. If the login process is successful, the callback is called with the access token as an argument, otherwise the callback is invoked with an argument equal to -1. Example:

    gl.startSignin(endLogin);


    // Callback that fires when login process ends
    function endLogin(result){
      if(result === -1){
        // Login was not successful :(
		    alert('Login error');
	    }else{
		    // If successful login, alert access_token
		    alert(result);
	    }
    }

- isLoggedIn(cb):

Method that checks if the user is already logged in. If the available access_token has already expired, a new one is requested by using the stored refresh_token. It requires to be passed a callback as an argument. If the user is already logged in, the callback is called with the access token as an argument, otherwise the callback is invoked with an argument equal to -1. Example:

    gl.isLoggedIn(endLoginCheck);
    
    // Callback to fire when login status check ends
    function endLoginCheck(status){
      if(status === -1){
        // User was not logged in
        alert('You are not logged in yet');
	    }else{
		    // User was already logged in, alert access_token
		    alert(result);
	    }
    }

- logOut():

Method to log the user out. It clears the stored refresh and access tokens. This method does not require any argument. Example:

    gl.logOut();


For further reference, a sample phonegap application is provided.

------------------

Released under MIT License:

Copyright (c) 2014 E. Valencia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
