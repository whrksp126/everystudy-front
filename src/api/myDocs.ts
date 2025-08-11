import { SERVER_URL } from "../utils/server";
import { DEVICE_DATA } from "../utils/osFunction";
import { fetchDataAsync } from "../utils/common";


// 유저 문제집 경로 등록
export const addFolderfetch = async (parentFolderId: string | null, name: string, folderType: string, color: string) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/folder/add_folder`;
  const method = 'POST';

  const fetchData = {
    parent_folder_id : parentFolderId || null, // 부모 폴더 id
    name : name, // 폴더 명
    folder_type : folderType, // 폴더 등록 타입(어디서 등록 했는지) 'workbook', 'review_note', 'diy_exam'
    color : color,
  }
  // console.log(fetchData);
  try{
    return await fetchDataAsync(url, method, fetchData);
  }catch(error){
    console.error(error);
    return null;
  }
}

// 유저 문제집 경로 수정
export const updateFolderfetch = async (folderId: string, name: string, color: string) => {
  // 성공 시 처리 로직
  const url = `${SERVER_URL}/folder/update_folder_info`;
  const method = 'PATCH';

  const fetchData = {
    folder_id : folderId, // 부모 폴더 id
    name : name, // 폴더 명
    color : color,
  }
  // console.log(fetchData);
  try{
    return await fetchDataAsync(url, method, fetchData);
  }catch(error){
    console.error(error);
    return null;
  }
}


// 폴더 이동
export const moveFolderfetch = async ({ itemId, toFolderId }: { itemId: string, toFolderId: string }) => {
  const url = `${SERVER_URL}/folder/move_folder`;
  const method = 'PATCH';
  const fetchData = {
    folder_id : itemId,
    parent_folder_id : toFolderId,
  }
  try{
    return await fetchDataAsync(url, method, fetchData);
  }catch(error){
    console.error(error);
    return null;
  }
}