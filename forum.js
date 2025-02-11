/**
 * 帖子数据结构
 * @typedef {Object} Post
 * @property {string} id - 帖子ID
 * @property {string} title - 标题
 * @property {string} content - 内容
 * @property {string} author - 作者ID
 * @property {string} category - 分类（问答/分享/讨论）
 * @property {string} createDate - 创建时间
 * @property {number} views - 浏览量
 * @property {Array} comments - 评论列表
 */

// 在 forum.js 顶部添加调试日志
console.log('DataStore.KEYS:', DataStore.KEYS);

// 首先定义测试数据
const testPosts = [
    {
        id: 'post_001',
        title: '分享一个养生茶配方',
        content: '红枣+枸杞+菊花，每天一杯很养生...',
        authorId: 'test001',
        author: 'test_user',
        createTime: '2024-01-15T08:00:00Z',
        updateTime: '2024-01-15T08:00:00Z',
        tags: ['养生茶', '配方分享'],
        views: 120,
        likes: [],
        comments: [],
        favorites: []
    },
    {
        id: 'post_002',
        title: '冬季养生小妙招',
        content: '1. 早睡早起 2. 适当运动 3. 注意保暖...',
        authorId: 'test001',
        author: 'test_user',
        createTime: '2024-01-14T10:00:00Z',
        updateTime: '2024-01-14T10:00:00Z',
        tags: ['冬季养生', '生活习惯'],
        views: 85,
        likes: [],
        comments: [],
        favorites: []
    },
    {
        id: 'post_003',
        title: '推荐一个安神助眠的方子',
        content: '酸枣仁、柏子仁、远志、茯苓...',
        authorId: 'test001',
        author: 'test_user',
        createTime: '2024-01-13T15:30:00Z',
        updateTime: '2024-01-13T15:30:00Z',
        tags: ['失眠', '中药方剂'],
        views: 156,
        likes: [],
        comments: [],
        favorites: []
    }
];

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 确保在论坛页面
        const forumContainer = document.querySelector('.forum-container');
        if (!forumContainer) {
            console.log('不在论坛页面');
            return;
        }

        console.log('初始化论坛...');

        // 1. 初始化数据存储
        initTestData();

        // 2. 初始化用户认证
        initAuth();

        // 3. 初始化筛选和搜索
        initFilters();
        initSearch();

        // 4. 加载帖子
        await loadPosts();
    } catch (error) {
        console.error('论坛初始化失败:', error);
        showError('加载失败，请刷新页面重试');
    }
});

/**
 * 论坛功能实现
 */

// 当前页码
let currentPage = 1;
const PAGE_SIZE = 10;

/**
 * 加载帖子列表
 * @param {string} filter - 筛选条件
 * @param {string} search - 搜索关键词
 */
