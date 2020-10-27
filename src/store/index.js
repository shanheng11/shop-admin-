import Vue from 'vue'
import Vuex from 'vuex'
import {Message} from 'element-ui'
import router from '../router'
import http from '../utils/http'
import qs from 'qs'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        token:localStorage.getItem('token')?localStorage.getItem("token"):'',
        info:localStorage.getItem('info')?JSON.parse(localStorage.getItem("info")):{},
    },
    mutations:{
        setinfo(state,payload){
            localStorage.setItem('token',payload.token);
            localStorage.setItem('info',JSON.stringify(payload.info));
            state.token = payload.token;
            state.info = payload.info
        },
        clearinfo(state){
            localStorage.clear();
            state.token='';
            state.info={}
        }
    },
    // actions:{
    //     userlogin(context,payload){
    //         let str = qs.stringify(payload)
    //         console.log(str);
    //         http.post('/api/userlogin',str)
    //         .then(res => {
    //             if(res.code==200){
    //                 context.commit('setinfo',{token:res.list.token,info:res.list})
    //                 router.replace("/index")
    //             }else{
    //                 Message.error(res.msg)
    //             }
    //         })
    //     }
    // }
})