import {Platform} from 'react-native';
import TrackPlayer, {Event, State} from 'react-native-track-player';
import {showToast} from '@/utils/toast';
import {ensureIOSPermission, IOSPermissionType} from './iosPermissions';

/**
 * 初始化iOS音频播放器
 * @returns 是否成功
 */
export async function setupIOSAudioPlayer() {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    // 确保有媒体库权限
    const hasPermission = await ensureIOSPermission(IOSPermissionType.MEDIA_LIBRARY);
    if (!hasPermission) {
      return false;
    }
    
    // 设置播放器
    await TrackPlayer.setupPlayer({
      // iOS特定配置
      iosCategory: 'playback',
      iosCategoryOptions: ['allowAirPlay', 'allowBluetooth', 'allowBluetoothA2DP', 'mixWithOthers'],
      iosCapabilities: [
        'play',
        'pause',
        'stop',
        'skipToNext',
        'skipToPrevious',
        'seekTo',
        'seekForward',
        'seekBackward',
      ],
    });
    
    // 添加事件监听
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    
    return true;
  } catch (error) {
    console.error('初始化iOS音频播放器失败', error);
    return false;
  }
}

/**
 * 获取iOS音频播放状态
 * @returns 播放状态
 */
export async function getIOSPlaybackState() {
  if (Platform.OS !== 'ios') {
    return null;
  }
  
  try {
    const state = await TrackPlayer.getState();
    return state;
  } catch (error) {
    console.error('获取iOS音频播放状态失败', error);
    return null;
  }
}

/**
 * 检查iOS音频是否正在播放
 * @returns 是否正在播放
 */
export async function isIOSPlaying() {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    const state = await getIOSPlaybackState();
    return state === State.Playing;
  } catch (error) {
    console.error('检查iOS音频播放状态失败', error);
    return false;
  }
}

/**
 * 添加本地音频文件到播放队列（iOS）
 * @param filePath 文件路径
 * @param metadata 元数据
 * @returns 是否成功
 */
export async function addLocalAudioToQueue(filePath: string, metadata: any) {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    // 确保文件路径格式正确
    const formattedPath = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
    
    // 创建轨道对象
    const track = {
      url: formattedPath,
      title: metadata?.title || '未知标题',
      artist: metadata?.artist || '未知艺术家',
      album: metadata?.album || '未知专辑',
      artwork: metadata?.artwork || undefined,
      duration: metadata?.duration || 0,
    };
    
    // 添加到播放队列
    await TrackPlayer.add(track);
    return true;
  } catch (error) {
    console.error('添加本地音频到播放队列失败', error);
    showToast('添加音频到播放队列失败');
    return false;
  }
}

/**
 * 从URL添加音频到播放队列（iOS）
 * @param url 音频URL
 * @param metadata 元数据
 * @returns 是否成功
 */
export async function addStreamingAudioToQueue(url: string, metadata: any) {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    // 创建轨道对象
    const track = {
      url: url,
      title: metadata?.title || '未知标题',
      artist: metadata?.artist || '未知艺术家',
      album: metadata?.album || '未知专辑',
      artwork: metadata?.artwork || undefined,
      duration: metadata?.duration || 0,
    };
    
    // 添加到播放队列
    await TrackPlayer.add(track);
    return true;
  } catch (error) {
    console.error('添加流媒体音频到播放队列失败', error);
    showToast('添加音频到播放队列失败');
    return false;
  }
}

/**
 * 清空iOS播放队列
 * @returns 是否成功
 */
export async function clearIOSPlayQueue() {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    await TrackPlayer.reset();
    return true;
  } catch (error) {
    console.error('清空iOS播放队列失败', error);
    return false;
  }
}