function(instance, properties, context) {

    // Function to check if debug mode is enabled
    function isDebugMode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('debug_mode_flusk_badge') === 'true';
    }

    // Function to log messages if debug mode is enabled
    function debugLog(message) {
        if (isDebugMode()) {
            console.log('Debug:', message);
        }
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
        debugLog("Set cookie: " + name + "=" + value + "; expires in " + days + " day(s)");
    }

    // Function to get a cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                debugLog("Found cookie: " + name);
                return c.substring(nameEQ.length, c.length);
            }
        }
        debugLog("Cookie not found: " + name);
        return null;
    }

    // Function to construct the API URL
    function constructApiUrl() {
        var apiUrl = 'https://api.flusk.eu/api:security/get-badge?app_id=' + window.app._id;
        if (isDebugMode()) {
            apiUrl += "&bypass_cache=" + new Date().getTime();
        }
        return apiUrl;
    }

    // Function to decide which image to use
    function getImageUrl(security_code) {
        if (security_code == "1") {
            return properties.theme === 'light' ? 
                'https://meta-q.cdn.bubble.io/f1706046905395x925163850755039500/1_light.svg' :
                'https://meta-q.cdn.bubble.io/f1706046916623x615699398506102100/1_dark.svg';
        } else {
            return properties.theme === 'light' ? 
                'https://meta-q.cdn.bubble.io/f1706046879683x352764287724591100/0_light.svg' :
                'https://meta-q.cdn.bubble.io/f1706046894403x415529898331008500/0_dark.svg';
        }
    }

    // Main code
    debugLog("Starting script");

    // Check if debug mode is enabled to force refresh
    if (isDebugMode()) {
        debugLog("Debug mode active - forcing data fetch");
        fetchDataAndDisplay();
    } else {
        var cookieValue = getCookie("flusk-security-badge");
        if (cookieValue) {
            var cookieData = JSON.parse(cookieValue);
            debugLog("Using data from cookie");
            displayBadge(cookieData.url, cookieData.security_code);
        } else {
            debugLog("No cookie found - fetching data");
            fetchDataAndDisplay();
        }
    }

    function fetchDataAndDisplay() {
        fetch(constructApiUrl())
            .then(response => response.json())
            .then(data => {
                setCookie("flusk-security-badge", JSON.stringify({ url: data.url, security_code: data.security_code }), data.security_code == "1" ? 30 : 1);
                displayBadge(data.url, data.security_code);
            })
            .catch(error => {
                console.error('Error:', error);
                debugLog("Error fetching data: " + error.message);
            });
    }

        function displayBadge(url, security_code) {
            var imageUrl = getImageUrl(security_code);
            instance.canvas.empty(); // Ensure the canvas is empty before appending new content
            instance.canvas.append('<a href="' + url + '" target="_blank"><img src="' + imageUrl + '" alt="Flusk Security Badge" style="width:100%;height:auto;"></a>');
            debugLog("Displayed badge with image: " + imageUrl + " and link: " + url);
        }

}