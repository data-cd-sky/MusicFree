import {Platform} from 'react-native';
import {initializeIOSServices, handleIOSAppResume, handleIOSAppBackground} from './iosServices';

/**
 * iOS模块入口
 * 导出所有iOS特定的功能和服务
 */

// 导出iOS服务初始化函数
export {initializeIOSServices, handleIOSAppResume, handleIOSAppBackground} from './iosServices';

/**
 * 初始化iOS模块
 * 在应用启动时调用此函数以初始化所有iOS特定的功能
 */
export async function initializeIOSModule() {
  // 仅在iOS平台执行
  if (Platform.OS !== 'ios') {
    return;
  }
  
  console.log('初始化iOS模块...');
  
  try {
    // 初始化iOS服务
    await initializeIOSServices();
    
    // 注册应用生命周期事件监听器
    const appStateSubscription = registerIOSAppStateListeners();
    
    console.log('iOS模块初始化完成');
    
    // 返回清理函数，以便在需要时可以移除监听器
    return () => {
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  } catch (error) {
    console.error('iOS模块初始化失败', error);
  }
}

/**
 * 注册iOS应用生命周期事件监听器
 */
export function registerIOSAppStateListeners() {
  // 仅在iOS平台执行
  if (Platform.OS !== 'ios') {
    return;
  }
  
  // 使用AppState来监听应用状态变化
  const {AppState} = require('react-native');
  
  // 返回事件订阅，以便在需要时可以移除监听器
  return AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      handleIOSAppResume();
    } else if (nextAppState === 'background') {
      handleIOSAppBackground();
    }
  });
}