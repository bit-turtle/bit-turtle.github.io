		var highscore = 0;
		function setCookie(cname,cvalue,exdays) {
 		const d = new Date();
  		d.setTime(d.getTime() + (exdays*24*60*60*1000));
  		let expires = "expires=" + d.toUTCString();
  		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
		}

		function getCookie(cname) {
  		let name = cname + "=";
  		let decodedCookie = decodeURIComponent(document.cookie);
  		let ca = decodedCookie.split(';');
  		for(let i = 0; i < ca.length; i++) {
    		let c = ca[i];
    		while (c.charAt(0) == ' ') {
      		c = c.substring(1);
    		}
    		if (c.indexOf(name) == 0) {
      		return c.substring(name.length, c.length);
    		}
  		}
  		return "";
		}

		function checkCookie() {
  		let high = getCookie("attackhighscore");
  		if (high != "") {
    		highscore = high;
  		} else {
     		if (high != "" && high != null) {
       		setCookie("attackhighscore", 0, 30);
     		}
  		}
		}
		checkCookie();
