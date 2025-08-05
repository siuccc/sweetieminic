// 通用JavaScript功能 - 所有页面共享

// 通用消息显示函数
function showMessage(message, duration = 3000) {
    // 创建提示框
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        color: #d16ba5;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(220, 170, 255, 0.3);
        z-index: 1000;
        font-size: 1rem;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        animation: slideDown 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 指定时间后自动移除
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, duration);
}

// 创建爱心特效
function createHeartEffect(x, y) {
    const heart = document.createElement('div');
    heart.textContent = '💕';
    heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        animation: heartFloat 2s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    
    // 2秒后移除
    setTimeout(() => {
        if (document.body.contains(heart)) {
            document.body.removeChild(heart);
        }
    }, 2000);
}

// 格式化日期为文件名键值
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 通用日期显示初始化
function initializeDateDisplay() {
    const today = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateString = today.toLocaleDateString('zh-CN', options);
    
    const todayDateElement = document.getElementById('todayDate');
    if (todayDateElement) {
        todayDateElement.textContent = dateString;
    }
}

// 显示日期选择器
function showDatePicker() {
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
    `;
    
    dateInput.addEventListener('change', function() {
        if (this.value) {
            const selectedDate = new Date(this.value + 'T00:00:00');
            const dateKey = formatDateKey(selectedDate);
            // 判断当前页面位置来决定跳转路径
            const isInDaily = window.location.pathname.includes('/daily/');
            const basePath = isInDaily ? './' : 'daily/';
            window.location.href = `${basePath}${dateKey}.html`;
        }
        document.body.removeChild(this);
    });
    
    document.body.appendChild(dateInput);
    dateInput.showPicker();
}

// 跳转到今日页面
function goToTodayPage() {
    const today = new Date();
    const dateKey = formatDateKey(today);
    // 判断当前页面位置来决定跳转路径
    const isInDaily = window.location.pathname.includes('/daily/');
    const basePath = isInDaily ? './' : 'daily/';
    window.location.href = `${basePath}${dateKey}.html`;
}

// 返回主页
function goBack() {
    window.location.href = '../index.html';
}
