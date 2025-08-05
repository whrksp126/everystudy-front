import React from 'react';

interface FileSelectorModalProps {
  isOpen: boolean;
  labelText: string;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  accept: string;
}

export const FileSelectorModal: React.FC<FileSelectorModalProps> = ({
  isOpen,
  labelText,
  onClose,
  onFileSelect,
  accept
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-xl font-bold hover:bg-opacity-100 transition-all z-10"
      >
        ✕
      </button>

      {/* 파일 선택 영역 */}
      <div className="relative">
        <label className="block text-white text-lg font-bold text-center mb-4 drop-shadow-lg">
          {labelText}
        </label>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="block bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-8 text-white text-center cursor-pointer hover:bg-opacity-30 transition-all border-2 border-dashed border-white border-opacity-50"
        >
          <div className="text-4xl mb-2">📁</div>
          <div className="text-sm opacity-80">클릭하여 파일 선택</div>
        </label>
      </div>
    </div>
  );
}; 