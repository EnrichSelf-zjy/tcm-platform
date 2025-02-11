/**
 * 渲染待审投稿列表
 */
function renderSubmissions() {
    const container = document.getElementById('submissionList');
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

    container.innerHTML = submissions
        .filter(s => s.status === 'pending')
        .map(sub => `
            <div class="submission-card">
                <h3>${sub.name}</h3>
                <div class="composition">
                    ${Object.entries(sub.composition).map(([k, v]) => `
                        <p>${k}: ${v}</p>
                    `).join('')}
                </div>
                <div class="actions">
                    <button onclick="approveSubmission(${sub.id})">✅ 通过</button>
                    <button onclick="rejectSubmission(${sub.id})">❌ 拒绝</button>
                </div>
                <p class="meta">投稿时间：${new Date(sub.submitDate).toLocaleString()}</p>
            </div>
        `).join('');
}

let currentReviewId = null;

/**
 * 审核通过投稿
 */
function approveSubmission(id) {
    currentReviewId = id;
    document.getElementById('reviewDialog').style.display = 'flex';
}

/**
 * 拒绝投稿
 */
function rejectSubmission(id) {
    currentReviewId = id;
    document.getElementById('reviewDialog').style.display = 'flex';
}

function submitReview() {
    const comment = document.getElementById('reviewComment').value;
    const status = currentReviewId ?
        (confirm('是否通过该投稿？') ? 'approved' : 'rejected') : '';

    if (status) {
        updateSubmissionStatus(currentReviewId, status, comment);
    }
    cancelReview();
}

function cancelReview() {
    document.getElementById('reviewDialog').style.display = 'none';
    currentReviewId = null;
    document.getElementById('reviewComment').value = '';
}

function updateSubmissionStatus(id, status, comment = '') {
    const submissions = JSON.parse(localStorage.getItem('submissions'));
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
        submissions[index] = {
            ...submissions[index],
            status,
            reviewDate: new Date().toISOString(),
            reviewer: 'admin', // 模拟审核人
            comment
        };
        localStorage.setItem('submissions', JSON.stringify(submissions));
        renderSubmissions();
    }
}

// 初始化页面
window.onload = renderSubmissions;

// 在admin.js中添加切换选项卡功能
function showHistory() {
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const container = document.getElementById('submissionList');

    container.innerHTML = submissions
        .filter(s => s.status !== 'pending')
        .map(sub => `
            <div class="submission-card ${sub.status}">
                <h3>${sub.name} (${sub.status === 'approved' ? '✅ 已通过' : '❌ 已拒绝'})</h3>
                <div class="meta-info">
                    <p>投稿人：匿名用户</p>
                    <p>投稿时间：${new Date(sub.submitDate).toLocaleString()}</p>
                    <p>审核时间：${new Date(sub.reviewDate).toLocaleString()}</p>
                    ${sub.comment ? `<p>审核意见：${sub.comment}</p>` : ''}
                </div>
                <div class="composition">
                    ${Object.entries(sub.composition).map(([k, v]) => `
                        <p>${k}: ${v}</p>
                    `).join('')}
                </div>
            </div>
        `).join('');
}

/**
 * 渲染待处理举报
 */
function renderReports() {
    const reports = JSON.parse(localStorage.getItem('postReports')) || [];
    const container = document.getElementById('reportList');

    container.innerHTML = reports
        .filter(r => r.status === 'pending')
        .map(report => `
            <div class="report-card">
                <h4>举报ID：${report.postId}</h4>
                <p>原因：${report.reason}</p>
                <div class="report-actions">
                    <button onclick="handleReport('${report.postId}', 'resolved')">标记已处理</button>
                    <button onclick="handleReport('${report.postId}', 'invalid')">标记无效</button>
                </div>
            </div>
        `).join('');
}

function handleReport(postId, status) {
    const reports = JSON.parse(localStorage.getItem('postReports'));
    const report = reports.find(r => r.postId === postId);
    if (report) {
        report.status = status;
        localStorage.setItem('postReports', JSON.stringify(reports));
        renderReports();
    }
}

/**
 * 初始化数据可视化
 */
function initDataVisualization() {
    // 获取基础数据
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

    // 创建图表容器
    const container = document.createElement('div');
    container.id = 'dataDashboard';
    container.innerHTML = `
        <div class="chart-container">
            <canvas id="userActivityChart"></canvas>
        </div>
        <div class="chart-container">
            <canvas id="contentDistributionChart"></canvas>
        </div>
    `;

    document.body.appendChild(container);

    // 初始化图表
    renderUserActivityChart(users);
    renderContentDistributionChart(posts, submissions);
}

/**
 * 渲染用户活跃度图表
 */
function renderUserActivityChart(users) {
    const ctx = document.getElementById('userActivityChart').getContext('2d');
    const registrationData = users.reduce((acc, user) => {
        const date = new Date(user.registerDate).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(registrationData),
            datasets: [{
                label: '每日注册用户数',
                data: Object.values(registrationData),
                borderColor: '#2c5f2d',
                tension: 0.4
            }]
        }
    });
}

/**
 * 添加数据筛选功能
 */
