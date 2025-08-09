import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system';

// 导入iOS特定工具
import {
  checkIOSPermission,
  requestIOSPermission,
  ensureIOSPermission,
  IOSPermissionType,
} from './iosPermissions';
import {
  getIOSDocumentsPath,
  getIOSCachePath,
  pickIOSFile,
  saveFileToIOSDocuments,
  shareIOSFile,
  readIOSFileContent,
  writeIOSFileContent,
} from './iosFileUtils';
import {
  setupIOSAudioPlayer,
  getIOSPlaybackState,
  isIOSPlaying,
  addLocalAudioToQueue,
  addStreamingAudioToQueue,
  clearIOSPlayQueue,
} from './iosAudioUtils';

// 导入Android特定工具（假设已存在）
import {checkPermission, requestPermission} from '../permissions/index';

/**
 * 检查权限（跨平台）
 * @param permission 权限名称
 * @returns 是否有权限
 */
export async function checkPlatformPermission(permission: string) {
  if (Platform.OS === 'ios') {
    // 映射权限名称到iOS权限类型
    let iosPermissionType: IOSPermissionType | null = null;
    
    switch (permission) {
      case 'android.permission.READ_EXTERNAL_STORAGE':
      case 'android.permission.WRITE_EXTERNAL_STORAGE':
        iosPermissionType = IOSPermissionType.FILES;
        break;
      case 'android.permission.RECORD_AUDIO':
        iosPermissionType = IOSPermissionType.MICROPHONE;
        break;
      default:
        return true; // 未知权限，默认返回true
    }
    
    return iosPermissionType ? await checkIOSPermission(iosPermissionType) : true;
  } else {
    // Android权限检查
    return await checkPermission(permission);
  }
}

/**
 * 请求权限（跨平台）
 * @param permission 权限名称
 * @returns 是否获取到权限
 */
export async function requestPlatformPermission(permission: string) {
  if (Platform.OS === 'ios') {
    // 映射权限名称到iOS权限类型
    let iosPermissionType: IOSPermissionType | null = null;
    
    switch (permission) {
      case 'android.permission.READ_EXTERNAL_STORAGE':
      case 'android.permission.WRITE_EXTERNAL_STORAGE':
        iosPermissionType = IOSPermissionType.FILES;
        break;
      case 'android.permission.RECORD_AUDIO':
        iosPermissionType = IOSPermissionType.MICROPHONE;
        break;
      default:
        return true; // 未知权限，默认返回true
    }
    
    return iosPermissionType ? await requestIOSPermission(iosPermissionType) : true;
  } else {
    // Android权限请求
    return await requestPermission(permission);
  }
}

/**
 * 获取文档目录路径（跨平台）
 * @returns 文档目录路径
 */
export function getDocumentsPath() {
  if (Platform.OS === 'ios') {
    return getIOSDocumentsPath();
  } else {
    // Android文档目录
    return FileSystem.documentDirectory || '';
  }
}

/**
 * 获取缓存目录路径（跨平台）
 * @returns 缓存目录路径
 */
export function getCachePath() {
  if (Platform.OS === 'ios') {
    return getIOSCachePath();
  } else {
    // Android缓存目录
    return FileSystem.cacheDirectory || '';
  }
}

/**
 * 初始化音频播放器（跨平台）
 * @returns 是否成功
 */
export async function setupAudioPlayer() {
  if (Platform.OS === 'ios') {
    return await setupIOSAudioPlayer();
  } else {
    // Android已经在其他地方初始化
    return true;
  }
}

/**
 * 添加本地音频到播放队列（跨平台）
 * @param filePath 文件路径
 * @param metadata 元数据
 * @returns 是否成功
 */
export async function addLocalAudioToPlatformQueue(filePath: string, metadata: any) {
  if (Platform.OS === 'ios') {
    return await addLocalAudioToQueue(filePath, metadata);
  } else {
    // 使用现有的Android方法
    // 这里假设Android方法已经存在
    // 实际实现时需要替换为真实的Android方法调用
    return true;
  }
}

/**
 * 添加流媒体音频到播放队列（跨平台）
 * @param url 音频URL
 * @param metadata 元数据
 * @returns 是否成功
 */
export async function addStreamingAudioToPlatformQueue(url: string, metadata: any) {
  if (Platform.OS === 'ios') {
    return await addStreamingAudioToQueue(url, metadata);
  } else {
    // 使用现有的Android方法
    // 这里假设Android方法已经存在
    // 实际实现时需要替换为真实的Android方法调用
    return true;
  }
}

/**
 * 分享文件（跨平台）
 * @param filePath 文件路径
 * @param title 分享标题
 * @returns 是否成功
 */
export async function sharePlatformFile(filePath: string, title: string = '分享文件') {
  if (Platform.OS === 'ios') {
    return await shareIOSFile(filePath, title);
  } else {
    // 使用现有的Android分享方法
    // 这里假设Android方法已经存在
    // 实际实现时需要替换为真实的Android方法调用
    return true;
  }
}