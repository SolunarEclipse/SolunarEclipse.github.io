
const app = document.getElementById('app');

let categories = [
    { id: 1, name: 'Alimentação', type: 'expense', color: '#ef4444' },
    { id: 2, name: 'Transporte', type: 'expense', color: '#f59e0b' },
    { id: 3, name: 'Salário', type: 'income', color: '#10b981' },
];

let transactions = [
    { id: 1, description: 'Supermercado', amount: 250.00, date: '2025-10-01', categoryId: 1, type: 'expense' },
    { id: 2, name: 'Salário Mensal', amount: 5000.00, date: '2025-10-05', categoryId: 3, type: 'income' },
    { id: 3, description: 'Uber', amount: 45.00, date: '2025-10-08', categoryId: 2, type: 'expense' },
];

let goals = [
    { id: 1, name: 'Economia Mensal', target: 1000, current: 500 },
    { id: 2, name: 'Fundo Emergência', target: 10000, current: 3500 },
];

let activeTab = 'dashboard';
let showAddModal = false;
let modalType = '';
let editingId = null;
let formData = {};

function render() {
    const { totalIncome, totalExpense, balance } = calculateTotals();
    const expensesByCategory = getExpensesByCategory();
    const chartData = getMonthlyData();

    app.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div class="max-w-7xl mx-auto p-6">
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">💰 Controle Financeiro Pessoal</h1>
                    <p class="text-slate-600">Gerencie suas finanças de forma simples e eficiente</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="card income">
                        <div class="flex">
                            <span class="text-green-100">Receitas</span>
                            <i data-lucide="trending-up" class="w-6 h-6"></i>
                        </div>
                        <p class="text-3xl font-bold">R$ ${totalIncome.toFixed(2)}</p>
                    </div>
                    
                    <div class="card expense">
                        <div class="flex">
                            <span class="text-red-100">Despesas</span>
                            <i data-lucide="trending-down" class="w-6 h-6"></i>
                        </div>
                        <p class="text-3xl font-bold">R$ ${totalExpense.toFixed(2)}</p>
                    </div>
                    
                    <div class="card ${balance >= 0 ? 'balance-positive' : 'balance-negative'}">
                        <div class="flex">
                            <span class="text-blue-100">Saldo</span>
                            <i data-lucide="target" class="w-6 h-6"></i>
                        </div>
                        <p class="text-3xl font-bold">R$ ${balance.toFixed(2)}</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-lg mb-6">
                    <div class="tab-nav">
                        <button class="${activeTab === 'dashboard' ? 'active' : ''}" onclick="setActiveTab('dashboard')">Painel</button>
                        <button class="${activeTab === 'transactions' ? 'active' : ''}" onclick="setActiveTab('transactions')">Transações</button>
                        <button class="${activeTab === 'categories' ? 'active' : ''}" onclick="setActiveTab('categories')">Categorias</button>
                        <button class="${activeTab === 'goals' ? 'active' : ''}" onclick="setActiveTab('goals')">Metas</button>
                    </div>

                    <div class="p-6">
                        ${renderTabContent(activeTab, { totalIncome, totalExpense, balance, expensesByCategory, chartData })}
                    </div>
                </div>
            </div>

            ${showAddModal ? renderModal() : ''}
        </div>
    `;
    lucide.createIcons();
}

function renderTabContent(tab, data) {
    switch (tab) {
        case 'dashboard':
            return `
                <div class="space-y-6">
                    <div class="flex-between-center">
                        <h2 class="text-2xl font-bold text-slate-800">Visão Geral</h2>
                        <button onclick="exportReport()" class="btn-primary">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            Exportar Relatório
                        </button>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-slate-50 rounded-xl p-6">
                            <h3 class="text-lg font-semibold mb-4">Receitas vs Despesas</h3>
                            <div style="width: 100%; height: 250px;">
                                <canvas id="lineChart"></canvas>
                            </div>
                        </div>

                        <div class="bg-slate-50 rounded-xl p-6">
                            <h3 class="text-lg font-semibold mb-4">Despesas por Categoria</h3>
                            <div style="width: 100%; height: 250px;">
                                <canvas id="pieChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-4">Progresso das Metas</h3>
                        <div class="space-y-4">
                            ${goals.map(goal => `
                                <div>
                                    <div class="flex-between-center mb-2">
                                        <span class="font-medium">${goal.name}</span>
                                        <span class="text-slate-600">
                                            R$ ${goal.current.toFixed(2)} / R$ ${goal.target.toFixed(2)}
                                        </span>
                                    </div>
                                    <div class="progress-bar-container">
                                        <div
                                            class="progress-bar"
                                            style="width: ${Math.min((goal.current / goal.target) * 100, 100)}%"
                                        ></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        case 'transactions':
            return `
                <div>
                    <div class="flex-between-center mb-4">
                        <h2 class="text-2xl font-bold text-slate-800">Transações</h2>
                        <button onclick="openModal('transaction')" class="btn-primary">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            Nova Transação
                        </button>
                    </div>

                    <div class="space-y-3">
                        ${transactions.sort((a, b) => b.date.localeCompare(a.date)).map(t => {
                            const category = categories.find(c => c.id === t.categoryId);
                            return `
                                <div class="list-item">
                                    <div class="details">
                                        <div class="icon-circle ${t.type}">
                                            <i data-lucide="${t.type === 'income' ? 'trending-up' : 'trending-down'}" class="w-6 h-6"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold">${t.description || t.name}</p>
                                            <p class="text-sm text-slate-600">${category?.name || 'N/A'} • ${new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        <span class="text-xl font-bold amount ${t.type}">
                                            ${t.type === 'income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}
                                        </span>
                                        <button onclick="openModal('transaction', ${t.id})" class="btn-icon">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </button>
                                        <button onclick="deleteItem('transaction', ${t.id})" class="btn-icon delete">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        case 'categories':
            return `
                <div>
                    <div class="flex-between-center mb-4">
                        <h2 class="text-2xl font-bold text-slate-800">Categorias</h2>
                        <button onclick="openModal('category')" class="btn-primary">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            Nova Categoria
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${categories.map(cat => `
                            <div class="list-item category-item">
                                <div class="details">
                                    <div class="color-swatch" style="background-color: ${cat.color}"></div>
                                    <div>
                                        <p class="font-semibold">${cat.name}</p>
                                        <p class="text-sm text-slate-600">${cat.type === 'income' ? 'Receita' : 'Despesa'}</p>
                                    </div>
                                </div>
                                <div class="actions">
                                    <button onclick="openModal('category', ${cat.id})" class="btn-icon">
                                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="deleteItem('category', ${cat.id})" class="btn-icon delete">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        case 'goals':
            return `
                <div>
                    <div class="flex-between-center mb-4">
                        <h2 class="text-2xl font-bold text-slate-800">Metas Financeiras</h2>
                        <button onclick="openModal('goal')" class="btn-primary">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            Nova Meta
                        </button>
                    </div>

                    <div class="space-y-4">
                        ${goals.map(goal => `
                            <div class="bg-slate-50 p-6 rounded-lg">
                                <div class="flex-between-center mb-4">
                                    <div>
                                        <h3 class="text-lg font-semibold">${goal.name}</h3>
                                        <p class="text-slate-600">
                                            R$ ${goal.current.toFixed(2)} de R$ ${goal.target.toFixed(2)} (${((goal.current/goal.target)*100).toFixed(1)}%)
                                        </p>
                                    </div>
                                    <div class="actions">
                                        <button onclick="openModal('goal', ${goal.id})" class="btn-icon">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </button>
                                        <button onclick="deleteItem('goal', ${goal.id})" class="btn-icon delete">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="progress-bar-container">
                                    <div
                                        class="progress-bar"
                                        style="width: ${Math.min((goal.current / goal.target) * 100, 100)}%"
                                    ></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        default:
            return '';
    }
}

function renderModal() {
    const title = editingId ? 'Editar' : 'Nova';
    let specificFields = '';

    if (modalType === 'category') {
        specificFields = `
            <div class="form-group">
                <label>Nome</label>
                <input type="text" value="${formData.name || ''}" oninput="updateFormData('name', this.value)" />
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select onchange="updateFormData('type', this.value)">
                    <option value="expense" ${formData.type === 'expense' ? 'selected' : ''}>Despesa</option>
                    <option value="income" ${formData.type === 'income' ? 'selected' : ''}>Receita</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cor</label>
                <input type="color" value="${formData.color || '#3b82f6'}" oninput="updateFormData('color', this.value)" />
            </div>
        `;
    } else if (modalType === 'transaction') {
        specificFields = `
            <div class="form-group">
                <label>Descrição</label>
                <input type="text" value="${formData.description || ''}" oninput="updateFormData('description', this.value)" />
            </div>
            <div class="form-group">
                <label>Valor</label>
                <input type="number" step="0.01" value="${formData.amount || ''}" oninput="updateFormData('amount', parseFloat(this.value))" />
            </div>
            <div class="form-group">
                <label>Data</label>
                <input type="date" value="${formData.date || new Date().toISOString().split('T')[0]}" oninput="updateFormData('date', this.value)" />
            </div>
            <div class="form-group">
                <label>Categoria</label>
                <select onchange="updateFormData('categoryId', parseInt(this.value))">
                    ${categories.map(cat => `
                        <option value="${cat.id}" ${formData.categoryId === cat.id ? 'selected' : ''}>${cat.name} (${cat.type === 'income' ? 'Receita' : 'Despesa'})</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select onchange="updateFormData('type', this.value)">
                    <option value="expense" ${formData.type === 'expense' ? 'selected' : ''}>Despesa</option>
                    <option value="income" ${formData.type === 'income' ? 'selected' : ''}>Receita</option>
                </select>
            </div>
        `;
    } else if (modalType === 'goal') {
        specificFields = `
            <div class="form-group">
                <label>Nome</label>
                <input type="text" value="${formData.name || ''}" oninput="updateFormData('name', this.value)" />
            </div>
            <div class="form-group">
                <label>Meta (R$)</label>
                <input type="number" step="0.01" value="${formData.target || ''}" oninput="updateFormData('target', parseFloat(this.value))" />
            </div>
            <div class="form-group">
                <label>Atual (R$)</label>
                <input type="number" step="0.01" value="${formData.current || 0}" oninput="updateFormData('current', parseFloat(this.value))" />
            </div>
        `;
    }

    return `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title} ${modalType === 'category' ? 'Categoria' : modalType === 'transaction' ? 'Transação' : 'Meta'}</h3>
                    <button onclick="closeModal()" class="modal-close-btn">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    ${specificFields}
                </div>
                <div class="modal-actions">
                    <button onclick="closeModal()" class="btn-secondary">Cancelar</button>
                    <button onclick="handleSubmit()" class="btn-success">
                        <i data-lucide="check" class="w-4 h-4"></i>
                        ${editingId ? 'Salvar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateFormData(key, value) {
    formData = { ...formData, [key]: value };
}

function setActiveTab(tab) {
    activeTab = tab;
    render();
    if (tab === 'dashboard') {
        renderCharts();
    }
}

function openModal(type, id = null) {
    modalType = type;
    showAddModal = true;
    editingId = id;

    if (id) {
        let item;
        if (type === 'category') item = categories.find(c => c.id === id);
        else if (type === 'transaction') item = transactions.find(t => t.id === id);
        else if (type === 'goal') item = goals.find(g => g.id === id);
        formData = { ...item };
    } else {
        if (type === 'category') formData = { name: '', type: 'expense', color: '#3b82f6' };
        else if (type === 'transaction') formData = { description: '', amount: '', date: new Date().toISOString().split('T')[0], categoryId: categories[0]?.id, type: 'expense' };
        else if (type === 'goal') formData = { name: '', target: '', current: 0 };
    }
    render();
}

function closeModal() {
    showAddModal = false;
    formData = {};
    editingId = null;
    render();
}

function handleSubmit() {
    if (modalType === 'category') {
        if (!formData.name) return;
        if (editingId) {
            categories = categories.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
        } else {
            categories = [...categories, { ...formData, id: Date.now() }];
        }
    } else if (modalType === 'transaction') {
        if (!formData.description || !formData.amount) return;
        const data = { ...formData, amount: parseFloat(formData.amount) };
        if (editingId) {
            transactions = transactions.map(t => t.id === editingId ? { ...data, id: editingId } : t);
        } else {
            transactions = [...transactions, { ...data, id: Date.now() }];
        }
    } else if (modalType === 'goal') {
        if (!formData.name || !formData.target) return;
        const data = { ...formData, target: parseFloat(formData.target), current: parseFloat(formData.current || 0) };
        if (editingId) {
            goals = goals.map(g => g.id === editingId ? { ...data, id: editingId } : g);
        } else {
            goals = [...goals, { ...data, id: Date.now() }];
        }
    }
    closeModal();
}

function deleteItem(type, id) {
    if (type === 'category') categories = categories.filter(c => c.id !== id);
    if (type === 'transaction') transactions = transactions.filter(t => t.id !== id);
    if (type === 'goal') goals = goals.filter(g => g.id !== id);
    render();
}

function calculateTotals() {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
}

function getExpensesByCategory() {
    return categories
        .filter(c => c.type === 'expense')
        .map(cat => ({
            name: cat.name,
            value: transactions.filter(t => t.categoryId === cat.id && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            color: cat.color
        }))
        .filter(item => item.value > 0);
}

function getMonthlyData() {
    const monthlyData = transactions.reduce((acc, t) => {
        const month = t.date.substring(0, 7);
        if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
        if (t.type === 'income') acc[month].income += t.amount;
        else acc[month].expense += t.amount;
        return acc;
    }, {});
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

function exportReport() {
    const { totalIncome, totalExpense, balance } = calculateTotals();
    const report = `
RELATÓRIO FINANCEIRO
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO
Receitas: R$ ${totalIncome.toFixed(2)}
Despesas: R$ ${totalExpense.toFixed(2)}
Saldo: R$ ${balance.toFixed(2)}

TRANSAÇÕES
${transactions.map(t => `${t.date} | ${t.description || t.name} | ${t.type === 'income' ? '+' : '-'}R$ ${t.amount.toFixed(2)}`).join('\n')}

METAS
${goals.map(g => `${g.name}: R$ ${g.current.toFixed(2)} / R$ ${g.target.toFixed(2)} (${((g.current/g.target)*100).toFixed(1)}%)`).join('\n')}
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a); // Required for Firefox
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url);
}

function renderCharts() {
    const chartData = getMonthlyData();
    const expensesByCategory = getExpensesByCategory();

    // Line Chart
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.month),
                datasets: [
                    {
                        label: 'Receitas',
                        data: chartData.map(d => d.income),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Despesas',
                        data: chartData.map(d => d.expense),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Pie Chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: expensesByCategory.map(d => d.name),
                datasets: [
                    {
                        data: expensesByCategory.map(d => d.value),
                        backgroundColor: expensesByCategory.map(d => d.color),
                        hoverOffset: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                    }
                }
            }
        });
    }
}

// Initial render
render();
// Render charts after initial render if dashboard is active
if (activeTab === 'dashboard') {
    renderCharts();
}
