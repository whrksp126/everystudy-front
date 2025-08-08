// 유저 디바이스 데이터 조회
export const getDeviceData = (key: string) => {
  const deviceData = localStorage.getItem('deviceData') || '{}';
  if(key){
    return JSON.parse(deviceData)[key];
  }else{
    return JSON.parse(deviceData);
  }
  
}

// 유저 디바이스 아이디 삭제
export const setDeviceData = (key: string, value: string) => {
  const deviceData = localStorage.getItem('deviceData') || '{}';
  const deviceDataObj = JSON.parse(deviceData);
  deviceDataObj[key] = value;
  localStorage.setItem('deviceData', JSON.stringify(deviceDataObj));
  return localStorage.getItem('deviceData');
}

// 유저 디바이스 아이디 조회
export const getDeviceId = () => {
  const deviceData = localStorage.getItem('deviceData') || '{}';
  const deviceDataObj = JSON.parse(deviceData);
  return deviceDataObj.deviceId?.[getDeviceData('email') || ''];
}

