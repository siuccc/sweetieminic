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
    // 创建背景遮罩
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(5px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // 创建日期选择器容器
    const container = document.createElement('div');
    container.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(220, 170, 255, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        text-align: center;
        max-width: 400px;
        width: 90%;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '选择日期查看情话 💕';
    title.style.cssText = `
        color: #d16ba5;
        margin: 0 0 20px 0;
        font-size: 1.2rem;
    `;
    
    // 创建快速选择按钮区域
    const quickSelectDiv = document.createElement('div');
    quickSelectDiv.style.cssText = `
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        border: 1px solid rgba(220, 170, 255, 0.3);
    `;
    
    const quickSelectTitle = document.createElement('p');
    quickSelectTitle.textContent = '最近更新的情话：';
    quickSelectTitle.style.cssText = `
        color: #d16ba5;
        font-size: 0.9rem;
        margin-bottom: 10px;
        font-weight: 500;
    `;
    
    const quickButtonsContainer = document.createElement('div');
    quickButtonsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
    `;
    
    // 动态检测已存在的页面 - 智能版本
    const getRecentPages = async () => {
        const today = new Date();
        const existingPages = [];
        
        // 生成最近30天的日期列表用于检测
        const datesToCheck = [];
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            datesToCheck.push(checkDate);
        }
        
        // 判断当前页面位置来决定检测路径
        const isInDaily = window.location.pathname.includes('/daily/');
        const basePath = isInDaily ? './' : 'daily/';
        
        // 并发检测页面是否存在
        const checkPromises = datesToCheck.map(async (date) => {
            const dateKey = formatDateKey(date);
            const url = `${basePath}${dateKey}.html`;
            
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    const isToday = formatDateKey(date) === formatDateKey(today);
                    const isSpecial = dateKey === '2025-08-05'; // 特殊标记8月5日
                    
                    return {
                        date: dateKey,
                        label: isToday ? `${date.getMonth() + 1}月${date.getDate()}日 (今天)` : 
                               isSpecial ? `${date.getMonth() + 1}月${date.getDate()}日 💕` :
                               `${date.getMonth() + 1}月${date.getDate()}日`,
                        dateObj: date,
                        isToday: isToday,
                        special: isSpecial,
                        sortDate: date.getTime()
                    };
                }
            } catch (error) {
                // 检测失败，页面不存在
                return null;
            }
            return null;
        });
        
        const results = await Promise.all(checkPromises);
        
        // 过滤出存在的页面，按日期降序排序，取前5个
        return results
            .filter(result => result !== null)
            .sort((a, b) => b.sortDate - a.sortDate)
            .slice(0, 5);
    };
    
    // 显示加载状态
    const loadingText = document.createElement('p');
    loadingText.textContent = '正在检测可用页面... 🔍';
    loadingText.style.cssText = `
        text-align: center;
        color: rgba(209, 107, 165, 0.7);
        font-size: 0.8rem;
        margin: 10px 0;
    `;
    quickButtonsContainer.appendChild(loadingText);
    
    // 异步加载页面列表
    getRecentPages().then(quickDates => {
        // 清除加载文字
        quickButtonsContainer.innerHTML = '';
        
        if (quickDates.length === 0) {
            const noDataText = document.createElement('p');
            noDataText.textContent = '暂无可查看的页面 😢';
            noDataText.style.cssText = `
                text-align: center;
                color: rgba(209, 107, 165, 0.5);
                font-size: 0.8rem;
                margin: 10px 0;
            `;
            quickButtonsContainer.appendChild(noDataText);
            return;
        }
        
        quickDates.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = item.label;
        
        // 特殊日期的样式
        const baseStyle = `
            padding: 6px 12px;
            color: #d16ba5;
            border: 1px solid rgba(240, 147, 251, 0.3);
            border-radius: 15px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        if (item.special || item.isToday) {
            btn.style.cssText = baseStyle + `
                background: linear-gradient(45deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2));
                border-color: rgba(240, 147, 251, 0.5);
                font-weight: 500;
            `;
        } else {
            btn.style.cssText = baseStyle + `
                background: rgba(240, 147, 251, 0.1);
            `;
        }
        
        btn.addEventListener('mouseenter', function() {
            if (item.special || item.isToday) {
                this.style.background = 'linear-gradient(45deg, rgba(240, 147, 251, 0.3), rgba(245, 87, 108, 0.3))';
            } else {
                this.style.background = 'rgba(240, 147, 251, 0.2)';
            }
            this.style.transform = 'translateY(-1px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (item.special || item.isToday) {
                this.style.background = 'linear-gradient(45deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2))';
            } else {
                this.style.background = 'rgba(240, 147, 251, 0.1)';
            }
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', function() {
            dateInput.value = item.date;
        });
        
        quickButtonsContainer.appendChild(btn);
    });
}).catch(error => {
    // 如果检测失败，使用默认列表
    quickButtonsContainer.innerHTML = '';
    const errorText = document.createElement('p');
    errorText.textContent = '检测失败，请手动选择日期 😅';
    errorText.style.cssText = `
        text-align: center;
        color: rgba(209, 107, 165, 0.5);
        font-size: 0.8rem;
        margin: 10px 0;
    `;
    quickButtonsContainer.appendChild(errorText);
});

