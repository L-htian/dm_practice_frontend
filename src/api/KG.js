import axios from 'axios';
const api = {
    KGPre : 'http://localhost:8089/api/KG/'
}
// 图谱相关
export function getKGDataAPI(id){
    // todo
}
// export async function saveAsJsonAPI(){
//     const res = await axios({
//         url: `${api.KGPre}/saveAsJson`,
//         method: 'POST',
//         headers:{
//             'Content-Type':'application/json; charset=utf-8'
//         },
//         responseType:'blob',
//     });
//     return res.data;
// }
// export async function saveAsXmlAPI(){
//     const res = await axios({
//         url: `${api.KGPre}/saveAsXml`,
//         method: 'POST',
//         headers:{
//             'Content-Type':'application/xml; charset=utf-8'
//         },
//         responseType:'blob',
//     });
//     return res.data;
// }