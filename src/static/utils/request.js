import Vue from 'vue'
import axios from 'axios'
import {VueAxios} from "./axios"
import {notification, message} from 'ant-design-vue'

// 创建 axios 实例
const service = axios.create({
    // todo 服务器url
    baseURL: process.env.NODE_ENV === 'production' ? '': 'http://localhost:8080',
    withCredentials: true
})
console.log(process.env.NODE_ENV)
const err = (error) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status === 403) {
            notification.error({
                message: 'Forbidden',
                description: data.message
            })
        }
        if (error.response.status === 401 && !(data.result)) {
            notification.error({
                message: 'Unauthorized',
                description: 'Authorization verification failed'
            })
        }
    }
    return Promise.reject(error)
}

//request interceptor
service.interceptors.request.use((config) => {
    const requestConfig = {
        ...config,
        url: `${config.url}`,
    }
    return requestConfig
}, err)

service.interceptors.response.use((response) => {
    switch (response.status) {
        case 200:
            if(response.data.success && response.data.success){
                return response.data.content
            }
            message.error(response.data.message)
            break
        case 404:
            return false
        default:
            message.error(response.data.message)
    }
})

const installer = {
    vm: {},
    install (Vue) {
        Vue.use(VueAxios, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}