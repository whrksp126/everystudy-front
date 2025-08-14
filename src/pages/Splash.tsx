import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { getLoginUserInfo, setDoucmentCookie } from '../utils/loginSession';  

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loadingText, setLoadingText] = useState('데이터를 불러오는 중');

  useEffect(() => {

    // 구글 OAuth 콜백인 경우: 바로 토큰 교환 처리
    const code = params.get('code');
    if (code) {
      handleGoogleCallback(code);
      return; // 기존 로딩 타이머 세팅 X
    }


    const loadingInterval = setInterval(loadingTextAnimation, 500);
    // 데이터 로딩 시뮬레이션 (실제로는 여기서 API 호출 등을 수행)

    const loadingTimeout = setTimeout(() => {
      clearInterval(loadingInterval);
      init();
    }, 3000); // 3초 후 로딩 완료

    return () => {
      clearInterval(loadingInterval);
      clearTimeout(loadingTimeout);
    };
  }, [navigate]);


    // 구글 콜백 처리: code -> /auth/google/token
    const handleGoogleCallback = async (code: string) => {
      try {
        // 'https://rbgvzzal9l.execute-api.ap-northeast-2.amazonaws.com/auth/google/token',
        const res = await fetch(
          'http://localhost:8000/auth/google/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // 세션/쿠키 기반이면 필수
            body: JSON.stringify({ code }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.msg || res.statusText);

        // (선택) 여기서 디바이스 등록이 필요하면 호출
        // const { TYPE, ID, NAME } = DEVICE_DATA;
        // await setDeviceIdFetch(TYPE, ID, NAME, data?.email);

        // 세션 쿠키가 설정되었으면 평소 init과 동일 흐름으로 홈 이동
        await setDoucmentCookie();
        const isLoginUser = await getLoginUserInfo();
        navigate(isLoginUser ? '/home' : '/login', { replace: true });
      } catch (e: any) {
        alert('구글 로그인 처리 실패: ' + (e?.message || e));
        navigate('/login', { replace: true });
      }
    };



  // 로딩 텍스트 애니메이션
  const loadingTextAnimation = () => {
    setLoadingText(prev => {
      if (prev.endsWith('...')) {
        return '데이터를 불러오는 중';
      }
      return prev + '.';
    });
  }

  const init = async () => {
    await setDoucmentCookie();
    const isLoginUser = await getLoginUserInfo();
    if(!isLoginUser){
      navigate('/login');
    }
    if(isLoginUser){
      navigate('/home');
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* 로고 또는 앱 이름 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">EveryStudy</h1>
          <p className="text-gray-600">효율적인 학습을 위한 최고의 선택</p>
        </div>

        {/* 로딩 스피너 */}
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="text-gray-700 text-lg">
          {loadingText}
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-sm text-gray-500">
          <p>잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
};

export default Splash; 