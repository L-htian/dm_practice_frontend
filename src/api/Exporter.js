import {axios} from "@/static/utils/request";
const api = {
    KGExport : '/api/KGExport'
}
export async function exportXmlAPI(params){
    const res = await axios({
        url: `${api.KGExport}/exportXml`,
        method: 'POST',
        data:params,
        headers:{
            'Content-Type':'application/xml; charset=utf-8'
        },
        responseType:'blob',
    });
    return res.data;
}