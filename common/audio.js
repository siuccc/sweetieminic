// 音频播放控制模块 - 所有页面共享

let audioPlayer = null;
let isAudioPlaying = false;

// 音频播放器配置
const AUDIO_CONFIG = {
    volume: 0.7,
    loop: true,
    autoplay: true
};

// 初始化音频播放器
function initializeAudioPlayer(audioElementId, audioSrc) {
    // 创建或获取音频元素
    let audioElement = document.getElementById(audioElementId);
    
    if (!audioElement) {
        // 如果不存在，创建音频元素
        audioElement = document.createElement('audio');
        audioElement.id = audioElementId;
        audioElement.preload = 'auto';
        audioElement.loop = AUDIO_CONFIG.loop;
        
        // 添加音频源
        const source = document.createElement('source');
        source.src = audioSrc;
        source.type = 'audio/mpeg';
        audioElement.appendChild(source);
        
        // 添加到页面
        document.body.appendChild(audioElement);
    }
    
    audioPlayer = audioElement;
    
    // 设置音频属性
    audioPlayer.volume = AUDIO_CONFIG.volume;
    
    // 添加事件监听器
    setupAudioEventListeners();
    
    // 尝试自动播放
    if (AUDIO_CONFIG.autoplay) {
        attemptAutoplay();
    }
    
    // 添加用户交互监听器
    addUserInteractionListeners();
    
    return audioPlayer;
}

// 设置音频事件监听器
function setupAudioEventListeners() {
    if (!audioPlayer) return;
    
    audioPlayer.addEventListener('play', function() {
        isAudioPlaying = true;
        onAudioPlay();
    });
    
    audioPlayer.addEventListener('pause', function() {
        isAudioPlaying = false;
        onAudioPause();
    });
    
    audioPlayer.addEventListener('error', function() {
        console.log('音频播放出错');
        onAudioError();
    });
}

// 尝试自动播放音频
function attemptAutoplay() {
    if (!audioPlayer) return;
    
    const playPromise = audioPlayer.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // 自动播放成功
            isAudioPlaying = true;
            onAutoplaySuccess();
        }).catch((error) => {
            // 自动播放失败（通常是浏览器政策限制）
            console.log('自动播放失败:', error);
            isAudioPlaying = false;
            onAutoplayFailed();
        });
    }
}

// 添加用户交互监听器，在用户首次交互时尝试播放音频
function addUserInteractionListeners() {
    let hasInteracted = false;
    
    const startAudioOnInteraction = () => {
        if (!hasInteracted && !isAudioPlaying && audioPlayer) {
            hasInteracted = true;
            const playPromise = audioPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isAudioPlaying = true;
                    onUserInteractionPlay();
                }).catch((error) => {
                    console.log('用户交互播放失败:', error);
                });
            }
            
            // 移除事件监听器
            removeInteractionListeners();
        }
    };
    
    // 监听各种用户交互
    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);
    document.addEventListener('keydown', startAudioOnInteraction);
    
    // 保存引用以便后续移除
    window.audioInteractionHandler = startAudioOnInteraction;
}

// 移除用户交互监听器
function removeInteractionListeners() {
    if (window.audioInteractionHandler) {
        document.removeEventListener('click', window.audioInteractionHandler);
        document.removeEventListener('touchstart', window.audioInteractionHandler);
        document.removeEventListener('keydown', window.audioInteractionHandler);
        window.audioInteractionHandler = null;
    }
}

// 手动切换音频播放状态
function toggleAudio() {
    if (!audioPlayer) return;
    
    if (!isAudioPlaying) {
        // 开始播放
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isAudioPlaying = true;
                onManualPlay();
            }).catch((error) => {
                console.log('手动播放失败:', error);
                onPlayError();
            });
        }
    } else {
        // 暂停播放
        audioPlayer.pause();
        isAudioPlaying = false;
        onManualPause();
    }
}

// 获取音频播放状态
function getAudioStatus() {
    return {
        isPlaying: isAudioPlaying,
        volume: audioPlayer ? audioPlayer.volume : 0,
        currentTime: audioPlayer ? audioPlayer.currentTime : 0,
        duration: audioPlayer ? audioPlayer.duration : 0
    };
}

// 设置音频音量
function setAudioVolume(volume) {
    if (audioPlayer && volume >= 0 && volume <= 1) {
        audioPlayer.volume = volume;
        AUDIO_CONFIG.volume = volume;
    }
}

// 事件回调函数（可以被外部重写）
function onAudioPlay() {
    // 音频开始播放时的回调
}

function onAudioPause() {
    // 音频暂停时的回调
}

function onAudioError() {
    // 音频出错时的回调
}

function onAutoplaySuccess() {
    // 自动播放成功时的回调
}

function onAutoplayFailed() {
    // 自动播放失败时的回调
}

function onUserInteractionPlay() {
    // 用户交互后开始播放时的回调
}

function onManualPlay() {
    // 手动播放时的回调
}

function onManualPause() {
    // 手动暂停时的回调
}

function onPlayError() {
    // 播放出错时的回调
}
