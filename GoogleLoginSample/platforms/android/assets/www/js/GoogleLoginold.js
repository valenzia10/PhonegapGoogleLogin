var googleLoginApi = {
	clientId: "251875841896.apps.googleusercontent.com",
	
	clientSecret: "YM0NklXI5ZqQoqRzPfYCq-L7",
	
	accessToken: {},

	openAuthWindow: function(){
		var _this = googleLoginApi;
		
		var urlAuth = "https://accounts.google.com/o/oauth2/auth?"
			+ "scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&"
			+ "redirect_uri=http://localhost&"
			+ "response_type=code&"
			+ "client_id=" + _this.clientId;
	
		
		// Open InAppBrowser to get authorization code
		_this.authWindow = window.open(urlAuth, '_blank', 'location=yes,toolbar=yes');
		_this.authWindow.addEventListener('loadstart', _this.parseRedirectUrl);
	
	},
	
	parseRedirectUrl: function(e){
		var _this = googleLoginApi;
		var url = e.url;
		var thereIsCode = url.indexOf("code=");
		var thereIsError = url.indexOf("error=");
		
		if(thereIsCode != -1){
			_this.authWindow.close();
			var toMatch = "code=([^&#]*)";
			var regex = new RegExp(toMatch);
			var result = regex.exec(url);
			if(result != null){
				var code = result[1];
				_this.exchangeCodeForTokens(code);
			}
		}else if(thereIsError != -1){
			_this.authWindow.close();
			localStorage["accessToken"] = null;
			localStorage["Gid"] = null;
			_this.endSignin(-1);
		}		
	},
	
	exchangeCodeForTokens: function(code){
		var _this = googleLoginApi;
		
		var dataQuery = "code=" + code + "&"
				+ "client_id=" + _this.clientId + "&"
				+ "client_secret=" + _this.clientSecret + "&"
				+ "redirect_uri=http://localhost&"
				+ "grant_type=authorization_code";
	
		_this.requestTokens("https://accounts.google.com/o/oauth2/token",dataQuery,_this.callBackTokens);
	},

	callBackTokens: function(resp){
		var _this = googleLoginApi;
		
		var tokensResp = eval('('+resp+')');
	
		if(tokensResp.access_token){
			localStorage["accessToken"] = tokensResp.access_token;
			localStorage["refreshToken"] = tokensResp.refresh_token;
			localStorage["refreshTime"] = (new Date()).getTime() + 1000*tokensResp.expires_in;
		
			_this.accessToken = tokensResp.access_token;
			_this.endSignin(1);
		}else{
			_this.accessToken = null;
			localStorage["accessToken"] = null;
			localStorage["Gid"] = null;
			_this.endSignin(-1);
		}
	},

	getAccessToken: function(refreshToken){
		var _this = googleLoginApi;
		
		var dataQuery = "client_id=" + _this.clientId + "&"
				+ "client_secret=" + _this.clientSecret + "&"
				+ "refresh_token=" + refreshToken + "&"
				+ "grant_type=refresh_token";
	
		_this.requestTokens("https://accounts.google.com/o/oauth2/token",dataQuery,_this.callBackRefreshToken);
	},

	callBackRefreshToken: function(resp){
		var _this = googleLoginApi;
		var tokensResp = eval('('+resp+')');

		if(tokensResp.access_token){
			localStorage["accessToken"] = tokensResp.access_token;
			localStorage["refreshTime"] = (new Date()).getTime() + 1000*tokensResp.expires_in;
	
			_this.accessToken = tokensResp.access_token;	
			_this.endSignin(1);
		}else{
			_this.accessToken = null;
			localStorage["accessToken"] = null;
			localStorage["Gid"] = null;
			_this.endSignin(-1);
		}
	},

	requestTokens: function(url,data,callback){
		var xmlreq = new XMLHttpRequest();
		
		xmlreq.onreadystatechange=function(){
			if (xmlreq.readyState==4 ){//&& xmlreq.status==200){		
				callback(xmlreq.responseText);
			}
		}	
		xmlreq.open("POST",url,true);
		xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlreq.send(data);
	},

	me: function(callback){
		var _this = googleLoginApi;
		
		if(_this.accessToken!==null && typeof(_this.accessToken)!=='undefined'){
			var urlAPI = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + _this.accessToken;
	
			var xmlreq = new XMLHttpRequest();
			xmlreq.onreadystatechange=function(){
				if (xmlreq.readyState==4 && xmlreq.status==200){
					var response = eval('(' + xmlreq.responseText + ')');
					if(response.name){
						localStorage["Gid"] = response.id;
					
						callback(response.name);
					}else{
						_this.accessToken = null;
						localStorage["accessToken"] = null;
						localStorage["Gid"] = null;
						callback(-1);
					}		
				}
			}	
			xmlreq.open("GET",urlAPI,true);
			xmlreq.send();
		}else{
			_this.accessToken = null;
			localStorage["accessToken"] = null;
			localStorage["Gid"] = null;
			callback(-1);
		}
	},
	
	isLoggedIn: function(callback){
		var _this = googleLoginApi;
		
		_this.endSignin = callback;
		_this.accessToken = localStorage["accessToken"];
		
		if(_this.accessToken == "null"){
			_this.accessToken = null;
		}
		
		if(_this.accessToken!==null && typeof(_this.accessToken)!=='undefined'){
			var refreshTime = localStorage["refreshTime"];
			var refreshToken = localStorage["refreshToken"];
			var currentTime = (new Date()).getTime();
			
			if(currentTime < refreshTime){
				_this.endSignin(1);
			}else{
				_this.getAccessToken(refreshToken);
			}
		}else{
			_this.endSignin(-1);
		}
	},
	
	startSignin: function(callbackEnd){
		var _this = googleLoginApi;

		_this.endSignin = callbackEnd;
		_this.openAuthWindow();
	},
	
	endSignin: {},
	
	logOut: function(){
		var _this = googleLoginApi;
		
		_this.accessToken = null;
		localStorage["accessToken"] = null;
		localStorage["Gid"] = null;
	}
}