// 配置
const CONFIG = {
    maxHistoryItems: 20
};

// API配置
const API_CONFIG = {
    // 替换为你的API Key和Secret Key
    API_KEY: 'GBjgXSot6OHyg5kFBEDvvP7T',
    SECRET_KEY: 'q8WKeLToVIev7znNE0tl1ciIUfIDo3BJ',
    // API接口地址改为本地代理服务器地址
    AUTH_URL: 'http://localhost:3001/api/token',
    PLANT_DETECT_URL: 'http://localhost:3001/api/identify'
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initRecognitionTabs();
    initCamera();
    initUpload();
    loadHistory();
});

/**
 * 初始化识别方式切换
 */
function initRecognitionTabs() {
    const tabs = document.querySelectorAll('.recognition-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 切换显示内容
            const mode = tab.dataset.mode;
            document.querySelectorAll('.recognition-mode').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${mode}Mode`).classList.add('active');

            // 如果切换到摄像头模式，确保摄像头已初始化
            if (mode === 'camera') {
                initCamera();
            }
        });
    });
}

/**
 * 初始化摄像头
 */
async function initCamera() {
    const video = document.getElementById('arVideo');
    // 如果已经初始化过，直接返回
    if (video.srcObject) return;

    try {
        // 优先使用后置摄像头
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });

        video.srcObject = stream;
        await video.play();

        // 设置初始视频样式
        const facingMode = stream.getVideoTracks()[0].getSettings().facingMode;
        video.style.transform = facingMode === 'user' ? 'scaleX(-1)' : 'none';

        // 添加拍照按钮事件
        document.getElementById('captureBtn').addEventListener('click', captureImage);
        document.getElementById('switchCameraBtn').addEventListener('click', switchCamera);

    } catch (error) {
        console.error('摄像头初始化失败:', error);
        if (error.name === 'NotAllowedError') {
            showError('请允许访问摄像头以使用拍照识别功能');
        } else if (error.name === 'NotFoundError') {
            showError('未检测到摄像头设备');
        } else {
            showError('摄像头初始化失败，请检查设备');
        }
    }
}

/**
 * 初始化上传功能
 */
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const recognizeBtn = document.getElementById('recognizeBtn');

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleImageFile(e.dataTransfer.files[0]);
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        handleImageFile(e.target.files[0]);
    });

    // 识别按钮点击事件
    recognizeBtn.addEventListener('click', () => {
        const imageData = document.getElementById('previewImage').src;
        startRecognition(imageData);
    });
}

/**
 * 处理图片文件
 */
function handleImageFile(file) {
    if (!file || !isValidImage(file)) {
        showError('请上传有效的图片文件（jpg/png，不超过5MB）');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImage = document.getElementById('previewImage');
        const placeholder = document.getElementById('uploadPlaceholder');
        const recognizeBtn = document.getElementById('recognizeBtn');

        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        placeholder.style.display = 'none';
        recognizeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

/**
 * 开始识别
 */
async function startRecognition(imageData) {
    showLoading('正在识别...');
    try {
        const result = await recognizeHerb(imageData);
        displayResult(result);
        saveToHistory(result, imageData);

        // 自动滚动到结果区域
        document.getElementById('resultSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } catch (error) {
        console.error('识别失败:', error);
        showError('识别失败，请重试');
    } finally {
        hideLoading();
    }
}

/**
 * 拍照识别
 */
async function captureImage() {
    try {
        const video = document.getElementById('arVideo');
        const canvas = document.createElement('canvas');

        // 设置canvas尺寸与视频一致
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 将视频帧绘制到canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // 获取图片数据
        const imageData = canvas.toDataURL('image/jpeg', 0.8);

        // 显示加载动画
        showLoading('正在识别...');

        // 获取base64图片数据（去掉前缀）
        const base64Image = imageData.split(',')[1];

        // 获取access token
        const accessToken = await getAccessToken();

        // 调用识别API
        const apiResult = await identifyHerb(base64Image, accessToken);
        console.log('API识别结果:', apiResult);

        // 处理识别结果并显示
        const processedResults = processResult(apiResult);

        // 保存到历史记录
        saveToHistory(apiResult, imageData);

        // 显示结果区域并滚动
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('拍照识别失败:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

/**
 * 切换摄像头
 */
async function switchCamera() {
    try {
        const video = document.getElementById('arVideo');
        const stream = video.srcObject;

        // 如果当前没有视频流,直接返回
        if (!stream) return;

        // 获取当前摄像头朝向
        const currentFacingMode = stream.getVideoTracks()[0].getSettings().facingMode;
        const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';

        // 尝试获取新的视频流
        let newStream;
        try {
            newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: newFacingMode }, // 先尝试强制切换
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
        } catch (error) {
            if (error.name === 'OverconstrainedError') {
                // 设备可能只有一个摄像头
                showError('您的设备可能只有一个摄像头，无法切换');
                return; // 直接返回，保持当前摄像头
            } else {
                throw error; // 其他错误则抛出
            }
        }

        // 只有在成功获取新流后才停止旧流
        stream.getTracks().forEach(track => track.stop());

        // 更新视频源
        video.srcObject = newStream;
        await video.play();

        // 更新视频样式
        video.style.transform = newFacingMode === 'user' ? 'scaleX(-1)' : 'none';

        // 更新按钮图标
        const switchBtn = document.getElementById('switchCameraBtn');
        switchBtn.querySelector('.icon').textContent = newFacingMode === 'environment' ? '📱' : '🔄';

    } catch (error) {
        console.error('切换摄像头失败:', error);
        // 如果切换失败，尝试恢复原来的摄像头
        try {
            const currentFacingMode = stream.getVideoTracks()[0].getSettings().facingMode;
            const fallbackStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: currentFacingMode },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            video.srcObject = fallbackStream;
            await video.play();

            // 根据错误类型显示不同提示
            if (error.name === 'NotAllowedError') {
                showError('无法切换摄像头，请检查权限设置');
            } else if (error.name === 'NotFoundError') {
                showError('未找到可用的摄像头设备');
            } else {
                showError('切换摄像头失败，已恢复原摄像头');
            }
        } catch (fallbackError) {
            console.error('恢复摄像头失败:', fallbackError);
            showError('摄像头出现问题，请刷新页面重试');
        }
    }
}

/**
 * 显示识别结果
 */
function displayResult(result) {
    const resultSection = document.getElementById('resultSection');
    const herbName = document.getElementById('herbName');
    const confidence = document.getElementById('confidence');
    const herbDetail = document.getElementById('herbDetail');

    // 更新结果内容
    herbName.textContent = result.name;
    confidence.textContent = `${(result.confidence * 100).toFixed(1)}%`;

    // 更新药材详情
    herbDetail.innerHTML = `
        <div class="herb-properties">
            <p><strong>性味：</strong>${result.details.nature}，${result.details.taste}</p>
            <p><strong>归经：</strong>${result.details.meridian}</p>
            <p><strong>功效：</strong>${result.details.effect}</p>
            <p><strong>用法：</strong>${result.details.usage}</p>
            ${result.details.precautions ?
            `<p class="warning"><strong>注意：</strong>${result.details.precautions}</p>` : ''}
        </div>
    `;

    // 显示结果区域
    resultSection.style.display = 'block';

    // 添加动画效果
    resultSection.classList.add('animate-in');
}

/**
 * 显示错误提示
 */
function showError(message) {
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.textContent = message;

    document.body.appendChild(errorToast);

    // 3秒后自动消失
    setTimeout(() => {
        errorToast.classList.add('fade-out');
        setTimeout(() => errorToast.remove(), 300);
    }, 3000);
}

// 工具函数
function showLoading(message) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.querySelector('p').textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;

    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 验证图片文件
 */
function isValidImage(file) {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * 调用识别API
 */
async function recognizeHerb(imageData) {
    // 这里模拟识别过程，实际项目中应该调用后端API
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomHerb = herbsData[Math.floor(Math.random() * herbsData.length)];
            resolve({
                name: randomHerb.name,
                confidence: 0.8 + Math.random() * 0.2,
                details: {
                    nature: randomHerb.nature,
                    taste: randomHerb.taste,
                    meridian: randomHerb.meridian,
                    effect: randomHerb.effect,
                    usage: randomHerb.usage,
                    precautions: randomHerb.precautions
                }
            });
        }, 1500);
    });
}

/**
 * 加载历史记录
 */
function loadHistory() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const history = JSON.parse(localStorage.getItem(`arHistory_${currentUser.id}`) || '[]');
    const historyList = document.getElementById('historyList');

    if (!historyList) return;

    // 清空现有历史记录
    historyList.innerHTML = '';

    if (!Array.isArray(history) || history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">暂无识别记录</div>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => {
        try {
            const results = Array.isArray(item.results) ? item.results : [];

            // 生成历史记录中的识别结果HTML
            const resultsHtml = results.map(result => {
                if (!result) return '';
                return `
                    <div class="history-result">
                        <h4>${result.name || '未知植物'}</h4>
                        <p>可信度：${((result.score || 0) * 100).toFixed(2)}%</p>
                    </div>
                `;
            }).join('');

            // 返回完整的历史记录卡片HTML
            return `
                <div class="history-card" onclick="toggleHistoryCard(this)" data-index="${index}">
                    ${item.image ? `
                        <div class="history-image">
                            <img src="${item.image}" alt="识别图片" onerror="this.src='assets/icons/placeholder.svg'">
                        </div>
                    ` : ''}
                    <div class="history-info">
                        ${resultsHtml || '<p>无识别结果</p>'}
                        <p class="history-time">识别时间：${formatTime(item.timestamp)}</p>
                        <p class="expand-hint">点击查看更多结果</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('处理历史记录项时出错:', error);
            return '';
        }
    }).filter(Boolean).join('');
}

