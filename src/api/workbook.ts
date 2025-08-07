import { SERVER_URL } from "../utils/server";
import { DEVICE_DATA } from "../utils/osFunction";
import { fetchDataAsync } from "../utils/common";


// [POST] /workbook/register_update_path
// - path_list = [
//    pdf: [
//       file_id
//       use_has_file_id
//       user_file_name
//       user_file_path
//    ]
//    audio: [
//       file_id
//       user_has_file_id
//       user_file_name
//       user_file_path
//    ]
//    is_file_registered
//    workbook_id
//    device_type   
// ]


// 유저 문제집 경로 등록
export const saveWorkBookPathfetch = async (workBook: any, files: any) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/workbook/register_update_path`;
  const method = 'POST';
  console.log(files);

  const fetchData = {
    data_list : [
      {
        workbook_id : workBook.id,
        device_id : DEVICE_DATA.ID,
        pdf : [
          ...files.pdfs.map((d: any) => ({
            file_id : d.id || null,
            user_has_file_id : d.user_has_file_id || null,
            user_file_name : d.name,
            user_file_path : d.path,
          })),
        ],
        audio : [
          ...files.mp3s.map((d: any) => ({
            file_id : d.id || null,
            user_has_file_id : d.user_has_file_id || null,
            user_file_name : d.name,
            user_file_path : d.path,
          })),
        ]
      }
    ]
  }
  // console.log(fetchData);
  return;
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
  const { pdfs: pdfList, mp3s: audioList } = files;
  
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
