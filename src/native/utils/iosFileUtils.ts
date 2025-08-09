import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Share from 'react-native-share';
import {showToast} from '@/utils/toast';
import {ensureIOSPermission, IOSPermissionType} from './iosPermissions';

/**
 * 获取iOS文档目录路径
 * @returns 文档目录路径
 */
export function getIOSDocumentsPath() {
  return FileSystem.documentDirectory || '';
}

/**
 * 获取iOS缓存目录路径
 * @returns 缓存目录路径
 */
export function getIOSCachePath() {
  return FileSystem.cacheDirectory || '';
}

/**
 * 检查文件是否存在
 * @param filePath 文件路径
 * @returns 是否存在
 */
export async function checkFileExists(filePath: string) {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
  } catch (error) {
    console.error('检查文件存在失败', error);
    return false;
  }
}

/**
 * 选择文件（iOS）
 * @param type 文件类型
 * @returns 文件信息
 */
export async function pickIOSFile(type: string[] = ['audio/*', 'application/javascript']) {
  if (Platform.OS !== 'ios') {
    return null;
  }
  
  // 确保有文件访问权限
  const hasPermission = await ensureIOSPermission(IOSPermissionType.FILES);
  if (!hasPermission) {
    return null;
  }
  
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type,
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return null;
    }
    
    return result.assets[0];
  } catch (error) {
    console.error('选择文件失败', error);
    showToast('选择文件失败');
    return null;
  }
}

/**
 * 保存文件到iOS文档目录
 * @param uri 文件URI
 * @param fileName 文件名
 * @returns 保存后的文件路径
 */
export async function saveFileToIOSDocuments(uri: string, fileName: string) {
  if (Platform.OS !== 'ios') {
    return null;
  }
  
  // 确保有文件访问权限
  const hasPermission = await ensureIOSPermission(IOSPermissionType.FILES);
  if (!hasPermission) {
    return null;
  }
  
  try {
    const documentsPath = getIOSDocumentsPath();
    const destinationPath = `${documentsPath}${fileName}`;
    
    // 如果文件已存在，先删除
    const fileExists = await checkFileExists(destinationPath);
    if (fileExists) {
      await FileSystem.deleteAsync(destinationPath);
    }
    
    // 复制文件
    await FileSystem.copyAsync({
      from: uri,
      to: destinationPath,
    });
    
    return destinationPath;
  } catch (error) {
    console.error('保存文件失败', error);
    showToast('保存文件失败');
    return null;
  }
}

/**
 * 分享文件（iOS）
 * @param filePath 文件路径
 * @param title 分享标题
 * @returns 是否成功
 */
export async function shareIOSFile(filePath: string, title: string = '分享文件') {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    const options = {
      title,
      url: filePath.startsWith('file://') ? filePath : `file://${filePath}`,
    };
    
    await Share.open(options);
    return true;
  } catch (error) {
    console.error('分享文件失败', error);
    showToast('分享文件失败');
    return false;
  }
}

/**
 * 读取文件内容（iOS）
 * @param filePath 文件路径
 * @returns 文件内容
 */
export async function readIOSFileContent(filePath: string) {
  if (Platform.OS !== 'ios') {
    return null;
  }
  
  try {
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('读取文件内容失败', error);
    return null;
  }
}

/**
 * 写入文件内容（iOS）
 * @param filePath 文件路径
 * @param content 文件内容
 * @returns 是否成功
 */
export async function writeIOSFileContent(filePath: string, content: string) {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    await FileSystem.writeAsStringAsync(filePath, content);
    return true;
  } catch (error) {
    console.error('写入文件内容失败', error);
    return false;
  }
}