/**
 * 帖子详情页功能实现
 */

// 当前帖子ID
let currentPostId = null;
let currentPage = 1;
const COMMENTS_PER_PAGE = 10;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadPostDetail();
});

/**
 * 加载帖子详情
 */
async function loadPostDetail() {
    try {
        // 从URL获取帖子ID
        const urlParams = new URLSearchParams(window.location.search);
        currentPostId = urlParams.get('id');

        if (!currentPostId) {
            showError('帖子不存在');
            return;
        }

        // 获取帖子数据
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === currentPostId);

        if (!post) {
            showError('帖子不存在');
            return;
        }

        // 更新浏览量
        updatePostViews(post);

        // 渲染帖子内容
        renderPostDetail(post);

        // 加载评论
        loadComments();
    } catch (error) {
        console.error('加载帖子详情失败:', error);
        showError('加载失败，请重试');
    }
}

/**
 * 渲染帖子详情
 * @param {Object} post - 帖子数据
 */
function renderPostDetail(post) {
    const container = document.getElementById('postContent');
    const currentUser = getCurrentUser();

    container.innerHTML = `
        <div class="post-meta">
            <div class="post-author">
                <div class="author-avatar">${post.author[0]}</div>
                <div class="author-info">
                    <span class="author-name">${post.author}</span>
                    <span class="post-time">${formatTime(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-actions">
                ${currentUser?.id === post.authorId ? `
                    <button class="btn-modern small" onclick="editPost()">编辑</button>
                ` : ''}
                <button class="action-btn ${post.likes.includes(currentUser?.id) ? 'active' : ''}"
                    onclick="toggleLike()">
                    <span class="icon">👍</span>
                    <span class="count">${post.likes.length}</span>
                </button>
                <button class="action-btn ${post.favorites.includes(currentUser?.id) ? 'active' : ''}"
                    onclick="toggleFavorite()">
                    <span class="icon">⭐</span>
                </button>
            </div>
        </div>
        <h1 class="post-title">${post.title}</h1>
        <div class="post-text">${formatContent(post.content)}</div>
        <div class="post-tags">
            ${post.tags.map(tag => `
                <span class="post-tag">${tag}</span>
            `).join('')}
        </div>
    `;
}

/**
 * 加载评论
 */
async function loadComments() {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === currentPostId);

        if (!post) return;

        // 更新评论数
        document.getElementById('commentCount').textContent = post.comments.length;

        // 分页加载评论
        const start = (currentPage - 1) * COMMENTS_PER_PAGE;
        const end = start + COMMENTS_PER_PAGE;
        const comments = post.comments.slice(start, end);

        // 渲染评论
        renderComments(comments);

        // 更新加载更多按钮状态
        const loadMoreBtn = document.querySelector('.load-more button');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = post.comments.length > end ? 'block' : 'none';
        }
    } catch (error) {
        console.error('加载评论失败:', error);
        showError('加载评论失败，请重试');
    }
}

/**
 * 渲染评论列表
 * @param {Array} comments - 评论数组
 */
function renderComments(comments) {
    const container = document.getElementById('commentsList');
    const currentUser = getCurrentUser();

    container.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">${comment.author[0]}</div>
                    <span class="author-name">${comment.author}</span>
                </div>
                <span class="comment-time">${formatTime(comment.createdAt)}</span>
            </div>
            <div class="comment-text">${formatContent(comment.content)}</div>
            <div class="comment-actions">
                <button onclick="toggleCommentLike('${comment.id}')">
                    <span class="icon">👍</span>
                    <span class="count">${comment.likes?.length || 0}</span>
                </button>
                ${currentUser?.id === comment.authorId ? `
                    <button onclick="deleteComment('${comment.id}')">删除</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * 提交评论
 */
async function submitComment() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('请先登录');
            return;
        }

        const content = document.getElementById('commentInput').value.trim();
        if (!content) {
            showError('请输入评论内容');
            return;
        }

        // 创建新评论
        const newComment = {
            id: generateId(),
            authorId: currentUser.id,
            author: currentUser.username,
            content,
            createdAt: new Date().toISOString(),
            likes: []
        };

        // 更新帖子数据
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id === currentPostId);

        if (!post) return;

        post.comments.unshift(newComment);
        localStorage.setItem('posts', JSON.stringify(posts));

        // 清空输入框并重新加载评论
        document.getElementById('commentInput').value = '';
        currentPage = 1;
        loadComments();

        showSuccess('评论发表成功');
    } catch (error) {
        console.error('发表评论失败:', error);
        showError(error.message);
    }
}

// 工具函数
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function updatePostViews(post) {
    post.views = (post.views || 0) + 1;
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const index = posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
        posts[index] = post;
        localStorage.setItem('posts', JSON.stringify(posts));
    }
}

// 初始化事件监听
document.getElementById('commentInput')?.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') {
        submitComment();
    }
}); 