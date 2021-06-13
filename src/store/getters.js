const getters = {
    // KGList
    selectedKGId: state => state.KGList.selectedKGId,
    selectedKGName: state => state.KGList.selectedKGName,
    isGraphOpening: state => state.KGList.isGraphOpening,
    uploadedFile: state => state.KGList.uploadedFile,
    getUploaded: state => state.KGList.getUploaded,
    getGraphNew: state => state.KGList.getGraphNew,
    getTextUpload: state => state.KGList.getTextUpload,
    uploadedTextFile: state => state.KGList.uploadedTextFile,
    getFused: state => state.KGList.getFused,
    fusedGraph: state => state.KGList.fusedGraph,
    // header
    current: state => state.Header.current,
}
export default getters