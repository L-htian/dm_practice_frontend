import $ from 'jquery'

const api = {
    KGListPre: 'http://localhost:8089/api/KGList'
}

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

export function deleteGraphAPI(graphId) {
    $.ajax(`${api.KGListPre}/${graphId}/deleteGraph`, {
        type: 'POST',
        async: true,
        success: function () {
            console.log('delete graph success!')
        }
    })
}

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
