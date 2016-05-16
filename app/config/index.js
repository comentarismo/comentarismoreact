var BASE_URL = 'http://comentarismo.com';
var API_URL = 'http://api.comentarismo.com';
var ELK_URL = 'http://elk.comentarismo.com';

if (typeof window !== 'undefined') {
    if (document.location.hostname.indexOf("localhost") !== -1) {
        BASE_URL = 'http://localhost:3002';
        API_URL = 'http://localhost:3000';
        ELK_URL = 'http://g7-box:9200';
    }
}
else if(process.env.NODE_ENV !== "production"){
    BASE_URL = 'http://localhost:3002';
    API_URL = 'http://localhost:3000';
    ELK_URL = 'http://g7-box:9200';
}

let config = {
    BASE_URL: BASE_URL,
    API_URL: API_URL,
    ELK_URL: ELK_URL,
    LOGIN_URL: BASE_URL + '/login',
};


export default config;
