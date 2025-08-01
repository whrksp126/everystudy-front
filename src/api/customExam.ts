import { SERVER_URL } from "../utils/server";
import { getCookie } from "../utils/common";
import { refreshAccessToken } from "../utils/loginSession";

export const getSubjectListFetch = async (): Promise<any> => {
  const url = `${SERVER_URL}/common/subject`;
  const method = 'GET';
  const accessToken = getCookie("userAccessToken");
  try{  
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if(response.status === 401) {
      console.log("Access Token 만료: 갱신 시도");
      const refreshed = await refreshAccessToken();
      if(refreshed){
        return await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }else{
        return null;
      }
    }
    return response;
  }catch(error){
    console.error(error);
    return null;
  }
}


export const getDiyExamListFetch = async (): Promise<any> => {
  const deviceType = getCookie("DEVICE_TYPE");
  const url = `${SERVER_URL}/diy_exam/diy_exam_list?device_type=${deviceType}&`;
  const method = 'GET';
  const accessToken = getCookie("userAccessToken");
  try{  
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if(response.status === 401) {
      console.log("Access Token 만료: 갱신 시도");
      const refreshed = await refreshAccessToken();
      if(refreshed){
        return await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }else{
        return null;
      }
    }
    return response;
  }catch(error){
    console.error(error);
    return null;
  }
}