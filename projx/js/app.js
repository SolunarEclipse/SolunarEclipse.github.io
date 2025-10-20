// ============================================
// BeautyBook - Aplicação Principal
// ============================================

// Dados da Aplicação
const app = {
  currentPage: 'home',
  
  professionals: [
    {
      id: 1,
      name: 'Maria Silva',
      specialty: 'Cabeleireira & Coloração',
      rating: 4.8,
      reviews: 127,
      image: '👩‍🦰',
      bio: 'Cabeleireira experiente com 8 anos na indústria. Especializada em cortes modernos e coloração vibrante.',
      location: 'Salão Downtown, Rua Principal',
      phone: '(11) 98765-4321',
      email: 'maria@beautysalon.com',
      yearsExperience: 8
    },
    {
      id: 2,
      name: 'Ana Santos',
      specialty: 'Maquiadora Profissional',
      rating: 4.9,
      reviews: 89,
      image: '👩‍🦱',
      bio: 'Maquiadora profissional com 6 anos de experiência. Especializada em maquiagem para eventos e casamentos.',
      location: 'Studio de Beleza, Avenida Oak',
      phone: '(11) 99876-5432',
      email: 'ana@beautysalon.com',
      yearsExperience: 6
    },
    {
      id: 3,
      name: 'João Barbeiro',
      specialty: 'Barbeiro & Cuidados com Barba',
      rating: 4.7,
      reviews: 156,
      image: '👨‍🦱',
      bio: 'Barbeiro tradicional com 10 anos de experiência. Especializado em cortes clássicos e cuidados com barba.',
      location: 'Barbearia Clássica, Rua Elm',
      phone: '(11) 97654-3210',
      email: 'joao@beautysalon.com',
      yearsExperience: 10
    },
    {
      id: 4,
      name: 'Carla Nails',
      specialty: 'Especialista em Unhas',
      rating: 4.6,
      reviews: 203,
      image: '💅',
      bio: 'Especialista em unhas com 5 anos de experiência. Oferece manicure, pedicure e nail art.',
      location: 'Salão de Unhas, Rua Rose',
      phone: '(11) 96543-2109',
      email: 'carla@beautysalon.com',
      yearsExperience: 5
    }
  ],

  services: [
    { id: 1, name: 'Corte de Cabelo', description: 'Corte profissional com estilo', duration: 30, price: 45.00, category: 'Cabelo' },
    { id: 2, name: 'Coloração de Cabelo', description: 'Serviço completo de coloração', duration: 60, price: 85.00, category: 'Cabelo' },
    { id: 3, name: 'Penteado', description: 'Penteado para ocasiões especiais', duration: 45, price: 60.00, category: 'Cabelo' },
    { id: 4, name: 'Maquiagem', description: 'Aplicação profissional de maquiagem', duration: 45, price: 60.00, category: 'Maquiagem' },
    { id: 5, name: 'Manicure', description: 'Cuidados com as unhas e esmalte', duration: 30, price: 35.00, category: 'Unhas' },
    { id: 6, name: 'Pedicure', description: 'Cuidados com os pés e esmalte', duration: 45, price: 45.00, category: 'Unhas' },
    { id: 7, name: 'Tratamento Facial', description: 'Cuidados completos de pele', duration: 60, price: 75.00, category: 'Skincare' },
    { id: 8, name: 'Aparagem de Barba', description: 'Aparagem e modelagem de barba', duration: 20, price: 25.00, category: 'Cabelo' }
  ],

  appointments: [
    { id: 1, clientName: 'João Silva', service: 'Corte de Cabelo', date: '2025-10-22', time: '09:00', duration: 30, status: 'confirmado' },
    { id: 2, clientName: 'Maria Santos', service: 'Coloração de Cabelo', date: '2025-10-22', time: '10:00', duration: 60, status: 'confirmado' },
    { id: 3, clientName: 'Ana Costa', service: 'Corte de Cabelo', date: '2025-10-22', time: '11:30', duration: 30, status: 'pendente' },
    { id: 4, clientName: 'Pedro Oliveira', service: 'Aparagem de Barba', date: '2025-10-23', time: '14:00', duration: 20, status: 'confirmado' },
    { id: 5, clientName: 'Carla Mendes', service: 'Penteado', date: '2025-10-23', time: '15:00', duration: 45, status: 'confirmado' }
  ],

  timeSlots: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ],

  bookingState: {
    step: 1,
    professional: null,
    service: null,
    date: '',
    time: null
  }
};

