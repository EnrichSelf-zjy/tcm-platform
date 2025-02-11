/**
 * 加载用户信息
 */
// 删除旧的loadProfile函数，因为已经被新的loadUserProfile替代

function getStatusText(status) {
    const statusMap = {
        pending: '⏳ 审核中',
        approved: '✅ 已通过',
        rejected: '❌ 已拒绝'
    };
    return statusMap[status] || '未知状态';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// 初始化页面
// window.onload = loadProfile;

/**
 * 个人中心功能实现
 */

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadUserProfile();
    initTabs();
    initForms();
});

/**
 * 加载用户资料
 */
async function loadUserProfile() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // 更新头像显示
        updateAvatarDisplay(currentUser);

        // 加载基本信息
        document.getElementById('userName').textContent = currentUser.profile.nickname || currentUser.username;
        document.getElementById('userBio').textContent = currentUser.profile.bio || '这个人很懒，什么都没写~';

        // 加载统计数据
        loadUserStats(currentUser.id);

        // 加载帖子列表
        loadUserPosts(currentUser.id);

        // 加载收藏列表
        loadUserCollections(currentUser.id);

        // 加载浏览历史
        loadUserHistory(currentUser.id);

        // 加载设置表单
        loadUserSettings(currentUser);
    } catch (error) {
        console.error('加载用户资料失败:', error);
        showError('加载用户资料失败，请重试');
    }
}

/**
 * 加载用户统计数据
 * @param {string} userId - 用户ID
 */
async function loadUserStats(userId) {
    try {
        console.log('加载用户统计数据:', userId);

        // 使用 DataStore 获取帖子数据
        const posts = DataStore.get(DataStore.KEYS.POSTS) || [];
        const userPosts = posts.filter(post => post.authorId === userId);
        console.log('用户帖子数量:', userPosts.length);

        // 更新帖子数量
        document.getElementById('postCount').textContent = userPosts.length;

        // 获取用户数据
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        const currentUser = users.find(u => u.id === userId);
        console.log('当前用户数据:', currentUser);

        if (currentUser) {
            // 关注数
            currentUser.following = currentUser.following || [];
            document.getElementById('followingCount').textContent = currentUser.following.length;

            // 粉丝数
            const followers = users.filter(u => u.following?.includes(userId));
            document.getElementById('followerCount').textContent = followers.length;

            // 计算获赞总数
            const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
            if (document.getElementById('likeCount')) {
                document.getElementById('likeCount').textContent = totalLikes;
            }

            // 计算评论总数
            const totalComments = userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
            if (document.getElementById('commentCount')) {
                document.getElementById('commentCount').textContent = totalComments;
            }

            // 加载关注列表和粉丝列表
            loadFollowing(userId);
            loadFollowers(userId);
        }
    } catch (error) {
        console.error('加载统计数据失败:', error);
        showError('加载统计数据失败，请重试');
    }
}

/**
 * 加载用户帖子
 * @param {string} userId - 用户ID
 */
async function loadUserPosts(userId) {
    try {
        console.log('加载用户帖子:', userId);

        // 使用 DataStore 获取帖子数据
        const posts = DataStore.get(DataStore.KEYS.POSTS) || [];
        console.log('获取到的帖子数据:', posts);

        // 过滤用户帖子
        const userPosts = posts.filter(post => post.authorId === userId);
        console.log('用户的帖子:', userPosts);

        const container = document.getElementById('userPosts');
        container.innerHTML = userPosts.map(post => `
            <div class="post-card" data-id="${post.id}">
                <h3>${post.title}</h3>
                <div class="post-meta">
                    <span>${formatTime(post.createTime || post.createdAt)}</span>
                    <span>👁️ ${post.views || 0}</span>
                    <span>👍 ${post.likes?.length || 0}</span>
                    <span>💬 ${post.comments?.length || 0}</span>
                </div>
                <p class="post-excerpt">${post.content.slice(0, 100)}...</p>
                <div class="post-actions">
                    <button class="btn-modern small" onclick="editPost('${post.id}')">编辑</button>
                    <button class="btn-modern small danger" onclick="deletePost('${post.id}')">删除</button>
                </div>
            </div>
        `).join('') || '<p class="no-data">还没有发布过帖子</p>';

    } catch (error) {
        console.error('加载帖子失败:', error);
        showError('加载帖子失败，请重试');
    }
}

