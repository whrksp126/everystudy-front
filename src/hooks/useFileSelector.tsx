import { useState, useCallback } from 'react';
import { pdfjsLib } from '../utils/pdfUtils';
import { getUriToBlobToFile } from '../utils/common';
import { osSaveFileTemp } from '../utils/osFunction';
import { getAppPdfFileData, getAppAudioFileData } from '../utils/common';
import { DEVICE_DATA } from '../utils/osFunction';

interface PdfData {
  name: string;
  path: string;
  file: File | null;
  thumbnail_blob: Blob;
  cover_img: string;
  page_count: number;
  size: { mw: number; mh: number };
}

interface AudioData {
  name: string;
  path: string;
  file: File | null;
  total_time: number;
}

type FileData = PdfData | AudioData;

interface UseFileSelectorReturn {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openFileSelector: (type: string, index?: number, bookId?: string) => Promise<void>;
  closeFileSelector: () => void;
  selectedFile: FileData | null;
  handleFileSelect: (file: File, type: string) => Promise<void>;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileData | null>>;
}

export const useFileSelector = (): UseFileSelectorReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  const processPdfFile = useCallback(async (file: File): Promise<PdfData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const pdfData = new Uint8Array(this.result as ArrayBuffer);
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;

          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Canvas context not available');
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport, canvas }).promise;

          const dataUrl = canvas.toDataURL("image/png");
          const thumbnailBlob = getUriToBlobToFile(dataUrl);

          resolve({
            name: file.name,
            path: URL.createObjectURL(file),
            file,
            thumbnail_blob: thumbnailBlob,
            cover_img: dataUrl,
            page_count: pdf.numPages,
            size: {
              mw: viewport.width,
              mh: viewport.height
            }
          });
        } catch (error) {
          console.error("PDF 처리 중 오류:", error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const processAudioFile = useCallback(async (file: File): Promise<AudioData> => {
    return new Promise((resolve, reject) => {
      const objectURL = URL.createObjectURL(file);
      const audio = new Audio(objectURL);

      audio.addEventListener('loadedmetadata', () => {
        const total_time = audio.duration;
        resolve({
          name: file.name,
          path: objectURL,
          file: file,
          total_time: total_time
        });
      });

      audio.addEventListener('error', (e) => {
        reject(new Error("Error loading audio file: " + e.message));
      });
    });
  }, []);

  const openFileSelector = useCallback(async (type: string, index?: number, bookId?: string) => {
    setIsOpen(true);
    setError(null);
    // BROWSER가 아닌 경우 (ANDROID, IOS 등)
    console.log("🔥 bookId", bookId)
    if (DEVICE_DATA.OS !== 'BROWSER') {
      try {
        
        const {filePath, fileName}: {filePath: string, fileName: string} = await osSaveFileTemp(bookId || 'new', type, index || 0) as {filePath: string, fileName: string};  
        
        if (type === 'pdf') {
          const pdfData = await getAppPdfFileData({filePath, fileName});
          setSelectedFile({
            name: pdfData.user_file_name,
            path: pdfData.user_file_path,
            file: null,
            thumbnail_blob: pdfData.thumbnail_blob,
            cover_img: pdfData.cover_img,
            page_count: pdfData.total_page,
            size: pdfData.size
          });
        } else if (type === 'audio') {
          const audioData = await getAppAudioFileData({filePath, fileName});
          setSelectedFile({
            name: audioData.user_file_name,
            path: audioData.user_file_path,
            file: null,
            total_time: audioData.total_time
          });
        }
        setIsOpen(false);
      } catch (error) {
        console.error('파일 처리 실패:', error);
        setError('파일 처리 중 오류가 발생했습니다.');
        setIsOpen(false);
      }
    }
  }, []);

  const closeFileSelector = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const handleFileSelect = useCallback(async (file: File, type: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let fileData: FileData;
      
      if (type === 'pdf') {
        fileData = await processPdfFile(file);
      } else if (type === 'audio') {
        fileData = await processAudioFile(file);
      } else {
        throw new Error('지원하지 않는 파일 타입입니다.');
      }
      
      setSelectedFile(fileData);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [processPdfFile, processAudioFile]);

  return {
    isOpen,
    isLoading,
    error,
    openFileSelector,
    closeFileSelector,
    selectedFile,
    handleFileSelect,
    setSelectedFile, // 추가!
  };
}; 