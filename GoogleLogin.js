var GoogleLogin = function(id,secret){
	var clientId = id;
	var clientSecret = secret;
	var accessToken =  {};
	var authWindow = null;
	var endSignin = {};

	var openAuthWindow = function(){
		var urlAuth = "https://accounts.google.com/o/oauth2/auth?"
			+ "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&"
			+ "redirect_uri=http://localhost&"
			+ "response_type=code&"
			+ "client_id=" + clientId;
	
		
		// Open InAppBrowser to get authorization code
		authWindow = window.open(urlAuth, '_blank', 'location=yes,toolbar=no');
		authWindow.addEventListener('loadstart', parseRedirectUrl);
	
	};
	
	var parseRedirectUrl = function(e){
		var url = e.url;
		var thereIsCode = url.indexOf("code=");
		var thereIsError = url.indexOf("error=");
		
		if(thereIsCode != -1){
			authWindow.close();
			var toMatch = "code=([^&#]*)";
			var regex = new RegExp(toMatch);
			var result = regex.exec(url);
			if(result != null){
				var code = result[1];
				exchangeCodeForTokens(code);
			}
		}else if(thereIsError != -1){
			authWindow.close();
			localStorage["accessToken"] = null;
			endSignin(-1);
		}		
	};
	
	var exchangeCodeForTokens = function(code){
		var dataQuery = "code=" + code + "&"
				+ "client_id=" + clientId + "&"
				+ "client_secret=" + clientSecret + "&"
				+ "redirect_uri=http://localhost&"
				+ "grant_type=authorization_code";
	
		requestTokens("https://accounts.google.com/o/oauth2/token",dataQuery,callBackTokens);
	};

	var callBackTokens = function(resp){
		var tokensResp = eval('('+resp+')');
	
		if(tokensResp.access_token){
			localStorage["accessToken"] = tokensResp.access_token;
			localStorage["refreshToken"] = tokensResp.refresh_token;
			localStorage["refreshTime"] = (new Date()).getTime() + 1000*tokensResp.expires_in;
		
			accessToken = tokensResp.access_token;
			endSignin(accessToken);
		}else{
			accessToken = null;
			localStorage["accessToken"] = null;
			endSignin(-1);
		}
	};

	var getAccessToken = function(refreshToken){
		var dataQuery = "client_id=" + clientId + "&"
				+ "client_secret=" + clientSecret + "&"
				+ "refresh_token=" + refreshToken + "&"
				+ "grant_type=refresh_token";
	
		requestTokens("https://accounts.google.com/o/oauth2/token",dataQuery,callBackRefreshToken);
	};

	var callBackRefreshToken = function(resp){
		var tokensResp = eval('('+resp+')');

		if(tokensResp.access_token){
			localStorage["accessToken"] = tokensResp.access_token;
			localStorage["refreshTime"] = (new Date()).getTime() + 1000*tokensResp.expires_in;
	
			accessToken = tokensResp.access_token;	
			endSignin(accessToken);
		}else{
			accessToken = null;
			localStorage["accessToken"] = null;
			endSignin(-1);
		}
	};

	var requestTokens = function(url,data,callback){
		var xmlreq = new XMLHttpRequest();
		
		xmlreq.onreadystatechange=function(){
			if (xmlreq.readyState == 4){		
				callback(xmlreq.responseText);
			}
		};
		xmlreq.open("POST",url,true);
		xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlreq.send(data);
	};
	
	var isLoggedIn = function(callback){
		endSignin = callback;
		accessToken = localStorage["accessToken"];
		
		if(accessToken == "null"){
			accessToken = null;
		}
		
		if(accessToken!==null && typeof(accessToken)!=='undefined'){
			var refreshTime = localStorage["refreshTime"];
			var refreshToken = localStorage["refreshToken"];
			var currentTime = (new Date()).getTime();
			
			if(currentTime < refreshTime){
				endSignin(accessToken);
			}else{
				getAccessToken(refreshToken);
			}
		}else{
			endSignin(-1);
		}
	};
	
	var startSignin = function(callbackEnd){
		endSignin = callbackEnd;
		openAuthWindow();
	};
	
	var logOut = function(){
		accessToken = null;
		localStorage["accessToken"] = null;
		localStorage["refreshToken"] = null;
	};
	
	return {
	        startSignin: startSignin,
	        isLoggedIn: isLoggedIn,
	        logOut: logOut
	        };
};