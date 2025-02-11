/**
 * 初始化页面
 */
function init() {
    try {
        // 确保数据已加载
        if (!Array.isArray(herbsData) || !Array.isArray(formulasData)) {
            console.error('数据未正确加载');
            return;
        }

        // 默认显示全部中药和方剂
        renderHerbs('全部');
        renderFormulas('all');
        initSearch();
        initQuickNav();
        initScrollAnimation();
        initHerbFilters();
        initButtonEvents();
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

/**
 * 渲染中药卡片
 */
function renderHerbs(filter = '全部') {
    const container = document.getElementById('herbsContainer');
    let herbs = herbsData;

    if (filter !== '全部') {
        herbs = herbsData.filter(herb => {
            return herb.effect && herb.effect.includes(filter);
        });
    }

    // 只显示前5个
    herbs = herbs.slice(0, 5);

    container.innerHTML = herbs.map(herb => `
        <div class="herb-card">
            <div class="herb-icon">🌿</div>
            <h3>${herb.name}</h3>
            <p class="herb-alias">${herb.alias ? '别名：' + herb.alias.join('、') : ''}</p>
            <p class="herb-nature">性味：${herb.nature}，${herb.taste}</p>
            <p class="herb-meridian">归经：${herb.meridian}</p>
            <p class="herb-effect">功效：${herb.effect}</p>
            <p class="herb-usage">用法：${herb.usage}</p>
            <p class="herb-source">出处：${herb.source}</p>
            ${herb.precautions ? `<p class="herb-precautions">注意：${herb.precautions}</p>` : ''}
        </div>
    `).join('');
}

/**
 * 过滤并渲染方剂
 * @param {string} type - 方剂类型 (all/classic/trending)
 */
function filterFormulas(type) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn =>
        btn.classList.toggle('active', btn.textContent === type)
    );

    // 过滤数据
    const filtered = formulasData.filter(formula =>
        type === 'all' ||
        (type === 'classic' && !formula.isTrending) ||
        (type === 'trending' && formula.isTrending)
    );

    renderFormulas(filtered);
}

/**
 * 渲染方剂卡片
 * @param {string|Array} formulas - 要渲染的方剂数据或类型
 */
function renderFormulas(filter = 'all') {
    const container = document.getElementById('formulasContainer');
    let formulas = formulasData;

    if (filter !== 'all') {
        formulas = formulasData.filter(formula => formula.type === filter);
    }

    // 只显示前5个
    formulas = formulas.slice(0, 5);

    container.innerHTML = formulas.map(formula => `
        <div class="formula-card">
            <h3>${formula.name}</h3>
            <p class="formula-type">${formula.type === 'classic' ? '传统经方' : '网红养生方'}</p>
            <p class="formula-effect">${formula.effect}</p>
            <div class="formula-herbs">
                ${formula.composition.map(item => `
                    <span class="herb-tag">${item.herb} ${item.weight}</span>
                `).join('')}
            </div>
            <p class="formula-source">出处：${formula.source}</p>
        </div>
    `).join('');
}

