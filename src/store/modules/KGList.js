const KGList = {
    state: {
        selectedKGId: -1,
        selectedKGName: '',
        isGraphOpening: false,
        uploadedFile: [],
        uploadedTextFile: [],
        fusedGraph: {},
        getUploaded: false,
        getGraphNew: false,
        getTextUpload: false,
        getFused: false
    },
    mutations: {
        set_selectedKGId: function (state, data) {
            state.selectedKGId = data;
        },
        set_selectedKGName: function (state, data) {
            state.selectedKGName = data;
        },
        set_isGraphOpening: function (state, data) {
            state.isGraphOpening = data;
        },
        set_uploadedFile: function (state, data) {
            state.uploadedFile = data;
        },
        set_getUpload: function (state, data) {
            state.getUploaded = data;
        },
        set_getGraphNew: function (state, data) {
            state.getGraphNew = data;
        },
        set_getTextUpload: function (state, data) {
            state.getTextUpload = data;
        },
        set_uploadedTextFile: function (state, data) {
            state.uploadedTextFile = data;
        },
        set_getFused: function (state, data) {
            state.getFused = data;
        },
        set_fusedGraph: function (state, data) {
            state.fusedGraph = data;
        }
    },
    actions: {}
}
export default KGList;