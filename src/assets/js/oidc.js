/* eslint-disable no-unused-vars */
import { hash } from "./md5.js";

var GENERAL = {
	ENTORNO: {
		TOKEN: {},
	},
};
var logout_url = "";
var setting_bearer = {
	headers: {},
};
var params = {},
	queryString = location.hash.substring(1),
	regex = /([^&=]+)=([^&]*)/g;

export function getState() {
	if (
		window.localStorage.getItem("access_token") === null ||
		window.localStorage.getItem("access_token") === undefined
	) {
		console.log("params", params);
		let m;
		while ((m = regex.exec(queryString))) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		// And send the token over to the server
		const req = new XMLHttpRequest();
		// consider using POST so query isn't logged
		const query = "https://" + window.location.host + "?" + queryString;
		req.open("GET", query, true);
		if (params["id_token"] !== null && params["id_token"] !== undefined) {
			window.localStorage.setItem("access_token", params["access_token"]);
			window.localStorage.setItem("id_token", params["id_token"]);
			window.localStorage.setItem("expires_in", params["expires_in"]);
			window.localStorage.setItem("state", params["state"]);
		} else {
			clearStorage();
		}
		req.onreadystatechange = function(e) {
			if (req.readyState === 4) {
				if (req.status === 200) {
					// window.location = params.state;
				} else if (req.status === 400) {
					window.alert("There was an error processing the token.");
				}
			}
		};
	}
	setExpiresAt();
	timer();
	clearUrl();
}

export function setGeneral(url_token) {
	GENERAL.ENTORNO.TOKEN = url_token;
}

export function logout() {
	logout_url = GENERAL.ENTORNO.TOKEN.SIGN_OUT_URL;
	logout_url += "?id_token_hint=" + window.localStorage.getItem("id_token");
	logout_url += "&post_logout_redirect_uri=" + GENERAL.ENTORNO.TOKEN.SIGN_OUT_REDIRECT_URL;
	logout_url += "&state=" + window.localStorage.getItem("state");
	clearStorage();
	window.location.replace(logout_url);
}

export function clearUrl() {
	const clean_uri = window.location.origin + window.location.pathname;
	window.history.replaceState({}, document.title, clean_uri);
}

export function getPayload() {
	var id_token = window.localStorage.getItem("id_token");
	if (typeof id_token !== undefined && id_token !== null) {
		var arr = id_token.split(".");
		return JSON.parse(atob(arr[1]));
	}
	return null;
}

export function logoutValid() {
	var state;
	var valid = true;
	var queryString = location.search.substring(1);
	var regex = /([^&=]+)=([^&]*)/g;
	var m;
	while ((m = regex.exec(queryString))) {
		state = decodeURIComponent(m[2]);
	}
	if (window.localStorage.getItem("state") === state) {
		clearStorage();
		valid = true;
	} else {
		valid = false;
	}
	return valid;
}

// el flag es un booleano que define si abra boton de login
export function live(flag) {
	if (
		window.localStorage.getItem("id_token") === "undefined" ||
		window.localStorage.getItem("id_token") === null ||
		logoutValid()
	) {
		if (!flag) {
			getAuthorizationUrl();
		}
		return false;
	} else {
		return true;
	}
}

export function liveToken() {
	setting_bearer = {
		headers: new Headers({
			headers: {
				Accept: "application/json",
				Authorization: "Bearer " + window.localStorage.getItem("access_token"),
			},
		}),
	};
}

export function getHeader() {
	setting_bearer = {
		headers: {
			Accept: "application/json",
			Authorization: "Bearer " + window.localStorage.getItem("access_token"),
		},
	};
	return setting_bearer;
}

export function getAuthorizationUrl(newWindow = false) {
	params = GENERAL.ENTORNO.TOKEN;
	if (!params.nonce) {
		params.nonce = generateState();
	}
	if (!params.state) {
		params.state = generateState();
	}
	let url =
		params.AUTORIZATION_URL +
		"?" +
		"client_id=" +
		encodeURIComponent(params.CLIENTE_ID) +
		"&" +
		"redirect_uri=" +
		encodeURIComponent(params.REDIRECT_URL) +
		"&" + // + window.location.href + '&' para redirect con regex
		"response_type=" +
		encodeURIComponent(params.RESPONSE_TYPE) +
		"&" +
		"scope=" +
		encodeURIComponent(params.SCOPE) +
		"&" +
		"state_url=" +
		encodeURIComponent(window.location.hash);
	if (params.nonce) {
		url += "&nonce=" + encodeURIComponent(params.nonce);
	}
	url += "&state=" + encodeURIComponent(params.state);
	if (newWindow) window.open(url);
	else window.location = url;
	return url;
}

export function generateState() {
	const text = ((Date.now() + Math.random()) * Math.random()).toString().replace(".", "");
	return hash(text);
}

export function setExpiresAt(expAt = "expires_at", expIn = "expires_in") {
	if (
		window.localStorage.getItem(expAt) === null ||
		window.localStorage.getItem(expAt) === undefined ||
		window.localStorage.getItem(expAt) === "Invalid Date"
	) {
		const expires_at = new Date();
		let secs = expires_at.getSeconds() + parseInt(window.localStorage.getItem(expIn), 10) - 60;
		expires_at.setSeconds(secs);
		window.localStorage.setItem(expAt, expires_at.toUTCString());
	}
}

export function expired(expAt = "expires_at") {
	return new Date(window.localStorage.getItem(expAt)) < new Date();
}

export function timer(expAt = "expires_at", expiredCallback = null) {
	setInterval(() => {
		if (window.localStorage.getItem(expAt) !== null) {
			if (expired()) {
				logout();
				clearStorage();
			}
		} else {
			window.location.reload();
		}
	}, 5000);
}

export function clearStorage() {
	window.localStorage.removeItem("access_token");
	window.localStorage.removeItem("id_token");
	window.localStorage.removeItem("expires_in");
	window.localStorage.removeItem("state");
	window.localStorage.removeItem("expires_at");
}