// 添加滚动动画
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('.herb-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * 搜索功能实现
 */
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar .btn-modern');

    const handleSearch = () => {
        const keyword = searchInput.value.toLowerCase().trim();
        if (!keyword) return;

        // 搜索中药
        const herbResults = herbsData.filter(herb =>
            herb.name.toLowerCase().includes(keyword) ||
            herb.efficacy.toLowerCase().includes(keyword) ||
            herb.properties.toLowerCase().includes(keyword)
        );

        // 搜索方剂
        const formulaResults = formulasData.filter(formula =>
            formula.name.toLowerCase().includes(keyword) ||
            formula.efficacy.toLowerCase().includes(keyword) ||
            formula.indications.some(ind => ind.toLowerCase().includes(keyword))
        );

        // 渲染搜索结果
        renderSearchResults(herbResults, formulaResults);
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

function renderSearchResults(herbs, formulas) {
    const resultsSection = document.createElement('section');
    resultsSection.className = 'content-section search-results';
    resultsSection.innerHTML = `
        <div class="section-header">
            <h2 class="gradient-text">搜索结果</h2>
            <button class="btn-modern" onclick="clearSearch()">返回</button>
        </div>
        <div class="content-grid">
            ${[...herbs, ...formulas].map(item => `
                <div class="content-card">
                    <h3>${item.name}</h3>
                    <div class="property-tags">
                        ${(item.properties || item.indications).split('；').map(p =>
        `<span class="property-tag">${p}</span>`
    ).join('')}
                    </div>
                    <p class="herb-desc">${item.efficacy}</p>
                    <button class="btn-modern" onclick="showDetail('${item.id}')">查看详情</button>
                </div>
            `).join('')}
        </div>
    `;

    // 替换现有内容
    const mainContent = document.querySelector('#herbs').parentNode;
    mainContent.insertBefore(resultsSection, document.querySelector('#herbs'));
    document.querySelector('#herbs').style.display = 'none';
    document.querySelector('#formulas').style.display = 'none';
}

/**
 * 初始化快速导航
 */
function initQuickNav() {
    const quickNavItems = document.querySelectorAll('.quick-nav-item');

    quickNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const textSpan = item.querySelector('span:last-child');
            if (!textSpan) return;

            const action = textSpan.textContent.trim();

            switch (action) {
                case '药材识别':
                    window.location.href = 'ar.html';
                    break;

                case '方剂查询':
                    showFormulaSearchPanel();
                    break;

                case '功效检索':
                    window.location.href = 'effects.html';
                    break;

                case '全部':
                    renderHerbs();
                    break;

                case '补气养血':
                case '清热解毒':
                case '活血化瘀':
                    filterHerbsByEffect(action);
                    break;
            }
        });
    });
}

/**
 * 显示方剂查询面板
 */
function showFormulaSearchPanel() {
    const modal = createModal(`
        <div class="formula-search-panel">
            <h3>方剂查询</h3>
            <div class="search-options">
                <input type="text" id="formulaKeyword" placeholder="输入方剂名称、功效或症状">
                <div class="filter-options">
                    <label><input type="checkbox" value="classic"> 经典方剂</label>
                    <label><input type="checkbox" value="trending"> 网红方剂</label>
                </div>
            </div>
            <div id="formulaResults" class="formula-results"></div>
        </div>
    `);

    // 添加搜索事件
    const searchInput = modal.querySelector('#formulaKeyword');
    searchInput.addEventListener('input', debounce(handleFormulaSearch, 300));
}

/**
 * 处理方剂搜索
 */
function handleFormulaSearch() {
    const keyword = document.getElementById('formulaKeyword').value.toLowerCase().trim();
    const classicOnly = document.querySelector('input[value="classic"]').checked;
    const trendingOnly = document.querySelector('input[value="trending"]').checked;

    // 筛选方剂
    let results = formulasData.filter(formula => {
        const matchesKeyword = formula.name.toLowerCase().includes(keyword) ||
            formula.efficacy.toLowerCase().includes(keyword) ||
            formula.indications.some(ind => ind.toLowerCase().includes(keyword));

        const matchesType = (!classicOnly && !trendingOnly) ||
            (classicOnly && !formula.isTrending) ||
            (trendingOnly && formula.isTrending);

        return matchesKeyword && matchesType;
    });

    // 渲染结果
    const container = document.getElementById('formulaResults');
    container.innerHTML = results.length ? results.map(formula => `
        <div class="formula-card">
            <h4>${formula.name} ${formula.isTrending ? '🔥' : '📜'}</h4>
            <div class="formula-tags">
                ${formula.indications.map(ind =>
        `<span class="tag">${ind}</span>`
    ).join('')}
            </div>
            <div class="formula-composition">
                ${Object.entries(formula.composition).map(([herb, amount]) =>
        `<p>${herb}: ${amount}</p>`
    ).join('')}
            </div>
            <button class="btn-modern" onclick="showFormulaDetail('${formula.id}')">
                查看详情
            </button>
        </div>
    `).join('') : '<p class="no-results">未找到相关方剂</p>';
}

/**
 * 显示方剂详情
 * @param {string} id - 方剂ID
 */
