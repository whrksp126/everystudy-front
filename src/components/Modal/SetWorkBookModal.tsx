import React, { useEffect, useRef, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconUpload, IconX } from '../../assets/Icon';
import { useAlert } from '../../hooks/useAlert';
import WarringNoWorkBookAlert from '../Alert/WarringNoWorkBookAlert';
import { useFileSelector } from '../../hooks/useFileSelector';
import { FileSelectorModal } from '../FileSelectorModal';

const SetWorkBookModal: React.FC<{item: any}> = ({item}) => {
  const { popModal, closeModal } = useModal();
  const { openAlert } = useAlert();
  const [workBook, setWorkBook] = useState<any>(item);
  const [files, setFiles] = useState<any>(item.files);
  const [fileStates, setFileStates] = useState<{[key: string]: 'idle' | 'loading' | 'validation_error' | 'upload_error' | 'success'}>({});
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastAddedIndex, setLastAddedIndex] = useState<{type: string, index: number} | null>(null);

  // 통합 파일 선택 훅 사용
  const fileSelector = useFileSelector();

  // 현재 선택된 인덱스 저장
  const [currentFileIndex, setCurrentFileIndex] = useState<{type: string, index: number} | null>(null);

  const handleClose = () => {
    popModal();
  };

  // 파일 선택 결과 처리 (PDF, MP3 통합)
  useEffect(() => {

    if (fileSelector.selectedFile && currentFileIndex) {
      const fileData = fileSelector.selectedFile;
      
      setFiles((prevFiles: { [key: string]: any[] }) => {
        const updatedFiles = { ...prevFiles };
        const fileType = currentFileIndex.type === 'pdf' ? 'pdfs' : 'mp3s';
        const arr = Array.isArray(updatedFiles[fileType]) ? [...updatedFiles[fileType]] : [];
        
        // 선택된 인덱스에 파일 저장
        if (currentFileIndex.type === 'pdf') {
          const pdfData = fileData as PdfData;
          arr[currentFileIndex.index] = {
            ...arr[currentFileIndex.index],
            name: pdfData.name,
            path: pdfData.path,
            file: pdfData.file,
            thumbnail_blob: pdfData.thumbnail_blob,
            cover_img: pdfData.cover_img,
            page_count: pdfData.page_count,
            size: pdfData.size
          };
        } else if (currentFileIndex.type === 'mp3') {
          const audioData = fileData as AudioData;
          arr[currentFileIndex.index] = {
            ...arr[currentFileIndex.index],
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

      if(type === 'pdf' || type === 'mp3'){
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


  const handleSave = () => {
    openAlert(WarringNoWorkBookAlert, {
      preserveState: true, 
      keepInDOM: true 
    });
  };

  // 상태 초기화 함수(현재 업로드 중인 파일만 idle로)
  const resetFileUploadStates = () => {
    if (!currentFileIndex) return;
    const { type, index } = currentFileIndex;
    setFileStates(prev => ({
      ...prev,
      [`${type}_${index}`]: files[type + 's'] && files[type + 's'][index].path ? 'success' : 'idle'
    }));
    setCurrentFileIndex(null);
  };


  // 파일 삭제
  const handleFileDelete = (type: string, index: number) => {
    setFiles(prev => ({
      ...prev,
      [type + 's']: prev[type + 's'].map((item: any, i: number) => {
        if (i === index) {
          // title만 남기고 나머지 제거
          return { title: item.title };
        }
        return item;
      })
    }));
    setFileStates(prev => ({
      ...prev,
      [`${type}_${index}`]: 'idle'
    }));
  };


  return (
    <div className="w-full max-w-[712px] max-h-[600px] pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          직접 교재를 등록해보세요
        </h2>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-[20px] flex-1 max-h-[calc(600px-64px-84px)] py-[24px] overflow-y-auto">

        <div className="px-[32px]">
          <div className="flex gap-[24px] px-[20px] py-[16px]  rounded-[10px] bg-gray-25">
            {/* 썸네일 */}
            <div>
              <img src={workBook.image} alt="교재 썸네일" className="w-[120px] h-[160px] rounded-[10px]" />
            </div>
            {/* 교재 정보 */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[12px]">
                {/* 태그 */}
                <div className="flex gap-[8px]">
                  {workBook.tags.map((tag: any) => (
                  <span key={tag.name} className={`px-[8px] py-[3px] rounded-[6px] text-12r ${tag.color === 'purple' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>{tag.name}</span>
                  ))}
                </div>
                {/* 교재명 */}
                <h3 className="text-20b text-black">
                  {workBook.title}
                </h3>
              </div>
              
              <div className="flex flex-col gap-[6px]">
                {/* 영역 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">영역</h4>
                  <span className="text-15m text-gray-400">{workBook.area}</span>
                </div>
                {/* 출판사 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">출판사</h4>
                  <span className="text-15m text-gray-400">{workBook.publisher}</span>
                </div>
                {/* 발행일 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">발행일</h4>
                  <span className="text-15m text-gray-400">{workBook.releaseDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[16px] px-[32px]">
          {files.pdfs.map((file: any, index: number) => (
            
          <div 
            onClick={() => handleFileUpload('pdf', index, workBook.id)}
            key={`pdf-${index}`} className="flex flex-col flex-1 gap-[12px]">
            <h3 className="text-16s text-black">{file.title}</h3>

            <div className={`
              relative
              flex flex-col items-center justify-center gap-[12px] flex-1 
              min-h-[148px] 
              px-[20px] 
              border rounded-[10px] 
              text-16m ${
                fileStates[`pdf_${index}`] === 'loading' || fileStates[`pdf_${index}`] === 'success'
                  ? 'border-blue-200 bg-blue-25 text-blue-400' 
                  : fileStates[`pdf_${index}`] === 'validation_error' || fileStates[`pdf_${index}`] === 'upload_error'
                  ? 'border-red-200 bg-red-25 text-red-400'
                  : 'border-gray-75 bg-gray-25 text-gray-400'
              }
            `}>
                {fileStates[`pdf_${index}`] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-center text-16r">업로드 중...</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'validation_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400" />
                    <span className="text-center text-16r text-red-400">PDF 파일을<br />업로드 해주세요.</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'upload_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400" />
                    <span className="text-center text-16r text-red-400">파일 업로드 실패<br />다시 시도해 주세요.</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'success' ? (
                  <>
                    <span className="text-center text-16r">{file.name}</span>
                    <button 
                      className="absolute top-[12px] right-[12px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete('pdf', index);
                      }}
                    >
                      <IconX width={24} height={24} className="text-gray-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <IconUpload width={32} height={32} className="text-gray-200" />
                    <span className="text-center text-16r text-gray-400">PDF 파일을<br />업로드 해주세요.</span>
                  </>
                )}
            </div>
          </div>
          ))}
          {files.mp3s.map((file: any, index: number) => (
          <div 
            onClick={() => handleFileUpload('mp3', index, workBook.id)}
            key={`audio-${index}`} className="flex flex-col flex-1 gap-[16px]">
            <h3 className="text-16s text-black">{file.title}</h3>
            <div className={`
              relative
              flex flex-col items-center justify-center gap-[12px] flex-1
              min-h-[148px] h-full
              px-[20px] 
              border rounded-[10px]
              text-16m ${
                fileStates[`mp3_${index}`] === 'loading' || fileStates[`mp3_${index}`] === 'success'
                  ? 'border-blue-200 bg-blue-25 text-blue-400' 
                  : fileStates[`mp3_${index}`] === 'validation_error' || fileStates[`mp3_${index}`] === 'upload_error'
                  ? 'border-red-200 bg-red-25 text-red-400'
                  : 'border-gray-75 bg-gray-25 text-gray-400'
                }
              `}
              >
                {fileStates[`mp3_${index}`] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-center text-16r">업로드 중...</span>
                  </>
                ) : fileStates[`mp3_${index}`] === 'validation_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400" />
                    <span className="text-center text-16r text-red-400">MP3 파일을<br />업로드 해주세요.</span>
                  </>
                ) : fileStates[`mp3_${index}`] === 'upload_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400" />
                    <span className="text-center text-16r text-red-400">파일 업로드 실패<br />다시 시도해 주세요.</span>
                  </>
                ) : fileStates[`mp3_${index}`] === 'success' ? (
                  <>
                    <span className="text-center text-16r">{file.name}</span>
                    <button 
                      className="absolute top-[12px] right-[12px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete('mp3', index);
                      }}
                    >
                      <IconX width={24} height={24} className="text-gray-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <IconUpload width={32} height={32} className="text-gray-200" />
                    <span className="text-center text-16r text-gray-400">MP3 파일을<br />업로드 해주세요.</span>
                  </>
                )}
            </div>       
          </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button 
          onClick={handleSave}
          className="w-[240px] h-[52px] rounded-[8px] bg-primary-purple text-16s text-white"
        >등록하기</button>
      </div>


      {/* 파일 선택 모달 (PDF/MP3 통합) */}
      <FileSelectorModal
        isOpen={fileSelector.isOpen}
        labelText="파일을 선택해주세요"
        onClose={() => {
          fileSelector.closeFileSelector();
          resetFileUploadStates();
        }}
        onFileSelect={(file) => fileSelector.handleFileSelect(file, currentFileIndex?.type || 'pdf')}
        accept={currentFileIndex?.type === 'mp3' ? "audio/*" : "application/pdf"}
      />

    </div>
  );
};

export default SetWorkBookModal; 