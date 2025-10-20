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
      specialty: 'Hair Styling & Coloring',
      rating: 4.8,
      reviews: 127,
      image: '👩‍🦰',
      bio: 'Cabeleireira experiente com 8 anos na indústria. Especializada em cortes modernos e coloração vibrante.',
      location: 'Downtown Salon, Main Street',
      phone: '(555) 123-4567',
      email: 'maria@beautysalon.com',
      yearsExperience: 8
    },
    {
      id: 2,
      name: 'Ana Santos',
      specialty: 'Makeup Artist',
      rating: 4.9,
      reviews: 89,
      image: '👩‍🦱',
      bio: 'Maquiadora profissional com 6 anos de experiência. Especializada em maquiagem para eventos e casamentos.',
      location: 'Beauty Studio, Oak Avenue',
      phone: '(555) 234-5678',
      email: 'ana@beautysalon.com',
      yearsExperience: 6
    },
    {
      id: 3,
      name: 'João Barbeiro',
      specialty: 'Barber & Beard Care',
      rating: 4.7,
      reviews: 156,
      image: '👨‍🦱',
      bio: 'Barbeiro tradicional com 10 anos de experiência. Especializado em cortes clássicos e cuidados com barba.',
      location: 'Classic Barber Shop, Elm Street',
      phone: '(555) 345-6789',
      email: 'joao@beautysalon.com',
      yearsExperience: 10
    },
    {
      id: 4,
      name: 'Carla Nails',
      specialty: 'Nail Specialist',
      rating: 4.6,
      reviews: 203,
      image: '💅',
      bio: 'Especialista em unhas com 5 anos de experiência. Oferece manicure, pedicure e nail art.',
      location: 'Nail Salon, Rose Street',
      phone: '(555) 456-7890',
      email: 'carla@beautysalon.com',
      yearsExperience: 5
    }
  ],

  services: [
    { id: 1, name: 'Haircut', description: 'Professional haircut with styling', duration: 30, price: 45.00, category: 'Hair' },
    { id: 2, name: 'Hair Coloring', description: 'Full hair coloring service', duration: 60, price: 85.00, category: 'Hair' },
    { id: 3, name: 'Hair Styling', description: 'Special occasion styling', duration: 45, price: 60.00, category: 'Hair' },
    { id: 4, name: 'Makeup', description: 'Professional makeup application', duration: 45, price: 60.00, category: 'Makeup' },
    { id: 5, name: 'Manicure', description: 'Nail care and polish', duration: 30, price: 35.00, category: 'Nails' },
    { id: 6, name: 'Pedicure', description: 'Foot care and polish', duration: 45, price: 45.00, category: 'Nails' },
    { id: 7, name: 'Facial Treatment', description: 'Complete facial skincare', duration: 60, price: 75.00, category: 'Skincare' },
    { id: 8, name: 'Beard Trim', description: 'Beard shaping and trimming', duration: 20, price: 25.00, category: 'Hair' }
  ],

  appointments: [
    { id: 1, clientName: 'João Silva', service: 'Haircut', date: '2025-10-22', time: '09:00', duration: 30, status: 'confirmed' },
    { id: 2, clientName: 'Maria Santos', service: 'Hair Coloring', date: '2025-10-22', time: '10:00', duration: 60, status: 'confirmed' },
    { id: 3, clientName: 'Ana Costa', service: 'Haircut', date: '2025-10-22', time: '11:30', duration: 30, status: 'pending' },
    { id: 4, clientName: 'Pedro Oliveira', service: 'Beard Trim', date: '2025-10-23', time: '14:00', duration: 20, status: 'confirmed' },
    { id: 5, clientName: 'Carla Mendes', service: 'Styling', date: '2025-10-23', time: '15:00', duration: 45, status: 'confirmed' }
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
// Página Home
// ============================================

function renderHomePage() {
  // Já renderizado no HTML
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
          <div class="progress-label">Professional</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">2</div>
          <div class="progress-label">Service</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">3</div>
          <div class="progress-label">Date & Time</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirm</div>
        </div>
      </div>

      <h2 class="mb-4">Select a Professional</h2>
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
          <div class="progress-label">Professional</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">2</div>
          <div class="progress-label">Service</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">3</div>
          <div class="progress-label">Date & Time</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirm</div>
        </div>
      </div>

      <button class="btn btn-ghost mb-4" onclick="previousStep()">← Back</button>
      
      <h2 class="mb-2">Select a Service</h2>
      <p class="text-muted mb-4">Professional: <strong>${app.bookingState.professional.name}</strong></p>
      
      <div class="grid">
        ${app.services.map(service => `
          <div class="service-card" onclick="selectService(${service.id})">
            <div class="service-info">
              <div class="service-name">✂️ ${service.name}</div>
              <div class="service-details">
                <span>⏱️ ${service.duration} min</span>
              </div>
            </div>
            <div class="service-price">$${service.price.toFixed(2)}</div>
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
          <div class="progress-label">Professional</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Service</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">3</div>
          <div class="progress-label">Date & Time</div>
        </div>
        <div class="progress-step">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirm</div>
        </div>
      </div>

      <button class="btn btn-ghost mb-4" onclick="previousStep()">← Back</button>
      
      <h2 class="mb-2">Select Date & Time</h2>
      <p class="text-muted mb-4">
        Professional: <strong>${app.bookingState.professional.name}</strong> | 
        Service: <strong>${app.bookingState.service.name}</strong>
      </p>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📅 Select Date</div>
          </div>
          <div class="card-content">
            <input type="date" id="appointmentDate" class="w-full" onchange="updateSelectedDate()">
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🕐 Select Time</div>
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
          Continue to Confirmation
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
          <div class="progress-label">Professional</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Service</div>
        </div>
        <div class="progress-step completed">
          <div class="progress-number">✓</div>
          <div class="progress-label">Date & Time</div>
        </div>
        <div class="progress-step active">
          <div class="progress-number">4</div>
          <div class="progress-label">Confirm</div>
        </div>
      </div>

      <h2 class="mb-4">Confirm Your Booking</h2>

      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title">Booking Summary</div>
        </div>
        <div class="card-content">
          <div class="flex-between mb-3">
            <span>Professional:</span>
            <strong>${app.bookingState.professional.name}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Service:</span>
            <strong>${app.bookingState.service.name}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Duration:</span>
            <strong>${app.bookingState.service.duration} minutes</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Date:</span>
            <strong>${formatDate(app.bookingState.date)}</strong>
          </div>
          <div class="flex-between mb-3">
            <span>Time:</span>
            <strong>${app.bookingState.time}</strong>
          </div>
          <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
          <div class="flex-between">
            <span class="font-bold">Total Price:</span>
            <strong class="text-xl text-primary">$${totalPrice.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-ghost flex-1" onclick="previousStep()">← Back</button>
        <button class="btn btn-primary flex-1" onclick="completeBooking()">Complete Booking</button>
      </div>
    </div>
  `;
}

function completeBooking() {
  alert(`✅ Booking Confirmed!\n\nProfessional: ${app.bookingState.professional.name}\nService: ${app.bookingState.service.name}\nDate: ${formatDate(app.bookingState.date)}\nTime: ${app.bookingState.time}`);
  
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
      <h2 class="mb-4">Professional Schedule</h2>

      <div class="card mb-4">
        <div class="card-header flex-between">
          <div>
            <div class="card-title">Schedule View</div>
            <div class="card-description">Manage your appointments and availability</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary" onclick="setViewMode('day')">Day View</button>
            <button class="btn btn-outline" onclick="setViewMode('week')">Week View</button>
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
          <div class="card-description">Total Appointments</div>
        </div>
        <div class="card text-center">
          <div class="card-title text-lg">${app.appointments.filter(a => a.status === 'confirmed').length}</div>
          <div class="card-description">Confirmed</div>
        </div>
        <div class="card text-center">
          <div class="card-title text-lg">${app.appointments.filter(a => a.status === 'pending').length}</div>
          <div class="card-description">Pending</div>
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
    appointmentsList.innerHTML = '<p class="text-muted text-center">No appointments for this date</p>';
    return;
  }

  appointmentsList.innerHTML = `
    <h3 class="mb-3">Appointments for ${formatDate(selectedDate)}</h3>
    ${filtered.map(apt => `
      <div class="appointment-card">
        <div class="appointment-time">🕐 ${apt.time}</div>
        <div class="appointment-client">👤 Client: ${apt.clientName}</div>
        <div class="appointment-service">✂️ Service: ${apt.service}</div>
        <span class="appointment-status status-${apt.status}">${apt.status.toUpperCase()}</span>
        <div class="appointment-actions mt-3">
          <button class="btn btn-sm btn-outline" onclick="rescheduleAppointment(${apt.id})">Reschedule</button>
          <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${apt.id})">Cancel</button>
        </div>
      </div>
    `).join('')}
  `;
}

function rescheduleAppointment(id) {
  alert('Reschedule feature would open a booking dialog for appointment ' + id);
}

function cancelAppointment(id) {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    app.appointments = app.appointments.filter(apt => apt.id !== id);
    updateScheduleDate();
  }
}

