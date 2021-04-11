const KGList = {
    state:{
        selectedKGId: -1,
        selectedKGName: '',
        isGraphOpening: false,
    },
    mutations: {
        set_selectedKGId: function (state, data){
            state.selectedKGId = data;
        },
        set_selectedKGName: function (state, data){
            state.selectedKGName = data;
        },
        set_isGraphOpening: function(state, data){
            state.isGraphOpening = data;
        }
    },
    actions: {

    }
}
export default KGList;