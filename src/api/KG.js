import {axios} from "@/static/utils/request";
const api = {
    KGPre : '/api/KG'
}
// 节点相关
export function addNodeAPI(data){
    return axios({
        url: `${api.KGPre}/addNode`,
        method: 'POST',
        data,
    })
}
export function deleteNodeAPI(id){
    return axios({
        url: `${api.KGPre}/${id}/deleteNode`,
        method: 'POST',
    })
}
export function setNodeNameAPI(data){
    return axios({
        url: `${api.KGPre}/${data.id}/setNodeName`,
        method: 'POST',
        data: {"name":data.name},
    })
}
export function setImgsrcAPI(data){
    return axios({
        url: `${api.KGPre}/${data.id}/setImgsrcName`,
        method: 'POST',
        data: {"imgsrc":data.imgsrc},
    })
}
// 联系相关
export function addLinkAPI(data){
    return axios({
        url: `${api.KGPre}/addLink`,
        method: 'POST',
        data,
    })
}
export function deleteLinkAPI(id){
    return axios({
        url: `${api.KGPre}/${id}/deleteLink`,
        method: 'POST',
    })
}
export function setLinkNameAPI(data){
    return axios({
        url: `${api.KGPre}/${data.id}/setLinkName`,
        method: 'POST',
        data: {"name":data.name},
    })
}
// 图谱相关
export function getKGDataAPI(id){
    return axios({
        url: `${api.KGPre}/${id}/getKGData`,
        method: 'GET',
    })
}
export async function saveAsJsonAPI(){
    const res = await axios({
        url: `${api.KGPre}/saveAsJson`,
        method: 'POST',
        data:params,
        headers:{
            'Content-Type':'application/json; charset=utf-8'
        },
        responseType:'blob',
    });
    return res.data;
}
export async function saveAsXmlAPI(params){
    const res = await axios({
        url: `${api.KGPre}/saveAsXml`,
        method: 'POST',
        data:params,
        headers:{
            'Content-Type':'application/xml; charset=utf-8'
        },
        responseType:'blob',
    });
    return res.data;
}