/**
 * 切换历史记录卡片展开状态
 */
function toggleHistoryCard(card) {
    const index = card.dataset.index;
    const history = JSON.parse(localStorage.getItem(`arHistory_${getCurrentUser().id}`) || '[]');
    const item = history[index];

    if (!item) return;

    // 显示模态框
    const modal = document.getElementById('historyModal');
    const detailContainer = document.getElementById('historyDetail');

    // 生成详细内容
    let detailHtml = `
        <div class="history-image-full">
            <img src="${item.image}" alt="识别图片" onerror="this.src='assets/icons/placeholder.svg'">
        </div>
        <div class="confidence-card">
            <h3 class="confidence-title">识别结果分析</h3>
            <div class="confidence-content">
                ${item.results.map(result => {
        // 计算可信度文字描述和图标
        let confidenceText = '可信度较低';
        let confidenceIcon = '🤔';
        let score = (result.score * 100).toFixed(1);

        if (score > 80) {
            confidenceText = '可信度很高';
            confidenceIcon = '✨';
        } else if (score > 60) {
            confidenceText = '可信度较高';
            confidenceIcon = '👍';
        } else if (score > 40) {
            confidenceText = '可信度一般';
            confidenceIcon = '🤔';
        }

        // 获取药材描述
        const herbInfo = getHerbDescription(result.name);

        return `
                        <div class="result-container">
                            <div class="confidence-item">
                                <span class="herb-icon">${confidenceIcon}</span>
                                <div class="confidence-info">
                                    <div class="confidence-name">${result.name || '未知植物'}</div>
                                    <div class="confidence-value">
                                        ${confidenceText}（${score}%）
                                    </div>
                                </div>
                            </div>
                            ${herbInfo ? `
                                <div class="herb-description">
                                    <div class="herb-name">药材简介</div>
                                    <p class="description-text">${herbInfo}</p>
                                </div>
                            ` : ''}
                        </div>
                    `;
    }).join('')}
            </div>
            <div class="confidence-explanation">
                <h4 class="explanation-title">识别说明</h4>
                <div class="explanation-text">
                    <p>• 可信度很高（>80%）：系统非常确信这是正确的识别结果</p>
                    <p>• 可信度较高（60-80%）：系统比较确信，但建议进一步确认</p>
                    <p>• 可信度一般（40-60%）：系统不太确定，请谨慎参考</p>
                    <p>• 可信度较低（<40%）：仅供参考，建议重新拍摄或咨询专业人士</p>
                </div>
            </div>
        </div>
        <p class="history-time">识别时间：${formatTime(item.timestamp)}</p>
    `;

    detailContainer.innerHTML = detailHtml;
    modal.classList.add('active');

    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

/**
 * 获取药材描述信息
 */
function getHerbDescription(herbName) {
    // 这里可以从数据库或配置文件中获取药材描述
    const herbDescriptions = {
        '香蕉': '香蕉是一种常见的水果，富含钾、维生素B6和膳食纤维。在中医理论中，香蕉性寒，味甘，具有润肠通便、清热降火的功效。',
        '芭蕉': '芭蕉是芭蕉科芭蕉属植物，其叶片可用于包裹食物，果实可食用。在传统医学中，芭蕉的茎、叶都可入药，具有清热利湿的功效。',
        '大蕉': '大蕉是芭蕉科植物，果实较普通香蕉个头更大，口感偏面，多用于烹饪。在民间医学中，大蕉有助于消化，可用于治疗胃部不适。'
        // 可以继续添加更多药材的描述
    };

    return herbDescriptions[herbName] || null;
}

/**
 * 关闭历史记录详情模态框
 */
function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.remove('active');

    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 点击模态框背景关闭
document.getElementById('historyModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeHistoryModal();
    }
});

