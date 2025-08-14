import { SERVER_URL } from "../utils/server";
import { DEVICE_DATA } from "../utils/osFunction";
import { fetchDataAsync } from "../utils/common";
import { getDeviceId } from "../utils/localStorage";

// 유저 문제집 경로 등록
export const setWorkBookPathfetch = async (workBook: any, files: any) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/workbook/register_update_path`;
  const method = 'POST';
  const fetchData = {
    data_list : [
      {
        workbook_id : workBook.id,
        device_id : getDeviceId(),
        pdf : [
          ...files.pdfs.map((d: any) => ({
            file_id : d.id || null,
            user_file_id : d.user_file_id || null,
            user_file_name : d.user_filename,
            user_file_path : d.user_filepath,
          })),
        ],
        audio : [
          ...files.audios.map((d: any) => ({
            file_id : d.id || null,
            user_file_id : d.user_file_id || null,
            user_file_name : d.user_filename,
            user_file_path : d.user_filepath,
          })),
        ]
      }
    ]
  }
  try{
    return await fetchDataAsync(url, method, fetchData);
  }catch(error){
    console.error(error);
    return null;
  }
}


// 문제집 데이터 수정
export const editWorkBookStandardDatafetch = async (title: string, bookId: string, files: any) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/pdf_viewer/update_viewer_files`;
  const method = 'PATCH';
  const { pdfs: pdfList, audios: audioList } = files;
  
  const form_data: {key: string, value: Blob}[] = [];
  pdfList.forEach((d: any, i: number) => {
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
        pdf: pdfList.map(({ file_id, user_file_id, user_file_name, user_file_path, page_count, size }: {file_id: string, user_file_id: string, user_file_name: string, user_file_path: string, page_count: number, size: {mw: number, mh: number}}, index: number) => ({
          file_id, // 파일 id
          user_file_id: user_file_id,
          page_count: page_count, // 파일 총 페이지 수
          size : size, // 파일 용량
          priority : index + 1, 
          user_file_name: user_file_name, 
          user_file_path: user_file_path, 
        })),
        audio: audioList.map(({ file_id, user_file_id, user_file_name, user_file_path, total_time }: {file_id: string, user_file_id: string, user_file_name: string, user_file_path: string, total_time: number}, index: number) => ({
          file_id, 
          user_file_id: user_file_id,
          total_time : total_time, 
          priority : index + 1, 
          user_file_name: user_file_name, 
          user_file_path: user_file_path, 
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
