// 每日情话页面专用脚本

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    // 每分钟更新一次时间
    setInterval(updateCurrentTime, 60000);
});

// 更新当前时间显示
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = `${timeString} 写给你`;
    }
}

// 页面加载完成后的欢迎消息
window.addEventListener('load', function() {
    setTimeout(() => {
        showMessage('💕 这是炸鸡腿今天想对你说的话');
    }, 1000);
});
