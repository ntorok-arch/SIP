<template>
  <div class="company-applicants">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-2">{{ t('applicants') }}</h2>
        <p class="text-muted mb-0">{{ t('manage_applicants') }}</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-4 mb-4">
      <div class="col-md-3" v-for="stat in stats" :key="stat.key">
        <div class="stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="stat-icon" :class="stat.iconClass">
              <i :class="stat.icon"></i>
            </div>
            <div>
              <p class="text-muted small mb-1">{{ t(stat.label) }}</p>
              <h4 class="fw-bold mb-0">{{ stat.value }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-section mb-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="search-wrapper">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              class="form-control" 
              :placeholder="t('search_applicants')"
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="programFilter">
            <option value="all">{{ t('all_programs') }}</option>
            <option v-for="prog in programs" :key="prog" :value="prog">{{ prog }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="statusFilter">
            <option value="all">{{ t('all_status') }}</option>
            <option value="pending">{{ t('pending') }}</option>
            <option value="reviewed">{{ t('reviewed') }}</option>
            <option value="accepted">{{ t('accepted') }}</option>
            <option value="rejected">{{ t('rejected') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Applicants Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>{{ t('applicant') }}</th>
              <th>{{ t('program') }}</th>
              <th>{{ t('applied_date') }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="applicant in filteredApplicants" :key="applicant.id">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar" :style="{ background: applicant.avatarColor }">
                    {{ applicant.initials }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ applicant.name }}</div>
                    <small class="text-muted">{{ applicant.email }}</small>
                  </div>
                </div>
              </td>
              <td>{{ applicant.program }}</td>
              <td>{{ applicant.date }}</td>
              <td>
                <span class="badge" :class="getStatusClass(applicant.status)">
                  {{ t(applicant.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon-accent btn-sm" @click="viewApplicant(applicant)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-success" @click="updateStatus(applicant, 'accepted')">
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="updateStatus(applicant, 'rejected')">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const programFilter = ref('all')
const statusFilter = ref('all')

const stats = ref([
  { key: 'total', label: 'total_applicants', value: '45', icon: 'bi bi-people', iconClass: 'bg-primary' },
  { key: 'pending', label: 'pending', value: '12', icon: 'bi bi-clock', iconClass: 'bg-warning' },
  { key: 'reviewed', label: 'reviewed', value: '8', icon: 'bi bi-check-circle', iconClass: 'bg-info' },
  { key: 'accepted', label: 'accepted', value: '25', icon: 'bi bi-award', iconClass: 'bg-success' }
])

const programs = ref(['Software Engineering', 'UX Design', 'Data Science'])

const applicants = ref([
  {
    id: 1,
    name: 'Emma Thompson',
    initials: 'ET',
    avatarColor: '#7c3aed',
    email: 'emma@email.com',
    program: 'Software Engineering',
    date: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    avatarColor: '#10b981',
    email: 'michael@email.com',
    program: 'UX Design',
    date: '5 hours ago',
    status: 'reviewed'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    initials: 'SJ',
    avatarColor: '#f59e0b',
    email: 'sarah@email.com',
    program: 'Data Science',
    date: '1 day ago',
    status: 'accepted'
  }
])

const filteredApplicants = computed(() => {
  return applicants.value.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesProgram = programFilter.value === 'all' || a.program === programFilter.value
    const matchesStatus = statusFilter.value === 'all' || a.status === statusFilter.value
    return matchesSearch && matchesProgram && matchesStatus
  })
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-warning',
    reviewed: 'bg-info',
    accepted: 'bg-success',
    rejected: 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const viewApplicant = (applicant) => {
  router.push(`/company/applicants/${applicant.id}`)
}

const updateStatus = (applicant, status) => {
  applicant.status = status
  alert(t('status_updated'))
}
</script>

<style scoped>
.company-applicants {
  padding: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.search-wrapper {
  position: relative;
}

.search-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-wrapper input {
  padding-left: 45px;
}

.table-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 5px;
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
  margin: 0 2px !important;
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

/* حجم صغير (btn-sm) */
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
[data-theme="dark"] .stat-card,
[data-theme="dark"] .table-card {
  background: #1f2937;
  border-color: #374151;
}
</style>