quickSelectDiv.appendChild(quickSelectTitle);
quickSelectDiv.appendChild(quickButtonsContainer);
    
    // 创建日期输入框
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.cssText = `
        width: 100%;
        padding: 12px;
        border: 2px solid rgba(220, 170, 255, 0.3);
        border-radius: 10px;
        font-size: 1rem;
        color: #d16ba5;
        background: rgba(255, 255, 255, 0.8);
        margin-bottom: 20px;
        box-sizing: border-box;
    `;
    
    // 设置默认值为今天
    const today = new Date();
    dateInput.value = formatDateKey(today);
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
    `;
    
    // 创建确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '查看这天的话 💕';
    confirmBtn.style.cssText = `
        padding: 12px 24px;
        background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(220, 170, 255, 0.3);
    `;
    
    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
        padding: 12px 24px;
        background: rgba(150, 150, 150, 0.2);
        color: #666;
        border: 1px solid rgba(150, 150, 150, 0.3);
        border-radius: 25px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    // 添加悬停效果
    confirmBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(220, 170, 255, 0.4)';
    });
    
    confirmBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(220, 170, 255, 0.3)';
    });
    
    cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(150, 150, 150, 0.3)';
        this.style.transform = 'translateY(-1px)';
    });
    
    cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(150, 150, 150, 0.2)';
        this.style.transform = 'translateY(0)';
    });
    
    // 确认按钮事件
    confirmBtn.addEventListener('click', function() {
        if (dateInput.value) {
            const selectedDate = new Date(dateInput.value + 'T00:00:00');
            const dateKey = formatDateKey(selectedDate);
            
            // 判断当前页面位置来决定跳转路径
            const isInDaily = window.location.pathname.includes('/daily/');
            const basePath = isInDaily ? './' : 'daily/';
            const targetUrl = `${basePath}${dateKey}.html`;
            
            // 显示加载提示
            showMessage(`正在跳转到 ${selectedDate.toLocaleDateString('zh-CN')} 的页面...`);
            
            // 检查页面是否存在（简单检查）
            fetch(targetUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // 页面存在，跳转
                        setTimeout(() => {
                            window.location.href = targetUrl;
                        }, 800);
                    } else {
                        // 页面不存在，显示提示
                        setTimeout(() => {
                            showMessage(`😢 ${selectedDate.toLocaleDateString('zh-CN')} 还没有写情话哦，选择其他日期试试吧~`, 4000);
                        }, 800);
                    }
                })
                .catch(() => {
                    // 网络错误或页面不存在，直接尝试跳转
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 800);
                });
        }
        document.body.removeChild(overlay);
    });
    
    // 取消按钮事件
    cancelBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // 点击背景关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // ESC键关闭
    const handleEsc = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 组装元素
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    
    container.appendChild(title);
    container.appendChild(quickSelectDiv);
    container.appendChild(dateInput);
    container.appendChild(buttonContainer);
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    // 自动聚焦到日期输入框
    setTimeout(() => {
        dateInput.focus();
    }, 100);
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
