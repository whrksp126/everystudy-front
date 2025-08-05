
export const getDeviceCookie = (cookieName: string) => {
  const cookieRegex = new RegExp(`(?:(?:^|.*;\\s*)${cookieName}\\s*=\\s*([^;]*).*$)|^.*$`);
  return document.cookie.replace(cookieRegex, "$1");
};

export const DEVICE_DATA = {
  OS: getDeviceCookie("OS_NAME"),
  TYPE: getDeviceCookie("DEVICE_TYPE"),
  NAME: getDeviceCookie("DEVICE_NAME"),
  ID: getDeviceCookie("DEVICE_ID"),
  VERSION: getDeviceCookie("APP_VERSION"),
}

let OS_BROWSER = null;
if (DEVICE_DATA.OS === 'APP') {
  OS_BROWSER = chrome?.webview?.hostObjects?.sync?.app_api;
}else if(DEVICE_DATA.OS === 'IOS'){
  OS_BROWSER = window?.webkit?.messageHandlers?.app_api;
}else if(DEVICE_DATA.OS === 'ANDROID'){
  OS_BROWSER = typeof app_api !== 'undefined' ? app_api : chrome?.webview?.hostObjects?.sync?.app_api;
}else{

}


// iOS API 호출 함수 
export function getIosAppApi(action: string, data: any = {}): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Promise((resolve, reject) => {
    if (window.webkit?.messageHandlers?.app_api) {
      // iOS에 action 값 전송
      window.__resolveData = resolve; // iOS에서 resolveData를 호출하면 Promise 해결
      window.webkit.messageHandlers.app_api.postMessage({ action: action, data: data});
    } else {
      reject("iOS 환경이 아닙니다.");
    }
  });
}

const BROWSER_WEB_API = {
  // *************************** //
  // ** new 공통 함수 수정 금지 ** //


  get_deviceid : ()=>{return '1q2w3e4r'},
  get_devicetype : ()=>{return 'tablet'},
  get_devicemodel : ()=>{return 'DESKTOP-7L6EJUP'},
  get_deviceos : ()=>{return 'WINDOW'},
  get_appversion : ()=>{return '1.0.0'},


  save_file_temp : (workbook_id: string, file_type: string) => {return `/${workbook_id}.${file_type}`},
  save_file_static : (workbook_id: string, file_name: string) => {return `/${workbook_id}.${file_name}`},
  is_file_exists : async (path: string) => {return true},
  get_file_list : () => {return []},
  delete_file : (path: string) => {return true},
  delete_temp_all : ()=>{return true},
  delete_file_temp : (path: string) => {return true},
  rename_folder : (oldpath: string, newPaht: string) => {return true},
  get_file_info : (path: string) => {return {}},
  // ** new 공통 함수 수정 금지 ** //
  // *************************** //
}


export const WEBVIEW_API_MAP = {
  WINDOW : window.pywebview ? pywebview.api : null,
  IOS: (() => {
    const api = {
      call: (action, data={}) => {
        return getIosAppApi(action, data);
      },
    };
    // BROWSER_WEB_API의 모든 액션을 자동으로 메서드로 추가
    return Object.assign(
      api,
      ...Object.keys(BROWSER_WEB_API).map(action => ({
        [action]: function (data) {
          return this.call(action, data);
        },
      }))
    );
  })(),
  ANDROID : OS_BROWSER,
  APP : OS_BROWSER,
  BROWSER : BROWSER_WEB_API,
};

// 파일 임시 저장
export async function osSaveFileTemp(workbookId: string, fileType: string, fileIndex: number){
  if (DEVICE_DATA.OS === 'BROWSER') {
    const fileName: string = `web_${fileType}_${fileIndex}.${fileType == 'pdf' ? 'pdf' : 'mp3'}`;
    const filePath: string = `/static/${workbookId}/${fileName}`;
    
    // 실패 시뮬레이션 (50% 확률로 실패)
    if (Math.random() < 0.5) {
      throw new Error('파일 업로드에 실패했습니다.');
    }
    
    return {filePath: filePath, fileName: fileName};
  } else {
    if (DEVICE_DATA.OS === 'IOS') {
      const result = await WEBVIEW_API_MAP[DEVICE_DATA.OS].save_file_temp({workbook_id: String(workbookId), file_type: String(fileType)});
      console.log("💾 result:", result);
      return {filePath: result, fileName: result.split('/').pop()};
    }else{
      return new Promise((resolve, reject) => {
        const cbName = 'onSaveFileTempResult';
        window[cbName] = function(filePath: string, fileName: string) {
          window[cbName] = undefined;
          if (filePath) resolve({filePath: filePath, fileName: fileName});
          else reject('user cancelled or error');
        };
        WEBVIEW_API_MAP[DEVICE_DATA.OS].save_file_temp(workbookId, fileType, cbName);
      });
    }
  };
}


// new 저장소 파일 영구 저장
export async function osSaveFileStatic(workbookId: string, fileName: string){
  if (DEVICE_DATA.OS === 'BROWSER') {
    return 'staticPath'
  } else {
    if (DEVICE_DATA.OS === 'IOS') {
      return await WEBVIEW_API_MAP[DEVICE_DATA.OS].save_file_static({workbook_id: String(workbookId), file_name: String(fileName)});
    }else{
      return await WEBVIEW_API_MAP[DEVICE_DATA.OS].save_file_static(workbookId, fileName);
    }
  };
}

// 앱 내장 임시 저장소 파일 삭제
export async function osDeleteTempAll(){
  if (DEVICE_DATA.OS === 'BROWSER') {
    return WEBVIEW_API_MAP[DEVICE_DATA.OS].delete_temp_all();
  } else {
    return await WEBVIEW_API_MAP[DEVICE_DATA.OS].delete_temp_all();
  };
};

// 파일 정보 조회
export async function osGetFileInfo(path: string){
  if (DEVICE_DATA.OS === 'BROWSER') {
    return WEBVIEW_API_MAP[DEVICE_DATA.OS].get_file_info(path);
  } else {
    return await WEBVIEW_API_MAP[DEVICE_DATA.OS].get_file_info(path);
  };
}

// 앱 내장 저장소 폴더명 변경
export async function osRenameFolder(oldPath: string, newPath: string){
  if (DEVICE_DATA.OS === 'BROWSER') {
    return WEBVIEW_API_MAP[DEVICE_DATA.OS].rename_folder(oldPath, newPath);
  } else {
    if (DEVICE_DATA.OS === 'IOS') {
      return await WEBVIEW_API_MAP[DEVICE_DATA.OS].rename_folder({old_path: String(oldPath), new_path: String(newPath)});
    }
    return await WEBVIEW_API_MAP[DEVICE_DATA.OS].rename_folder(oldPath, newPath);
  };
};