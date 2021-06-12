const KGList = {
    state:{
        selectedKGId: -1,
        selectedKGName: '',
        isGraphOpening: false,
        uploadedData: [],
        uploadedTextData:[],
        getUploaded: false,
        getGraphNew: false,
        getTextUpload:false
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
        },
        set_uploadedData: function (state, data) {
            state.uploadedData = data;
        },
        set_getUpload: function (state, data) {
            state.getUploaded = data
        },
        set_getGraphNew: function (state, data) {
            state.getGraphNew = data
        },
        set_getTextUpload:function (state,data){
            state.getTextUpload = data
        },
        set_uploadedTextData:function (state,data){
            state.uploadedTextData = data
        }
    },
    actions: {

    }
}
export default KGList;