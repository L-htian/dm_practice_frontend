import Vue from 'vue'
import Vuex from 'vuex'
import KGList from './modules/KGList'
import Header from "./modules/header";
import getters from "./getters";
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        KGList,
        Header
    },
    state: {},
    mutations: {},
    actions: {},
    getters
});