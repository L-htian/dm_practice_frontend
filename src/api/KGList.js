import $ from 'jquery'

const api = {
    KGListPre: 'http://218.244.146.223:8089/api/KGList'
}

/**
 * 获得图的列表信息
 * @return 图的列表信息
 * @author 吴昊宇
 * @date 2021/3/29
 */
export function getAllGraphAPI() {
    let graphs = []
    $.ajax(`${api.KGListPre}/getAllGraph`, {
        type: 'GET',
        contentType: "application/json",
        dataType: 'text',
        // 同步
        async: false,
        success: function (data) {
            graphs = (JSON.parse(data)).content
            console.log('get all graphs success!')
        }
    })
    return graphs
}

/**
 * 删除图谱
 * @param graphId 图谱id
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
export function deleteGraphAPI(graphId) {
    $.ajax(`${api.KGListPre}/${graphId}/deleteGraph`, {
        type: 'POST',
        async: true,
        success: function () {
            console.log('delete graph success!')
        }
    })
}

/**
 * 更新图谱
 * @param graph 图谱
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
export function updateGraphAPI(graph) {
    $.ajax(`${api.KGListPre}/updateGraph`, {
        type: 'POST',
        data: JSON.stringify(graph),
        dataType: 'application/json',
        contentType: 'application/json',
        async: true,
        success: function () {
            console.log('update graph success!')
        }
    })
}

/**
 * 图谱融合
 * @param graphIdList 图谱id的列表
 * @return 融合之后的图谱信息
 * @author 李昊天
 * @date 2021/6/11
 */
export function fuseGraphAPI(graphIdList) {
    let re
    $.ajax(`${api.KGListPre}/fuseGraph`, {
        type: 'POST',
        data: JSON.stringify({
            "graphIdList": graphIdList
        }),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            re = (JSON.parse(data)).content
            console.log("getFuseData success")
        }
    })
    return re
}

