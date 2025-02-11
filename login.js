/**
 * 登录页面交互逻辑
 */

// 验证码倒计时
let countdownTimer = null;
const COUNTDOWN_TIME = 60;

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initTabs();
    initForms();
    initPasswordToggles();
    initPasswordStrength();
});

/**
 * 初始化表单切换标签
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 切换表单显示
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${target}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // 处理表单内的切换链接
    document.querySelectorAll('.form-hint a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(`.tab-btn[data-tab="${link.dataset.tab}"]`).click();
        });
    });
}

/**
 * 初始化表单提交处理
 */
function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 注册表单处理
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // 表单验证
            if (!username || !email || !password || !confirmPassword) {
                showError(registerForm, '请填写完整信息');
                return;
            }

            if (password !== confirmPassword) {
                showError(registerForm, '两次输入的密码不一致');
                return;
            }

            if (!agreeTerms) {
                showError(registerForm, '请阅读并同意服务条款');
                return;
            }

            // 验证邮箱格式
            if (!isValidEmail(email)) {
                showError(registerForm, '请输入有效的邮箱地址');
                return;
            }

            // 执行注册
            await register({
                username,
                email,
                password,
                nickname: username
            });

            // 注册成功后自动切换到登录表单
            document.querySelector('.tab-btn[data-tab="login"]').click();
            showSuccess(loginForm, '注册成功，请登录');
        } catch (error) {
            showError(registerForm, error.message);
        }
    });
}

/**
 * 处理登录提交
 */
async function handleLogin(e) {
    e.preventDefault();

    const accountInput = document.getElementById('loginAccount');
    const passwordInput = document.getElementById('loginPassword');

    if (!accountInput || !passwordInput) {
        console.error('找不到登录表单元素');
        alert('系统错误，请刷新页面重试');
        return;
    }

    const username = accountInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        console.log('尝试登录:', username);
        const success = await login(username, password);

        if (success) {
            console.log('登录成功，准备跳转');
            // 确保UI更新
            updateAuthUI();
            // 延迟跳转，让用户看到更新后的UI
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            console.log('登录失败');
            alert('用户名或密码错误');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('登录过程出错:', error);
        alert('登录失败，请重试');
    }
}

/**
 * 显示错误信息
 * @param {HTMLElement} form - 表单元素
 * @param {string} message - 错误信息
 */
function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.querySelector('button[type="submit"]').before(errorDiv);
    }
    errorDiv.textContent = message;
}

/**
 * 显示成功信息
 * @param {HTMLElement} form - 表单元素
 * @param {string} message - 成功信息
 */
function showSuccess(form, message) {
    let successDiv = form.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        form.querySelector('button[type="submit"]').before(successDiv);
    }
    successDiv.textContent = message;
}

/**
 * 添加邮箱验证函数
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 初始化密码显示切换
 */
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
            }
        });
    });
}

/**
 * 初始化密码强度检测
 */
function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', () => {
            const password = input.value;
            const strength = checkPasswordStrength(password);
            showPasswordStrength(input, strength);
        });
    });
}

// 检查密码强度
function checkPasswordStrength(password) {
    let score = 0;

    // 长度检查
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // 包含数字
    if (/\d/.test(password)) score++;

    // 包含小写字母
    if (/[a-z]/.test(password)) score++;

    // 包含大写字母
    if (/[A-Z]/.test(password)) score++;

    // 包含特殊字符
    if (/[!@#$%^&*]/.test(password)) score++;

    return score;
}

// 显示密码强度
function showPasswordStrength(input, strength) {
    let strengthText = '';
    let strengthClass = '';

    switch (strength) {
        case 0:
        case 1:
            strengthText = '弱';
            strengthClass = 'weak';
            break;
        case 2:
        case 3:
            strengthText = '中';
            strengthClass = 'medium';
            break;
        case 4:
        case 5:
            strengthText = '强';
            strengthClass = 'strong';
            break;
        default:
            strengthText = '非常强';
            strengthClass = 'very-strong';
    }

    // 显示强度提示
    let strengthIndicator = input.parentElement.querySelector('.strength-indicator');
    if (!strengthIndicator) {
        strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'strength-indicator';
        input.parentElement.appendChild(strengthIndicator);
    }

    strengthIndicator.textContent = `密码强度：${strengthText}`;
    strengthIndicator.className = `strength-indicator ${strengthClass}`;
}

/**
 * 模拟发送短信验证码
 * @param {string} phone - 手机号
 * @returns {Promise<string>} 验证码
 */
async function sendSmsCode(phone) {
    // 模拟API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            const code = Math.random().toString().slice(-6);
            console.log(`验证码：${code}`); // 实际项目中应该通过短信发送
            resolve(code);
        }, 1000);
    });
}

// 清理工作
window.addEventListener('beforeunload', () => {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
}); 