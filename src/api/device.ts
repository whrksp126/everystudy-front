import { SERVER_URL } from "../utils/server";
import { fetchDataAsync } from "../utils/common";
import { getDeviceData, setDeviceData } from "../utils/localStorage";

// 디바이스 식별자 생성 API
export const setDeviceIdFetch = async (type: string, code: string, name: string, email: string): Promise<any> => {
  const url = `${SERVER_URL}/mypage/return_device_id`;
  const method = 'POST';
  const fetchData = {
    device_type: type,
    device_code: code,
    device_name: name,
  };
  console.log(url)
  try{
    const result = await fetchDataAsync(url, method, fetchData);
    if(result){
      setDeviceData('deviceId', {... getDeviceData('deviceId'), [email]: result });
    }
    return true;

  }catch(error){
    console.error(error);
    return null;
  }
}