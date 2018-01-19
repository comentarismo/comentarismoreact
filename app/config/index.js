var BASE_URL = 'https://www.comentarismo.com';
var API_URL = 'https://api.comentarismo.com';
var ELK_URL = 'https://elk.comentarismo.com';
var SNT_URL = 'https://sentiment.comentarismo.com';
var FE_SNT_URL = '//sentiment.comentarismo.com';


if (typeof window !== 'undefined') {
    if (document.location.hostname.indexOf("localhost") !== -1) {
        BASE_URL = 'http://localhost:3002';
        API_URL = 'http://localhost:3000';
        ELK_URL = 'http://g7-box:9200';
        SNT_URL = 'http://localhost:3003';
        FE_SNT_URL = '//localhost:3003';
    }
}
else if(process.env.NODE_ENV !== "production"){
    BASE_URL = 'http://localhost:3002';
    API_URL = 'http://localhost:3000';
    ELK_URL = 'http://g7-box:9200';
    SNT_URL = 'http://localhost:3003';
    FE_SNT_URL = '//localhost:3003';
}

let config = {
    BASE_URL: BASE_URL,
    API_URL: API_URL,
    ELK_URL: ELK_URL,
    SNT_URL: SNT_URL,
    FE_SNT_URL: FE_SNT_URL,
    LOGIN_URL: BASE_URL + '/login',
};


export default config;
