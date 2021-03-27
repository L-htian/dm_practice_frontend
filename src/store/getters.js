const getters = {
    // KGList
    selectedKGId: state => state.KGList.selectedKGId,
    isGraphOpening: state => state.KGList.isGraphOpening,
    // header
    current: state => state => state.Header.current,
}
export default getters