import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoginUserInfo, setDoucmentCookie } from '../utils/loginSession';  

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('데이터를 불러오는 중');
  
  useEffect(() => {
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