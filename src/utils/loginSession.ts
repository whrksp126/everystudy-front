// 환경변수에서 백엔드 URL 가져오기

import { setCookie } from "./common";
import { getIosAppApi } from "./osFunction";
import { getLoginUserInfoFetch, refreshAccessTokenFetch } from "../api/login";

// http only 로그아웃
async function logout(): Promise<void> {
  setCookie("userAccessToken", "", 0);
  localStorage.removeItem("userRefreshToken"); // Refresh Token 삭제
}

// 로그인 유저 정보 조회 API
export async function getLoginUserInfo(): Promise<boolean> {
  try {
    const response = await getLoginUserInfoFetch();
    if (response.ok) {
      const user = await response.json();
      console.log('User info:', user);
      return true;
    }

    if (response.status === 401) {
      console.log("Access Token 만료, 갱신 시도...");
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return await getLoginUserInfo();
      } else {
        console.error("로그인이 필요합니다. 로그인 페이지로 이동하세요.");
        return false;
      }
    }

    // 기타 오류 상태
    console.error(`서버 오류 발생: ${response.statusText}`);
    return false;

  } catch (error) {
    // 네트워크 오류 또는 예외 처리
    console.error('네트워크 오류 발생:', error);
    console.error("네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.");
    return false;
  }
}

// Access Token 갱신
export async function refreshAccessToken(): Promise<any> {
  const response = await refreshAccessTokenFetch();
  if (response.ok) {
    const result = await response.json();
    if(result.code == 200){
      // Access Token 갱신
      setCookie("userAccessToken", result.data.access_token); 
      console.log("Access Token 갱신 성공");  
      return true;
    }
  } else {
    console.error("토큰 갱신 실패: 로그아웃 필요");
    logout();
    return false;
  }
}
// 문서 쿠키 설정
export const setDoucmentCookie = async () => {
  let OS_BROWSER;
  let OS_NAME;
  if((window as any)?.webkit?.messageHandlers?.app_api){
    OS_BROWSER = (window as any)?.webkit?.messageHandlers?.app_api;
    OS_NAME = "IOS"
  }else if(typeof (window as any).app_api !== 'undefined' || (window as any)?.chrome?.webview?.hostObjects?.sync?.app_api){
    OS_BROWSER = typeof (window as any).app_api !== 'undefined' ? (window as any).app_api : (window as any)?.chrome?.webview?.hostObjects?.sync?.app_api;
    OS_NAME = "ANDROID";
  }else if((window as any)?.pywebview){
    OS_NAME = "WINDOW";
  }else{
    OS_NAME = "BROWSER";
  }
  const WEBVIEW_API_MAP: any = {
    WINDOW: (window as any).pywebview ? (window as any).pywebview.api : null,
    IOS:{
      get_deviceid: async () => {return await getIosAppApi("get_deviceid")},
      get_devicetype: async () => {return await getIosAppApi("get_devicetype")},
      get_devicemodel: async () => {return await getIosAppApi("get_devicemodel")},
      get_deviceos: async () => {return await getIosAppApi("get_deviceos")},
      get_appversion: async () => {return await getIosAppApi("get_appversion")},
    },
    ANDROID: OS_BROWSER,
    BROWSER: {
      get_deviceid: () => '1q2w3e4r',
      get_devicetype: () => 'tablet',
      get_devicemodel: () => 'DESKTOP-7L6EJUP',
      get_deviceos: () => 'BROWSER',
      get_appversion: () => '1.0.0',
    }
  };
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 100);
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = "OS_NAME=" + OS_NAME + ";" + expires + ";path=/";

  const deviceId = await WEBVIEW_API_MAP[OS_NAME].get_deviceid();
  document.cookie = "DEVICE_ID=" + deviceId + ";" + expires + ";path=/";

  const deviceType = await WEBVIEW_API_MAP[OS_NAME].get_devicetype();
  document.cookie = "DEVICE_TYPE=" + deviceType + ";" + expires + ";path=/";

  const deviceName = await WEBVIEW_API_MAP[OS_NAME].get_devicemodel();
  document.cookie = "DEVICE_NAME=" + deviceName + ";" + expires + ";path=/";

  const deviceOs = await WEBVIEW_API_MAP[OS_NAME].get_deviceos();
  document.cookie = "DEVICE_OS=" + deviceOs + ";" + expires + ";path=/";

  const appVersion = await WEBVIEW_API_MAP[OS_NAME].get_appversion();
  document.cookie = "APP_VERSION=" + appVersion + ";" + expires + ";path=/";
} 

