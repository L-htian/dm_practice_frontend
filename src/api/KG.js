import $ from 'jquery'
import axios from "axios";

const api = {
    KGPre: 'http://218.244.146.223:8089/api/KG'
}

/**
 * 创建节点时调用获得节点id
 * @param node 节点信息
 * @return 节点id
 * @author 吴昊宇
 * @date 2021/3/29
 */
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

/**
 * 根据节点id删除节点
 * @param id 节点id
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
export function deleteNodeAPI(id) {
    $.ajax(`${api.KGPre}/${id}/deleteNode`, {
        type: 'POST',
        async: true,
        success: function () {
            console.log('delete node success!')
        }
    })
}

/**
 * 更新节点的信息
 * @param node 节点信息
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
export function updateNodeAPI(node) {
    $.ajax(`${api.KGPre}/updateNode`, {
        type: 'POST',
        data: JSON.stringify(node),
        dataType: 'application/json',
        contentType: 'application/json',
        // 后端同步存储
        async: false,
        success: function (data) {
            console.log('update node success!')
        }
    })
}

/**
 * 创建节点之间的连接
 * @param link 连接信息
 * @return 连接id
 * @author 吴昊宇
 * @date 2021/3/29
 */
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
            console.log('save link success!' + newId)
        }
    })
    return newId
}

/**
 * 根据连接id删除连接
 * @param id 连接id
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
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

/**
 * 更新连接信息
 * @param link 连接信息
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
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

/**
 * 更新图谱的信息
 * @param data 图谱信息
 * @return None
 * @author 吴昊宇
 * @date 2021/3/29
 */
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

/**
 * 上传图谱
 * @param data 上传的json文档的数据
 * @return 格式化之后符合图谱要求的图谱数据
 * @author 吴昊宇
 * @date 2021/4/11
 */
export function uploadAPI(data) {
    let re
    $.ajax(`${api.KGPre}/upload`, {
        type: 'POST',
        data: JSON.stringify(data),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (content) {
            console.log('upload success!')
            re = JSON.parse(content).content
            console.log(re)
        }
    })
    return re
}

/**
 * 代码作用
 * @param textData 上传的txt文档的数据
 * @return 格式化处理之后的符合图谱要求的图谱数据
 * @author 吴昊宇
 * @date 2021/6/13
 */
export function getGraphByTextAPI(textData) {
    let re
    $.ajax(`${api.KGPre}/uploadDocument`, {
        type: 'POST',
        data: JSON.stringify({
            "document": textData
        }),
        dataType: 'text',
        contentType: 'application/json',
        async: false,
        success: function (data) {
            re = (JSON.parse(data)).content
            console.log('get text data success')
        }
    })
    return re
}

/**
 * 根据输入内容搜索节点
 * @param graphId 图谱id
 * @param content 搜索内容
 * @return 节点数据
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 获得搜索历史
 * @return 搜索历史
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 创建节点图元信息
 * @param data 节点图元信息
 * @return 节点图元id
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 创建连接图元
 * @param data 连接图元信息
 * @return 连接图元id
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 获得节点图元
 * @return 全部的节点图元信息
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 获得连接图元
 * @return 全部的连接图元信息
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 删除节点图元
 * @param id 节点图元的id
 * @return None
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 删除连接图元
 * @param id 连接图元id
 * @return None
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 获得图谱信息
 * @param id 图谱id
 * @return 图谱信息
 * @author 李昊天
 * @date 2021/4/2
 */
export function saveAsJsonAPI(id) {
    let re
    $.ajax(`${api.KGPre}/${id}/saveAsJson`, {
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

/**
 * 获得图谱信息
 * @param id 图谱id
 * @return 图谱信息
 * @author 李昊天
 * @date 2021/4/2
 */
export function saveAsXmlAPI(id) {
    let re
    $.ajax(`${api.KGPre}/${id}/saveAsXml`, {
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

/**
 * 创建图
 * @return 新图id
 * @author 李昊天
 * @date 2021/4/2
 */
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

/**
 * 获得图信息
 * @param id 图id
 * @return 图的信息
 * @author 李昊天
 * @date 2021/4/2
 */
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
            console.log(graphInfo);
        }
    })
    return graphInfo
}

/**
 * 图谱改名
 * @param graphId 图谱id
 * @param graphName 需要改成的图谱的名字
 * @return None
 * @author 李昊天
 * @date 2021/4/7
 */
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
        success: function () {
            console.log("changeGraphName Success")
        }
    })
}

/**
 * 获得统计数据
 * @param graphId 图谱id
 * @return 统计数据
 * @author 李昊天
 * @date 2021/4/10
 */
export function getCountDataAPI(graphId) {
    let countData
    $.ajax(`${api.KGPre}/${graphId}/getTagCountData`, {
        type: 'GET',
        dataType: 'text',
        data: {},
        async: false,
        success: function (data) {
            countData = (JSON.parse(data)).content
        }
    })
    return countData
}

/**
 * 获得当前图的名称
 * @param graphId 图谱id
 * @return 列表图信息
 * @author 李昊天
 * @date 2021/6/17
 */
export function getSingleGraphInfoAPI(graphId) {
    let re
    $.ajax(`${api.KGPre}/${graphId}/getSingleGraph`, {
        type: 'GET',
        dataType: 'text',
        async: false,
        success: function (data) {
            re = (JSON.parse(data)).content
        }
    })
    return re
}

/**
 * 获得当前节点国有股比例、注册资本、入度、出度、风险值
 * @param nodeId 节点id
 * @return 国有股比例、注册资本、入度、出度、风险值
 * @author 李昊天
 * @date 2021/6/17
 */
export function getSingleNodeRiskAPI(nodeId) {
    let re
    $.ajax(`${api.KGPre}/${nodeId}/getSingleNodeRisk`, {
        type: 'GET',
        dataType: 'text',
        async: false,
        success: function (data) {
            re = {
                "success": (JSON.parse(data)).success,
                "content": (JSON.parse(data)).success === true ? (JSON.parse(data)).content : (JSON.parse(data)).message
            }
        },
    })
    return re
}