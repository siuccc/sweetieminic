// 主页专用JavaScript - 音频播放控制和主页特有功能

// 音频播放控制
let audio = null;
let isPlaying = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    audio = document.getElementById('loveAudio');
    
    // 初始化今日日期显示
    initializeDateDisplay();
    
    // 初始化音频播放器
    initializeAudioPlayer('loveAudio', 'audio/split.mp3');
    
    // 重写音频事件回调
    onAudioPlay = function() {
        isPlaying = true;
        updateButtonState(true);
    };
    
    onAudioPause = function() {
        isPlaying = false;
        updateButtonState(false);
    };
    
    onAudioError = function() {
        showMessage('音频文件暂时无法播放，请稍后再试 💕');
        resetButton();
    };
    
    // 为页面添加一些互动效果
    addInteractiveEffects();
});

// 更新按钮状态
function updateButtonState(playing) {
    const playBtn = document.getElementById('playBtn');
    const btnText = playBtn.querySelector('.btn-text');
    const btnIcon = playBtn.querySelector('.btn-icon');
    
    if (playing) {
        btnText.textContent = '音乐播放中...';
        btnIcon.textContent = '🎶';
        playBtn.classList.add('playing');
    } else {
        btnText.textContent = '';
        btnIcon.textContent = '🎵';
        playBtn.classList.remove('playing');
    }
}

// 重置按钮状态
function resetButton() {
    isPlaying = false;
    updateButtonState(false);
}

// 切换音频播放状态
function toggleAudio() {
    // 调用音频模块的切换函数
    window.toggleAudio(); 
}

// 添加互动效果
function addInteractiveEffects() {
    // 为甜蜜消息添加点击效果
    const sweetMessage = document.querySelector('.sweet-message');
    if (sweetMessage) {
        // 添加鼠标样式提示可点击
        sweetMessage.style.cursor = 'pointer';
        sweetMessage.style.transition = 'all 0.3s ease';
        
        // 鼠标悬停效果
        sweetMessage.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 12px 40px rgba(220, 170, 255, 0.35)';
            this.style.background = 'rgba(255, 255, 255, 0.9)';
        });
        
        // 鼠标离开效果
        sweetMessage.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 32px rgba(220, 170, 255, 0.2)';
            this.style.background = 'rgba(255, 255, 255, 0.8)';
        });
        
        // 点击效果
        sweetMessage.addEventListener('click', function() {
            this.style.transform = 'scale(1.02) translateY(-3px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px)';
            }, 200);
            
            // 随机显示甜蜜话语
            const sweetWords = [
                '炸鸡腿想你了 💕',
                '每天都要开心哦 🌸',
                '你是最可爱的minic 🥰',
                '永远爱你 💖',
                '今天也要做可爱的事情 ✨',
                '炸鸡腿超级超级喜欢你哦 🍗',
                '好想见面好想见面 💞',
                '每一天都要甜甜的 💗',
                '你是我的小甜心 🍭',
                '姐姐姐姐亲亲💋',
                '姐姐姐姐抱抱🤗',
                '炸鸡腿永远爱你哦 💖',
                '炸鸡腿会一直陪着你哦 🌟',
                '炸鸡腿不会不要你的哦😘',
                '好想你好想你💕',
            ];
            const randomWord = sweetWords[Math.floor(Math.random() * sweetWords.length)];
            showMessage(randomWord);
        });
    }
    
    // 为图片添加点击效果
    const cuteImage = document.querySelector('.cute-image');
    if (cuteImage) {
        cuteImage.addEventListener('click', function(event) {
            // 创建爱心特效
            createHeartEffect(event.clientX, event.clientY);
        });
    }
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            toggleAudio();
        }
    });
}

// 欢迎消息
window.addEventListener('load', function() {
    setTimeout(() => {
        showMessage('欢迎来到minic的甜蜜小站！💕');
    }, 1000);
});
