import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {showToast} from '@/utils/toast';

// iOS权限类型
export enum IOSPermissionType {
  PHOTO = 'photo',
  MICROPHONE = 'microphone',
  MEDIA_LIBRARY = 'mediaLibrary',
  FILES = 'files',
}

// 权限映射
const permissionMap = {
  [IOSPermissionType.PHOTO]: PERMISSIONS.IOS.PHOTO_LIBRARY,
  [IOSPermissionType.MICROPHONE]: PERMISSIONS.IOS.MICROPHONE,
  [IOSPermissionType.MEDIA_LIBRARY]: PERMISSIONS.IOS.MEDIA_LIBRARY,
  [IOSPermissionType.FILES]: PERMISSIONS.IOS.DOCUMENTS,
};

// 权限描述
const permissionDescMap = {
  [IOSPermissionType.PHOTO]: '照片库',
  [IOSPermissionType.MICROPHONE]: '麦克风',
  [IOSPermissionType.MEDIA_LIBRARY]: '媒体库',
  [IOSPermissionType.FILES]: '文件访问',
};

/**
 * 检查iOS权限
 * @param permissionType 权限类型
 * @returns 是否有权限
 */
export async function checkIOSPermission(permissionType: IOSPermissionType) {
  if (Platform.OS !== 'ios') {
    return true;
  }

  const permission = permissionMap[permissionType];
  if (!permission) {
    return false;
  }

  try {
    const result = await check(permission);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } catch (error) {
    console.error('权限检查失败', error);
    return false;
  }
}

/**
 * 请求iOS权限
 * @param permissionType 权限类型
 * @returns 是否获取到权限
 */
export async function requestIOSPermission(permissionType: IOSPermissionType) {
  if (Platform.OS !== 'ios') {
    return true;
  }

  const permission = permissionMap[permissionType];
  if (!permission) {
    return false;
  }

  try {
    const result = await request(permission);
    const granted = result === RESULTS.GRANTED || result === RESULTS.LIMITED;
    
    if (!granted) {
      showToast(`需要${permissionDescMap[permissionType]}权限才能使用此功能`);
    }
    
    return granted;
  } catch (error) {
    console.error('权限请求失败', error);
    showToast(`${permissionDescMap[permissionType]}权限请求失败`);
    return false;
  }
}

/**
 * 确保有指定的iOS权限，如果没有则请求
 * @param permissionType 权限类型
 * @returns 是否有权限
 */
export async function ensureIOSPermission(permissionType: IOSPermissionType) {
  if (Platform.OS !== 'ios') {
    return true;
  }
  
  const hasPermission = await checkIOSPermission(permissionType);
  if (hasPermission) {
    return true;
  }
  
  return await requestIOSPermission(permissionType);
}