import React, { useState, useEffect, useRef } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconUpload, IconNotification, IconPlusSquare, IconCheck, IconX } from '../../assets/Icon.tsx';
import { osDeleteTempAll } from '../../utils/osFunction';
import { useFileSelector } from '../../hooks/useFileSelector';
import { FileSelectorModal } from '../FileSelectorModal';
import { saveMyBookStandardDatafetch } from '../../api/myBook';


// PDF 데이터 타입 정의
interface PdfData {
  name: string;
  path: string;
  file: File | null;
  thumbnail_blob: Blob;
  cover_img: string;
  page_count: number;
  size: { mw: number; mh: number };
}

// Audio 데이터 타입 정의
interface AudioData {
  name: string;
  path: string;
  file: File | null;
  total_time: number;
}


interface SetMyBookModalProps {
  onClose?: () => void;
}

const SetMyBookModal: React.FC<SetMyBookModalProps> = () => {
  const { popModal, closeModal } = useModal();
  const [bookId, setBookId] = useState<string>('new');
  const [title, setTitle] = useState<string>('');
  const [files, setFiles] = useState<any>({pdfs: [],audios: []});
  const [fileStates, setFileStates] = useState<{[key: string]: 'idle' | 'loading' | 'validation_error' | 'upload_error' | 'success'}>({});
  const [titleState, setTitleState] = useState<'idle' | 'error'>('idle');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastAddedIndex, setLastAddedIndex] = useState<{type: string, index: number} | null>(null);

  // 통합 파일 선택 훅 사용
  const fileSelector = useFileSelector();
  
  // 현재 선택된 인덱스 저장
  const [currentFileIndex, setCurrentFileIndex] = useState<{type: string, index: number} | null>(null);

  // 모달 닫기
  const handleClose = async () => {
    // 임시 파일 삭제
    await osDeleteTempAll();
    console.log("💾 임시 파일 삭제 완료");
    popModal();
  };

  // 새로운 파일이 추가되면 스크롤
  useEffect(() => {
    if (lastAddedIndex) {
      // 약간의 지연 후 스크롤 (DOM 업데이트 완료 후)
      setTimeout(() => {
        const elementId = `${lastAddedIndex.type}_${lastAddedIndex.index}`;
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        setLastAddedIndex(null); // 스크롤 후 초기화
      }, 100);
    }
  }, [lastAddedIndex]);

  // 파일 선택 결과 처리 (PDF, AUDIO 통합)
  useEffect(() => {
    if (fileSelector.selectedFile && currentFileIndex) {
      const fileData = fileSelector.selectedFile;
      
      setFiles((prevFiles: { [key: string]: any[] }) => {
        const updatedFiles = { ...prevFiles };
        const fileType = currentFileIndex.type === 'pdf' ? 'pdfs' : 'audios';
        const arr = Array.isArray(updatedFiles[fileType]) ? [...updatedFiles[fileType]] : [];
        
        // 선택된 인덱스에 파일 저장
        if (currentFileIndex.type === 'pdf') {
          const pdfData = fileData as PdfData;
          arr[currentFileIndex.index] = {
            name: pdfData.name,
            path: pdfData.path,
            file: pdfData.file,
            thumbnail_blob: pdfData.thumbnail_blob,
            cover_img: pdfData.cover_img,
            page_count: pdfData.page_count,
            size: pdfData.size
          };
        } else if (currentFileIndex.type === 'audio') {
          const audioData = fileData as AudioData;
          arr[currentFileIndex.index] = {
            name: audioData.name,
            path: audioData.path,
            file: audioData.file,
            total_time: audioData.total_time
          };
        }
        
        updatedFiles[fileType] = arr;
        return updatedFiles;
      });
      
      setFileStates(prev => ({ ...prev, [`${currentFileIndex.type}_${currentFileIndex.index}`]: 'success' }));
      setLastAddedIndex({ type: currentFileIndex.type, index: currentFileIndex.index });
      setCurrentFileIndex(null);
      fileSelector.setSelectedFile(null);
    }
  }, [fileSelector.selectedFile, currentFileIndex]);

  // 파일 업로드
  const handleFileUpload = async (type: string, index: number, bookId: string) => {
    const fileKey = `${type}_${index}`;
    
    // 로딩 시작
    setFileStates(prev => ({ ...prev, [fileKey]: 'loading' }));
    
    try {
      // 1초 후에 실행
      await new Promise(resolve => setTimeout(resolve, 1000));

      if(type === 'pdf' || type === 'audio'){
        setCurrentFileIndex({ type, index });
        await fileSelector.openFileSelector(type, index, bookId);
        return;
      }

      // setFileStates(prev => ({ ...prev, [fileKey]: 'success' }));
      // setLastAddedIndex({ type, index });
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      setFileStates(prev => ({ ...prev, [fileKey]: 'upload_error' }));
      setTimeout(() => {
        setFileStates(prev => ({ ...prev, [fileKey]: 'idle' }));
      }, 3000);
    }
  };

  const handleSaveFiles = async () => {
    console.log("💾 files:", files);
    
    // 상태 초기화 (파일 상태는 유지)
    setTitleState('idle');
    
    let hasError = false;
    
    if(title.trim() === ""){
      setTitleState('error');
      hasError = true;
      
      // 3초 후 에러 상태 해제
      setTimeout(() => {
        setTitleState('idle');
      }, 3000);
    }
    if(files.pdfs.length === 0){
      setFileStates(prev => ({ ...prev, 'pdf_0': 'validation_error' }));
      hasError = true;
      
      // 3초 후 에러 상태 해제
      setTimeout(() => {
        setFileStates(prev => ({ ...prev, 'pdf_0': 'idle' }));
      }, 3000);
    }
    
    if(hasError) return;
    try{
      const result = await saveMyBookStandardDatafetch(title, bookId, files);
    }catch(error){
      console.error(error);
    }
    
    // if(result.code != 200) return alert("등록 오류");
    // if(!book_data?.workbook_id){ 
    //   const oldPath = `/tmp/new`;
    //   const newPath = `/tmp/${result.data.workbook_id}`;
    //   await osRenameFolder(oldPath, newPath);
    // }
    // // 파일 영구 저장
    // for (const d of fetchData.json_data.file_path.pdf || []) {
    //   if(type == 'edit'){
    //     await osSaveFileStatic(book_data?.workbook_id, d.user_file_name);
    //   }else{
    //     await osSaveFileStatic(result.data.workbook_id, d.user_file_name);
    //   }
    // }
    // for (const d of fetchData.json_data.file_path.audio || []) {
    //   if(type == 'edit'){
    //     await osSaveFileStatic(book_data?.workbook_id, d.user_file_name);
    //   }else{
    //     await osSaveFileStatic(result.data.workbook_id, d.user_file_name);
    //   }
    // }
  }

  // 상태 초기화 함수(현재 업로드 중인 파일만 idle로)
  const resetFileUploadStates = () => {
    if (!currentFileIndex) return;
    const { type, index } = currentFileIndex;
    setFileStates(prev => ({
      ...prev,
      [`${type}_${index}`]: files[type + 's'] && files[type + 's'][index] ? 'success' : 'idle'
    }));
    setCurrentFileIndex(null);
  };

  // 파일 삭제
  const handleFileDelete = (type: string, index: number) => {
    setFiles(prev => ({
      ...prev,
      [type + 's']: prev[type + 's'].filter((_, i) => i !== index)
    }));
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
      <div ref={scrollContainerRef} className="flex flex-col gap-[24px] flex-1 overflow-y-auto max-h-[calc(600px-64px)] px-[32px] py-[24px]">
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[24px]">
            <div className="flex gap-[16px] items-center">
              <h3 className="w-[80px] text-16s text-black">교재명</h3>
              <input 
                type="text" 
                placeholder="교재명을 입력해주세요."
                className={`flex-1 h-[58px] pl-[16px] pr-[12px] border rounded-[10px] text-16m ${
                  titleState === 'error'
                    ? 'border-red-200 bg-red-25 text-red-400 placeholder:text-red-400' 
                    : 'border-[#0000000a] bg-gray-50'
                }`}
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
                className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                  fileStates['pdf_0'] === 'loading'
                    ? 'border-blue-200 bg-blue-25 text-blue-400' 
                    : fileStates['pdf_0'] === 'validation_error' || fileStates['pdf_0'] === 'upload_error'
                    ? 'border-red-200 bg-red-25 text-red-400'
                    : 'border-gray-75 bg-gray-25 text-gray-400'
                }`}
              >
                {fileStates['pdf_0'] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-14r">업로드 중...</span>
                  </>
                ) : fileStates['pdf_0'] === 'validation_error' ? (
                  <>
                    <IconUpload width={24} height={24} className="text-red-400" />
                    <span className="text-14r text-red-400">PDF 파일을 업로드 해주세요</span>
                  </>
                ) : fileStates['pdf_0'] === 'upload_error' ? (
                  <>
                    <IconUpload width={24} height={24} className="text-red-400" />
                    <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                  </>
                ) : (
                  <>
                    <IconUpload width={24} height={24} className="text-gray-200" />
                    <span className="text-14r text-gray-400">PDF 파일을 업로드 해주세요</span>
                  </>
                )}
              </div>
            </div>
            )}
            
            {files.pdfs.length > 0 && (
              <>
              {files.pdfs.map((file: any, index: number) => (
                <div key={index} id={`pdf_${index}`} className="flex gap-[16px] items-center">
                  
                  <h3 className="w-[80px] text-16s text-black">{index === 0 && 'PDF 파일'}</h3>
                  
                  <div 
                    onClick={() => handleFileUpload('pdf', index)}
                    className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                      fileStates[`pdf_${index}`] === 'loading'
                        ? 'border-blue-200 bg-blue-25 text-blue-400' 
                        : fileStates[`pdf_${index}`] === 'upload_error'
                        ? 'border-red-200 bg-red-25 text-red-400'
                        : 'border-blue-50 bg-blue-25 text-gray-400'
                    }`}
                  >
                    {fileStates[`pdf_${index}`] === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                        <span className="text-14r">업로드 중...</span>
                      </>
                    ) : fileStates[`pdf_${index}`] === 'upload_error' ? (
                      <>
                        <IconUpload width={24} height={24} className="text-red-400" />
                        <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                      </>
                    ) : (
                      <>
                        <IconCheck width={24} height={24} className="text-primary-blue" />
                        <span className="flex-1 text-14r text-primary-blue">{file.name}</span>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleFileDelete('pdf', index);
                        }}>
                          <IconX width={24} height={24} className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {/* 추가 버튼 */}
              <div className="flex gap-[16px] items-center">
                <h3 className="w-[80px] text-16s text-black"></h3>
                <div 
                  onClick={() => handleFileUpload('pdf', files.pdfs.length)}
                  className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                    fileStates[`pdf_${files.pdfs.length}`] === 'loading'
                      ? 'border-blue-200 bg-blue-25 text-blue-400' 
                      : fileStates[`pdf_${files.pdfs.length}`] === 'upload_error'
                      ? 'border-red-200 bg-red-25 text-red-400'
                      : 'border-gray-75 bg-gray-25 text-gray-400'
                  }`}
                >
                  {fileStates[`pdf_${files.pdfs.length}`] === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <span className="text-14r">업로드 중...</span>
                    </>
                  ) : fileStates[`pdf_${files.pdfs.length}`] === 'upload_error' ? (
                    <>
                      <IconUpload width={24} height={24} className="text-red-400" />
                      <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                    </>
                  ) : (
                    <>
                      <IconPlusSquare width={24} height={24} className="text-gray-200" />
                      <span className="text-14r text-gray-400">파일 더 업로드하기</span>
                    </>
                  )}
                </div>   
              </div> 
              </>
            )}

            {/* audio 파일 */}
            {files.audios.length === 0 && (
            <div className="flex gap-[16px] items-center">
              <h3 className="w-[80px] text-16s text-black">MP3 파일</h3>
              <div 
                onClick={() => handleFileUpload('audio', 0)}
                className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                  fileStates['audio_0'] === 'loading'
                    ? 'border-blue-200 bg-blue-25 text-blue-400' 
                    : fileStates['audio_0'] === 'upload_error'
                    ? 'border-red-200 bg-red-25 text-red-400'
                    : 'border-gray-75 bg-gray-25 text-gray-400'
                }`}
              >
                {fileStates['audio_0'] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-14r">업로드 중...</span>
                  </>
                ) : fileStates['audio_0'] === 'upload_error' ? (
                  <>
                    <IconUpload width={24} height={24} className="text-red-400" />
                    <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                  </>
                ) : (
                  <>
                    <IconUpload width={24} height={24} className="text-gray-200" />
                    <span className="text-14r text-gray-400">MP3 파일을 업로드 해주세요</span>
                  </>
                )}
              </div>
            </div>
            )}
            
            {files.audios.length > 0 && (
              <>
              {files.audios.map((file: any, index: number) => (
                <div key={index} id={`audio_${index}`} className="flex gap-[16px] items-center">
                  
                  <h3 className="w-[80px] text-16s text-black">{index === 0 && 'MP3 파일'}</h3>
                  
                  <div 
                    onClick={() => handleFileUpload('audio', index)}
                    className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                      fileStates[`audio_${index}`] === 'loading'
                        ? 'border-blue-200 bg-blue-25 text-blue-400' 
                        : fileStates[`audio_${index}`] === 'upload_error'
                        ? 'border-red-200 bg-red-25 text-red-400'
                        : 'border-blue-50 bg-blue-25 text-gray-400'
                    }`}
                  >
                    {fileStates[`audio_${index}`] === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                        <span className="text-14r">업로드 중...</span>
                      </>
                    ) : fileStates[`audio_${index}`] === 'upload_error' ? (  
                      <>
                        <IconUpload width={24} height={24} className="text-red-400" />
                        <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                      </>
                    ) : (
                      <>
                        <IconCheck width={24} height={24} className="text-primary-blue" />
                        <span className="flex-1 text-14r text-primary-blue">{file.name}</span>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleFileDelete('audio', index);
                        }}>
                          <IconX width={24} height={24} className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {/* 추가 버튼 */}
              <div className="flex gap-[16px] items-center">
                <h3 className="w-[80px] text-16s text-black"></h3>
                <div 
                  onClick={() => handleFileUpload('audio', files.audios.length)}
                  className={`flex items-center gap-[8px] flex-1 h-[58px] p-[20px] border rounded-[10px] text-16m ${
                    fileStates[`audio_${files.audios.length}`] === 'loading'
                      ? 'border-blue-200 bg-blue-25 text-blue-400' 
                      : fileStates[`audio_${files.audios.length}`] === 'upload_error'
                      ? 'border-red-200 bg-red-25 text-red-400'
                      : 'border-gray-75 bg-gray-25 text-gray-400'
                  }`}
                >
                  {fileStates[`audio_${files.audios.length}`] === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <span className="text-14r">업로드 중...</span>
                    </>
                  ) : fileStates[`audio_${files.audios.length}`] === 'upload_error' ? (
                    <>
                      <IconUpload width={24} height={24} className="text-red-400" />
                      <span className="text-14r text-red-400">파일 업로드 실패, 다시 시도해 주세요.</span>
                    </>
                  ) : (
                    <>
                      <IconPlusSquare width={24} height={24} className="text-gray-200" />
                      <span className="text-14r text-gray-400">파일 더 업로드하기</span>
                    </>
                  )}
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
        <button 
          onClick={handleSaveFiles}
          className="w-[240px] h-[52px] rounded-[8px] bg-primary-purple text-16s text-white"
        >
          등록하기
        </button>
      </div>

      {/* 파일 선택 모달 (PDF/AUDIO 통합) */}
      <FileSelectorModal
        isOpen={fileSelector.isOpen}
        labelText="파일을 선택해주세요"
        onClose={() => {
          fileSelector.closeFileSelector();
          resetFileUploadStates();
        }}
        onFileSelect={(file) => fileSelector.handleFileSelect(file, currentFileIndex?.type || 'pdf')}
        accept={currentFileIndex?.type === 'audio' ? "audio/*" : "application/pdf"}
      />

    </div>
  );
};

export default SetMyBookModal; 