import React, { useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconUpload, IconNotification, IconPlusSquare, IconCheck } from '../../assets/Icon';

interface SetMyBookModalProps {
  onClose?: () => void;
}

const SetMyBookModal: React.FC<SetMyBookModalProps> = () => {
  const { popModal, closeModal } = useModal();
  const [title, setTitle] = useState<string>('');
  const [files, setFiles] = useState<any>({pdfs: [],mp3s: []});

  const handleClose = () => {
    popModal();
  };

  const handleFileUpload = (type: string, index: number) => {
    if(type === 'pdf'){
      console.log(`${index}번째 PDF 파일 업로드`);
    }else if(type === 'mp3'){
      console.log(`${index}번째 MP3 파일 업로드`);
    };
  };

  return (
    <div 
      style={{maxHeight: 'min(600px, 90vh)',}}
      className="flex flex-col max-w-[712px] w-full h-full pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden"
      >
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          신규 교재 등록 신청
        </h2>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-[24px] flex-1 overflow-y-auto max-h-[calc(600px-64px)] px-[32px] py-[24px]">
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex gap-[16px] items-center">
              <h3 className="w-[80px] text-16s text-black">교재명</h3>
              <input 
                type="text" 
                placeholder="교재명을 입력해주세요." 
                className="flex-1 h-[58px] pl-[16px] pr-[12px] border border-[#0000000a] rounded-[10px] bg-gray-50 text-16m" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            {/* PDF 파일 */}
            {files.pdfs.length === 0 && (
            <div className="flex gap-[16px] items-center">
              <h3 className="w-[80px] text-16s text-black">PDF 파일</h3>
              <div 
                onClick={() => handleFileUpload('pdf', 0)}
                className="flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400"
              >
                <IconUpload width={24} height={24} className="text-gray-200" />
                <span className="text-14r text-gray-400">PDF 파일을 업로드 해주세요</span>
              </div>
            </div>
            )}
            
            {files.pdfs.length > 0 && (
              <>
              {files.pdfs.map((file: any, index: number) => (
                <div key={index} className="flex gap-[16px] items-center">
                  {index === 0 && (
                  <h3 className="w-[80px] text-16s text-black">PDF 파일</h3>
                  )}
                  <div 
                    onClick={() => handleFileUpload('pdf', index)}
                    className={`
                      flex items-center gap-[8px] flex-1 
                      h-[58px] 
                      p-[20px] 
                      border border-blue-50 rounded-[10px]
                      bg-blue-25 
                      text-16m text-gray-400 
                      
                    `}
                  >
                    <IconCheck width={24} height={24} className="text-primary-blue" />
                    <span className="text-14r text-primary-blue">{file.name}</span>
                  </div>
                </div>
              ))}
              {/* 추가 버튼 */}
              <div className="flex gap-[16px] items-center">
                <h3 className="w-[80px] text-16s text-black"></h3>
                <div 
                  onClick={() => handleFileUpload('pdf', files.pdfs.length)}
                  className="flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400"
                >
                  <IconPlusSquare width={24} height={24} className="text-gray-200" />
                  <span className="text-14r text-gray-400">파일 더 업로드하기</span>
                </div>   
              </div> 
              </>
            )}

            {/* mp3 파일 */}
            {files.mp3s.length === 0 && (
            <div className="flex gap-[16px] items-center">
              <h3 className="w-[80px] text-16s text-black">MP3 파일</h3>
              <div 
                onClick={() => handleFileUpload('mp3', 0)}
                className="flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400"
              >
                <IconUpload width={24} height={24} className="text-gray-200" />
                <span className="text-14r text-gray-400">MP3 파일을 업로드 해주세요</span>
              </div>
            </div>
            )}
            
            {files.mp3s.length > 0 && (
              <>
              {files.mp3s.map((file: any, index: number) => (
                <div key={index} className="flex gap-[16px] items-center">
                  {index === 0 && (
                  <h3 className="w-[80px] text-16s text-black">MP3 파일</h3>
                  )}
                  <div 
                    onClick={() => handleFileUpload('mp3', index)}
                    className={`
                      flex items-center gap-[8px] flex-1 
                      h-[58px] 
                      p-[20px] 
                      border border-blue-50 rounded-[10px]
                      bg-blue-25 
                      text-16m text-gray-400 
                      
                    `}
                  >
                    <IconCheck width={24} height={24} className="text-primary-blue" />
                    <span className="text-14r text-primary-blue">{file.name}</span>
                  </div>
                </div>
              ))}
              {/* 추가 버튼 */}
              <div className="flex gap-[16px] items-center">
                <h3 className="w-[80px] text-16s text-black"></h3>
                <div 
                  onClick={() => handleFileUpload('mp3', files.mp3s.length)}
                  className="flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border border-gray-75 rounded-[10px] bg-gray-25 text-16m text-gray-400"
                >
                  <IconPlusSquare width={24} height={24} className="text-gray-200" />
                  <span className="text-14r text-gray-400">파일 더 업로드하기</span>
                </div>   
              </div> 
              </>
            )}

          </div>  
        </div>
        <div className="flex items-center gap-[4px]">
          <IconNotification width={16} height={16} className="text-primary-purple" />
          <span className="text-14r text-primary-purple">신규 교재 등록이 완료되면 푸시알림으로 알려드려요. 등록이 완료되기 전에도 파일뷰어 기능은 사용할 수 있어요.</span>
        </div>
      </div>
      <div className="flex items-center justify-center h-[64px]">
        <button className="w-[240px] h-[52px] rounded-[8px] bg-primary-purple text-16s text-white">등록하기</button>
      </div>


    </div>
  );
};

export default SetMyBookModal; 