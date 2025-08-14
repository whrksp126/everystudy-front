import React, { useEffect, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconArrowLeft, IconUpload, IconX } from '../../assets/Icon.tsx';
import { useAlert } from '../../hooks/useAlert';
import WarringNoWorkBookAlert from '../Alert/WarringNoWorkBookAlert';
import { useFileSelector } from '../../hooks/useFileSelector';
import { FileSelectorModal } from '../FileSelectorModal';
import { setWorkBookPathfetch } from '../../api/workbook';
import { useData } from '../../contexts/DataContext';
import { osIsFileExists } from '../../utils/osFunction';

const SetWorkBookModal: React.FC<{item: any}> = ({item}) => {
  const { popModal, closeModal } = useModal();
  const { openAlert } = useAlert();
  const [workBook] = useState<any>(item);
  const [files, setFiles] = useState<any>(item.files);
  const [fileStates, setFileStates] = useState<{[key: string]: 'idle' | 'loading' | 'validation_error' | 'upload_error' | 'exists_error' | 'success'}>({});
  const { getUserPaths, userPathsLoaded } = useData();
  
  // const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const [lastAddedIndex, setLastAddedIndex] = useState<{type: string, index: number} | null>(null);

  // 통합 파일 선택 훅 사용
  const fileSelector = useFileSelector();

  // 현재 선택된 인덱스 저장
  const [currentFileIndex, setCurrentFileIndex] = useState<{type: string, index: number} | null>(null);


  useEffect(() => {
    // await를 사용하기 위해 내부에 async 함수를 선언하여 실행
    const userPaths = getUserPaths();
    const userPath = userPaths.find((data: any) => data.workbook_id === item.id);
    if (userPath) {
      setFiles({
        pdfs: userPath.pdf.map((pdf: any, index: number) => ({
          ...files.pdfs[index],
          ...pdf,
        })),
        audios: userPath.audio.map((audio: any, index: number) => ({
          ...files.audios[index],
          ...audio,
        })),
      });
      checkFilesExists();
    }
  }, [userPathsLoaded]);

  const checkFilesExists = async () => {
    const userPaths = getUserPaths();
    const userPath = userPaths.find((data: any) => data.workbook_id === item.id);
    const newFileStates: { [key: string]: 'idle' | 'loading' | 'validation_error' | 'upload_error' | 'exists_error' | 'success' } = {};
    // PDF 파일 존재 여부 확인
    for (let index = 0; index < userPath.pdf.length; index++) {
      const pdf = userPath.pdf[index];
      const isFileExists = await osIsFileExists(pdf.user_file_path);
      if (isFileExists) {
        newFileStates[`pdf_${index}`] = 'success';
      } else {
        newFileStates[`pdf_${index}`] = 'exists_error';
      }
    }
    // 오디오 파일 존재 여부 확인
    for (let index = 0; index < userPath.audio.length; index++) {
      const audio = userPath.audio[index];
      const isFileExists = await osIsFileExists(audio.user_file_path);
      if (isFileExists) {
        newFileStates[`audio_${index}`] = 'success';
      } else {
        newFileStates[`audio_${index}`] = 'exists_error';
      }
    }

    setFileStates((prev) => ({
      ...prev,
      ...newFileStates,
    }));
  }


  useEffect(() => {
  }, [fileStates]);

  const handleClose = () => {
    popModal();
  };


  // 파일 선택 결과 처리 (PDF, MP3 통합)
  useEffect(() => {
    if (fileSelector.selectedFile && currentFileIndex) {
      const fileData = fileSelector.selectedFile;
      
      setFiles((prevFiles: { [key: string]: any[] }) => {
        const updatedFiles = { ...prevFiles };
        const fileType = currentFileIndex.type === 'pdf' ? 'pdfs' : 'audios';
        const arr = Array.isArray(updatedFiles[fileType]) ? [...updatedFiles[fileType]] : [];
        
        // 선택된 인덱스에 파일 저장
        if (currentFileIndex.type === 'pdf') {
          const pdfData = fileData as any;
          arr[currentFileIndex.index] = {
            ...arr[currentFileIndex.index],
            user_file_name: pdfData.user_file_name,
            user_file_path: pdfData.user_file_path,
            file: pdfData.file,
            thumbnail_blob: pdfData.thumbnail_blob,
            cover_img: pdfData.cover_img,
            page_count: pdfData.page_count,
            size: pdfData.size
          };
        } else if (currentFileIndex.type === 'audio') {
          const audioData = fileData as any;
          arr[currentFileIndex.index] = {
            ...arr[currentFileIndex.index],
            user_file_name: audioData.user_file_name,
            user_file_path: audioData.user_file_path,
            file: audioData.file,
            total_time: audioData.total_time
          };
        }
        
        updatedFiles[fileType] = arr;
        return updatedFiles;
      });
      
      setFileStates(prev => ({ ...prev, [`${currentFileIndex.type}_${currentFileIndex.index}`]: 'success' }));
      // setLastAddedIndex({ type: currentFileIndex.type, index: currentFileIndex.index });
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
    };
  };


  const handleSave = async () => {
    if(!files.pdfs[0].path){
      openAlert(WarringNoWorkBookAlert, {
        preserveState: true, 
        keepInDOM: true 
      });
      return;
    }
    try{
      const result = await setWorkBookPathfetch(workBook, files);
      console.log(result);
      if(result){
        closeModal();
      }
    }catch(error){
      console.error(error);
    }
  };

  // 상태 초기화 함수(현재 업로드 중인 파일만 idle로)
  // user_file_path가 있으면 isFileExists로 실제 파일 존재 여부 확인 후 상태 업데이트
  const resetFileUploadStates = async () => {
    if (!currentFileIndex) return;
    const { type, index } = currentFileIndex;
    const fileItem = files[type + 's'] && files[type + 's'][index];
    if (fileItem && fileItem.user_file_path) {
      try {
        // osIsFileExists는 utils에서 import 되어 있다고 가정
        const isExists = await osIsFileExists(fileItem.user_file_path);
        setFileStates(prev => ({
          ...prev,
          [`${type}_${index}`]: isExists ? 'success' : 'exists_error'
        }));
      } catch (_e) {
        setFileStates(prev => ({
          ...prev,
          [`${type}_${index}`]: 'exists_error'
        }));
      }
    } else {
      setFileStates(prev => ({
        ...prev,
        [`${type}_${index}`]: 'idle'
      }));
    }
    setCurrentFileIndex(null);
  };


  // 파일 삭제
  const handleFileDelete = (type: string, index: number) => {
    setFiles((prev: any) => ({
      ...prev,
      [type + 's']: prev[type + 's'].map((item: any, i: number) => {
        if (i === index) {
          // title만 남기고 나머지 제거
          return { title: item.title };
        }
        return item;
      })
    }));
    setFileStates((prev: any) => ({
      ...prev,
      [`${type}_${index}`]: 'idle'
    }));
  };


  return (
    <div className="
      w-full max-w-[712px] max-h-[600px] h-full pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden
      max-sm:max-w-full max-sm:max-h-full max-sm:w-full max-sm:h-full max-sm:rounded-none
    ">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] px-[20px]">
        <button
          onClick={handleClose}
          className="p-[4px]"
        >
          <IconArrowLeft width={32} height={32} className="text-gray-400" />
        </button>
        <h2 className="
          absolute left-1/2 -translate-x-1/2 text-20b text-gray-800
          max-sm:hidden
        ">
          직접 교재를 등록해보세요
        </h2>
      </div>
      {/* 메인 */}
      <div className="
        flex flex-col gap-[24px] flex-1 max-h-[calc(600px-64px-84px)] h-full overflow-y-auto 
        max-sm:gap-[0px] max-sm:max-h-[calc(100vh-64px-84px)] max-sm:h-full max-sm:px-[0px] max-sm:py-[0px] max-sm:pb-[40px]
      ">
        {/* 모바일 헤더 */}
        <div className="px-[20px] py-[15px] hidden max-sm:flex">
          <h2 className="text-20b text-gray-800 hidden max-sm:block">직접 교재를 등록해보세요</h2>
        </div>

        <div className="px-[32px] max-sm:px-[16px] max-sm:mb-[32px]">
          <div className="
            flex gap-[24px] px-[20px] py-[16px]  rounded-[10px] bg-gray-25
            max-sm:flex-col max-sm:items-start
            ">
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
                  <span className="text-15m text-gray-400">{workBook.area || ''}</span>
                </div>
                {/* 출판사 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">출판사</h4>
                  <span className="text-15m text-gray-400">{workBook.publisher || ''}</span>
                </div>
                {/* 발행일 */}
                <div className="flex items-center gap-[4px]">
                  <h4 className="w-[50px] h-[20px] text-15m text-black">발행일</h4>
                  <span className="text-15m text-gray-400">{workBook?.releaseDate ? new Date(workBook.releaseDate).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="
          flex gap-[16px] px-[32px] 
          max-sm:flex-col max-sm:items-start max-sm:px-[16px]
        ">
          {files.pdfs.map((file: any, index: number) => (
            
          <div 
            onClick={() => handleFileUpload('pdf', index, workBook.id)}
            key={`pdf-${index}`} className="
              flex flex-col flex-1 gap-[12px]
              max-sm:w-full
            ">
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
                  : fileStates[`pdf_${index}`] === 'validation_error' || fileStates[`pdf_${index}`] === 'upload_error' || fileStates[`pdf_${index}`] === 'exists_error'
                  ? 'border-red-200 bg-red-25 text-red-400'
                  : 'border-gray-75 bg-gray-25 text-gray-400'
              }

              max-sm:min-h-[58px] max-sm:h-[58px] max-sm:flex-row max-sm:justify-start
            `}>
                {fileStates[`pdf_${index}`] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-center text-16r">업로드 중...</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'validation_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400 max-sm:hidden" />
                    <span className="text-center text-16r text-red-400 max-sm:hidden">PDF 파일을<br />업로드 해주세요.</span>
                    <IconUpload width={24} height={24} className="text-red-400 hidden max-sm:block" />
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">PDF 파일을 업로드 해주세요.</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'upload_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400 max-sm:hidden" />
                    <span className="text-center text-16r text-red-400 max-sm:hidden">파일 업로드 실패<br />다시 시도해 주세요.</span>
                    <IconUpload width={24} height={24} className="text-red-400 hidden max-sm:block" />
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">파일 업로드 실패<br />다시 시도해 주세요.</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'exists_error' ? (
                  <>
                    <span className="text-center text-16r text-red-400 max-sm:hidden">{file.user_file_name}<br />파일이 존재하지 않습니다.</span>
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">{file.user_file_name}<br />파일이 존재하지 않습니다.</span>
                  </>
                ) : fileStates[`pdf_${index}`] === 'success' ? (
                  <>
                    <span className="text-center text-16r">{file.user_file_name}</span>
                    <button 
                      className="absolute top-[12px] right-[12px] max-sm:top-[50%] max-sm:translate-y-[-50%]"
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
                    <IconUpload width={32} height={32} className="text-gray-200 max-sm:hidden" />
                    <span className="text-center text-16r text-gray-400 max-sm:hidden">PDF 파일을<br />업로드 해주세요.</span>
                    <IconUpload width={24} height={24} className="text-gray-200 hidden max-sm:block hidden" />
                    <span className="text-center text-16r text-gray-400 hidden max-sm:block">PDF 파일을 업로드 해주세요.</span>
                  </>
                )}
            </div>
          </div>
          ))}
          {files.audios.map((file: any, index: number) => (
          <div 
            onClick={() => handleFileUpload('audio', index, workBook.id)}
            key={`audio-${index}`} className="
              flex flex-col flex-1 gap-[12px]
              max-sm:w-full
            ">
            <h3 className="text-16s text-black">{file.title}</h3>
            <div className={`
              relative
              flex flex-col items-center justify-center gap-[12px] flex-1
              min-h-[148px] h-full
              px-[20px] 
              border rounded-[10px]
              text-16m ${
                fileStates[`audio_${index}`] === 'loading' || fileStates[`audio_${index}`] === 'success'
                  ? 'border-blue-200 bg-blue-25 text-blue-400' 
                  : fileStates[`audio_${index}`] === 'validation_error' || fileStates[`audio_${index}`] === 'upload_error' || fileStates[`audio_${index}`] === 'exists_error'
                  ? 'border-red-200 bg-red-25 text-red-400'
                  : 'border-gray-75 bg-gray-25 text-gray-400'
                }
              max-sm:min-h-[58px] max-sm:h-[58px] max-sm:flex-row max-sm:justify-start
              `}
              
              >
                {fileStates[`audio_${index}`] === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-center text-16r">업로드 중...</span>
                  </>
                ) : fileStates[`audio_${index}`] === 'validation_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400 max-sm:hidden" />
                    <span className="text-center text-16r text-red-400 max-sm:hidden">MP3 파일을<br />업로드 해주세요.</span>
                    <IconUpload width={24} height={24} className="text-red-400 hidden max-sm:block" />
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">MP3 파일을 업로드 해주세요.</span>
                  </>
                ) : fileStates[`audio_${index}`] === 'upload_error' ? (
                  <>
                    <IconUpload width={32} height={32} className="text-red-400 max-sm:hidden" />
                    <span className="text-center text-16r text-red-400 max-sm:hidden">파일 업로드 실패<br />다시 시도해 주세요.</span>
                    <IconUpload width={24} height={24} className="text-red-400 hidden max-sm:block" />
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">파일 업로드 실패<br />다시 시도해 주세요.</span>
                  </>
                ) : fileStates[`audio_${index}`] === 'exists_error' ? (
                  <>
                    <span className="text-center text-16r text-red-400 max-sm:hidden">{file.user_file_name}<br />파일이 존재하지 않습니다.</span>
                    <span className="text-center text-16r text-red-400 hidden max-sm:block">{file.user_file_name}<br />파일이 존재하지 않습니다.</span>
                  </>
                ) : fileStates[`audio_${index}`] === 'success' ? (
                  <>
                    <span className="text-center text-16r">{file.user_file_name}</span>
                    <button 
                      className="absolute top-[12px] right-[12px] max-sm:top-[50%] max-sm:translate-y-[-50%]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete('audio', index);
                      }}
                    >
                      <IconX width={24} height={24} className="text-gray-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <IconUpload width={32} height={32} className="text-gray-200 max-sm:hidden" />
                    <span className="text-center text-16r text-gray-400 max-sm:hidden">MP3 파일을<br />업로드 해주세요.</span>
                    <IconUpload width={24} height={24} className="text-gray-200 hidden max-sm:block" />
                    <span className="text-center text-16r text-gray-400 hidden max-sm:block">MP3 파일을 업로드 해주세요.</span>
                  </>
                )}
            </div>       
          </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center px-[20px]">
        <button 
          onClick={handleSave}
          className="
            max-w-[240px] w-full h-[52px] px-[20px] rounded-[8px] bg-primary-purple text-16s text-white
            max-sm:max-w-[100%]
          "
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
        accept={currentFileIndex?.type === 'audio' ? "audio/*" : "application/pdf"}
      />

    </div>
  );
};

export default SetWorkBookModal; 