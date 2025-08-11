import React, { useEffect, useRef, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IconX } from '../../assets/Icon.tsx';
import { addFolderfetch, updateFolderfetch } from '../../api/myDocs';
import { useData } from '../../contexts/DataContext';

type SetFolderModalProps = {
  folderPath?: string[];
  type?: string;
  item?: any;
};

// 폴더 색상 데이터
const folderColors = [
  '#67cdff',
  '#717171',
  '#1C82F6',
  '#59D878',
  '#FFDC4B',
  '#FF625A',
  '#7568F1',
];

const SetFolderModal: React.FC<SetFolderModalProps> = ({ type, folderPath, item}) => {
  const { popModal, closeModal } = useModal();
  const { setUpdateMyDocsFolder } = useData();
  const [selectedColor, setSelectedColor] = useState(
    type === 'edit'
      ? (folderColors.includes(item.color) ? item.color : folderColors[0])
      : folderColors[0]
  );
  const folderNameRef = useRef<HTMLInputElement>(type === 'edit' ? item.name : '이름 없음');

  const handleDeleteName = () => {
    folderNameRef.current.value = '';
  }

  const handleClose = () => {
    popModal();
  };


  const handleSave = async () => {
    if(type === 'add'){
      const parentFolderId = folderPath?.pop() || null;
      const name = folderNameRef.current?.value || '';
      const folderType = 'workbook';
      const color = folderColors.find(color => color === selectedColor) || '';
      try{
        await addFolderfetch(parentFolderId, name, folderType, color);  
      }catch(error){
        console.error(error);
      }
    }
    if(type === 'edit'){
      const folderId = item.id;
      const name = folderNameRef.current?.value || '';
      const color = folderColors.find(color => color === selectedColor) || '';

      try{
        await updateFolderfetch(folderId, name, color);
        setUpdateMyDocsFolder({id: folderId, name: name, color: color});
      }catch(error){
        console.error(error);
      }
    }
    

    
    // popModal();
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (folderNameRef.current) {
      folderNameRef.current.value = e.target.value;
    }
  };

  return (
    <div className="w-full max-w-[360px] pb-[32px] rounded-[13px] bg-white shadow-xl overflow-hidden">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between h-[64px] pr-[20px] pl-[16px]">
        <button
          onClick={handleClose}
          className="px-[16px] py-[8px] text-18m text-primary-purple"
        >
          취소
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-20b text-gray-800">
          폴더 설정
        </h2>
        <button
          onClick={handleSave}
          className="h-[40px] px-[14px] rounded-[6px] bg-primary-purple text-14m text-white"
        >
          저장
        </button>
      </div>
      {/* 메인 */}
      <div className="flex flex-col gap-[12px] flex-1 px-[20px] overflow-y-auto">
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-16s text-black">폴더명</h3>
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="폴더명을 입력하세요." 
              defaultValue={type === 'edit' ? item.name : '이름 없음'} 
              ref={folderNameRef}
              onChange={handleFolderNameChange}
              className="w-full h-[48px] py-[13px] pl-[16px] pr-[45px] rounded-[10px] bg-gray-50 text-16m text-gray-800" 
            />
            <div 
              className="absolute right-[12px] top-1/2 -translate-y-1/2 p-[8px]"
              onClick={handleDeleteName}
            >
              <IconX width={16} height={16} className="text-gray-200" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-16s text-black">폴더 색상</h3>
          <div className="flex items-center justify-between gap-[10px] p-[5px] overflow-x-auto">
            {folderColors.map((color) => (
              <button
                key={`color-${color}`}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center justify-center w-[36px] h-[36px] border border-[3px] rounded-[20px] bg-white transition-all ${
                  selectedColor === color 
                    ? 'border-primary-purple' 
                    : 'border-white'
                }`}
              >
                <div 
                  className="w-[26px] h-[26px] rounded-[20px]" 
                  style={{ backgroundColor: color }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default SetFolderModal; 