function showFormulaDetail(id) {
    const formula = formulasData.find(f => f.id === id);
    if (!formula) return;

    const modal = createModal(`
        <div class="formula-detail">
            <h2>${formula.name} ${formula.isTrending ? '🔥' : '📜'}</h2>
            <div class="formula-info">
                <h3>功效</h3>
                <p>${formula.efficacy}</p>
                
                <h3>适应症</h3>
                <div class="indication-tags">
                    ${formula.indications.map(ind =>
        `<span class="tag">${ind}</span>`
    ).join('')}
                </div>
                
                <h3>组成</h3>
                <div class="composition-table">
                    ${Object.entries(formula.composition).map(([herb, amount]) => `
                        <div class="herb-row">
                            <span class="herb-name">${herb}</span>
                            <span class="herb-amount">${amount}</span>
                        </div>
                    `).join('')}
                </div>
                
                ${formula.usage ? `
                    <h3>用法</h3>
                    <p>${formula.usage}</p>
                ` : ''}
                
                ${formula.notes ? `
                    <h3>注意事项</h3>
                    <p class="warning">${formula.notes}</p>
                ` : ''}
                
                <div class="reference">
                    <p>来源：${formula.reference}</p>
                    ${formula.isTrending ? `
                        <div class="evolution">
                            <h3>方剂演变</h3>
                            <p>创制年份：${formula.timeline.year}</p>
                            <p>源自：${formula.timeline.origin}</p>
                            <p>改良：${formula.timeline.evolution}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `);
}

/**
 * 显示功效检索面板
 */
function showEffectSearchPanel() {
    // 提取所有功效标签
    const effects = new Set();
    herbsData.forEach(herb => {
        herb.properties.split('；').forEach(p => effects.add(p.trim()));
    });

    // 创建功效分类
    const categories = {
        '补益类': effects => effects.filter(e => e.includes('补') || e.includes('养')),
        '清热类': effects => effects.filter(e => e.includes('清热') || e.includes('解毒')),
        '活血类': effects => effects.filter(e => e.includes('活血') || e.includes('化瘀')),
        '理气类': effects => effects.filter(e => e.includes('理气') || e.includes('行气')),
        '祛湿类': effects => effects.filter(e => e.includes('祛湿') || e.includes('利水'))
    };

    // 创建模态框内容
    const modal = createModal(`
        <div class="effect-search-panel">
            <h3>功效检索</h3>
            <div class="effect-categories">
                ${Object.entries(categories).map(([category, filterFn]) => `
                    <div class="category">
                        <h4>${category}</h4>
                        <div class="effect-tags">
                            ${Array.from(effects)
            .filter(e => filterFn([e]).length > 0)
            .map(effect => `
                                    <label class="effect-tag">
                                        <input type="checkbox" value="${effect}">
                                        <span>${effect}</span>
                                    </label>
                                `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="selected-effects"></div>
            <div class="modal-footer">
                <button class="btn-modern" onclick="applyEffectFilter()">应用筛选</button>
                <button class="btn-modern secondary" onclick="resetEffectFilter()">重置</button>
            </div>
        </div>
    `);

    // 添加选中效果显示
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    const selectedEffects = modal.querySelector('.selected-effects');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const selected = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            selectedEffects.innerHTML = selected.length ?
                `已选择: ${selected.join('、')}` : '';
        });
    });
}

/**
 * 应用功效筛选
 */
function applyEffectFilter() {
    const selected = Array.from(document.querySelectorAll('.effect-tag input:checked'))
        .map(cb => cb.value);

    if (selected.length === 0) {
        alert('请至少选择一个功效');
        return;
    }

    // 筛选药材
    const filtered = herbsData.filter(herb =>
        selected.some(effect => herb.properties.includes(effect))
    );

    // 渲染结果
    renderFilteredHerbs(filtered);

    // 关闭模态框
    document.querySelector('.modal').remove();
}

/**
 * 重置功效筛选
 */
function resetEffectFilter() {
    document.querySelectorAll('.effect-tag input').forEach(cb => {
        cb.checked = false;
    });
    document.querySelector('.selected-effects').innerHTML = '';
}

/**
 * 按功效筛选中药
 * @param {string} effect - 功效类别
 */