/**
 * 加载用户收藏
 */
async function loadUserCollections(userId) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // 获取帖子数据
        const posts = DataStore.get(DataStore.KEYS.POSTS) || [];
        const collected = posts.filter(post => post.favorites?.includes(currentUser.id));

        const container = document.getElementById('userFavorites');
        if (!container) return;

        container.innerHTML = collected.length ? collected.map(post => `
            <div class="post-card" data-id="${post.id}" onclick="openPost('${post.id}')">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar">${post.author?.[0] || '?'}</div>
                        <div class="author-info">
                            <span class="author-name">${post.author || '未知用户'}</span>
                            <span class="post-time">${formatTime(post.createTime)}</span>
                        </div>
                    </div>
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
                <div class="post-stats">
                    <span>👁️ ${post.views || 0}</span>
                    <span>👍 ${post.likes?.length || 0}</span>
                    <span>💬 ${post.comments?.length || 0}</span>
                    <button class="unfavorite-btn" onclick="event.stopPropagation(); toggleFavorite('${post.id}')">
                        取消收藏
                    </button>
                </div>
            </div>
        `).join('') : '<p class="no-data">暂无收藏内容</p>';
    } catch (error) {
        console.error('加载收藏失败:', error);
        showError('加载收藏失败，请重试');
    }
}

/**
 * 加载浏览历史
 */
async function loadUserHistory(userId) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // 获取浏览记录
        const viewHistory = DataStore.get(DataStore.KEYS.VIEW_HISTORY) || {};
        const userHistory = viewHistory[currentUser.id] || [];
        const posts = DataStore.get(DataStore.KEYS.POSTS) || [];

        const container = document.getElementById('userHistory');
        if (!container) return;

        container.innerHTML = userHistory.length ? `
            <div class="history-header">
                <button class="btn-modern small" onclick="clearViewHistory()">清空记录</button>
            </div>
            <div class="history-list">
                ${userHistory.map(item => {
            const post = posts.find(p => p.id === item.postId);
            if (!post) return '';
            return `
                <div class="post-card" data-id="${post.id}">
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span>作者：${post.author}</span>
                        <span>浏览时间：${formatTime(item.viewTime)}</span>
                    </div>
                    <p class="post-excerpt">${post.content.slice(0, 100)}...</p>
                </div>
            `;
        }).join('')}
            </div>
        ` : '<p class="no-data">暂无浏览历史</p>';
    } catch (error) {
        console.error('加载历史记录失败:', error);
        showError('加载历史记录失败，请重试');
    }
}

/**
 * 加载用户设置
 * @param {Object} user - 用户数据
 */
function loadUserSettings(user) {
    document.getElementById('nickname').value = user.profile.nickname || '';
    document.getElementById('email').value = user.profile.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('bio').value = user.profile.bio || '';

    document.querySelector('input[name="showEmail"]').checked = user.profile.showEmail;
    document.querySelector('input[name="showPhone"]').checked = user.profile.showPhone;
}

// 工具函数
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function showError(message) {
    alert(message); // 简单实现，可以改为更好的UI
}

function showSuccess(message) {
    alert(message); // 简单实现，可以改为更好的UI
}

/**
 * 生成默认头像SVG
 * @param {string} username - 用户名
 * @param {number} [size=40] - 头像大小
 * @returns {string} SVG字符串
 */
