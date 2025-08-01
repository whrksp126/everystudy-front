
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