function filterHerbsByEffect(effect) {
    if (effect === '功效检索') {
        // 显示功效筛选面板
        const container = document.getElementById('herbsContainer');
        const effects = ['补气养血', '清热解毒', '活血化瘀'];

        container.innerHTML = `
            <div class="effects-panel">
                ${effects.map(e => `
                    <button class="effect-btn" onclick="filterHerbsByEffect('${e}')">
                        ${e}
                    </button>
                `).join('')}
            </div>
        `;
        return;
    }

    // 根据功效筛选中药
    const filtered = herbsData.filter(herb => {
        switch (effect) {
            case '补气养血':
                return herb.properties.includes('补气') || herb.properties.includes('养血');
            case '清热解毒':
                return herb.properties.includes('清热') || herb.properties.includes('解毒');
            case '活血化瘀':
                return herb.properties.includes('活血') || herb.properties.includes('化瘀');
            default:
                return true;
        }
    });

    // 渲染筛选结果
    const container = document.getElementById('herbsContainer');
    container.innerHTML = filtered.map(herb => `
        <div class="content-card">
            <div class="herb-icon">
                ${herb.icon ?
            `<img src="assets/icons/${herb.icon}" alt="${herb.name}" 
                     onerror="this.src='assets/icons/default-herb.svg'">` :
            `<span class="icon-placeholder">${herb.name[0]}</span>`
        }
            </div>
            <h3>${herb.name}</h3>
            <div class="property-tags">
                ${herb.properties.split('；')
            .map(p => `<span class="property-tag">${p}</span>`)
            .join('')}
            </div>
            <p class="herb-desc">${herb.efficacy}</p>
            <button class="btn-modern" onclick="showDetail('${herb.id}')">
                查看详情
            </button>
        </div>
    `).join('');
}

/**
 * 显示详情弹窗
 */
function showDetail(id) {
    // 查找数据
    const item = herbsData.find(h => h.id === id) || formulasData.find(f => f.id === id);
    if (!item) return;

    // 创建详情弹窗
    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" onclick="this.closest('.detail-modal').remove()">×</button>
            <h2>${item.name}</h2>
            ${item.aliases ? `<p class="aliases">别名：${item.aliases.join('、')}</p>` : ''}
            <div class="property-tags">
                ${(item.properties || item.indications).split('；').map(p =>
        `<span class="property-tag">${p}</span>`
    ).join('')}
            </div>
            <div class="detail-content">
                <p><strong>功效：</strong>${item.efficacy}</p>
                ${item.usage ? `<p><strong>用法用量：</strong>${item.usage}</p>` : ''}
                ${item.contraindications ? `
                    <p class="warning"><strong>禁忌：</strong>${item.contraindications}</p>
                ` : ''}
                <p class="reference"><strong>来源：</strong>${item.reference}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * 清除搜索结果，返回主页面
 */
function clearSearch() {
    // 移除搜索结果区域
    document.querySelector('.search-results')?.remove();
    // 显示原有内容
    document.querySelector('#herbs').style.display = 'block';
    document.querySelector('#formulas').style.display = 'block';
    // 清空搜索框
    document.querySelector('.search-bar input').value = '';
}

/**
 * 更新分类按钮状态
 * @param {string} activeCategory - 当前激活的分类
 */
function updateCategoryButtons(activeCategory) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === activeCategory);
    });
}

/**
 * 初始化中药过滤器
 */
function initHerbFilters() {
    const herbFilterButtons = document.querySelectorAll('.herb-tag-btn');
    herbFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 更新按钮状态
            herbFilterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // 获取过滤类型
            const filterType = e.target.textContent;
            filterHerbs(filterType);
        });
    });

    // 初始化方剂过滤器
    const formulaFilterButtons = document.querySelectorAll('.formula-tag-btn');
    formulaFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 更新按钮状态
            formulaFilterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            // 获取过滤类型
            const filterType = e.target.textContent;
            filterFormulas(filterType === '全部' ? 'all' :
                filterType === '传统经方' ? 'classic' : 'trending');
        });
    });
}

/**
 * 过滤中药显示
 * @param {string} type - 过滤类型
 */
function filterHerbs(type) {
    let herbs = herbsData;

    if (type !== '全部') {
        herbs = herbsData.filter(herb => {
            // 确保 effect 属性存在
            return herb.effect && herb.effect.includes(type);
        });
    }

    // 只显示前5个
    herbs = herbs.slice(0, 5);

    const container = document.getElementById('herbsContainer');
    container.innerHTML = herbs.map(herb => `
        <div class="herb-card">
            <div class="herb-icon">🌿</div>
            <h3>${herb.name}</h3>
            <p class="herb-alias">${herb.alias ? herb.alias.join('、') : ''}</p>
            <p class="herb-nature">性味：${herb.nature}，${herb.taste}</p>
            <p class="herb-meridian">归经：${herb.meridian}</p>
            <p class="herb-effect">功效：${herb.effect}</p>
            <p class="herb-usage">用法：${herb.usage}</p>
            <p class="herb-source">出处：${herb.source}</p>
            ${herb.precautions ? `<p class="herb-precautions">注意：${herb.precautions}</p>` : ''}
        </div>
    `).join('');
}

