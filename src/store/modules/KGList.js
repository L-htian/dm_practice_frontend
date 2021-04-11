const KGList = {
    state:{
        selectedKGId: null,
        isGraphOpening: false,
    },
    mutations: {
        set_selectedKGId: function (state, data){
            state.selectedKGId = data
        },
        set_isGraphOpening: function(state, data){
            state.isGraphOpening = data
        }
    },
    actions: {

    }
}
export default KGList;