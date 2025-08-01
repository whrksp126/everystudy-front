import { refreshAccessToken } from "./loginSession";

// 쿠키 조회
export function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

// 쿠키 설정
export function setCookie(name: string, value: string, days: number = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
} 

// URL에서 마지막 경로 값을 가져오는 함수
export function getLastPathFromURL(): string {
  const path = window.location.pathname;
  let lastPath = path.substring(path.lastIndexOf('/') + 1);
  if (lastPath.endsWith('.html')) {
    lastPath = lastPath.substring(0, lastPath.lastIndexOf('.'));
  }
  return lastPath;
}

// 비동기 fetch api
export async function fetchDataAsync(url: string, method: string, data: any, form: boolean = false){
  const accessToken = getCookie("userAccessToken");

  let newUrl = url;
  const headers: any = {
    'Authorization': `Bearer ${accessToken}`
  }
  if(!form){ headers['Content-Type'] = `application/json`}
  const fetchOptions: any = { method, headers};
  if(method !== 'GET' && form) {
    const formData = new FormData();
    formData.append('json_data', JSON.stringify(data.json_data)) 
    data.form_data.forEach(({key, value}: {key: string, value: string})=>{
      formData.append(key, value);
    })
    fetchOptions.body = formData
  }
  if(method !== 'GET' && !form){
    fetchOptions.body = JSON.stringify(data);
  }
  if(method == 'GET' || method == 'DELETE'){
    newUrl += `?`
    for (const key in data) {
      const value = data[key];
      newUrl += `${key}=${value}&`;
    }
    console.log(newUrl);
  }
  fetchOptions.credentials = 'include';
  try {
    const response = await fetch(newUrl, fetchOptions);
    if (response.ok) {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('image/') || contentType.includes('audio/') || contentType.includes('application/octet-stream')) {
        return await response.blob();
      } else if (contentType.includes('text/')) {
        return await response.text();
      } else {
        throw new Error('지원하지 않는 데이터 형식입니다.');
      }
    } else if(response.status === 401) {
      console.log("Access Token 만료: 갱신 시도");
      const refreshed = await refreshAccessToken();
      if(refreshed){
        return await fetchDataAsync(url, method, data, form) // 새 Access Token으로 재요청
      }else{
        return null;
      }
    }else{
      throw new Error('문제가 발생했습니다.');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}