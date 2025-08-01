import React from 'react';
import { X, ArrowLeft, Star, Calendar, User, Buildings } from 'phosphor-react';
import { useModal } from '../../hooks/useModal';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  image: string;
}

// props를 Record<string, unknown>로 변경
interface BookDetailModalProps {
  [key: string]: unknown;
}

const BookDetailModal: React.FC<BookDetailModalProps> = (props) => {
  const { popModal, closeModal } = useModal();
  // book을 타입 단언해서 사용
  const book = props.book as Book;

  const handleBack = () => {
    popModal(); // 이전 모달로 돌아가기
  };

  const handleClose = () => {
    closeModal();
  };

  const handleRegister = () => {
    // 교재 등록 로직
    console.log('교재 등록:', book);
    closeModal();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-900">교재 상세</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* 교재 정보 */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* 교재 이미지 */}
          <div className="flex-shrink-0">
            <img
              src={book.image}
              alt={book.title}
              className="w-32 h-44 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* 교재 상세 정보 */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-600">{book.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Buildings size={16} className="text-gray-400" />
                <span className="text-gray-600">{book.publisher}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-400" />
                <span className="text-gray-600">4.5 (128개 평가)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-600">2024년 최신판</span>
              </div>
            </div>

            {/* 교재 설명 */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">교재 소개</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {book.title}은 수험생들을 위한 최고의 교재입니다. 체계적인 구성과 
                명확한 설명으로 학습 효과를 극대화합니다. 실제 시험과 유사한 문제들로 
                구성되어 있어 실전 감각을 기를 수 있습니다.
              </p>
            </div>

            {/* 특징 */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">주요 특징</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 체계적인 개념 정리</li>
                <li>• 다양한 난이도의 문제</li>
                <li>• 상세한 해설과 풀이</li>
                <li>• 실전 모의고사 포함</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <button
            onClick={handleRegister}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            교재 등록하기
          </button>
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal; 