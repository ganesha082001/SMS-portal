const SessionStorageUtil = {
    setAppData: function(data) {
        sessionStorage.setItem('appData', JSON.stringify(data));
    },

    getAppData: function() {
        const appData = sessionStorage.getItem('appData');
        return appData ? JSON.parse(appData) : null;
    },

    // create a function to get particular data from session storage
    getParticularData: function(key) {
        const appData = sessionStorage.getItem('appData');
        return appData ? JSON.parse(appData)[key] : null;
    },

    // create a function to set particular data to session storage
    setParticularData: function(key, value) {
        const appData = sessionStorage.getItem('appData');
        if (appData) {
            const data = JSON.parse(appData);
            data[key] = value;
            sessionStorage.setItem('appData', JSON.stringify(data));
        }
    },

    // create a function to clear particular data from session storage
    clearParticularData: function(key) {
        const appData = sessionStorage.getItem('appData');
        if (appData) {
            const data = JSON.parse(appData);
            delete data[key];
            sessionStorage.setItem('appData', JSON.stringify(data));
        }
    },

    getCurrentUserID: function() {
        const appData = sessionStorage.getItem('appData');
        return appData ? JSON.parse(appData).userID : null;
    },


    clearAppData: function() {
        sessionStorage.removeItem('appData');
    }
};

export default SessionStorageUtil;