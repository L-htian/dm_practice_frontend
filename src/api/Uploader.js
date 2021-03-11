import {axios} from "@/static/utils/request";
const api = {
    KGUpload : '/api/KGUpload'
}
export function uploadAPI(data){
    return axios({
        url: `${api.KGUpload}/upload`,
        method: 'POST',
        data,
    })
}