async function loadPosts(filter = 'all', search = '') {
    try {
        console.log('开始加载帖子...');
        console.log('DataStore.KEYS:', DataStore.KEYS);

        // 获取帖子数据
        let posts = DataStore.get(DataStore.KEYS.POSTS);
        console.log('从 DataStore 获取的帖子:', posts);

        // 如果没有数据，初始化测试数据
        if (!posts || !Array.isArray(posts)) {
            console.log('没有找到帖子数据，初始化测试数据');
            posts = testPosts;
            DataStore.set(DataStore.KEYS.POSTS, posts);
            console.log('测试数据已初始化');
        }

        // 应用筛选
        posts = filterPosts(posts, filter);
        console.log('筛选后的帖子:', posts);

        // 应用搜索
        if (search) {
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.content.toLowerCase().includes(search.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
            console.log('搜索后的帖子:', posts);
        }

        // 分页
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedPosts = posts.slice(start, end);
        console.log('分页后的帖子:', paginatedPosts);

        // 渲染帖子
        renderPosts(paginatedPosts);
        console.log('帖子渲染完成');

        // 更新加载更多按钮状态
        updateLoadMoreButton(posts.length > end);
    } catch (error) {
        console.error('加载帖子失败:', error);
        showError('加载帖子失败，请重试');
    }
}

/**
 * 筛选帖子
 * @param {Array} posts - 帖子数组
 * @param {string} filter - 筛选条件
 * @returns {Array} 筛选后的帖子
 */
function filterPosts(posts, filter) {
    const currentUser = getCurrentUser();

    switch (filter) {
        case 'trending':
            return posts.sort((a, b) => b.likes.length - a.likes.length);
        case 'latest':
            return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'following':
            if (!currentUser) return [];
            return posts.filter(post =>
                currentUser.following.includes(post.authorId)
            );
        default:
            return posts;
    }
}

/**
 * 渲染帖子列表
 */
function renderPosts(posts) {
    const container = document.getElementById('postsContainer');
    // 添加容器存在性检查
    if (!container) {
        console.log('帖子容器未找到');
        return;
    }

    container.innerHTML = posts.length ? posts.map(post => {
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        const author = users.find(u => u.id === post.authorId);

        // 如果找不到作者，使用默认值
        const authorName = author ? author.username : '未知用户';
        const authorAvatar = author ? author.avatar : '👤';

        return `
            <div class="post-card" data-id="${post.id}" onclick="openPost('${post.id}')">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar">${authorAvatar}</div>
                        <div class="author-info">
                            <span class="author-name">${authorName}</span>
                            <span class="post-time">${formatTime(post.createTime)}</span>
                        </div>
                        ${getCurrentUser() && getCurrentUser().id !== post.authorId ? `
                            <button 
                                class="follow-btn ${getCurrentUser().following?.includes(post.authorId) ? 'following' : ''}"
                                onclick="toggleFollow('${post.authorId}', event)"
                            >
                                ${getCurrentUser().following?.includes(post.authorId) ? '已关注' : '关注'}
                            </button>
                        ` : ''}
                    </div>
                    ${getCurrentUser()?.id === post.authorId ? `
                        <div class="post-actions">
                            <button class="edit-btn" onclick="editPost('${post.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" onclick="deletePost('${post.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-text">${post.content}</div>
                    ${post.tags?.length ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn ${post.likes?.includes(getCurrentUser()?.id) ? 'active' : ''}"
                            onclick="toggleLike('${post.id}')"
                            title="${post.likes?.includes(getCurrentUser()?.id) ? '取消点赞' : '点赞'}">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span class="text">点赞</span>
                        <span class="count">${post.likes?.length || 0}</span>
                    </button>
                    <button class="action-btn comment-btn" 
                            onclick="toggleComments('${post.id}')"
                            title="评论">
                        <svg viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                        </svg>
                        <span class="text">评论</span>
                        <span class="count">${post.comments?.length || 0}</span>
                    </button>
                    <button class="action-btn favorite-btn ${post.favorites?.includes(getCurrentUser()?.id) ? 'active' : ''}"
                            onclick="toggleFavorite('${post.id}')"
                            title="${post.favorites?.includes(getCurrentUser()?.id) ? '取消收藏' : '收藏'}">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        <span class="text">收藏</span>
                        <span class="count">${post.favorites?.length || 0}</span>
                    </button>
                    <div class="views-count" title="浏览量">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        <span>${post.views || 0}</span>
                    </div>
                </div>
                <div class="comments-section" style="display: none;">
                    <div class="comments-container"></div>
                    ${getCurrentUser() ? `
                        <div class="comment-form">
                            <textarea 
                                placeholder="写下你的评论..." 
                                rows="2"
                                onkeydown="handleCommentKeydown(event, '${post.id}', this)"
                            ></textarea>
                            <button onclick="submitComment('${post.id}', this.previousElementSibling)">
                                发送
                            </button>
                        </div>
                    ` : `
                        <div class="login-tip">
                            <a href="login.html">登录</a>后参与评论
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('') : '<p class="empty-message">暂无帖子</p>';

    // 阻止按钮点击事件冒泡
    container.querySelectorAll('.post-actions button').forEach(btn => {
        btn.addEventListener('click', e => e.stopPropagation());
    });
}

/**
 * 切换评论显示状态
 */
async function toggleComments(postId) {
    const section = document.querySelector(`[data-id="${postId}"] .comments-section`);
    const container = section.querySelector('.comments-container');
    const isVisible = section.style.display !== 'none';

    if (!isVisible) {
        section.style.display = 'block';
        try {
            const comments = await forumInteraction.showComments(postId);
            container.innerHTML = comments.map(comment => `
                <div class="comment" data-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-author">
                            <span class="author-name">${comment.author}</span>
                            <span class="comment-time">${formatTime(comment.createTime)}</span>
                        </div>
                        ${comment.authorId === getCurrentUser()?.id ? `
                            <button class="delete-btn" onclick="deleteComment('${postId}', '${comment.id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `).join('') || '<div class="no-comments">暂无评论</div>';
        } catch (error) {
            container.innerHTML = '<div class="error-message">加载评论失败</div>';
            console.error('加载评论失败:', error);
        }
    } else {
        section.style.display = 'none';
    }
}

/**
 * 处理评论框按键事件
 */
function handleCommentKeydown(event, postId, textarea) {
    // 检查是否按下Enter（不需要Ctrl或Command）
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // 阻止默认换行
        submitComment(postId, textarea);
    }
}

/**
 * 提交评论
 */
async function submitComment(postId, textarea) {
    const content = textarea.value.trim();
    if (!content) {
        showError('请输入评论内容');
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
        showError('请先登录');
        return;
    }

    try {
        await forumInteraction.addComment(postId, currentUser.id, content);
        textarea.value = '';

        // 更新评论列表
        await toggleComments(postId);

        // 更新评论数量
        const posts = DataStore.get(DataStore.KEYS.POSTS);
        const post = posts.find(p => p.id === postId);
        const commentBtn = document.querySelector(`[data-id="${postId}"] .comment-btn`);
        if (commentBtn) {
            const countSpan = commentBtn.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = post.comments.length;
                // 添加动画效果
                countSpan.style.animation = 'none';
                countSpan.offsetHeight; // 触发重绘
                countSpan.style.animation = 'count-update 0.3s ease';
            }
        }

        showSuccess('评论发表成功');
    } catch (error) {
        showError(error.message || '评论失败，请重试');
    }
}

/**
 * 显示发帖表单
 */
function showPostForm() {
    if (!getCurrentUser()) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('postFormModal').style.display = 'flex';
}

/**
 * 关闭发帖表单
 */
function closePostForm() {
    document.getElementById('postFormModal').style.display = 'none';
    document.getElementById('postForm').reset();
}

/**
 * 发布帖子
 * @param {Event} e - 表单提交事件
 */
async function submitPost(e) {
    e.preventDefault();

    try {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error('请先登录');

        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const tags = document.getElementById('postTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        // 创建新帖子
        const newPost = {
            id: `post_${Date.now()}`,
            title,
            content,
            authorId: currentUser.id,
            author: currentUser.username,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            tags,
            views: 0,
            likes: [],
            comments: [],
            favorites: []
        };

        console.log('准备发布新帖子:', newPost);

        // 获取现有帖子
        let posts = DataStore.get(DataStore.KEYS.POSTS) || [];
        console.log('现有帖子数量:', posts.length);

        // 添加新帖子
        posts.unshift(newPost);

        // 保存更新后的帖子
        DataStore.set(DataStore.KEYS.POSTS, posts);
        console.log('保存后的帖子数量:', posts.length);

        // 关闭表单
        closePostForm();

        // 重新加载帖子列表
        currentPage = 1; // 重置到第一页
        await loadPosts();

        showError('发布成功！');
    } catch (error) {
        console.error('发布帖子失败:', error);
        showError(error.message);
    }
}

// 工具函数
function generatePostId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 格式化内容
 */
function formatContent(content) {
    if (!content) return '';
    return content
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
        .replace(/[#＃]([^\s#＃]+)/g, '<span class="hashtag">#$1</span>');
}

/**
 * 格式化时间
 */
function formatTime(timestamp) {
    if (!timestamp) return '未知时间';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 处理无效日期
    if (isNaN(diff)) return '未知时间';

    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 初始化事件监听
document.getElementById('postForm')?.addEventListener('submit', submitPost);

/**
 * 查看帖子详情
 */
function viewPostDetail(postId) {
    const post = getPostById(postId);
    if (post) {
        // 更新浏览量
        post.views++;
        updatePost(post);

        // 存储当前查看的帖子ID
        localStorage.setItem('currentPostId', postId);
        window.location.href = 'post-detail.html';
    }
}

/**
 * 渲染帖子详情
 */
function renderPostDetail() {
    const postId = localStorage.getItem('currentPostId');
    const post = getPostById(postId);
    if (!post) return;

    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postContent').textContent = post.content;
    document.getElementById('postViews').textContent = post.views;
    document.getElementById('postAuthor').textContent = `作者：${getAuthorName(post.author)}`;
    document.getElementById('postCategory').textContent = `分类：${post.category}`;
    document.getElementById('postDate').textContent = `时间：${new Date(post.createDate).toLocaleString()}`;

    // 渲染评论
    document.getElementById('commentsCount').textContent = post.comments.length;
    document.getElementById('commentsList').innerHTML = post.comments.map(comment => `
        <div class="comment-card">
            <div class="comment-meta">
                <span>${getAuthorName(comment.author)}</span>
                <span>${new Date(comment.date).toLocaleString()}</span>
            </div>
            <p>${comment.content}</p>
        </div>
    `).join('');
}

/**
 * 编辑帖子
 * @param {string} postId - 帖子ID
 */
async function editPost(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showError('请先登录');
        return;
    }

    const posts = DataStore.get(DataStore.KEYS.POSTS);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        showError('帖子不存在');
        return;
    }

    if (post.authorId !== currentUser.id) {
        showError('没有编辑权限');
        return;
    }

    // 显示编辑表单
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postTags').value = post.tags.join(',');

    // 显示模态框
    const modal = document.getElementById('postFormModal');
    modal.style.display = 'block';
    modal.dataset.editId = postId; // 标记正在编辑的帖子ID
}

/**
 * 收藏帖子
 */
async function toggleFavorite(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showError('请先登录');
        return;
    }

    try {
        const posts = DataStore.get(DataStore.KEYS.POSTS);
        const post = posts.find(p => p.id === postId);

        if (!post) {
            throw new Error('帖子不存在');
        }

        post.favorites = post.favorites || [];
        const index = post.favorites.indexOf(currentUser.id);

        // 更新收藏状态
        if (index === -1) {
            post.favorites.push(currentUser.id);
        } else {
            post.favorites.splice(index, 1);
        }

        // 保存更新
        DataStore.set(DataStore.KEYS.POSTS, posts);

        // 更新UI
        const btn = document.querySelector(`[data-id="${postId}"] .favorite-btn`);
        if (btn) {
            const isActive = index === -1;
            btn.classList.toggle('active', isActive);

            // 更新收藏数量
            const countSpan = btn.querySelector('.count');
            if (countSpan) {
                // 使用更新后的长度
                const newCount = isActive ? post.favorites.length : post.favorites.length;
                countSpan.textContent = newCount;

                // 添加动画效果
                countSpan.style.animation = 'none';
                countSpan.offsetHeight; // 触发重绘
                countSpan.style.animation = 'count-update 0.3s ease';
            }
        }

        // 显示提示
        showSuccess(index === -1 ? '收藏成功' : '已取消收藏');
    } catch (error) {
        showError(error.message);
    }
}

function reportPost() {
    const reason = prompt('请输入举报原因（最多200字）：');
    if (reason && reason.length <= 200) {
        // 将举报信息存储到本地
        const reports = JSON.parse(localStorage.getItem('postReports')) || [];
        reports.push({
            postId: localStorage.getItem('currentPostId'),
            reason: reason,
            date: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('postReports', JSON.stringify(reports));
        alert('举报已提交，管理员将会尽快处理');
    }
}

// 在forum.js中添加搜索功能
function searchPosts() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const posts = JSON.parse(localStorage.getItem('forumPosts'));

    const results = posts.filter(post =>
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
    );

    renderPosts(results);
}

// 在论坛页面添加搜索框 

/**
 * 论坛交互功能
 */
const forumInteraction = {
    /**
     * 切换点赞状态
     */
    toggleLike: async (postId, userId) => {
        try {
            console.log('切换点赞状态:', postId, userId);
            const posts = DataStore.get(DataStore.KEYS.POSTS);
            const post = posts.find(p => p.id === postId);

            if (!post) {
                throw new Error('帖子不存在');
            }

            // 确保likes数组存在
            post.likes = post.likes || [];
            const likeIndex = post.likes.indexOf(userId);

            if (likeIndex === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(likeIndex, 1);
            }

            DataStore.set(DataStore.KEYS.POSTS, posts);
            console.log('点赞状态更新成功');

            return {
                liked: likeIndex === -1,
                count: post.likes.length
            };
        } catch (error) {
            console.error('点赞操作失败:', error);
            throw error;
        }
    },

    /**
     * 显示评论
     */
    showComments: async (postId) => {
        try {
            console.log('获取评论:', postId);
            const posts = DataStore.get(DataStore.KEYS.POSTS);
            const post = posts.find(p => p.id === postId);

            if (!post) {
                throw new Error('帖子不存在');
            }

            // 确保comments数组存在
            post.comments = post.comments || [];
            console.log('帖子评论:', post.comments);

            // 获取评论用户信息
            const users = DataStore.get(DataStore.KEYS.USERS) || [];
            return post.comments.map(comment => ({
                ...comment,
                author: users.find(u => u.id === comment.authorId)?.username || '未知用户'
            }));
        } catch (error) {
            console.error('获取评论失败:', error);
            throw error;
        }
    },

    /**
     * 添加评论
     * @param {string} postId - 帖子ID
     * @param {string} userId - 用户ID
     * @param {string} content - 评论内容
     */
    addComment: async (postId, userId, content) => {
        try {
            const posts = DataStore.get(DataStore.KEYS.POSTS);
            const post = posts.find(p => p.id === postId);

            if (!post) {
                throw new Error('帖子不存在');
            }

            const newComment = {
                id: `comment_${Date.now()}`,
                content,
                authorId: userId,
                createTime: new Date().toISOString(),
                likes: []
            };

            post.comments.push(newComment);
            DataStore.set(DataStore.KEYS.POSTS, posts);

            return newComment;
        } catch (error) {
            console.error('添加评论失败:', error);
            throw error;
        }
    },

    /**
     * 删除评论
     * @param {string} postId - 帖子ID
     * @param {string} commentId - 评论ID
     * @param {string} userId - 用户ID
     */
    deleteComment: async (postId, commentId, userId) => {
        try {
            const posts = DataStore.get(DataStore.KEYS.POSTS);
            const post = posts.find(p => p.id === postId);

            if (!post) {
                throw new Error('帖子不存在');
            }

            const comment = post.comments.find(c => c.id === commentId);
            if (!comment) {
                throw new Error('评论不存在');
            }

            // 检查权限
            if (comment.authorId !== userId && post.authorId !== userId) {
                throw new Error('没有删除权限');
            }

            post.comments = post.comments.filter(c => c.id !== commentId);
            DataStore.set(DataStore.KEYS.POSTS, posts);
        } catch (error) {
            console.error('删除评论失败:', error);
            throw error;
        }
    }
};

/**
 * 工具函数
 */
// 添加提示函数
function showMessage(message, type = 'error') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加到页面
    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => toast.classList.add('show'), 10);

    // 自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 成功提示
function showSuccess(message) {
    showMessage(message, 'success');
}

// 错误提示
function showError(message) {
    showMessage(message, 'error');
}

function updateLoadMoreButton(hasMore) {
    const btn = document.querySelector('.load-more button');
    if (btn) {
        btn.style.display = hasMore ? 'block' : 'none';
    }
}

/**
 * 初始化函数
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-tabs .tab-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadPosts(btn.dataset.filter);
        });
    });
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) {
        console.log('搜索输入框未找到');
        return;
    }

    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        filterPosts(searchTerm);
    }, 500));
}

// 修改初始化调用
document.addEventListener('DOMContentLoaded', () => {
    // 只在论坛页面初始化搜索
    if (document.querySelector('.forum-container')) {
        initSearch();
    }
});

// 修改事件处理函数名，与HTML中保持一致
const toggleLike = async (postId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showError('请先登录');
        return;
    }

    try {
        const result = await forumInteraction.toggleLike(postId, currentUser.id);
        const btn = document.querySelector(`[data-id="${postId}"] .action-btn:first-child`);
        if (btn) {
            btn.classList.toggle('active', result.liked);
            btn.querySelector('.count').textContent = result.count;
        }
    } catch (error) {
        showError(error.message);
    }
};

const showComments = async (postId) => {
    try {
        const comments = await forumInteraction.showComments(postId);
        const container = document.querySelector(`[data-id="${postId}"] .comments-container`);
        if (container) {
            container.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${formatTime(comment.createTime)}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                    ${comment.authorId === getCurrentUser()?.id ? `
                        <button onclick="deleteComment('${postId}', '${comment.id}')" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `).join('');
            container.style.display = 'block';
        }
    } catch (error) {
        showError(error.message);
    }
};

// 删除评论处理函数
const deleteComment = async (postId, commentId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showError('请先登录');
        return;
    }

    try {
        await forumInteraction.deleteComment(postId, commentId, currentUser.id);

        // 更新评论列表
        await toggleComments(postId);

        // 更新评论数量
        const posts = DataStore.get(DataStore.KEYS.POSTS);
        const post = posts.find(p => p.id === postId);
        const commentBtn = document.querySelector(`[data-id="${postId}"] .comment-btn`);
        if (commentBtn) {
            const countSpan = commentBtn.querySelector('.count');
            if (countSpan) {
                countSpan.textContent = post.comments.length;
                // 添加动画效果
                countSpan.style.animation = 'none';
                countSpan.offsetHeight; // 触发重绘
                countSpan.style.animation = 'count-update 0.3s ease';
            }
        }

        showSuccess('评论已删除');
    } catch (error) {
        showError(error.message || '删除失败，请重试');
    }
};

/**
 * 打开帖子详情
 */
function openPost(postId) {
    try {
        // 获取帖子数据
        const posts = DataStore.get(DataStore.KEYS.POSTS) || [];
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        // 记录浏览记录
        addViewHistory(postId);

        // 更新浏览量
        post.views = (post.views || 0) + 1;
        DataStore.set(DataStore.KEYS.POSTS, posts);

        // 获取评论数据
        const comments = post.comments || [];
        const currentUser = getCurrentUser();

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'post-modal';
        modal.innerHTML = `
            <div class="post-modal-content">
                <div class="post-modal-header">
                    <div class="post-author">
                        <div class="author-avatar">${post.author?.[0] || '?'}</div>
                        <div class="author-info">
                            <span class="author-name">${post.author || '未知用户'}</span>
                            <span class="post-time">${formatTime(post.createTime)}</span>
                        </div>
                    </div>
                    <button class="close-btn" onclick="this.closest('.post-modal').remove()">×</button>
                </div>
                <div class="post-modal-body">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-content">${post.content}</div>
                    ${post.tags?.length ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="post-stats">
                        <span>👁️ ${post.views || 0}</span>
                        <span>👍 ${post.likes?.length || 0}</span>
                        <span>💬 ${comments.length || 0}</span>
                    </div>
                </div>
                <div class="post-modal-comments">
                    <h3>评论 (${comments.length})</h3>
                    <div class="comments-list">
                        ${comments.length ? comments.map(comment => `
                            <div class="comment">
                                <div class="comment-header">
                                    <div class="comment-author">
                                        <span class="author-name">${comment.author || '未知用户'}</span>
                                        <span class="comment-time">${formatTime(comment.createTime)}</span>
                                    </div>
                                    ${comment.authorId === currentUser?.id ? `
                                        <button class="delete-btn" onclick="deleteComment('${post.id}', '${comment.id}')">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="comment-content">${comment.content}</div>
                            </div>
                        `).join('') : '<div class="no-comments">暂无评论</div>'}
                    </div>
                    ${currentUser ? `
                        <div class="comment-form">
                            <textarea 
                                placeholder="写下你的评论..." 
                                rows="2"
                                onkeydown="handleCommentKeydown(event, '${post.id}', this)"
                            ></textarea>
                            <button onclick="submitComment('${post.id}', this.previousElementSibling)">
                                发送
                            </button>
                        </div>
                    ` : `
                        <div class="login-tip">
                            <a href="login.html">登录</a>后参与评论
                        </div>
                    `}
                </div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);

        // 添加ESC键关闭功能
        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEsc);
            }
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    } catch (error) {
        console.error('打开帖子失败:', error);
        showError('打开帖子失败，请重试');
    }
}