function addDataFilters() {
    const filterBar = document.createElement('div');
    filterBar.id = 'filterBar';
    filterBar.innerHTML = `
        <div class="filter-group">
            <label>时间范围：</label>
            <select id="timeRange">
                <option value="7">最近7天</option>
                <option value="30">最近30天</option>
                <option value="all">全部时间</option>
            </select>
        </div>
        <div class="filter-group">
            <label>内容类型：</label>
            <select id="contentType">
                <option value="all">全部内容</option>
                <option value="posts">论坛帖子</option>
                <option value="submissions">用户投稿</option>
            </select>
        </div>
    `;
    document.querySelector('#dataDashboard').prepend(filterBar);

    // 添加事件监听
    document.getElementById('timeRange').addEventListener('change', updateCharts);
    document.getElementById('contentType').addEventListener('change', updateCharts);
}

function updateCharts() {
    const timeRange = document.getElementById('timeRange').value;
    const contentType = document.getElementById('contentType').value;

    // 获取最新数据
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const posts = filterByContentType(
        filterByTimeRange(
            JSON.parse(localStorage.getItem('forumPosts')) || [],
            timeRange
        ),
        contentType
    );

    const submissions = filterByContentType(
        filterByTimeRange(
            JSON.parse(localStorage.getItem('submissions')) || [],
            timeRange
        ),
        contentType
    );

    // 重新渲染图表
    renderUserActivityChart(users);
    renderContentDistributionChart(posts, submissions);
}

function filterByTimeRange(data, timeRange) {
    const now = new Date();
    const cutoffDate = new Date(now);

    switch (timeRange) {
        case '7':
            cutoffDate.setDate(now.getDate() - 7);
            break;
        case '30':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        case 'all':
            return data; // 不进行时间过滤
    }

    return data.filter(item => {
        const itemDate = new Date(item.createDate || item.submitDate);
        return itemDate >= cutoffDate;
    });
}

function filterByContentType(data, contentType) {
    switch (contentType) {
        case 'posts':
            return data.filter(item => item.content); // 论坛帖子有content字段
        case 'submissions':
            return data.filter(item => item.composition); // 投稿有composition字段
        default:
            return data;
    }
}

/**
 * 管理后台功能优化
 */

// 初始化排序功能
document.getElementById('sortBy').addEventListener('change', (e) => {
    sortPendingList(e.target.value);
});

/**
 * 排序待审核列表
 * @param {string} type - 排序类型（time/user）
 */
function sortPendingList(type) {
    const pendingFormulas = JSON.parse(localStorage.getItem('pendingFormulas') || '[]');

    switch (type) {
        case 'time':
            pendingFormulas.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime));
            break;
        case 'user':
            pendingFormulas.sort((a, b) => a.submitter.username.localeCompare(b.submitter.username));
            break;
    }

    renderPendingList(pendingFormulas);
}

/**
 * 批量审核功能
 */
function batchApprove() {
    const selectedFormulas = [...document.querySelectorAll('.formula-card input[type="checkbox"]:checked')]
        .map(cb => cb.closest('.formula-card').dataset.id);

    if (selectedFormulas.length === 0) {
        alert('请选择要审核的配方');
        return;
    }

    if (confirm(`确定要批量通过这 ${selectedFormulas.length} 个配方吗？`)) {
        Promise.all(selectedFormulas.map(id =>
            updateFormulaStatus(id, 'approved', '批量审核通过')
        )).then(() => {
            loadPendingFormulas();
            updateStats();
            alert('批量审核完成');
        });
    }
}

/**
 * 渲染待审核列表（优化版）
 */
function renderPendingList(formulas) {
    const container = document.getElementById('pendingList');

    container.innerHTML = formulas.map(formula => `
        <div class="formula-card" data-id="${formula.id}">
            <div class="card-header">
                <input type="checkbox" class="select-formula">
                <span class="status-badge status-pending">待审核</span>
            </div>
            <h3>${formula.name}</h3>
            <div class="formula-meta">
                <span class="submitter">👤 ${formula.submitter.username}</span>
                <span class="submit-time">🕒 ${formatTime(formula.submitTime)}</span>
            </div>
            <div class="composition">
                <h4>配方组成：</h4>
                <div class="herb-list">
                    ${Object.entries(formula.composition).map(([herb, amount]) => `
                        <div class="herb-item">
                            <span class="herb-name">${getHerbName(herb)}</span>
                            <span class="herb-amount">${amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="formula-details">
                <div class="detail-item">
                    <strong>功效：</strong>
                    <p>${formula.efficacy}</p>
                </div>
                <div class="detail-item">
                    <strong>使用方法：</strong>
                    <p>${formula.usage}</p>
                </div>
                <div class="detail-item">
                    <strong>理论依据：</strong>
                    <p>${formula.theory}</p>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-approve" onclick="quickApprove('${formula.id}')">快速通过</button>
                <button class="btn-review" onclick="showReviewDialog('${formula.id}')">详细审核</button>
            </div>
        </div>
    `).join('');
}

/**
 * 格式化时间显示
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // 小于1分钟
        return '刚刚';
    } else if (diff < 3600000) { // 小于1小时
        return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 小于1天
        return `${Math.floor(diff / 3600000)}小时前`;
    } else {
        return date.toLocaleDateString();
    }
}

/**
 * 快速通过功能
 */
function quickApprove(formulaId) {
    updateFormulaStatus(formulaId, 'approved', '快速审核通过')
        .then(() => {
            loadPendingFormulas();
            updateStats();
        });
} 