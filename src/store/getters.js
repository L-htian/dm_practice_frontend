const getters = {
    // KGList
    selectedKGId: state => state.KGList.selectedKGId,
    isGraphOpening: state => state.KGList.isGraphOpening,
    // header
    current: state => state.Header.current,
    // uploader
    uploadedData: state => state.Uploader.uploadedData,
}
export default getters