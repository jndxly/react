import COS from 'cos-js-sdk-v5';

const config = {
  host: '//10.4.145.144:8086/fileUpload/upload',
  // host: '172.168.11.124:8060',
  // host: '172.168.11.240:8060',
  token: '',
  cos: new COS({
    getAuthorization: (options, callback) => {
      // 异步获取签名
      let key = options.Key || '';
      let pathname = key;

      let url = 'http://' + config.host + '/v1/author/avatar/sign?ext=' + encodeURIComponent(pathname);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', config.token);
      xhr.onload = function (e) {
        callback(e.target.responseText);
      };
      xhr.send();

      //本地签名
      // var authorization = COS.getAuthorization({
      //   SecretId: 'AKIDHRQFxtMSFwTuAHCyd9UksreMwKWmvreJ',
      //   SecretKey: 'dLi3GPNAlANPFzYvBkAhK3lKtPtKi6Of',
      //   Method: options.Method,
      //   Key: options.Key,
      // });
      // console.log(authorization);
      // callback(authorization);
    }
  }),
    importHandler:function(file){

    return new Promise(function(resolve, reject){
        let formData = new FormData();
        formData.append("file", file);
        let url = config.host ;
        // 实例化一个AJAX对象
        let xhr;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }
        else if(window.ActiveXObject){
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
        }
        xhr.withCredentials = true;




        xhr.open("POST", url, true);

        // 发送表单数据
        xhr.send(formData);

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 ){
                if(xhr.status >= 200 && xhr.status < 300){
                    let result = JSON.parse(xhr.responseText);
                    resolve(result.data);
                }

                else{
                    reject()
                }

            }

        }
    })


    }
}

export default config;


// WEBPACK FOOTER //
// ./src/config/index.js