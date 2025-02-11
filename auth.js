/**
 * 用户数据结构
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} passwordHash - 加密后的密码
 * @property {string} email - 邮箱
 * @property {string} createdAt - 注册时间
 * @property {Object} profile - 用户资料
 * @property {string} role - 用户角色
 */

// 初始化用户存储
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

/**
 * 密码加密函数
 * @param {string} password - 原始密码
 * @returns {Promise<string>} 加密后的密码
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * 清理用户输入
 * @param {string} input - 用户输入
 * @returns {string} 清理后的输入
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    // 移除HTML标签
    input = input.replace(/<[^>]*>/g, '');
    // 移除特殊字符
    input = input.replace(/[<>'"]/g, '');
    // 移除前后空格
    return input.trim();
}

// 移除旧的事件监听器，统一使用register函数
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const username = sanitizeInput(document.getElementById('registerUsername').value);
        const email = sanitizeInput(document.getElementById('registerEmail').value);
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            throw new Error('两次输入的密码不一致');
        }

        await register({
            username,
            email,
            password
        });

        alert('注册成功！');
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message || '注册失败');
    }
});

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @returns {Promise<Object>} 注册成功的用户信息
 */
async function register(userData) {
    try {
        // 验证用户数据
        validateUserData(userData);

        // 清理用户输入
        const cleanUsername = sanitizeInput(userData.username);
        const cleanEmail = sanitizeInput(userData.email);

        // 检查用户名是否已存在
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        if (users.some(u => u.username === cleanUsername)) {
            throw new Error('用户名已存在');
        }

        // 创建新用户
        const newUser = {
            id: generateUserId(),
            username: cleanUsername,
            passwordHash: await hashPassword(userData.password),
            email: cleanEmail,
            createdAt: new Date().toISOString(),
            role: UserRole.USER,
            profile: {
                email: cleanEmail,
                nickname: cleanUsername
            },
            favorites: [],
            following: [],
            followers: [],
            posts: []
        };

        // 保存用户数据到DataStore
        users.push(newUser);
        DataStore.set(DataStore.KEYS.USERS, users);

        return newUser;
    } catch (error) {
        console.error('注册失败:', error);
        throw error;
    }
}

/**
 * 用户登录
 */
async function login(username, password) {
    try {
        // 获取用户数据
        const users = DataStore.get(DataStore.KEYS.USERS) || [];

        // 清理输入
        const cleanUsername = sanitizeInput(username);

        // 查找用户
        const user = users.find(u => u.username === cleanUsername);
        if (!user) {
            return false;
        }

        // 验证密码
        const hashedPassword = await hashPassword(password);
        const isValid = user.passwordHash === hashedPassword;

        if (isValid) {
            // 确保用户数据结构完整
            user.following = user.following || [];
            user.posts = user.posts || [];
            user.profile = user.profile || {};

            // 保存登录状态
            localStorage.setItem('currentUser', JSON.stringify(user));

            // 更新当前用户
            setCurrentUser(user);

            return true;
        }
        return false;
    } catch (error) {
        console.error('登录失败:', error);
        return false;
    }
}

/**
 * 认证服务模块
 */

// 用户角色枚举
const UserRole = {
    GUEST: 'guest',
    USER: 'user',
    ADMIN: 'admin'
};

// 用户状态管理
let currentUser = null;

/**
 * 初始化认证系统
 */
function initAuth() {
    // 确保测试账号存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        // 创建测试账号时就进行密码加密
        hashPassword('test123').then(hashedPassword => {
            const testUser = {
                id: 'user_test001',
                username: 'test_user',
                passwordHash: hashedPassword, // 存储加密后的密码
                role: 'user',
                createdAt: '2024-03-20T14:16:04.729Z',
                profile: {
                    email: 'test@example.com',
                    nickname: 'test_user'
                }
            };
            localStorage.setItem('users', JSON.stringify([testUser]));
        });
    }

    // 检查登录状态
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateAuthUI();
    }
}

/**
 * 用户登出
 */
function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

/**
 * 更新认证UI
 */
function updateAuthUI() {
    const authItem = document.getElementById('authItem');
    if (!authItem) {
        console.error('找不到authItem元素');
        return;
    }

    const currentUser = getCurrentUser();
    console.log('更新UI，当前用户:', currentUser);

    if (currentUser) {
        // 显示用户名和下拉菜单
        authItem.innerHTML = `
            <div class="user-menu">
                <a href="profile.html" class="username">
                    ${currentUser.profile.nickname || currentUser.username}
                </a>
            </div>
        `;
    } else {
        authItem.innerHTML = `<a href="login.html">登录/注册</a>`;
    }
}

/**
 * 检查用户权限
 * @param {string} requiredRole - 所需角色
 * @returns {boolean} 是否有权限
 */
function checkPermission(requiredRole) {
    if (!currentUser) return false;

    const roles = Object.values(UserRole);
    const userRoleIndex = roles.indexOf(currentUser.role);
    const requiredRoleIndex = roles.indexOf(requiredRole);

    return userRoleIndex >= requiredRoleIndex;
}

/**
 * 获取当前用户
 * @returns {Object|null} 当前用户信息
 */
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('获取当前用户失败:', error);
        return null;
    }
}

function generateToken(user) {
    // 简单的token生成
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    };
    return btoa(JSON.stringify(payload));
}

function verifyToken(token) {
    try {
        const payload = JSON.parse(atob(token));
        if (payload.exp < Date.now()) {
            throw new Error('Token已过期');
        }
        return payload;
    } catch (error) {
        throw new Error('无效的Token');
    }
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validateUserData(data) {
    if (!data.username || data.username.length < 3) {
        throw new Error('用户名至少需要3个字符');
    }
    if (!data.password || data.password.length < 6) {
        throw new Error('密码至少需要6个字符');
    }
    if (!data.email || !data.email.includes('@')) {
        throw new Error('请输入有效的邮箱地址');
    }
}

function setCurrentUser(user) {
    currentUser = user;
    updateAuthUI();
}

// 导出需要的函数和常量
window.UserRole = UserRole;
window.initAuth = initAuth;
window.register = register;
window.login = login;
window.logout = logout;
window.checkPermission = checkPermission;
window.getCurrentUser = getCurrentUser;

// 确保页面加载完成后更新UI
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

/**
 * 切换账号
 */
function switchAccount(userId) {
    try {
        if (!userId) {
            throw new Error('用户ID不能为空');
        }

        // 获取用户数据
        const users = DataStore.get(DataStore.KEYS.USERS) || [];
        console.log('可用用户列表:', users); // 添加调试日志

        const user = users.find(u => u.id === userId);
        console.log('目标用户:', user); // 添加调试日志

        if (!user) {
            throw new Error('用户不存在');
        }

        // 保存当前数据
        DataStore.backup();

        // 更新当前用户
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 恢复数据
        DataStore.restore();

        // 刷新页面
        window.location.reload();
    } catch (error) {
        console.error('切换账号失败:', error);
        showError('切换账号失败，请重试');
    }
} 