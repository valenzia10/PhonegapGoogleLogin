this.addEventListener("DOMContentLoaded", setupEvents, true);

function setupEvents(){
    document.addEventListener("deviceready",onDeviceReady,false);
}

function onDeviceReady(){
     document.getElementById("login-button").addEventListener('click',startLogin,false);
     document.getElementById("logout-button").addEventListener('click',logout,false);
     
     var clientId = "251875841896.apps.googleusercontent.com";
     var clientSecret = "YM0NklXI5ZqQoqRzPfYCq-L7";
     
     // Create login object and initialize with your app client id and secret
     gl = new GoogleLogin(clientId, clientSecret);
}

// Start login function if not already logged in
function startLogin(e){
  gl.startSignin(endLogin);
}

// Callback that fires when login process ends
function endLogin(result){
  if(result === -1){
    // Login was not successful :(
		alert('Login error');
	}else{
		// If successful login, use access_token to get profile name
		me(result);
	}
}

// Function to logout
function logout(e){
  gl.logOut();
  
  // Clear profile name
  document.getElementById("profile-name").innerHTML = ' ... ';
            
  // Update anchor behavior to logout
  var logoutButton = document.getElementById("logout-button");
  logoutButton.style.display = 'none';
  var loginButton = document.getElementById("login-button");
  loginButton.style.display = 'inline';
}

function me(accessToken){
		if(accessToken!==null && typeof(accessToken)!=='undefined'){
			var urlAPI = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken;
	
			var xmlreq = new XMLHttpRequest();
			xmlreq.onreadystatechange=function(){
				if (xmlreq.readyState==4 && xmlreq.status==200){
					var response = eval('(' + xmlreq.responseText + ')');
					if(response.name){					
						// Update profile name
            document.getElementById("profile-name").innerHTML = response.name 
                                  + '<br>Id: ' + response.id;
            
            // Update anchor behavior to logout
            var loginButton = document.getElementById("login-button");
            loginButton.style.display = 'none';
            var logoutButton = document.getElementById("logout-button");
            logoutButton.style.display = 'inline';
					}
				}
			}	;
			xmlreq.open("GET",urlAPI,true);
			xmlreq.send();
		}
}

