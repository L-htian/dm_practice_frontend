import $ from 'jquery'

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
    $.ajax(`${api.KGPre}/createLink`, {
        type: 'POST',
        data: JSON.stringify(link),
        dataType: 'application/json',
        contentType: 'application/json',
        // 同步
        async: true,
        success: function (data) {
            console.log('save link success!')
        }
    })
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
        dataType: 'application/json',
        contentType: 'application/json',
        async: true,
        success: function () {
            console.log('update graphInfo success!')
        }
    })
}
