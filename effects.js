/**
 * 功效数据
 */
const effectCategories = {
    '补益类': ['补气', '补血', '补阴', '补阳', '健脾', '养心', '滋肾'],
    '清热类': ['清热', '泻火', '凉血', '解毒', '清虚热'],
    '活血类': ['活血', '化瘀', '止血', '调经', '化痰'],
    '理气类': ['理气', '和胃', '降逆', '解郁', '安神'],
    '祛湿类': ['祛湿', '利水', '化痰', '祛风', '散寒']
};

// 当前选中的功效
let selectedEffects = new Set();

/**
 * 初始化功效检索页面
 */
document.addEventListener('DOMContentLoaded', () => {
    initEffectTabs();
    showEffectTags('补益类'); // 默认显示补益类
    initAuth();

    // 添加功效标签点击事件委托
    document.querySelector('.effect-tags').addEventListener('click', (e) => {
        const effectTag = e.target.closest('.effect-tag');
        if (effectTag) {
            toggleEffect(effectTag);
        }
    });

    // 添加已选功效标签点击事件委托
    document.querySelector('.selected-tags').addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-tag');
        if (removeBtn) {
            const effect = removeBtn.closest('.selected-tag').dataset.effect;
            const tag = document.querySelector(`.effect-tag[data-effect="${effect}"]`);
            if (tag) {
                toggleEffect(tag);
            }
        }
    });
});

/**
 * 初始化分类标签
 */
function initEffectTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新标签状态
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // 显示对应分类的功效标签
            showEffectTags(tab.dataset.category);
        });

        // 添加双击事件以删除该分类下的所有功效
        tab.addEventListener('dblclick', () => {
            const category = tab.dataset.category;
            removeEffectsByCategory(category);
        });
    });
}

/**
 * 移除指定分类下的所有功效
 */
function removeEffectsByCategory(category) {
    const categoryEffects = effectCategories[category];
    categoryEffects.forEach(effect => {
        selectedEffects.delete(effect);
    });

    // 更新UI
    showEffectTags(category);
    updateSelectedEffects();
}

/**
 * 显示指定分类的功效标签
 */
function showEffectTags(category) {
    const tagsContainer = document.querySelector('.effect-tags');
    const effects = effectCategories[category];

    tagsContainer.innerHTML = effects.map(effect => `
        <div class="effect-tag ${selectedEffects.has(effect) ? 'selected' : ''}" 
             data-effect="${effect}">
            ${effect}
        </div>
    `).join('');
}

/**
 * 切换功效选中状态
 */
function toggleEffect(tag) {
    const effect = tag.dataset.effect;
    tag.classList.toggle('selected');

    if (tag.classList.contains('selected')) {
        selectedEffects.add(effect);
    } else {
        selectedEffects.delete(effect);
    }

    updateSelectedEffects();
}

/**
 * 更新已选功效显示
 */
function updateSelectedEffects() {
    const container = document.querySelector('.selected-tags');

    if (selectedEffects.size === 0) {
        container.innerHTML = '<p class="empty-hint">请从上方选择功效标签</p>';
        return;
    }

    // 按分类对已选功效进行分组
    const effectsByCategory = {};
    selectedEffects.forEach(effect => {
        const category = Object.entries(effectCategories).find(([_, effects]) =>
            effects.includes(effect)
        )[0];

        if (!effectsByCategory[category]) {
            effectsByCategory[category] = [];
        }
        effectsByCategory[category].push(effect);
    });

    // 渲染已选功效，按分类分组显示
    container.innerHTML = Object.entries(effectsByCategory).map(([category, effects]) => `
        <div class="selected-category">
            <div class="category-header">
                ${category}
                <span class="remove-category" 
                      title="点击移除该分类下所有功效"
                      data-category="${category}">×</span>
            </div>
            <div class="category-effects">
                ${effects.map(effect => `
                    <div class="selected-tag" data-effect="${effect}">
                        ${effect}
                        <span class="remove-tag" title="点击移除">×</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // 添加移除分类的点击事件
    container.querySelectorAll('.remove-category').forEach(btn => {
        btn.addEventListener('click', () => {
            removeEffectsByCategory(btn.dataset.category);
        });
    });
}

/**
 * 应用功效筛选
 */
function applyEffectFilter() {
    if (selectedEffects.size === 0) {
        alert('请至少选择一个功效');
        document.querySelector('.effect-tags').classList.add('highlight');
        setTimeout(() => {
            document.querySelector('.effect-tags').classList.remove('highlight');
        }, 2000);
        return;
    }

    // 获取所有方剂数据
    const allRecipes = [...classicRecipes, ...popularRecipes];

    // 筛选符合条件的方剂
    const filteredRecipes = allRecipes.filter(recipe => {
        // 检查方剂的标签和效果是否包含选中的功效
        const recipeEffects = new Set([
            ...recipe.tags,
            ...recipe.effects.split('，')[0].split('、')
        ]);

        // 检查是否包含所有选中的功效
        return Array.from(selectedEffects).every(effect =>
            Array.from(recipeEffects).some(e => e.includes(effect))
        );
    });

    // 显示结果
    displayResults(filteredRecipes);
}

/**
 * 显示筛选结果
 */
function displayResults(recipes) {
    const container = document.getElementById('resultsContainer');

    if (recipes.length === 0) {
        container.innerHTML = '<p class="no-results">未找到符合条件的方剂</p>';
        return;
    }

    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-header">
                <span class="recipe-icon">${recipe.image}</span>
                <h3>${recipe.name}</h3>
                <span class="recipe-type ${recipe.type}">
                    ${recipe.type === 'classic' ? '经典' : '养生'}
                </span>
            </div>
            <p class="recipe-desc">${recipe.description}</p>
            <div class="recipe-tags">
                ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="recipe-stats">
                <span>👁️ ${recipe.views}</span>
                <span>❤️ ${recipe.likes}</span>
            </div>
        </div>
    `).join('');
}

/**
 * 重置功效筛选
 */
function resetEffectFilter() {
    selectedEffects.clear();
    document.querySelectorAll('.effect-tag').forEach(tag => {
        tag.classList.remove('selected');
    });
    document.querySelector('.selected-tags').innerHTML = '';
    document.getElementById('resultsContainer').innerHTML = '';
} 