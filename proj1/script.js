// Financial Control System - Epic Edition
const app = document.getElementById('app');

// Data
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

// Chart instances
let lineChartInstance = null;
let pieChartInstance = null;

// Main render function
function render() {
    const { totalIncome, totalExpense, balance } = calculateTotals();

    app.innerHTML = `
        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card income">
                <div class="stat-card-header">
                    <span class="stat-label">Receitas</span>
                    <i data-lucide="trending-up" class="stat-icon"></i>
                </div>
                <div class="stat-value">R$ ${totalIncome.toFixed(2)}</div>
            </div>
            
            <div class="stat-card expense">
                <div class="stat-card-header">
                    <span class="stat-label">Despesas</span>
                    <i data-lucide="trending-down" class="stat-icon"></i>
                </div>
                <div class="stat-value">R$ ${totalExpense.toFixed(2)}</div>
            </div>
            
            <div class="stat-card balance">
                <div class="stat-card-header">
                    <span class="stat-label">Saldo</span>
                    <i data-lucide="target" class="stat-icon"></i>
                </div>
                <div class="stat-value">R$ ${balance.toFixed(2)}</div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-nav">
            <button class="tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" onclick="setActiveTab('dashboard')">
                Painel
            </button>
            <button class="tab-btn ${activeTab === 'transactions' ? 'active' : ''}" onclick="setActiveTab('transactions')">
                Transações
            </button>
            <button class="tab-btn ${activeTab === 'categories' ? 'active' : ''}" onclick="setActiveTab('categories')">
                Categorias
            </button>
            <button class="tab-btn ${activeTab === 'goals' ? 'active' : ''}" onclick="setActiveTab('goals')">
                Metas
            </button>
        </div>

        <!-- Content Section -->
        <div class="content-section">
            ${renderTabContent()}
        </div>

        ${showAddModal ? renderModal() : ''}
    `;

    // Initialize Lucide icons
    lucide.createIcons();

    // Render charts if on dashboard
    if (activeTab === 'dashboard') {
        setTimeout(() => renderCharts(), 100);
    }
}

// Render tab content
function renderTabContent() {
    switch (activeTab) {
        case 'dashboard':
            return renderDashboard();
        case 'transactions':
            return renderTransactions();
        case 'categories':
            return renderCategories();
        case 'goals':
            return renderGoals();
        default:
            return '';
    }
}

