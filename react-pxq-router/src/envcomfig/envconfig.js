let baseURL;
let imgUrl = "//elm.cangdu.org/img/";
if(process.env.NODE_ENV === 'development'){
    baseURL = "//api.cangdu.org";
}
else{
    baseURL = "//api.acngdu.org"
}

export default {imgUrl, baseURL};