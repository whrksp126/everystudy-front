import { SERVER_URL } from "../utils/server";
import { fetchDataAsync } from "../utils/common";
import { getDeviceId } from "../utils/localStorage";
// my 교재 데이터 저장


export const saveMyBookStandardDatafetch = async (title: string, bookId: string, files: any) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/pdf_viewer/register_viewer_files`;
  const method = 'POST';
  const { pdfs: pdfList, audios: audioList } = files;
  
  const form_data: {key: string, value: Blob}[] = [];
  pdfList.forEach((d, i) => {
    form_data.push({
      key: `thumbnail_${i+1}`,
      value: d.thumbnail_blob, // 원본 파일
    });
  });
  const fetchData = {
    json_data: {
      workbook_name : title, // 문제집 명
      workbook_id : bookId, // 문제집 id
      device_id : getDeviceId(), // 사용자 기기 타입

      file_path: {
        pdf: pdfList.map(({ file_id, name, path, page_count, size }: {file_id: string, name: string, path: string, page_count: number, size: {mw: number, mh: number}}, index: number) => ({
          file_id, // 파일 id
          page_count: page_count, // 파일 총 페이지 수
          size : size, // 파일 용량
          priority : index + 1, 
          user_file_name: name, 
          user_file_path: path, 
        })),
        audio: audioList.map(({ file_id, name, path, total_time }: {file_id: string, name: string, path: string, total_time: number}, index: number) => ({
          file_id, 
          total_time : total_time, 
          priority : index + 1, 
          user_file_name: name, 
          user_file_path: path, 
        })),
      },
    },
    form_data,
  };
  
  console.log('fetchData', fetchData);
  try{
    return await fetchDataAsync(url, method, fetchData, true);
  }catch(error){
    console.error(error);
    return null;
  }
}


// my 교재 데이터 저장
export const editMyBookStandardDatafetch = async (title: string, bookId: string, files: any) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/pdf_viewer/update_viewer_files`;
  const method = 'PATCH';
  const { pdfs: pdfList, audios: audioList } = files;
  
  const form_data: {key: string, value: Blob}[] = [];
  pdfList.forEach((d, i) => {
    form_data.push({
      key: `thumbnail_${i+1}`,
      value: d.thumbnail_blob, // 원본 파일
    });
  });
  const fetchData = {
    json_data: {
      workbook_name : title, // 문제집 명
      workbook_id : bookId, // 문제집 id
      device_id : DEVICE_DATA.ID, // 사용자 기기 타입

      file_path: {
        pdf: pdfList.map(({ file_id, name, path, page_count, size }: {file_id: string, name: string, path: string, page_count: number, size: {mw: number, mh: number}}, index: number) => ({
          file_id, // 파일 id
          page_count: page_count, // 파일 총 페이지 수
          size : size, // 파일 용량
          priority : index + 1, 
          user_file_name: name, 
          user_file_path: path, 
        })),
        audio: audioList.map(({ file_id, name, path, total_time }: {file_id: string, name: string, path: string, total_time: number}, index: number) => ({
          file_id, 
          total_time : total_time, 
          priority : index + 1, 
          user_file_name: name, 
          user_file_path: path, 
        })),
      },
    },
    form_data,
  };
  try{
    return await fetchDataAsync(url, method, fetchData, true);
  }catch(error){
    console.error(error);
    return null;
  }
}