// Render Dashboard
function renderDashboard() {
    return `
        <div class="section-header">
            <h2 class="section-title">Visão Geral</h2>
            <button onclick="exportReport()" class="btn-primary">
                <i data-lucide="download"></i>
                Exportar Relatório
            </button>
        </div>

        <div class="charts-grid">
            <div class="chart-container">
                <h3 class="chart-title">⟨ Receitas vs Despesas ⟩</h3>
                <canvas id="lineChart" style="max-height: 300px;"></canvas>
            </div>

            <div class="chart-container">
                <h3 class="chart-title">⟨ Despesas por Categoria ⟩</h3>
                <canvas id="pieChart" style="max-height: 300px;"></canvas>
            </div>
        </div>

        <div class="chart-container" style="margin-top: 30px;">
            <h3 class="chart-title">⟨ Progresso das Metas ⟩</h3>
            ${goals.map(goal => `
                <div class="progress-container">
                    <div class="progress-header">
                        <span class="progress-label">${goal.name}</span>
                        <span class="progress-value">R$ ${goal.current.toFixed(2)} / R$ ${goal.target.toFixed(2)}</span>
                    </div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar" style="width: ${Math.min((goal.current / goal.target) * 100, 100)}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render Transactions
function renderTransactions() {
    const sortedTransactions = transactions.sort((a, b) => b.date.localeCompare(a.date));
    
    return `
        <div class="section-header">
            <h2 class="section-title">Transações</h2>
            <button onclick="openModal('transaction')" class="btn-primary">
                <i data-lucide="plus-circle"></i>
                Nova Transação
            </button>
        </div>

        <div class="items-list">
            ${sortedTransactions.map(t => {
                const category = categories.find(c => c.id === t.categoryId);
                return `
                    <div class="list-item">
                        <div class="item-left">
                            <div class="item-icon ${t.type}">
                                <i data-lucide="${t.type === 'income' ? 'trending-up' : 'trending-down'}"></i>
                            </div>
                            <div class="item-details">
                                <h3>${t.description || t.name}</h3>
                                <p>${category?.name || 'N/A'} • ${new Date(t.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        <div class="item-right">
                            <span class="item-amount ${t.type}">
                                ${t.type === 'income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}
                            </span>
                            <div class="item-actions">
                                <button onclick="openModal('transaction', ${t.id})" class="btn-icon">
                                    <i data-lucide="edit-2"></i>
                                </button>
                                <button onclick="deleteItem('transaction', ${t.id})" class="btn-icon delete">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render Categories
function renderCategories() {
    return `
        <div class="section-header">
            <h2 class="section-title">Categorias</h2>
            <button onclick="openModal('category')" class="btn-primary">
                <i data-lucide="plus-circle"></i>
                Nova Categoria
            </button>
        </div>

        <div class="categories-grid">
            ${categories.map(cat => `
                <div class="category-item">
                    <div class="category-left">
                        <div class="color-swatch" style="background-color: ${cat.color}"></div>
                        <div class="category-info">
                            <h3>${cat.name}</h3>
                            <p>${cat.type === 'income' ? 'Receita' : 'Despesa'}</p>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button onclick="openModal('category', ${cat.id})" class="btn-icon">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button onclick="deleteItem('category', ${cat.id})" class="btn-icon delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render Goals
function renderGoals() {
    return `
        <div class="section-header">
            <h2 class="section-title">Metas Financeiras</h2>
            <button onclick="openModal('goal')" class="btn-primary">
                <i data-lucide="plus-circle"></i>
                Nova Meta
            </button>
        </div>

        <div class="items-list">
            ${goals.map(goal => `
                <div class="list-item">
                    <div class="item-left">
                        <div class="item-icon income">
                            <i data-lucide="target"></i>
                        </div>
                        <div class="item-details">
                            <h3>${goal.name}</h3>
                            <p>R$ ${goal.current.toFixed(2)} de R$ ${goal.target.toFixed(2)} (${((goal.current/goal.target)*100).toFixed(1)}%)</p>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="progress-bar-wrapper" style="width: 200px; margin-right: 15px;">
                            <div class="progress-bar" style="width: ${Math.min((goal.current / goal.target) * 100, 100)}%"></div>
                        </div>
                        <div class="item-actions">
                            <button onclick="openModal('goal', ${goal.id})" class="btn-icon">
                                <i data-lucide="edit-2"></i>
                            </button>
                            <button onclick="deleteItem('goal', ${goal.id})" class="btn-icon delete">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render Modal
function renderModal() {
    const title = editingId ? 'Editar' : 'Nova';
    let modalTitle = '';
    let formFields = '';

    if (modalType === 'category') {
        modalTitle = `${title} Categoria`;
        formFields = `
            <div class="form-group">
                <label class="form-label">Nome</label>
                <input type="text" class="form-input" value="${formData.name || ''}" 
                    oninput="updateFormData('name', this.value)" placeholder="Ex: Alimentação">
            </div>
            <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-select" onchange="updateFormData('type', this.value)">
                    <option value="expense" ${formData.type === 'expense' ? 'selected' : ''}>Despesa</option>
                    <option value="income" ${formData.type === 'income' ? 'selected' : ''}>Receita</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Cor</label>
                <input type="color" class="form-input" value="${formData.color || '#3b82f6'}" 
                    oninput="updateFormData('color', this.value)">
            </div>
        `;
    } else if (modalType === 'transaction') {
        modalTitle = `${title} Transação`;
        formFields = `
            <div class="form-group">
                <label class="form-label">Descrição</label>
                <input type="text" class="form-input" value="${formData.description || ''}" 
                    oninput="updateFormData('description', this.value)" placeholder="Ex: Supermercado">
            </div>
            <div class="form-group">
                <label class="form-label">Valor (R$)</label>
                <input type="number" step="0.01" class="form-input" value="${formData.amount || ''}" 
                    oninput="updateFormData('amount', parseFloat(this.value))" placeholder="0.00">
            </div>
            <div class="form-group">
                <label class="form-label">Data</label>
                <input type="date" class="form-input" value="${formData.date || new Date().toISOString().split('T')[0]}" 
                    oninput="updateFormData('date', this.value)">
            </div>
            <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-select" onchange="updateFormData('categoryId', parseInt(this.value))">
                    ${categories.map(cat => `
                        <option value="${cat.id}" ${formData.categoryId === cat.id ? 'selected' : ''}>
                            ${cat.name} (${cat.type === 'income' ? 'Receita' : 'Despesa'})
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-select" onchange="updateFormData('type', this.value)">
                    <option value="expense" ${formData.type === 'expense' ? 'selected' : ''}>Despesa</option>
                    <option value="income" ${formData.type === 'income' ? 'selected' : ''}>Receita</option>
                </select>
            </div>
        `;
    } else if (modalType === 'goal') {
        modalTitle = `${title} Meta`;
        formFields = `
            <div class="form-group">
                <label class="form-label">Nome</label>
                <input type="text" class="form-input" value="${formData.name || ''}" 
                    oninput="updateFormData('name', this.value)" placeholder="Ex: Economia Mensal">
            </div>
            <div class="form-group">
                <label class="form-label">Meta (R$)</label>
                <input type="number" step="0.01" class="form-input" value="${formData.target || ''}" 
                    oninput="updateFormData('target', parseFloat(this.value))" placeholder="0.00">
            </div>
            <div class="form-group">
                <label class="form-label">Valor Atual (R$)</label>
                <input type="number" step="0.01" class="form-input" value="${formData.current || 0}" 
                    oninput="updateFormData('current', parseFloat(this.value))" placeholder="0.00">
            </div>
        `;
    }

    return `
        <div class="modal-overlay" onclick="closeModalOnOverlay(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3 class="modal-title">${modalTitle}</h3>
                    <button onclick="closeModal()" class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    ${formFields}
                </div>
                <div class="modal-actions">
                    <button onclick="closeModal()" class="btn-secondary">Cancelar</button>
                    <button onclick="handleSubmit()" class="btn-success">
                        ${editingId ? 'Salvar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Tab navigation
function setActiveTab(tab) {
    activeTab = tab;
    render();
}

// Modal functions
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
        if (type === 'category') {
            formData = { name: '', type: 'expense', color: '#3b82f6' };
        } else if (type === 'transaction') {
            formData = { 
                description: '', 
                amount: '', 
                date: new Date().toISOString().split('T')[0], 
                categoryId: categories[0]?.id, 
                type: 'expense' 
            };
        } else if (type === 'goal') {
            formData = { name: '', target: '', current: 0 };
        }
    }
    render();
}

function closeModal() {
    showAddModal = false;
    formData = {};
    editingId = null;
    render();
}

function closeModalOnOverlay(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal();
    }
}

function updateFormData(key, value) {
    formData = { ...formData, [key]: value };
}

function handleSubmit() {
    if (modalType === 'category') {
        if (!formData.name) return alert('Por favor, preencha o nome da categoria.');
        if (editingId) {
            categories = categories.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
        } else {
            categories = [...categories, { ...formData, id: Date.now() }];
        }
    } else if (modalType === 'transaction') {
        if (!formData.description || !formData.amount) return alert('Por favor, preencha todos os campos obrigatórios.');
        const data = { ...formData, amount: parseFloat(formData.amount) };
        if (editingId) {
            transactions = transactions.map(t => t.id === editingId ? { ...data, id: editingId } : t);
        } else {
            transactions = [...transactions, { ...data, id: Date.now() }];
        }
    } else if (modalType === 'goal') {
        if (!formData.name || !formData.target) return alert('Por favor, preencha todos os campos obrigatórios.');
        const data = { 
            ...formData, 
            target: parseFloat(formData.target), 
            current: parseFloat(formData.current || 0) 
        };
        if (editingId) {
            goals = goals.map(g => g.id === editingId ? { ...data, id: editingId } : g);
        } else {
            goals = [...goals, { ...data, id: Date.now() }];
        }
    }
    closeModal();
}

// Delete item
function deleteItem(type, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    if (type === 'category') categories = categories.filter(c => c.id !== id);
    if (type === 'transaction') transactions = transactions.filter(t => t.id !== id);
    if (type === 'goal') goals = goals.filter(g => g.id !== id);
    render();
}

// Calculations
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
            value: transactions.filter(t => t.categoryId === cat.id && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
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

// Export report
function exportReport() {
    const { totalIncome, totalExpense, balance } = calculateTotals();
    const report = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⟨ RELATÓRIO FINANCEIRO ⟩
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: ${new Date().toLocaleDateString('pt-BR')}

◆ RESUMO
Receitas: R$ ${totalIncome.toFixed(2)}
Despesas: R$ ${totalExpense.toFixed(2)}
Saldo: R$ ${balance.toFixed(2)}

◆ TRANSAÇÕES
${transactions.map(t => `${t.date} | ${t.description || t.name} | ${t.type === 'income' ? '+' : '-'}R$ ${t.amount.toFixed(2)}`).join('\n')}

◆ METAS
${goals.map(g => `${g.name}: R$ ${g.current.toFixed(2)} / R$ ${g.target.toFixed(2)} (${((g.current/g.target)*100).toFixed(1)}%)`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Render charts
function renderCharts() {
    const chartData = getMonthlyData();
    const expensesByCategory = getExpensesByCategory();

    // Destroy existing chart instances
    if (lineChartInstance) {
        lineChartInstance.destroy();
        lineChartInstance = null;
    }
    if (pieChartInstance) {
        pieChartInstance.destroy();
        pieChartInstance = null;
    }

    // Line Chart
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        lineChartInstance = new Chart(lineCtx, {
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
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Despesas',
                        data: chartData.map(d => d.expense),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                family: 'Rajdhani',
                                size: 14,
                                weight: 600
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#00ffff',
                        bodyColor: '#e0e0e0',
                        borderColor: 'rgba(0, 255, 255, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: 'Orbitron',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Rajdhani',
                            size: 13
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)',
                            borderColor: 'rgba(0, 255, 255, 0.3)'
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                family: 'Rajdhani',
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 255, 255, 0.1)',
                            borderColor: 'rgba(0, 255, 255, 0.3)'
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                family: 'Rajdhani',
                                size: 12
                            },
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // Pie Chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx && expensesByCategory.length > 0) {
        pieChartInstance = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: expensesByCategory.map(d => d.name),
                datasets: [
                    {
                        data: expensesByCategory.map(d => d.value),
                        backgroundColor: expensesByCategory.map(d => d.color),
                        borderColor: '#000',
                        borderWidth: 2,
                        hoverOffset: 15
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                family: 'Rajdhani',
                                size: 13,
                                weight: 600
                            },
                            padding: 12,
                            boxWidth: 15,
                            boxHeight: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#00ffff',
                        bodyColor: '#e0e0e0',
                        borderColor: 'rgba(0, 255, 255, 0.5)',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: 'Orbitron',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Rajdhani',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initial render
render();
