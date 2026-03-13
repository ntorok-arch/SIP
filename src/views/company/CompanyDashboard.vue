<template>
  <div class="company-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-5">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="fw-bold mb-2">{{ t('company_dashboard') }}</h2>
          <p class="text-muted mb-0">{{ t('manage_training') }}</p>
        </div>
        
        <div class="d-flex gap-3">
         
          <button class="btn-accent-gradient" @click="createProgram">
            <i class="bi bi-plus-circle me-2"></i>
            {{ t('new_program') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-4" v-for="stat in stats" :key="stat.key">
        <div class="stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-muted mb-2">{{ t(stat.label) }}</p>
              <h3 class="fw-bold mb-0">{{ stat.value }}</h3>
            </div>
            <div class="stat-icon" :class="stat.iconClass">
              <i :class="stat.icon"></i>
            </div>
          </div>
          <div class="stat-footer mt-3">
            <small :class="stat.trendClass">
              <i :class="stat.trendIcon"></i>
              {{ stat.trend }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Programs -->
    <div class="recent-programs mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold">{{ t('recent_programs') }}</h5>
        <router-link to="/company/programs" class="view-all">
          {{ t('view_all') }} <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <div class="row g-4">
        <div class="col-md-6" v-for="program in recentPrograms" :key="program.id">
          <div class="program-card">
            <div class="d-flex justify-content-between mb-3">
              <span class="badge" :class="program.statusClass">{{ t(program.status) }}</span>
              <span class="text-muted small">{{ program.date }}</span>
            </div>
            <h6 class="fw-bold mb-2">{{ program.title }}</h6>
            <p class="text-muted small mb-3">{{ program.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex gap-3">
                <span><i class="bi bi-people me-1"></i> {{ program.students }}</span>
                <span><i class="bi bi-clock me-1"></i> {{ program.duration }}</span>
              </div>
              <button class="btn-accent-outline btn-sm" @click="viewProgram(program)">
                {{ t('view') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Applicants -->
    <div class="recent-applicants">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold">{{ t('recent_applicants') }}</h5>
        <router-link to="/company/applicants" class="view-all">
          {{ t('view_all') }} <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ t('student') }}</th>
              <th>{{ t('program') }}</th>
              <th>{{ t('applied_date') }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="applicant in recentApplicants" :key="applicant.id">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar" :style="{ background: applicant.avatarColor }">
                    {{ applicant.initials }}
                  </div>
                  <span class="fw-bold">{{ applicant.name }}</span>
                </div>
              </td>
              <td>{{ applicant.program }}</td>
              <td>{{ applicant.date }}</td>
              <td>
                <span class="badge" :class="applicant.statusClass">{{ t(applicant.status) }}</span>
              </td>
              <td>
                <button class="btn-icon-accent btn-sm" @click="viewApplicant(applicant)">
                  <i class="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const router = useRouter()

// Stats
const stats = ref([
  {
    key: 'programs',
    label: 'total_programs',
    value: '12',
    icon: 'bi bi-journal-bookmark',
    iconClass: 'bg-primary text-white',
    trend: '+2 this month',
    trendClass: 'text-success',
    trendIcon: 'bi bi-arrow-up'
  },
  {
    key: 'students',
    label: 'active_students',
    value: '48',
    icon: 'bi bi-people',
    iconClass: 'bg-success text-white',
    trend: '+5 this month',
    trendClass: 'text-success',
    trendIcon: 'bi bi-arrow-up'
  },
  {
    key: 'applicants',
    label: 'pending_applications',
    value: '15',
    icon: 'bi bi-file-text',
    iconClass: 'bg-warning text-white',
    trend: '3 new today',
    trendClass: 'text-warning',
    trendIcon: 'bi bi-exclamation-circle'
  }
])

// Recent Programs
const recentPrograms = ref([
  {
    id: 1,
    title: 'Software Engineering Internship',
    description: '6-month intensive program for aspiring software engineers',
    status: 'active',
    statusClass: 'bg-success',
    date: 'Started Dec 1',
    students: 24,
    duration: '6 months'
  },
  {
    id: 2,
    title: 'UX Design Bootcamp',
    description: 'Learn user experience design from industry experts',
    status: 'draft',
    statusClass: 'bg-warning',
    date: 'Created Dec 15',
    students: 0,
    duration: '3 months'
  }
])

// Recent Applicants
const recentApplicants = ref([
  {
    id: 1,
    name: 'Emma Thompson',
    initials: 'ET',
    avatarColor: '#7c3aed',
    program: 'Software Engineering',
    date: '2 hours ago',
    status: 'pending',
    statusClass: 'bg-warning'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    avatarColor: '#10b981',
    program: 'UX Design',
    date: '5 hours ago',
    status: 'reviewed',
    statusClass: 'bg-info'
  }
])

// Methods
const refreshData = () => {
  alert(t('refreshing_data'))
}

const createProgram = () => {
  router.push('/company/programs/create')
}

const viewProgram = (program) => {
  router.push(`/company/programs/${program.id}`)
}

const viewApplicant = (applicant) => {
  router.push(`/company/applicants/${applicant.id}`)
}
</script>

<style scoped>
.company-dashboard {
  padding: 30px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.program-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
  height: 100%;
}
/* زر أيقونة دائري بنفسجي */
.btn-icon-accent {
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  background: transparent !important;
  border: 2px solid #7c3aed !important;
  color: #7c3aed !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  padding: 0 !important;
}

.btn-icon-accent i {
  font-size: 16px !important;
}

.btn-icon-accent:hover {
  background: #7c3aed !important;
  color: white !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3) !important;
}

.btn-icon-accent:active {
  transform: translateY(0) !important;
}

/* حجم صغير */
.btn-icon-accent.btn-sm {
  width: 28px !important;
  height: 28px !important;
}

.btn-icon-accent.btn-sm i {
  font-size: 14px !important;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-icon-accent {
  border-color: #a78bfa !important;
  color: #a78bfa !important;
}

[data-theme="dark"] .btn-icon-accent:hover {
  background: #7c3aed !important;
  color: white !important;
  border-color: #7c3aed !important;
}

.program-card:hover {
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124,58,237,0.1);
}

.view-all {
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
}
/* زر بنفسجي outline صغير */
.btn-accent-outline {
  background: transparent !important;
  color: #7c3aed !important;
  border: 2px solid #7c3aed !important;
  border-radius: 8px !important;
  padding: 6px 16px !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
}

.btn-accent-outline:hover {
  background: #7c3aed !important;
  color: white !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2) !important;
}

.btn-accent-outline:active {
  transform: translateY(0) !important;
}

/* حجم صغير (btn-sm) */
.btn-accent-outline.btn-sm {
  padding: 4px 12px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-accent-outline {
  color: #a78bfa !important;
  border-color: #a78bfa !important;
}

[data-theme="dark"] .btn-accent-outline:hover {
  background: #7c3aed !important;
  color: white !important;
  border-color: #7c3aed !important;
}
.view-all:hover {
  text-decoration: underline;
}
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
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: #6b7280;
  border-bottom-width: 1px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

/* Dark mode */
[data-theme="dark"] .stat-card,
[data-theme="dark"] .program-card {
  background: #1f2937;
  border-color: #374151;
}

[data-theme="dark"] .table {
  color: #f3f4f6;
}

[data-theme="dark"] .table th {
  color: #9ca3af;
  border-color: #374151;
}
</style>