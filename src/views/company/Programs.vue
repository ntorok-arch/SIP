<template>
  <div class="company-programs">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-2">{{ t('training_programs') }}</h2>
        <p class="text-muted mb-0">{{ t('manage_programs') }}</p>
      </div>
      <button class="btn btn-primary" style ="background:#7c3aed" @click="createProgram">
        <i class="bi bi-plus-circle me-2"></i>
        {{ t('new_program') }}
      </button>
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
              :placeholder="t('search_programs')"
              v-model="searchQuery"
            />
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="statusFilter">
            <option value="all">{{ t('all_status') }}</option>
            <option value="active">{{ t('active') }}</option>
            <option value="draft">{{ t('draft') }}</option>
            <option value="completed">{{ t('completed') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Programs Grid -->
    <div class="row g-4">
      <div v-for="program in filteredPrograms" :key="program.id" class="col-md-6 col-lg-4">
        <div class="program-card">
          <div class="card-header d-flex justify-content-between align-items-start mb-3">
            <div>
              <span class="badge" :class="getStatusClass(program.status)">
                {{ t(program.status) }}
              </span>
            </div>
            <div class="dropdown">
              <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="editProgram(program)">
                  <i class="bi bi-pencil me-2"></i>{{ t('edit') }}
                </a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="duplicateProgram(program)">
                  <i class="bi bi-files me-2"></i>{{ t('duplicate') }}
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" @click.prevent="deleteProgram(program)">
                  <i class="bi bi-trash me-2"></i>{{ t('delete') }}
                </a></li>
              </ul>
            </div>
          </div>

          <h5 class="fw-bold mb-2">{{ program.title }}</h5>
          <p class="text-muted small mb-3">{{ program.description }}</p>

          <div class="program-stats mb-3">
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted small">{{ t('students_enrolled') }}</span>
              <span class="fw-bold">{{ program.students }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted small">{{ t('duration') }}</span>
              <span class="fw-bold">{{ program.duration }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted small">{{ t('start_date') }}</span>
              <span class="fw-bold">{{ program.startDate }}</span>
            </div>
          </div>

          <div class="progress mb-3">
            <div 
              class="progress-bar" 
              :class="getProgressClass(program.progress)"
              :style="{ width: program.progress + '%' }"
            ></div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <span class="small text-muted">
              <i class="bi bi-people me-1"></i> {{ program.applicants }} {{ t('applicants') }}
            </span>
            <button class="btn-accent-outline btn-sm" @click="viewProgram(program)">
              {{ t('view_details') }}
            </button>
          </div>
        </div>
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
const statusFilter = ref('all')

const programs = ref([
  {
    id: 1,
    title: 'Software Engineering Internship',
    description: '6-month intensive program for aspiring software engineers',
    status: 'active',
    students: 24,
    duration: '6 months',
    startDate: 'Jan 15, 2025',
    progress: 75,
    applicants: 12
  },
  {
    id: 2,
    title: 'UX Design Bootcamp',
    description: 'Learn user experience design from industry experts',
    status: 'draft',
    students: 0,
    duration: '3 months',
    startDate: 'Feb 1, 2025',
    progress: 0,
    applicants: 0
  },
  {
    id: 3,
    title: 'Data Science Program',
    description: 'Master data analysis and machine learning',
    status: 'active',
    students: 18,
    duration: '4 months',
    startDate: 'Jan 10, 2025',
    progress: 50,
    applicants: 8
  }
])

const filteredPrograms = computed(() => {
  return programs.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-success',
    draft: 'bg-warning',
    completed: 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

const getProgressClass = (progress) => {
  if (progress >= 70) return 'bg-success'
  if (progress >= 30) return 'bg-primary'
  return 'bg-warning'
}

const createProgram = () => {
  router.push('/company/programs/create')
}

const viewProgram = (program) => {
  router.push(`/company/programs/${program.id}`)
}

const editProgram = (program) => {
  router.push(`/company/programs/${program.id}/edit`)
}

const duplicateProgram = (program) => {
  alert(t('duplicate_program', { name: program.title }))
}

const deleteProgram = (program) => {
  if (confirm(t('confirm_delete_program'))) {
    programs.value = programs.value.filter(p => p.id !== program.id)
  }
}
</script>

<style scoped>
.company-programs {
  padding: 30px;
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

.program-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  height: 100%;
}

.program-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-color: #7c3aed;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.progress {
  height: 8px;
  border-radius: 10px;
  background: #f0f0f0;
}

[data-theme="dark"] .program-card {
  background: #1f2937;
  border-color: #374151;
}
/* زر بنفسجي outline */
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
[data-theme="dark"] .program-card:hover {
  border-color: #7c3aed;
}
</style>