/**
 * 添加浏览记录
 */
function addViewHistory(postId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
        // 获取浏览记录
        let viewHistory = DataStore.get(DataStore.KEYS.VIEW_HISTORY) || {};
        viewHistory[currentUser.id] = viewHistory[currentUser.id] || [];

        // 移除已存在的相同帖子记录
        viewHistory[currentUser.id] = viewHistory[currentUser.id].filter(item => item.postId !== postId);

        // 添加新的浏览记录
        viewHistory[currentUser.id].unshift({
            postId,
            viewTime: new Date().toISOString()
        });

        // 限制记录数量，只保留最近50条
        if (viewHistory[currentUser.id].length > 50) {
            viewHistory[currentUser.id] = viewHistory[currentUser.id].slice(0, 50);
        }

        // 保存更新后的浏览记录
        DataStore.set(DataStore.KEYS.VIEW_HISTORY, viewHistory);

        // 更新浏览量显示
        const viewsCount = document.querySelector(`[data-id="${postId}"] .views-count span`);
        if (viewsCount) {
            const posts = DataStore.get(DataStore.KEYS.POSTS) || [];
            const post = posts.find(p => p.id === postId);
            if (post) {
                viewsCount.textContent = post.views || 0;
                // 添加动画效果
                viewsCount.style.animation = 'none';
                viewsCount.offsetHeight; // 触发重绘
                viewsCount.style.animation = 'count-update 0.3s ease';
            }
        }
    } catch (error) {
        console.error('添加浏览记录失败:', error);
    }
}