/**
 * 保存到历史记录
 */
function saveToHistory(apiResult, imageData) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const history = JSON.parse(localStorage.getItem(`arHistory_${currentUser.id}`) || '[]');

        // 确保有识别结果
        if (!apiResult || !apiResult.result) {
            console.error('无有效的识别结果');
            return;
        }

        // 确保结果是数组
        const results = Array.isArray(apiResult.result) ? apiResult.result : [apiResult.result];

        // 创建新的历史记录项
        const historyItem = {
            results: results.map(result => ({
                name: result.name || '未知植物',
                score: result.score || 0,
                timestamp: new Date().toISOString()
            })),
            image: imageData,
            timestamp: new Date().toISOString()
        };

        // 添加到历史记录开头
        history.unshift(historyItem);

        // 限制历史记录数量
        if (history.length > CONFIG.maxHistoryItems) {
            history.pop();
        }

        // 保存到localStorage
        localStorage.setItem(`arHistory_${currentUser.id}`, JSON.stringify(history));

        // 刷新历史记录显示
        loadHistory();
    } catch (error) {
        console.error('保存历史记录失败:', error);
    }
}

/**
 * 重置识别
 */
function resetRecognition() {
    const previewImage = document.getElementById('previewImage');
    const placeholder = document.getElementById('uploadPlaceholder');
    const recognizeBtn = document.getElementById('recognizeBtn');
    const resultSection = document.getElementById('resultSection');

    previewImage.style.display = 'none';
    placeholder.style.display = 'block';
    recognizeBtn.disabled = true;
    resultSection.style.display = 'none';

    // 清空文件输入
    document.getElementById('imageInput').value = '';

    placeholder.innerHTML = `
        <img src="assets/icons/upload.svg" alt="上传图片" class="upload-icon">
        <p>点击或拖拽图片到此处</p>
    `;
}

