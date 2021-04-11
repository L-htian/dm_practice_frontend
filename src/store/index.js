import Vue from 'vue'
import Vuex from 'vuex'
import KGList from './modules/KGList'
import Header from "./modules/header";
import Uploader from "./modules/Uploader";
import getters from "./getters";
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        KGList,
        Uploader,
        Header
    },
    state: {},
    mutations: {},
    actions: {},
    getters
});