/**
 * 过滤方剂显示
 * @param {string} type - 过滤类型 (all/classic/trending)
 */
function filterFormulas(type) {
    let formulas = formulasData;

    if (type !== 'all') {
        formulas = formulasData.filter(formula => formula.type === type);
    }

    // 只显示前5个
    formulas = formulas.slice(0, 5);

    const container = document.getElementById('formulasContainer');
    container.innerHTML = formulas.map(formula => `
        <div class="formula-card">
            <h3>${formula.name}</h3>
            <p class="formula-type">${formula.type === 'classic' ? '传统经方' : '网红养生方'}</p>
            <p class="formula-effect">${formula.effect}</p>
            <div class="formula-herbs">
                ${formula.composition.map(item => `
                    <span class="herb-tag">${item.herb} ${item.weight}</span>
                `).join('')}
            </div>
            <p class="formula-source">出处：${formula.source}</p>
        </div>
    `).join('');
}

/**
 * 初始化所有按钮事件
 */
function initButtonEvents() {
    // 初始化导航按钮
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // 初始化功能按钮
    document.querySelectorAll('.btn-modern').forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });

    // 初始化卡片点击
    document.querySelectorAll('.content-card').forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
}

/**
 * 处理导航点击
 * @param {Event} e - 点击事件
 */
function handleNavigation(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * 处理按钮点击
 * @param {Event} e - 点击事件
 */
function handleButtonClick(e) {
    const action = e.target.dataset.action;
    const user = getCurrentUser();

    // 检查登录状态
    if (!user && action !== 'search') {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    switch (action) {
        case 'search':
            handleSearch();
            break;
        case 'filter':
            showEffectSearchPanel();
            break;
        case 'submit':
            if (checkPermission(UserRole.USER)) {
                window.location.href = 'submit.html';
            }
            break;
        case 'favorite':
            handleFavorite(e.target.closest('.content-card').dataset.id);
            break;
        default:
            console.log('未知操作:', action);
    }
}

/**
 * 处理卡片点击
 * @param {Event} e - 点击事件
 */
function handleCardClick(e) {
    if (e.target.classList.contains('btn-modern')) return;

    const card = e.currentTarget;
    const id = card.dataset.id;
    showDetail(id);
}

/**
 * 处理收藏功能
 * @param {string} itemId - 项目ID
 */
async function handleFavorite(itemId) {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        const index = favorites.indexOf(itemId);

        if (index === -1) {
            favorites.push(itemId);
            alert('收藏成功');
        } else {
            favorites.splice(index, 1);
            alert('取消收藏');
        }

        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
        updateFavoriteButton(itemId);
    } catch (error) {
        console.error('收藏操作失败:', error);
        alert('操作失败，请重试');
    }
}

/**
 * 更新收藏按钮状态
 * @param {string} itemId - 项目ID
 */
function updateFavoriteButton(itemId) {
    const user = getCurrentUser();
    if (!user) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    const isFavorited = favorites.includes(itemId);

    const btn = document.querySelector(`[data-id="${itemId}"] .btn-favorite`);
    if (btn) {
        btn.innerHTML = isFavorited ? '❤️ 已收藏' : '🤍 收藏';
        btn.classList.toggle('active', isFavorited);
    }
}

/**
 * 创建模态框
 * @param {string} content - 模态框内容
 * @returns {HTMLElement} 模态框元素
 */
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间
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
 * 根据名称查找药材或方剂
 * @param {string} name - 药材或方剂名称
 * @returns {Object} 找到的项目
 */
function findItemByName(name) {
    return herbsData.find(h => h.name === name) ||
        formulasData.find(f => f.name === name);
}

/**
 * 处理方剂点击
 * @param {string} id - 方剂ID
 */
function handleRecipeClick(id) {
    window.location.href = `trending.html?id=${id}`;
}

// 在页面加载时初始化数据
document.addEventListener('DOMContentLoaded', () => {
    // 先初始化认证系统
    initAuth();

    // 然后初始化数据存储（只处理动态数据）
    DataStore.init();

    // 最后初始化页面内容
    init();
}); 