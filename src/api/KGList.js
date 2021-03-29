import $ from 'jquery'

const api = {
    KGListPre: 'http://localhost:8089/api/KGList'
}

export function getAllGraphAPI() {
    let graphs = []
    $.ajax(`${api.KGListPre}/getAllGraph`, {
        type: 'GET',
        contentType: "application/json",
        async: true,
        success: function (data) {
            graphs = (JSON.parse(data)).content.graph
            console.log('get all graphs success!')
        }
    })
    return graphs
}

export function deleteGraphAPI(graphId) {
    $.ajax(`${api.KGListPre}/${graphId}/deleteGraph`, {
        type: 'POST',
        async: false,
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
        async: false,
        success: function () {
            console.log('update graph success!')
        }
    })
}