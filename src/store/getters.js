const getters = {
    // KGList
    selectedKGId: state => state.KGList.selectedKGId,
    selectedKGName: state => state.KGList.selectedKGName,
    isGraphOpening: state => state.KGList.isGraphOpening,
    uploadedData: state => state.KGList.uploadedData,
    getUpload: state => state.KGList.getUpload,
    getGraphNew: state => state.KGList.getGraphNew,
    getTextUpload:state=>state.KGList.getTextUpload,
    uploadedTextData:state=>state.KGList.uploadedData,
    // header
    current: state => state.Header.current,
    // uploader

}
export default getters