/**
 * 切换关注状态
 */
async function toggleFollow(authorId, event) {
    event.stopPropagation();

    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showError('请先登录');
            return;
        }

        if (authorId === currentUser.id) {
            showError('不能关注自己');
            return;
        }

        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        const targetUser = users.find(u => u.id === authorId);
        const currentUserData = users.find(u => u.id === currentUser.id);

        if (!targetUser || !currentUserData) {
            console.error('用户数据获取失败:', {
                targetUserId: authorId,
                targetUser,
                currentUserId: currentUser.id,
                currentUserData,
                allUsers: users
            });
            throw new Error('用户数据获取失败');
        }

        // 确保数组存在
        currentUserData.following = currentUserData.following || [];
        targetUser.followers = targetUser.followers || [];

        const isFollowing = currentUserData.following.includes(authorId);

        if (isFollowing) {
            currentUserData.following = currentUserData.following.filter(id => id !== authorId);
            targetUser.followers = targetUser.followers.filter(id => id !== currentUser.id);
        } else {
            currentUserData.following.push(authorId);
            targetUser.followers.push(currentUser.id);
        }

        // 保存更新
        DataStore.set(DataStore.KEYS.USERS, users);
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));

        // 更新UI
        const followBtn = event.target;
        followBtn.classList.toggle('following', !isFollowing);
        followBtn.textContent = isFollowing ? '关注' : '已关注';

        showSuccess(isFollowing ? '已取消关注' : '关注成功');

        return {
            following: !isFollowing,
            count: targetUser.followers.length
        };
    } catch (error) {
        console.error('关注操作失败:', error);
        showError(error.message || '操作失败，请重试');
        throw error;
    }
}

// 在初始化时调用
function initTestData() {
    // 获取现有用户数据
    let users = DataStore.get(DataStore.KEYS.USERS) || [];

    // 检查是否需要添加测试用户
    const hasTestUser = users.some(user => user.id === 'test001');
    if (!hasTestUser) {
        users = [...testUsers, ...users];
        DataStore.set(DataStore.KEYS.USERS, users);
        console.log('测试用户数据已初始化');
    }
} 