// ============================================
// Inicialização
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  renderPage('home');
}

// ============================================
// Navegação
// ============================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      renderPage(page);
    });
  });
}

function renderPage(page) {
  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Atualizar navegação
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
    }
  });

  // Mostrar página selecionada
  const pageElement = document.getElementById(`page-${page}`);
  if (pageElement) {
    pageElement.classList.add('active');
    app.currentPage = page;
    
    // Chamar função de renderização específica
    switch(page) {
      case 'booking':
        renderBookingPage();
        break;
      case 'schedule':
        renderSchedulePage();
        break;
      case 'services':
        renderServicesPage();
        break;
      case 'professionals':
        renderProfessionalsPage();
        break;
    }
  }
}

// ============================================
// Página de Agendamento
// ============================================

function renderBookingPage() {
  const content = document.getElementById('booking-content');
  
  if (app.bookingState.step === 1) {
    renderProfessionalSelection(content);
  } else if (app.bookingState.step === 2) {
    renderServiceSelection(content);
  } else if (app.bookingState.step === 3) {
    renderDateTimeSelection(content);
  } else if (app.bookingState.step === 4) {
    renderConfirmation(content);
  }
}

function renderProfessionalSelection(container) {
  container.innerHTML = `
    <div class="container">
      <div class="progress-steps">
        <div class="progress-step active">
          <div class="progress-number">1</div>
          <div class="progress-label">Profissional</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">2</div>
          <div class="progress-label">Serviço</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">3</div>
          <div class="progress-label">Data & Hora</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirmar</div>
        </div>
      </div>

      <h2 class="mb-4">Selecione um Profissional</h2>
      <div class="grid grid-2">
        ${app.professionals.map(prof => `
          <div class="card professional-card" onclick="selectProfessional(${prof.id})">
            <div class="professional-avatar">${prof.image}</div>
            <div class="professional-name">${prof.name}</div>
            <div class="professional-specialty">${prof.specialty}</div>
            <div class="rating">
              <span class="stars">★</span>
              <span>${prof.rating}</span>
              <span class="rating-count">(${prof.reviews})</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectProfessional(id) {
  app.bookingState.professional = app.professionals.find(p => p.id === id);
  app.bookingState.step = 2;
  renderBookingPage();
}

function renderServiceSelection(container) {
  container.innerHTML = `
    <div class="container">
      <div class="progress-steps">
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Profissional</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">2</div>
          <div class="progress-label">Serviço</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">3</div>
          <div class="progress-label">Data & Hora</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirmar</div>
        </div>
      </div>

      <button class="btn btn-ghost mb-4" onclick="previousStep()">← Voltar</button>
      
      <h2 class="mb-2">Selecione um Serviço</h2>
      <p class="text-muted mb-4">Profissional: <strong>${app.bookingState.professional.name}</strong></p>
      
      <div class="grid">
        ${app.services.map(service => `
          <div class="service-card" onclick="selectService(${service.id})">
            <div class="service-info">
              <div class="service-name">✂️ ${service.name}</div>
              <div class="service-details">
                <span>⏱️ ${service.duration} min</span>
              </div>
            </div>
            <div class="service-price">R$ ${service.price.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectService(id) {
  app.bookingState.service = app.services.find(s => s.id === id);
  app.bookingState.step = 3;
  renderBookingPage();
}

function renderDateTimeSelection(container) {
  container.innerHTML = `
    <div class="container">
      <div class="progress-steps">
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Profissional</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Serviço</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">3</div>
          <div class="progress-label">Data & Hora</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirmar</div>
        </div>
      </div>

      <button class="btn btn-ghost mb-4" onclick="previousStep()">← Voltar</button>
      
      <h2 class="mb-2">Selecione Data & Hora</h2>
      <p class="text-muted mb-4">
        Profissional: <strong>${app.bookingState.professional.name}</strong> | 
        Serviço: <strong>${app.bookingState.service.name}</strong>
      </p>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📅 Selecione a Data</div>
          </div>
          <div class="card-content">
            <input type="date" id="appointmentDate" class="w-full" onchange="updateSelectedDate()">
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🕐 Selecione a Hora</div>
          </div>
          <div class="card-content">
            <div class="grid grid-3">
              ${app.timeSlots.map(time => `
                <button class="btn btn-outline time-slot" data-time="${time}" onclick="selectTime('${time}')">${time}</button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button class="btn btn-primary w-full" onclick="confirmDateTime()" ${!app.bookingState.date || !app.bookingState.time ? 'disabled' : ''}>
          Continuar para Confirmação
        </button>
      </div>
    </div>
  `;
}

function updateSelectedDate() {
  const dateInput = document.getElementById('appointmentDate');
  app.bookingState.date = dateInput.value;
}

function selectTime(time) {
  app.bookingState.time = time;
  
  // Atualizar visual
  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
  });
  
  event.target.classList.remove('btn-outline');
  event.target.classList.add('btn-primary');
}

function confirmDateTime() {
  if (app.bookingState.date && app.bookingState.time) {
    app.bookingState.step = 4;
    renderBookingPage();
  }
}

function renderConfirmation(container) {
  const totalPrice = app.bookingState.service.price;
  
  container.innerHTML = `
    <div class="container">
      <div class="progress-steps">
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Profissional</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Serviço</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Data & Hora</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirmar</div>
        </div>
      </div>

      <h2 class="mb-4">Confirme seu Agendamento</h2>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">Resumo do Agendamento</div>
        </div>
        <div class="card-content">
          <div class="flex-between mb-3">
            <span>Profissional:</span>
            <strong>${app.bookingState.professional.name}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Serviço:</span>
            <strong>${app.bookingState.service.name}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Duração:</span>
            <strong>${app.bookingState.service.duration} minutos</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Data:</span>
            <strong>${formatDate(app.bookingState.date)}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Hora:</span>
            <strong>${app.bookingState.time}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
          <div class="flex-between">
            <span class="font-bold">Preço Total:</span>
            <strong class="text-xl text-primary">R$ ${totalPrice.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-ghost flex-1" onclick="previousStep()">← Voltar</button>
        <button class="btn btn-primary flex-1" onclick="completeBooking()">Confirmar Agendamento</button>
      </div>
    </div>
  `;
}

function completeBooking() {
  alert(`✅ Agendamento Confirmado!\n\nProfissional: ${app.bookingState.professional.name}\nServiço: ${app.bookingState.service.name}\nData: ${formatDate(app.bookingState.date)}\nHora: ${app.bookingState.time}`);
  
  // Reset booking state
  app.bookingState = {
    step: 1,
    professional: null,
    service: null,
    date: '',
    time: null
  };
  
  renderPage('home');
}

function previousStep() {
  if (app.bookingState.step > 1) {
    app.bookingState.step--;
    renderBookingPage();
  }
}

// ============================================
// Página de Agenda
// ============================================

function renderSchedulePage() {
  const content = document.getElementById('schedule-content');
  const today = new Date().toISOString().split('T')[0];
  
  content.innerHTML = `
    <div class="container">
      <h2 class="mb-4">Agenda de Consultas</h2>

      <div class="card mb-4">
        <div class="card-header flex-between">
          <div>
            <div class="card-title">Visualização de Agenda</div>
            <div class="card-description">Gerencie seus agendamentos e disponibilidade</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" onclick="setViewMode('day')">Visualização Diária</button>
            <button class="btn btn-outline" onclick="setViewMode('week')">Visualização Semanal</button>
          </div>
        </div>
        <div class="card-content">
          <input type="date" id="scheduleDate" value="${today}" onchange="updateScheduleDate()" class="w-full max-w-lg">
        </div>
      </div>

      <div id="appointments-list"></div>

      <div class="grid grid-3 mt-4">
        <div class="card text-center">
          <div class="card-title text-lg">${app.appointments.length}</div>
          <div class="card-description">Total de Agendamentos</div>
        </div>
        <div class="card text-center">
          <div class="card-title text-lg">${app.appointments.filter(a => a.status === 'confirmado').length}</div>
          <div class="card-description">Confirmados</div>
        </div>
        <div class="card text-center">
          <div class="card-title text-lg">${app.appointments.filter(a => a.status === 'pendente').length}</div>
          <div class="card-description">Pendentes</div>
        </div>
      </div>
    </div>
  `;

  updateScheduleDate();
}

function updateScheduleDate() {
  const dateInput = document.getElementById('scheduleDate');
  const selectedDate = dateInput.value;
  const filtered = app.appointments.filter(apt => apt.date === selectedDate);
  
  const appointmentsList = document.getElementById('appointments-list');
  
  if (filtered.length === 0) {
    appointmentsList.innerHTML = '<p class="text-muted text-center">Nenhum agendamento para esta data</p>';
    return;
  }

  appointmentsList.innerHTML = `
    <h3 class="mb-3">Agendamentos para ${formatDate(selectedDate)}</h3>
    ${filtered.map(apt => `
      <div class="appointment-card">
        <div class="appointment-time">🕐 ${apt.time}</div>
        <div class="appointment-client">👤 Cliente: ${apt.clientName}</div>
        <div class="appointment-service">✂️ Serviço: ${apt.service}</div>
        <span class="appointment-status status-${apt.status === 'confirmado' ? 'confirmed' : 'pending'}">${apt.status.toUpperCase()}</span>
        <div class="appointment-actions mt-3">
          <button class="btn btn-sm btn-outline" onclick="rescheduleAppointment(${apt.id})">Remarcar</button>
          <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${apt.id})">Cancelar</button>
        </div>
      </div>
    `).join('')}
  `;
}

function rescheduleAppointment(id) {
  alert('Função de remarcação abriria um diálogo de agendamento para a consulta ' + id);
}

function cancelAppointment(id) {
  if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
    app.appointments = app.appointments.filter(apt => apt.id !== id);
    updateScheduleDate();
  }
}

function setViewMode(mode) {
  console.log('Modo de visualização alterado para:', mode);
}

// ============================================
// Página de Serviços
// ============================================

function renderServicesPage() {
  const content = document.getElementById('services-content');
  
  content.innerHTML = `
    <div class="container">
      <div class="flex-between mb-4">
        <h2>Gerenciamento de Serviços</h2>
        <button class="btn btn-primary" onclick="openAddServiceModal()">+ Adicionar Serviço</button>
      </div>

      <div class="grid grid-2">
        ${app.services.map(service => `
          <div class="card">
            <div class="flex-between mb-2">
              <div class="card-title">✂️ ${service.name}</div>
              <span class="badge badge-primary">${service.category}</span>
            </div>
            <div class="card-description mb-3">${service.description}</div>
            <div class="flex-between mb-3">
              <span>⏱️ ${service.duration} minutos</span>
              <span class="text-primary font-bold">R$ ${service.price.toFixed(2)}</span>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-outline flex-1" onclick="editService(${service.id})">Editar</button>
              <button class="btn btn-sm btn-danger flex-1" onclick="deleteService(${service.id})">Deletar</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div id="serviceModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">Adicionar Novo Serviço</div>
        <form onsubmit="saveService(event)">
          <div class="form-group">
            <label>Nome do Serviço</label>
            <input type="text" id="serviceName" required>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea id="serviceDescription" required></textarea>
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select id="serviceCategory" required>
              <option>Cabelo</option>
              <option>Maquiagem</option>
              <option>Unhas</option>
              <option>Skincare</option>
            </select>
          </div>
          <div class="form-group">
            <label>Duração (minutos)</label>
            <input type="number" id="serviceDuration" required>
          </div>
          <div class="form-group">
            <label>Preço (R$)</label>
            <input type="number" id="servicePrice" step="0.01" required>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="closeServiceModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar Serviço</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function openAddServiceModal() {
  document.getElementById('serviceModal').classList.add('active');
}

function closeServiceModal() {
  document.getElementById('serviceModal').classList.remove('active');
}

function saveService(e) {
  e.preventDefault();
  
  const newService = {
    id: Math.max(...app.services.map(s => s.id)) + 1,
    name: document.getElementById('serviceName').value,
    description: document.getElementById('serviceDescription').value,
    category: document.getElementById('serviceCategory').value,
    duration: parseInt(document.getElementById('serviceDuration').value),
    price: parseFloat(document.getElementById('servicePrice').value)
  };

  app.services.push(newService);
  closeServiceModal();
  renderServicesPage();
}

function editService(id) {
  alert('Editar serviço ' + id);
}

function deleteService(id) {
  if (confirm('Tem certeza que deseja deletar este serviço?')) {
    app.services = app.services.filter(s => s.id !== id);
    renderServicesPage();
  }
}

// ============================================
// Página de Profissionais
// ============================================

function renderProfessionalsPage() {
  const content = document.getElementById('professionals-content');
  const selectedProf = content.getAttribute('data-selected-prof');
  
  if (selectedProf) {
    renderProfessionalDetail(content, parseInt(selectedProf));
  } else {
    renderProfessionalsList(content);
  }
}

function renderProfessionalsList(container) {
  container.innerHTML = `
    <div class="container">
      <h2 class="mb-4">Nossos Profissionais</h2>
      
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Busque por nome ou especialidade..." onkeyup="filterProfessionals()">
      </div>

      <div class="grid grid-2" id="professionalsList">
        ${app.professionals.map(prof => `
          <div class="card professional-card" onclick="viewProfessional(${prof.id})">
            <div class="professional-avatar">${prof.image}</div>
            <div class="professional-name">${prof.name}</div>
            <div class="professional-specialty">${prof.specialty}</div>
            <div class="rating">
              <span class="stars">★</span>
              <span>${prof.rating}</span>
              <span class="rating-count">(${prof.reviews})</span>
            </div>
            <button class="btn btn-primary w-full mt-3">Agendar Agora</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderProfessionalDetail(container, profId) {
  const prof = app.professionals.find(p => p.id === profId);
  if (!prof) return;

  container.innerHTML = `
    <div class="container">
      <button class="btn btn-ghost mb-4" onclick="backToProfessionalsList()">← Voltar para Profissionais</button>

      <div class="grid grid-2 gap-4">
        <div class="card">
          <div class="text-center">
            <div class="professional-avatar" style="font-size: 4rem; margin-bottom: 1rem;">${prof.image}</div>
            <div class="card-title">${prof.name}</div>
            <div class="card-description">${prof.specialty}</div>
            <div class="rating justify-content-center mt-2">
              <span class="stars">★</span>
              <span>${prof.rating}</span>
              <span class="rating-count">(${prof.reviews} avaliações)</span>
            </div>
            <div class="text-muted mt-2">${prof.yearsExperience} anos de experiência</div>
            <button class="btn btn-primary w-full mt-4">Agendar Consulta</button>
          </div>

          <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">

          <div>
            <div class="card-title mb-3">Informações de Contato</div>
            <div class="mb-3">
              <div class="text-muted">📍 Localização</div>
              <div>${prof.location}</div>
            </div>
            <div class="mb-3">
              <div class="text-muted">📞 Telefone</div>
              <a href="tel:${prof.phone}">${prof.phone}</a>
            </div>
            <div class="mb-3">
              <div class="text-muted">📧 Email</div>
              <a href="mailto:${prof.email}">${prof.email}</a>
            </div>
            <button class="btn btn-outline w-full mt-3">Enviar Mensagem</button>
          </div>
        </div>

        <div>
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">Sobre</div>
            </div>
            <div class="card-content">
              <p>${prof.bio}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Avaliações Recentes</div>
              <div class="card-description">Comentários dos clientes</div>
            </div>
            <div class="card-content">
              ${[
                { name: 'João Silva', rating: 5, comment: 'Corte excelente! Muito profissional.', date: '2025-10-15' },
                { name: 'Ana Costa', rating: 5, comment: 'Melhor coloração que já tive!', date: '2025-10-10' },
                { name: 'Pedro Oliveira', rating: 4, comment: 'Ótimo serviço, equipe amigável.', date: '2025-10-05' }
              ].map(review => `
                <div style="margin-bottom: 1.5rem;">
                  <div class="flex-between mb-1">
                    <strong>${review.name}</strong>
                    <span class="text-muted text-sm">${review.date}</span>
                  </div>
                  <div class="stars mb-1">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                  <p class="text-sm">${review.comment}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function viewProfessional(id) {
  const content = document.getElementById('professionals-content');
  content.setAttribute('data-selected-prof', id);
  renderProfessionalsPage();
}

function backToProfessionalsList() {
  const content = document.getElementById('professionals-content');
  content.removeAttribute('data-selected-prof');
  renderProfessionalsPage();
}

function filterProfessionals() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filtered = app.professionals.filter(prof =>
    prof.name.toLowerCase().includes(searchInput) ||
    prof.specialty.toLowerCase().includes(searchInput)
  );

  const list = document.getElementById('professionalsList');
  list.innerHTML = filtered.map(prof => `
    <div class="card professional-card" onclick="viewProfessional(${prof.id})">
      <div class="professional-avatar">${prof.image}</div>
      <div class="professional-name">${prof.name}</div>
      <div class="professional-specialty">${prof.specialty}</div>
      <div class="rating">
        <span class="stars">★</span>
        <span>${prof.rating}</span>
        <span class="rating-count">(${prof.reviews})</span>
      </div>
      <button class="btn btn-primary w-full mt-3">Agendar Agora</button>
    </div>
  `).join('');
}

// ============================================
// Utilitários
// ============================================

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', options);
}

