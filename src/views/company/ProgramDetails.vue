<template>
  <div class="program-details">
    <!-- Header with back button -->
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link me-3" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <div>
        <h2 class="fw-bold mb-2">{{ program.title }}</h2>
        <p class="text-muted mb-0">{{ t('program_details') }}</p>
      </div>
      <div class="ms-auto">
       
        <button class="btn-accent-gradient" @click="viewApplicants">
          <i class="bi bi-people me-2"></i>{{ t('view_applicants') }}
        </button>
      </div>
    </div>

    <!-- Program Info Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="info-card">
          <div class="d-flex align-items-center gap-3">
            <div class="info-icon bg-primary text-white">
              <i class="bi bi-people"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">{{ t('students_enrolled') }}</p>
              <h4 class="fw-bold mb-0">{{ program.students }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="info-card">
          <div class="d-flex align-items-center gap-3">
            <div class="info-icon bg-success text-white">
              <i class="bi bi-clock"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">{{ t('duration') }}</p>
              <h4 class="fw-bold mb-0">{{ program.duration }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="info-card">
          <div class="d-flex align-items-center gap-3">
            <div class="info-icon bg-info text-white">
              <i class="bi bi-calendar"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">{{ t('start_date') }}</p>
              <h4 class="fw-bold mb-0">{{ program.startDate }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="info-card">
          <div class="d-flex align-items-center gap-3">
            <div class="info-icon bg-warning text-white">
              <i class="bi bi-file-text"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">{{ t('applicants') }}</p>
              <h4 class="fw-bold mb-0">{{ program.applicants }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row g-4">
      <!-- Left Column -->
      <div class="col-lg-8">
        <!-- Description -->
        <div class="details-card mb-4">
          <h5 class="fw-bold mb-3">{{ t('description') }}</h5>
          <p class="text-muted">{{ program.description }}</p>
        </div>

        <!-- Requirements -->
        <div class="details-card mb-4">
          <h5 class="fw-bold mb-3">{{ t('requirements') }}</h5>
          <ul class="list-unstyled">
            <li v-for="(req, index) in program.requirements" :key="index" class="mb-2">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              {{ req }}
            </li>
          </ul>
        </div>

        <!-- Timeline -->
        <div class="details-card">
          <h5 class="fw-bold mb-3">{{ t('program_timeline') }}</h5>
          <div class="timeline">
            <div v-for="(item, index) in program.timeline" :key="index" class="timeline-item">
              <div class="timeline-marker" :class="item.completed ? 'bg-success' : 'bg-secondary'"></div>
              <div class="timeline-content">
                <h6 class="fw-bold mb-1">{{ item.title }}</h6>
                <p class="small text-muted mb-0">{{ item.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-lg-4">
        <!-- Status Card -->
        <div class="status-card mb-4">
          <h6 class="fw-bold mb-3">{{ t('program_status') }}</h6>
          <div class="mb-3">
            <span class="badge mb-2" :class="getStatusClass(program.status)">
              {{ t(program.status) }}
            </span>
          </div>
          <div class="progress mb-3" style="height: 10px;">
            <div 
              class="progress-bar" 
              :class="getProgressClass(program.progress)"
              :style="{ width: program.progress + '%' }"
            ></div>
          </div>
          <p class="small text-muted">{{ program.progress }}% {{ t('complete') }}</p>
        </div>

        <!-- Recent Applicants -->
        <div class="applicants-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">{{ t('recent_applicants') }}</h6>
            <router-link to="/company/applicants" class="small text-primary">
              {{ t('view_all') }}
            </router-link>
          </div>
          <div v-for="applicant in recentApplicants" :key="applicant.id" class="applicant-item">
            <div class="d-flex align-items-center gap-2">
              <div class="avatar" :style="{ background: applicant.avatarColor }">
                {{ applicant.initials }}
              </div>
              <div class="flex-grow-1">
                <p class="fw-bold mb-0 small">{{ applicant.name }}</p>
                <small class="text-muted">{{ applicant.date }}</small>
              </div>
              <span class="badge" :class="getStatusClass(applicant.status)">
                {{ t(applicant.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const program = ref({
  id: route.params.id,
  title: 'Software Engineering Internship',
  description: '6-month intensive program for aspiring software engineers. Students will learn modern development practices, work on real projects, and receive mentorship from industry experts.',
  duration: '6 months',
  startDate: 'Jan 15, 2025',
  students: 24,
  applicants: 12,
  status: 'active',
  progress: 75,
  requirements: [
    'Bachelor degree in Computer Science or related field',
    'Knowledge of at least one programming language',
    'Good communication skills',
    'Portfolio of personal projects'
  ],
  timeline: [
    { title: 'Applications Open', date: 'Dec 1, 2024', completed: true },
    { title: 'Applications Close', date: 'Jan 5, 2025', completed: true },
    { title: 'Program Starts', date: 'Jan 15, 2025', completed: true },
    { title: 'Mid-term Review', date: 'Mar 15, 2025', completed: false },
    { title: 'Final Projects', date: 'Jun 1, 2025', completed: false },
    { title: 'Graduation', date: 'Jul 15, 2025', completed: false }
  ]
})

const recentApplicants = ref([
  {
    id: 1,
    name: 'Emma Thompson',
    initials: 'ET',
    avatarColor: '#7c3aed',
    date: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    avatarColor: '#10b981',
    date: '5 hours ago',
    status: 'reviewed'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: '#f59e0b',
    date: '1 day ago',
    status: 'accepted'
  }
])

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-success',
    draft: 'bg-warning',
    completed: 'bg-info',
    pending: 'bg-warning',
    reviewed: 'bg-info',
    accepted: 'bg-success',
    rejected: 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const getProgressClass = (progress) => {
  if (progress >= 70) return 'bg-success'
  if (progress >= 30) return 'bg-primary'
  return 'bg-warning'
}

const goBack = () => {
  router.push('/company/programs')
}

const editProgram = () => {
  router.push(`/company/programs/${program.value.id}/edit`)
}

const viewApplicants = () => {
  router.push('/company/applicants')
}

onMounted(() => {
  // Here you would fetch the program details based on route.params.id
  console.log('Loading program:', route.params.id)
})
</script>

<style scoped>
.program-details {
  padding: 30px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  height: 100%;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.details-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.status-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.applicants-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #e5e7eb;
}

.timeline-content {
  padding-left: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.applicant-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.applicant-item:last-child {
  border-bottom: none;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.progress {
  background: #f0f0f0;
  border-radius: 10px;
}

[data-theme="dark"] .info-card,
[data-theme="dark"] .details-card,
[data-theme="dark"] .status-card,
[data-theme="dark"] .applicants-card {
  background: #1f2937;
  border-color: #374151;
}

[data-theme="dark"] .timeline::before {
  background: #374151;
}
/* زر متدرج بنفسجي مثل لون الموقع */
.btn-accent-gradient {
  background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3) !important;
}

.btn-accent-gradient:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4) !important;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
}

.btn-accent-gradient:active {
  transform: translateY(0) !important;
}

.btn-accent-gradient i {
  font-size: 16px;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-accent-gradient {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
}

[data-theme="dark"] .applicant-item {
  border-color: #374151;
}
</style>