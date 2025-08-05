import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// 워커 경로 설정 (위에서 만든 파일 경로)
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export { pdfjsLib };