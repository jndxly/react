import COS from 'cos-js-sdk-v5';

const config = {
  host: 'localhost:3000',
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
  })
}

export default config;


// WEBPACK FOOTER //
// ./src/config/index.js