function setViewMode(mode) {
  // Implementar lógica de view mode se necessário
  console.log('View mode changed to:', mode);
}

// ============================================
// Página de Serviços
// ============================================

function renderServicesPage() {
  const content = document.getElementById('services-content');
  
  content.innerHTML = `
    <div class="container">
      <div class="flex-between mb-4">
        <h2>Services Management</h2>
        <button class="btn btn-primary" onclick="openAddServiceModal()">+ Add Service</button>
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
              <span>⏱️ ${service.duration} minutes</span>
              <span class="text-primary font-bold">$${service.price.toFixed(2)}</span>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-outline flex-1" onclick="editService(${service.id})">Edit</button>
              <button class="btn btn-sm btn-danger flex-1" onclick="deleteService(${service.id})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div id="serviceModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">Add New Service</div>
        <form onsubmit="saveService(event)">
          <div class="form-group">
            <label>Service Name</label>
            <input type="text" id="serviceName" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="serviceDescription" required></textarea>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="serviceCategory" required>
              <option>Hair</option>
              <option>Makeup</option>
              <option>Nails</option>
              <option>Skincare</option>
            </select>
          </div>
          <div class="form-group">
            <label>Duration (minutes)</label>
            <input type="number" id="serviceDuration" required>
          </div>
          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" id="servicePrice" step="0.01" required>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="closeServiceModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Service</button>
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
  alert('Edit service ' + id);
}

function deleteService(id) {
  if (confirm('Are you sure you want to delete this service?')) {
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
      <h2 class="mb-4">Our Professionals</h2>
      
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search by name or specialty..." onkeyup="filterProfessionals()">
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
            <button class="btn btn-primary w-full mt-3">Book Now</button>
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
      <button class="btn btn-ghost mb-4" onclick="backToProfessionalsList()">← Back to All Professionals</button>

      <div class="grid grid-2 gap-4">
        <div class="card">
          <div class="text-center">
            <div class="professional-avatar" style="font-size: 4rem; margin-bottom: 1rem;">${prof.image}</div>
            <div class="card-title">${prof.name}</div>
            <div class="card-description">${prof.specialty}</div>
            <div class="rating justify-content-center mt-2">
              <span class="stars">★</span>
              <span>${prof.rating}</span>
              <span class="rating-count">(${prof.reviews} reviews)</span>
            </div>
            <div class="text-muted mt-2">${prof.yearsExperience} years of experience</div>
            <button class="btn btn-primary w-full mt-4">Book Appointment</button>
          </div>

          <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;">

          <div>
            <div class="card-title mb-3">Contact Information</div>
            <div class="mb-3">
              <div class="text-muted">📍 Location</div>
              <div>${prof.location}</div>
            </div>
            <div class="mb-3">
              <div class="text-muted">📞 Phone</div>
              <a href="tel:${prof.phone}">${prof.phone}</a>
            </div>
            <div class="mb-3">
              <div class="text-muted">📧 Email</div>
              <a href="mailto:${prof.email}">${prof.email}</a>
            </div>
            <button class="btn btn-outline w-full mt-3">Send Message</button>
          </div>
        </div>

        <div>
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title">About</div>
            </div>
            <div class="card-content">
              <p>${prof.bio}</p>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Recent Reviews</div>
              <div class="card-description">Latest feedback from clients</div>
            </div>
            <div class="card-content">
              ${[
                { name: 'João Silva', rating: 5, comment: 'Amazing haircut! Very professional.', date: '2025-10-15' },
                { name: 'Ana Costa', rating: 5, comment: 'Best color treatment I\'ve had!', date: '2025-10-10' },
                { name: 'Pedro Oliveira', rating: 4, comment: 'Great service, friendly staff.', date: '2025-10-05' }
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
      <button class="btn btn-primary w-full mt-3">Book Now</button>
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

