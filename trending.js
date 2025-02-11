/**
 * 渲染时间线内容
 */
function renderTimeline() {
    const timelineContainer = document.getElementById('timeline');
    if (!timelineContainer) return;

    const timelineHtml = `
        <div class="timeline-item">
            <div class="timeline-content">
                <h3>经典方剂</h3>
                <p>传统中医经典处方，历经千年验证</p>
            </div>
        </div>
        <div class="timeline-item">
            <div class="timeline-content">
                <h3>养生方剂</h3>
                <p>现代养生保健方剂，简单易用</p>
            </div>
        </div>
    `;

    timelineContainer.innerHTML = timelineHtml;
}

// 初始化页面
window.onload = renderTimeline;

/**
 * 网红方剂功能实现
 */

// 当前页码和筛选条件
let currentPage = 1;
const PAGE_SIZE = 12;
let currentCategory = 'all';
let searchKeyword = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadRecipes();
    initFilters();
    initSearch();
});

/**
 * 初始化筛选标签
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.tag-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新标签状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新筛选条件并重新加载
            currentCategory = btn.dataset.category;
            currentPage = 1;
            loadRecipes();
        });
    });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchKeyword = searchInput.value.trim().toLowerCase();
            currentPage = 1;
            loadRecipes();
        }, 500);
    });
}

/**
 * 加载方剂列表
 */
async function loadRecipes() {
    try {
        // 获取所有方剂数据
        const recipes = [...classicRecipes, ...popularRecipes];

        // 筛选数据
        const filteredRecipes = filterRecipes(recipes);

        // 分页处理
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const pageRecipes = filteredRecipes.slice(start, end);

        // 渲染列表
        const container = document.getElementById('recipesList');
        if (currentPage === 1) {
            container.innerHTML = '';
        }

        // 获取当前用户的收藏列表
        const user = getCurrentUser();
        const collectedRecipes = user ? user.collectedRecipes || [] : [];

        // 渲染每个方剂卡片
        pageRecipes.forEach(recipe => {
            recipe.isCollected = collectedRecipes.includes(recipe.id);
            container.appendChild(createRecipeCard(recipe));
        });

        // 更新加载更多按钮状态
        const loadMoreBtn = document.querySelector('.load-more button');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = end >= filteredRecipes.length ? 'none' : 'block';
        }
    } catch (error) {
        console.error('加载方剂失败:', error);
        showError('加载失败，请重试');
    }
}

/**
 * 筛选方剂数据
 */
function filterRecipes(recipes) {
    return recipes.filter(recipe => {
        // 类型筛选
        if (currentCategory === 'classic' && recipe.type !== 'classic') {
            return false;
        }
        if (currentCategory === 'popular' && recipe.type !== 'popular') {
            return false;
        }

        // 关键词搜索
        if (searchKeyword) {
            const searchText = `${recipe.name}${recipe.description}${recipe.effects}`.toLowerCase();
            return searchText.includes(searchKeyword);
        }

        return true;
    });
}

/**
 * 创建方剂卡片
 * @param {Object} recipe - 方剂数据
 * @returns {HTMLElement} 卡片元素
 */
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.onclick = () => showRecipeDetail(recipe.id);

    card.innerHTML = `
        <div class="recipe-header">
            <span class="recipe-icon">${recipe.image}</span>
            <h3 class="recipe-name">${recipe.name}</h3>
            ${recipe.type === 'classic' ? '<span class="recipe-tag classic">经典</span>' :
            '<span class="recipe-tag popular">养生</span>'}
        </div>
        <div class="recipe-info">
            <p class="recipe-desc">${recipe.description}</p>
            <div class="recipe-tags">
                ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="recipe-stats">
            <span class="views">👁️ ${recipe.views}</span>
            <span class="likes">❤️ ${recipe.likes}</span>
            <button class="collect-btn ${recipe.isCollected ? 'collected' : ''}" data-id="${recipe.id}">
                ${recipe.isCollected ? '已收藏' : '收藏'}
            </button>
        </div>
    `;

    return card;
}

/**
 * 切换收藏状态
 */
function toggleCollection(recipeId) {
    const user = getCurrentUser();
    if (!user) return showLoginModal();

    if (user.collectedRecipes?.includes(recipeId)) {
        removeFromCollection(user.id, recipeId);
    } else {
        addToCollection(user.id, recipeId);
    }
    loadRecipes(); // 刷新列表
}

/**
 * 显示方剂详情
 * @param {string} recipeId - 方剂ID
 */
async function showRecipeDetail(recipeId) {
    try {
        const recipe = await getRecipeDetail(recipeId);

        // 更新浏览量
        updateRecipeViews(recipeId);

        // 显示详情模态框
        const modal = document.getElementById('recipeModal');
        const detail = document.getElementById('recipeDetail');

        detail.innerHTML = `
            <div class="recipe-header">
                <div class="recipe-info">
                    <h2>${recipe.name}</h2>
                    <div class="recipe-tags">
                        ${recipe.tags.map(tag => `
                            <span class="recipe-tag">${tag}</span>
                        `).join('')}
                    </div>
                    <p>${recipe.description}</p>
                </div>
            </div>
            
            <div class="recipe-section">
                <h3>功效主治</h3>
                <p>${recipe.effects}</p>
            </div>
            
            <div class="recipe-section">
                <h3>配方组成</h3>
                <div class="ingredients-list">
                    ${recipe.ingredients.map(item => `
                        <div class="ingredient-item">
                            <span>${item.name}</span>
                            <span>${item.amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recipe-section">
                <h3>制备方法</h3>
                <ol class="preparation-steps">
                    ${recipe.preparation.map(step => `
                        <li>${step}</li>
                    `).join('')}
                </ol>
            </div>
            
            <div class="recipe-section">
                <h3>服用方法</h3>
                <p>${recipe.usage}</p>
            </div>
            
            <div class="recipe-section">
                <h3>注意事项</h3>
                <p>${recipe.precautions}</p>
            </div>
        `;

        modal.style.display = 'flex';
    } catch (error) {
        console.error('加载方剂详情失败:', error);
        showError('加载详情失败，请重试');
    }
}

/**
 * 关闭方剂详情
 */
function closeRecipeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

/**
 * 加载更多方剂
 */
function loadMoreRecipes() {
    currentPage++;
    loadRecipes();
}

// 工具函数
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function showError(message) {
    alert(message); // 实际项目中应该使用更友好的提示
}

// 关闭模态框的其他方式
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeRecipeModal();
    }
});

document.getElementById('recipeModal')?.addEventListener('click', e => {
    if (e.target.id === 'recipeModal') {
        closeRecipeModal();
    }
});

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .recipe-icon {
        font-size: 2rem;
        margin-right: 1rem;
    }
    
    .recipe-card {
        position: relative;
        padding: 1.5rem;
        margin-bottom: 1rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .recipe-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);

/**
 * 获取方剂详情
 */
async function getRecipeDetail(recipeId) {
    // 从所有方剂中查找
    const allRecipes = [...classicRecipes, ...popularRecipes];
    const recipe = allRecipes.find(r => r.id === recipeId);

    if (!recipe) {
        throw new Error('方剂不存在');
    }

    return recipe;
}

/**
 * 更新方剂浏览量
 */
function updateRecipeViews(recipeId) {
    const allRecipes = [...classicRecipes, ...popularRecipes];
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (recipe) {
        recipe.views += 1;
    }
} 