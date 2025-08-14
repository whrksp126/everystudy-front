import { getCookie, setCookie } from "../utils/common";
import { SERVER_URL } from "../utils/server";
import { osGoogleLogin } from "../utils/osFunction";

// 로그인 API
export const loginFetch = async (email: string, password: string): Promise<any> => {
  const url = `${SERVER_URL}/user/signin`;
  const method = 'POST';
  const fetchData = {
    email: email,
    userpw: password,
  };
  console.log(url)
  try{
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fetchData),
    });
    const data = await response.json();
    if(data.code == 200){
      // ✅ access_token → 1년짜리 쿠키로 저장
      setCookie("userAccessToken", data.data.access_token);

      const refresh_token = data.data.refresh_token;
      localStorage.setItem("userRefreshToken", refresh_token);    
    }
    return data;
  }catch(error){
    console.error(error);
    return null;
  }
}

export const googleLoginFetch = async (): Promise<any> => {
  await osGoogleLogin()
}

export const googleLoginCallBackFetch = async (code: string): Promise<any> => {
  const url = `${SERVER_URL}/auth/google/token`;
  const method = 'POST';
  const fetchData = {
    code: code,
  };
  try{
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fetchData),
    });
    const data = await response.json();
    if(data.code == 200){
      // ✅ access_token → 1년짜리 쿠키로 저장
      setCookie("userAccessToken", data.data.access_token);

      const refresh_token = data.data.refresh_token;
      localStorage.setItem("userRefreshToken", refresh_token);    
    }
    return data;
  }catch(error){
    console.error(error);
    return null;
  }
  


  // const res = await fetch(
  //   'http://localhost:8000/auth/google/token',
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     credentials: 'include', // 세션/쿠키 기반이면 필수
  //     body: JSON.stringify({ code }),
  //   }
  // );
  // const data = await res.json();
  // if (!res.ok) throw new Error(data?.msg || res.statusText);

}

// 로그아웃 API
export const logoutFetch = async (): Promise<any> => {
  setCookie("userAccessToken", "", 0);
  localStorage.removeItem("userRefreshToken"); // Refresh Token 삭제
  window.location.href='/login';
}

// 로그인 유저 정보 조회 API
export const getLoginUserInfoFetch = async (): Promise<any> => {
  const url = `${SERVER_URL}/user/get`;
  const method = 'GET';
  const accessToken = getCookie("userAccessToken");
  try{
    const response = await fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${accessToken}`, 
      },
    });
    return response;
  }catch(error){
    console.error(error);
    return null;
  }
}

// Access Token 갱신
export const refreshAccessTokenFetch = async (): Promise<any> => {
  const url = `${SERVER_URL}/user/get_new_access_token`;
  const method = 'POST';
  const refreshToken = localStorage.getItem("userRefreshToken");
  try{
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return response;
  }catch(error){
    console.error(error);
    return null;
  }
}