// 初始化投稿数据存储
if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
}

/**
 * 配方创作工坊功能实现
 */

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initHerbSelect();
    checkAuth();
});

/**
 * 初始化药材选择器
 */
function initHerbSelect() {
    const herbOptions = herbsData.map(herb =>
        `<option value="${herb.id}">${herb.name}</option>`
    ).join('');

    document.querySelectorAll('.herb-select').forEach(select => {
        select.innerHTML = `
            <option value="">选择药材</option>
            ${herbOptions}
        `;
    });
}

/**
 * 添加药材输入行
 */
function addIngredient() {
    const container = document.getElementById('ingredients');
    const item = document.createElement('div');
    item.className = 'ingredient-item';
    item.innerHTML = `
        <select class="herb-select">
            <option value="">选择药材</option>
            ${herbsData.map(herb =>
        `<option value="${herb.id}">${herb.name}</option>`
    ).join('')}
        </select>
        <input type="text" placeholder="用量" class="amount-input">
        <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(item);
}

/**
 * 提交方剂
 */
async function submitFormula() {
    if (!checkAuth()) {
        alert('请先登录后再提交配方');
        return;
    }

    // 收集表单数据
    const formula = {
        name: document.getElementById('formulaName').value,
        composition: {},
        efficacy: document.getElementById('efficacy').value,
        usage: document.getElementById('usage').value,
        theory: document.getElementById('theory').value,
        status: 'pending',
        submitter: getCurrentUser(),
        submitTime: new Date().toISOString()
    };

    // 收集药材组成
    document.querySelectorAll('.ingredient-item').forEach(item => {
        const herb = item.querySelector('.herb-select').value;
        const amount = item.querySelector('.amount-input').value;
        if (herb && amount) {
            formula.composition[herb] = amount;
        }
    });

    // 验证表单
    if (!validateFormula(formula)) {
        return;
    }

    try {
        // 保存到待审核列表
        await saveFormula(formula);
        alert('提交成功！我们会尽快审核您的配方。');
        window.location.href = 'trending.html';
    } catch (error) {
        alert('提交失败，请稍后重试');
        console.error(error);
    }
}

/**
 * 验证方剂数据
 */
function validateFormula(formula) {
    if (!formula.name.trim()) {
        alert('请输入方剂名称');
        return false;
    }
    if (Object.keys(formula.composition).length === 0) {
        alert('请至少添加一味药材');
        return false;
    }
    if (!formula.efficacy.trim()) {
        alert('请描述方剂功效');
        return false;
    }
    if (!formula.usage.trim()) {
        alert('请填写使用建议');
        return false;
    }
    return true;
}

/**
 * 保存方剂到待审核列表
 */
async function saveFormula(formula) {
    let pendingFormulas = JSON.parse(localStorage.getItem('pendingFormulas') || '[]');
    formula.id = `formula_${Date.now()}`;
    pendingFormulas.push(formula);
    localStorage.setItem('pendingFormulas', JSON.stringify(pendingFormulas));
}

// 在药材输入框添加事件监听
document.querySelectorAll('input[name="herbName"]').forEach(input => {
    input.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        const datalist = document.getElementById('herbSuggestions');

        // 清空现有建议
        datalist.innerHTML = '';

        // 过滤匹配的药材
        herbsData
            .filter(h => h.name.toLowerCase().includes(value))
            .slice(0, 5) // 最多显示5个建议
            .forEach(h => {
                const option = document.createElement('option');
                option.value = h.name;
                datalist.appendChild(option);
            });
    });
}); 