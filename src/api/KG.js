import $ from 'jquery'
import axios from "axios";

const api = {
    KGPre: 'http://localhost:8089/api/KG/'
}

// api方法ajax版
export function createNodeAPI(node) {
    let newId
    $.ajax(`${api.KGPre}/createNode`, {
        type: 'POST',
        data: JSON.stringify(node),
        dataType: 'text',
        contentType: "application/json",
        async: false,
        success: function (data) {
            console.log(typeof data)
            console.log(JSON.parse(data).content.id)
            console.log(typeof JSON.parse(data))
            newId = (JSON.parse(data)).content.id
        },
        error: function (data) {
            console.log(data)
            console.log(2)
        }
    })
    return newId
}

export function deleteNodeAPI(id) {
    $.ajax(`${api.KGPre}/${id}/deleteNode`, {
        type: 'POST',
        async: true,
        success: function () {
            console.log('delete node success!')
        }
    })
}

export function updateNodeAPI(node) {
    $.ajax(`${api.KGPre}/updateNode`, {
        type: 'POST',
        data: JSON.stringify(node),
        dataType: 'application/json',
        contentType: 'application/json',
        // 后端异步存储
        async: true,
        success: function (data) {
            console.log('update node success!')
        }
    })
}

export function createLinkAPI(link) {
    let newId
    $.ajax(`${api.KGPre}/createLink`, {
        type: 'POST',
        data: JSON.stringify(link),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            newId = (JSON.parse(data)).content.id
            console.log('save link success!')
        }
    })
    return newId
}

export function deleteLinkAPI(id) {
    $.ajax(`${api.KGPre}/${id}/deleteLink`, {
        type: 'POST',
        contentType: 'application/json',
        // 后端异步删除
        async: true,
        success: function () {
            console.log('delete link success!')
        }
    })
}

export function updateLinkAPI(link) {
    $.ajax(`${api.KGPre}/updateLink`, {
        type: 'POST',
        data: JSON.stringify(link),
        dataType: 'application/json',
        contentType: 'application/json',
        // 后端异步存储
        async: true,
        success: function (data) {
            console.log('update link success!')
        }
    })
}

export function updateAPI(data) {
    $.ajax(`${api.KGPre}/update`, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'application/json',
        contentType: 'application/json',
        async: false,
        success: function () {
            console.log('update graphInfo success!')
        }
    })
}

// todo upload
export function uploadAPI(data) {
    $.ajax(`${api.KGPre}/upload`, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'application/json',
        contentType: 'application/json',
        async: true,
        success: function (content) {
            console.log('upload success!')
            return JSON.parse(content).content
        }
    })
}

export function searchNodeAPI(graphId, content) {
    let searchResult
    $.ajax(`${api.KGPre}/searchNode`, {
        type: 'POST',
        data: JSON.stringify({"graphId": graphId, "content": content}),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('saveSearchHistory Success')
            searchResult = JSON.parse(data).content
        }
    })
    return searchResult
}

export function getSearchHistoryAPI() {
    let results
    $.ajax(`${api.KGPre}/searchHistory`, {
        type: 'GET',
        data: {},
        dataType: 'text',
        // contentType:'application/json',
        async: false,
        success: function (data) {
            console.log('getSearchHistory Success')
            results = JSON.parse(data).content
        }
    })
    return results
}

export function createNodePrimitiveAPI(data) {
    let NodePrimitive
    $.ajax(`${api.KGPre}/createNodePrimitive`, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('Save NodePrimitive Success')
            NodePrimitive = (JSON.parse(data)).content;
        }
    })
    return NodePrimitive
}

export function createLinkPrimitiveAPI(data) {
    let LinkPrimitive
    $.ajax(`${api.KGPre}/createLinkPrimitive`, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('Save LinkPrimitive Success')
            LinkPrimitive = (JSON.parse(data)).content;
        }
    })
    return LinkPrimitive
}

export function getNodePrimitiveAPI() {
    let NodePrimitive
    $.ajax(`${api.KGPre}/getNodePrimitive`, {
        type: 'GET',
        data: {},
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('getNodePrimitive Success')
            NodePrimitive = (JSON.parse(data)).content
        }
    })
    return NodePrimitive
}

export function getLinkPrimitiveAPI() {
    let LinkPrimitive
    $.ajax(`${api.KGPre}/getLinkPrimitive`, {
        type: 'GET',
        data: {},
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('getLinkPrimitive Success')
            LinkPrimitive = (JSON.parse(data)).content
        }
    })
    return LinkPrimitive
}

export function deleteNodePrimitiveAPI(id) {
    $.ajax(`${api.KGPre}/${id}/deleteNodePrimitive`, {
        type: 'POST',
        contentType: 'application/json',
        async: true,
        success: function () {
            console.log('deleteNodePrimitive Success')
        }
    })
}

export function deleteLinkPrimitiveAPI(id) {
    $.ajax(`${api.KGPre}/${id}/deleteLinkPrimitive`, {
        type: 'POST',
        contentType: 'application/json',
        async: true,
        success: function () {
            console.log('deleteLinkPrimitive Success')
        }
    })
}

//todo 上传API 需要再议


export function saveAsJsonAPI(id) {
    let re
    $.ajax(`${api.KGPre}/saveAsJson`, {
        type: 'GET',
        data: {},
        dataType: 'text',
        async: false,
        success: function (data) {
            console.log('getJsonSourceData Success')
            re = (JSON.parse(data)).content
        }
    })
    return re
}

export function saveAsXmlAPI(id) {
    let re
    $.ajax(`${api.KGPre}/saveAsXml`, {
        type: 'GET',
        data: {},
        dataType: 'text',
        async: false,
        success: function (data) {
            console.log('getXmlSourceData Success')
            re = (JSON.parse(data)).content
        }
    })
    return re
}

export function createGraphAPI() {
    let graph
    $.ajax(`${api.KGPre}/createGraph`, {
        type: 'GET',
        dataType: 'text',
        data: {},
        contentType: 'application/json',
        async: false,
        success: function (data) {
            console.log('createGraphSuccess!')
            graph = (JSON.parse(data)).content
        }
    })
    return graph
}

export function getGraphAPI(id) {
    let graphInfo
    $.ajax(`${api.KGPre}/${id}/getGraph`, {
        type: 'GET',
        dataType: 'text',
        data: {},
        async: false,
        success: function (data) {
            console.log('getGraph Success')
            graphInfo = (JSON.parse(data)).content;
            // return graphInfo;
        }
    })
    return graphInfo
}

export function changeGraphNameAPI(graphId, graphName) {
    $.ajax(`${api.KGPre}/changeGraphName`, {
        type: 'POST',
        data: JSON.stringify({
            "name": graphName,
            "id": graphId,
            "imgsrc": '',
            "description": '',
        }),
        dataType: 'text',
        contentType: 'application/json',
        success: function (data) {
            console.log("changeGraphName Success")
        }
    })
}

export function getCountDataAPI(graphId) {
    let countData
    $.ajax(`${api.KGPre}/${graphId}/getCountData`, {
        type: 'GET',
        dataType: 'text',
        async: false,
        success: function (data) {
            countData = (JSON.parse(data)).content
        }
    })
    return countData
}