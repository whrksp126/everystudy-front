import { refreshAccessToken } from "./loginSession";
import { osGetFileInfo } from "./osFunction";
// PDF.js는 이제 React 훅에서 사용됩니다.
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
      return response;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


// 앱 내장 저장소 PDF 파일 저장 및 조회
export const getAppPdfFileData = async ({filePath, fileName}: {filePath: string, fileName: string}) => {
  const fileInfo = JSON.parse(await osGetFileInfo(filePath));
  const page_count = fileInfo.total_page;
  const size = fileInfo.size;
  const thumbnailPath = filePath.replace(/\.pdf$/, '.png');
  const { thumbnailBlob, coverImg } = await getAppThumbnailBlobAndUrl(thumbnailPath) as any;
  return {
    is_err : false,
    file: null,
    file_id : null, 
    file_nickname : fileName,
    thumbnail_blob : thumbnailBlob,
    cover_img : coverImg,
    total_page : page_count,
    size : size,
    user_file_name : fileName,
    user_file_path : filePath.startsWith('/tmp') ? filePath.replace('/tmp', '/static') : filePath
  }
}
// App 썸네일 이미지 가공
export async function getAppThumbnailBlobAndUrl(thumbnailPath: string) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = `http://localhost:8080${thumbnailPath}`;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
  const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      canvas.toBlob(function(thumbnailBlob) {
        const coverImg = URL.createObjectURL(thumbnailBlob as Blob);
        resolve({ thumbnailBlob, coverImg });
      }, 'image/png');
    };
    img.onerror = function() {
      reject(new Error('이미지 로딩 실패'));
    };
  });
}


// base64 URI → Blob 변환
export const getUriToBlobToFile = (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};

// 앱 내장 저장소 오디오 파일 저장 및 조회
export const getAppAudioFileData = async ({filePath, fileName}: {filePath: string, fileName: string}) => {
  const fileInfo = JSON.parse(await osGetFileInfo(filePath));
  const totalTime = fileInfo.total_time;
  return {
    is_err : false,
    file : null,
    file_id : null,
    file_nickname : fileName,
    user_file_name : fileName,
    user_file_path : filePath.startsWith('/tmp') ? filePath.replace('/tmp', '/static') : filePath,
    total_time : totalTime,
  } 
}