// 获取access token
async function getAccessToken() {
    try {
        const response = await fetch(API_CONFIG.AUTH_URL);
        const result = await response.json();
        return result.access_token;
    } catch (error) {
        console.error('获取token失败:', error);
        throw new Error('获取访问令牌失败');
    }
}

// 图像预处理
function preprocessImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // 获取base64编码
            const base64Image = e.target.result.split(',')[1];
            resolve(base64Image);
        };
        reader.onerror = () => reject(new Error('图片处理失败'));
        reader.readAsDataURL(file);
    });
}

// 识别药材
async function identifyHerb(base64Image, accessToken) {
    try {
        const response = await fetch(API_CONFIG.PLANT_DETECT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image,
                access_token: accessToken
            })
        });

        const result = await response.json();
        console.log('API返回的原始结果:', result);

        if (result.error) {
            throw new Error(result.error);
        }

        // 直接返回API结果，不进行处理
        return result;
    } catch (error) {
        console.error('识别失败:', error);
        throw new Error('药材识别失败: ' + error.message);
    }
}

// 处理识别结果
function processResult(result) {
    console.log('处理前的结果:', result);

    if (!result || !result.result) {
        throw new Error('未能识别到药材');
    }

    // 确保返回数组格式
    const results = Array.isArray(result.result) ? result.result : [result.result];

    if (results.length === 0) {
        throw new Error('未能识别到药材');
    }

    // 提取识别结果并显示在结果区域
    const resultSection = document.getElementById('resultSection');
    const herbName = document.getElementById('herbName');
    const confidence = document.getElementById('confidence');
    const herbDetail = document.getElementById('herbDetail');

    // 获取最可能的结果
    const bestMatch = results[0];

    // 更新UI - 显示最佳匹配
    herbName.textContent = bestMatch.name || '未知植物';
    confidence.textContent = ((bestMatch.score || 0) * 100).toFixed(2) + '%';

    // 构建所有可能结果的HTML
    let detailHtml = '<div class="possible-matches">';
    detailHtml += '<h4>可能的识别结果：</h4>';

    // 遍历所有结果
    results.forEach((item, index) => {
        detailHtml += `
            <div class="match-item ${index === 0 ? 'best-match' : ''}">
                <div class="match-header">
                    <h5>${item.name}</h5>
                    <span class="confidence-score">可信度: ${(item.score * 100).toFixed(2)}%</span>
                </div>
                ${item.baike_info ? `
                    <div class="match-details">
                        <p>${item.baike_info.description || '暂无描述'}</p>
                        ${item.baike_info.image_url ? `
                            <img src="${item.baike_info.image_url}" alt="${item.name}" class="result-image">
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    });

    detailHtml += '</div>';
    herbDetail.innerHTML = detailHtml;
    resultSection.style.display = 'block';

    return results;
}

// 主处理函数
async function handleImage(file) {
    try {
        showLoading('正在识别...');

        // 获取access token
        const accessToken = await getAccessToken();

        // 预处理图片
        const base64Image = await preprocessImage(file);

        // 识别药材
        const results = await identifyHerb(base64Image, accessToken);
        console.log('识别结果:', results);

        // 显示结果
        displayResult(results);

        // 隐藏加载状态
        hideLoading();

        // 滚动到结果区域
        document.getElementById('resultSection').scrollIntoView({
            behavior: 'smooth'
        });
    } catch (error) {
        console.error('处理失败:', error);
        showError(error.message);
        hideLoading();
    }
} 