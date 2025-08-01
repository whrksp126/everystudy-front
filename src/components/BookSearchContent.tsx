import React from 'react';

const BookSearchContent: React.FC = () => {
  const handleBookClick = () => {
    console.log('교재 클릭됨');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="등록할 교재를 검색하세요."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">추천 교재</h3>
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleBookClick}
          >
            <div className="w-full h-32 bg-yellow-200 rounded mb-2 flex items-center justify-center">
              <span className="text-sm text-gray-600">교재 이미지</span>
            </div>
            <h4 className="font-medium text-sm">수능특강 국어영역 언어와 매체 2025...</h4>
            <p className="text-xs text-gray-500">오늘 오후 12 | 14</p>
          </div>
          <div 
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleBookClick}
          >
            <div className="w-full h-32 bg-green-200 rounded mb-2 flex items-center justify-center">
              <span className="text-sm text-gray-600">교재 이미지</span>
            </div>
            <h4 className="font-medium text-sm">수능특강 수학 I 2025...</h4>
            <p className="text-xs text-gray-500">오늘 오후 12 | 14</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchContent; 