function generateAvatarSVG(username, size = 40) {
    // 从用户名生成颜色
    const getColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    };

    // 获取用户名首字母或前两个字符
    const getInitials = (name) => {
        if (!name) return '?';
        if (name.length <= 2) return name.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    const bgColor = getColor(username);
    const initials = getInitials(username);

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size / 5}"/>
            <text x="50%" y="50%" dy=".1em"
                  fill="white"
                  font-family="Arial, sans-serif"
                  font-size="${size / 2}"
                  font-weight="bold"
                  text-anchor="middle"
                  dominant-baseline="middle">
                ${initials}
            </text>
        </svg>
    `;
}

/**
 * 更新用户头像显示
 * @param {Object} user - 用户数据
 */
function updateAvatarDisplay(user) {
    const avatarContainer = document.getElementById('userAvatar');
    if (!avatarContainer) return;

    if (user.profile?.avatar) {
        // 如果用户有自定义头像，显示图片
        avatarContainer.innerHTML = `<img src="${user.profile.avatar}" alt="用户头像">`;
    } else {
        // 否则显示生成的SVG头像
        avatarContainer.innerHTML = generateAvatarSVG(user.username || user.profile?.nickname || '?', 100);
    }
}

// 初始化标签页切换
function initTabs() {
    const tabs = document.querySelectorAll('.content-tabs .tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // 添加当前活动状态
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`${target}Tab`)?.classList.add('active');
        });
    });
}

// 触发头像上传
function triggerAvatarUpload() {
    document.getElementById('avatarUpload').click();
}

// 处理头像上传
document.getElementById('avatarUpload')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        // 转换为Base64
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target?.result;
            if (!base64) return;

            const currentUser = getCurrentUser();
            if (!currentUser) return;

            // 更新用户头像
            currentUser.profile = {
                ...currentUser.profile,
                avatar: base64
            };

            // 保存到localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            // 更新显示
            updateAvatarDisplay(currentUser);
            showSuccess('头像更新成功');
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('上传头像失败:', error);
        showError('上传头像失败，请重试');
    }
});

// 移除收藏
async function removeCollection(recipeId) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // 移除收藏
        currentUser.collectedRecipes = currentUser.collectedRecipes.filter(id => id !== recipeId);

        // 保存更新
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        // 重新加载收藏列表
        await loadUserCollections(currentUser.id);
        showSuccess('已取消收藏');
    } catch (error) {
        console.error('取消收藏失败:', error);
        showError('取消收藏失败，请重试');
    }
}

// 添加表单初始化函数
function initForms() {
    // 初始化设置表单
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const currentUser = getCurrentUser();
                if (!currentUser) return;

                // 更新用户资料
                currentUser.profile = {
                    ...currentUser.profile,
                    nickname: e.target.nickname.value,
                    email: e.target.email.value,
                    bio: e.target.bio.value,
                    showEmail: e.target.showEmail.checked,
                    showPhone: e.target.showPhone.checked
                };

                // 保存更新
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }

                showSuccess('设置已保存');
                // 重新加载用户资料
                await loadUserProfile();
            } catch (error) {
                console.error('保存设置失败:', error);
                showError('保存设置失败，请重试');
            }
        });
    }

    // 初始化编辑资料表单
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const currentUser = getCurrentUser();
                if (!currentUser) return;

                // 更新基本资料
                currentUser.profile = {
                    ...currentUser.profile,
                    nickname: e.target.editNickname.value,
                    bio: e.target.editBio.value
                };

                // 保存更新
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }

                showSuccess('资料已更新');
                closeEditProfile();
                // 重新加载用户资料
                await loadUserProfile();
            } catch (error) {
                console.error('更新资料失败:', error);
                showError('更新资料失败，请重试');
            }
        });
    }
}

// 编辑资料相关函数
function editProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    // 填充表单
    document.getElementById('editNickname').value = currentUser.profile?.nickname || '';
    document.getElementById('editBio').value = currentUser.profile?.bio || '';

    // 显示模态框
    modal.style.display = 'block';
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 修改密码函数
function changePassword() {
    // TODO: 实现修改密码功能
    alert('修改密码功能开发中...');
}

// 修改手机号函数
function changePhone() {
    // TODO: 实现修改手机号功能
    alert('修改手机号功能开发中...');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        loadUserCollections(currentUser.id);
        loadUserHistory(currentUser.id);
    }
});

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
 * 切换收藏状态
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

        // 重新加载收藏列表
        await loadUserCollections(currentUser.id);

        // 显示提示
        showSuccess(index === -1 ? '收藏成功' : '已取消收藏');
    } catch (error) {
        showError(error.message || '操作失败，请重试');
    }
}

/**
 * 加载关注列表
 */
async function loadFollowing(userId) {
    try {
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        const currentUser = users.find(u => u.id === userId);

        if (!currentUser) return;

        const following = currentUser.following || [];
        const container = document.getElementById('followingList');

        container.innerHTML = following.length ? following.map(followId => {
            const user = users.find(u => u.id === followId);
            if (!user) return '';

            return `
                <div class="user-card">
                    <div class="user-avatar">${user.username[0]}</div>
                    <div class="user-info">
                        <span class="user-name">${user.username}</span>
                        <span class="user-bio">${user.profile?.bio || '这个人很懒，什么都没写~'}</span>
                    </div>
                    <button 
                        class="follow-btn following" 
                        onclick="toggleFollow('${user.id}', event)"
                    >已关注</button>
                </div>
            `;
        }).join('') : '<p class="empty-tip">暂无关注</p>';
    } catch (error) {
        console.error('加载关注列表失败:', error);
        showError('加载关注列表失败，请重试');
    }
}

/**
 * 加载粉丝列表
 */
async function loadFollowers(userId) {
    try {
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        const currentUser = users.find(u => u.id === userId);

        if (!currentUser) return;

        const followers = users.filter(u => u.following?.includes(userId));
        const container = document.getElementById('followersList');

        // 获取当前用户的关注列表，用于判断是否已关注
        const currentUserData = getCurrentUser();
        const currentUserFollowing = currentUserData?.following || [];

        container.innerHTML = followers.length ? followers.map(user => `
            <div class="user-card">
                <div class="user-avatar">${user.username[0]}</div>
                <div class="user-info">
                    <span class="user-name">${user.username}</span>
                    <span class="user-bio">${user.profile?.bio || '这个人很懒，什么都没写~'}</span>
                </div>
                ${user.id !== currentUserData?.id ? `
                    <button 
                        class="follow-btn ${currentUserFollowing.includes(user.id) ? 'following' : ''}" 
                        onclick="toggleFollow('${user.id}', event)"
                    >${currentUserFollowing.includes(user.id) ? '已关注' : '关注'}</button>
                ` : ''}
            </div>
        `).join('') : '<p class="empty-tip">暂无粉丝</p>';
    } catch (error) {
        console.error('加载粉丝列表失败:', error);
        showError('加载粉丝列表失败，请重试');
    }
}

/**
 * 创建模态框
 */
function createModal(id) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    document.body.appendChild(modal);

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(id);
        }
    });

    return modal;
}

/**
 * 关闭模态框
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 显示切换账号模态框
 */
function showSwitchAccountModal() {
    try {
        const currentUserId = getCurrentUser()?.id;
        const users = DataStore.get(DataStore.KEYS.USERS) || [];

        // 过滤掉当前账号，并确保没有重复
        const uniqueUsers = users.filter((user, index, self) =>
            user.id !== currentUserId &&
            self.findIndex(u => u.username === user.username) === index
        );

        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>切换账号</h3>
                    <button class="close-btn" onclick="closeModal('switchAccountModal')">&times;</button>
                </div>
                <div class="accounts-list">
                    ${uniqueUsers.map(user => `
                        <div class="account-item" onclick="selectAccount('${user.id}')">
                            <div class="account-avatar">${user.username[0].toUpperCase()}</div>
                            <div class="account-info">
                                <div class="account-name">${user.username}</div>
                                <div class="account-email">${user.email || ''}</div>
                            </div>
                        </div>
                    `).join('')}
                    <div class="account-item add-account" onclick="window.location.href='register.html'">
                        <div class="account-avatar">+</div>
                        <div class="account-info">
                            <div class="account-name">添加新账号</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = document.getElementById('switchAccountModal') || createModal('switchAccountModal');
        modal.innerHTML = modalContent;
        modal.style.display = 'block';
    } catch (error) {
        console.error('显示切换账号模态框失败:', error);
        showError('显示切换账号模态框失败，请重试');
    }
}

/**
 * 选择账号并切换
 */
function selectAccount(userId) {
    if (!userId) {
        console.error('未选择用户');
        showError('请选择要切换的账号');
        return;
    }

    try {
        // 调用 auth.js 中的 switchAccount
        switchAccount(userId);

        // 关闭模态框
        const modal = document.getElementById('switchAccountModal');
        if (modal) {
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error('选择账号失败:', error);
        showError(error.message || '切换账号失败，请重试');
    }
}

/**
 * 退出登录
 */
function logout() {
    if (confirm('确定要退出登录吗？')) {
        try {
            // 清除当前用户数据
            localStorage.removeItem('currentUser');

            // 跳转到登录页
            window.location.href = 'login.html';
        } catch (error) {
            console.error('退出登录失败:', error);
            showError('退出登录失败，请重试');
        }
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

        // 重新加载粉丝列表
        loadFollowers(currentUser.id);

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