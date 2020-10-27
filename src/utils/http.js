import axios from 'axios'
axios.defaults.timeout = 3000
axios.defaults.baseURL = ''

axios.interceptors.request.use(config => {
  // Do something before request is sent
  let token = localStorage.getItem("token")?localStorage.getItem('token'):'';
  config.headers.Authorization = token
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});
axios.interceptors.response.use(response => {
// Do something before response is sent
return response.data;
},error => {
// Do something with response error
return Promise.reject(error);
});

//封装方法
function get(url,params={}){
    return new Promise((res,rej)=>{
        axios({
            method:'get',
            url,
            params
        }).then((data)=>{
            res(data)
        })
    })
}

function post(url,data={}){
    return new Promise((res,rej)=>{
        axios({
            method:'post',
            url,
            data
        }).then((dat)=>{
            res(dat)
        })
    })
}
function upload(url,data={}){
    return new Promise((res,rej)=>{
        let form = new FormData()
        for(let key in data){
            form.append(key,data[key])
        }
        axios({
            method:"post",
            url,
            data:form,
            headers:{
                "Content-Type": "multipart/form-data"
            }
        }).then(data=>{
            res(data)
        })
    })
}
export default {
    post,
    get,
    upload
}