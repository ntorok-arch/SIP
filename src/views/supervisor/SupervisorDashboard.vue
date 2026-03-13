<template>
  <div class="supervisor-dashboard">
    <!-- رأس الصفحة مع الترحيب -->
    <div class="dashboard-header mb-5" data-aos="fade-down">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 class="fw-bold mb-2">{{ t('supervisor_dashboard') }}</h2>
          <p class="text-muted mb-0">{{ t('monitor_students') }}</p>
        </div>
        
        <!-- زر إضافة مهمة جديدة -->
        <button class="btn-accent-solid" @click="openCreateTaskModal">
          <i class="bi bi-plus-circle me-2"></i>
          {{ t('create_task') }}
        </button>
      </div>
    </div>

    <!-- بطاقات الإحصائيات السريعة -->
    <div class="row g-4 mb-5">
      <div class="col-12 col-sm-6 col-md-3" v-for="stat in quickStats" :key="stat.key">
        <StatCard
          :icon="stat.icon"
          :label="t(stat.label)"
          :value="stat.value"
          :trend="stat.trend"
          :trend-up="stat.trendUp"
          :variant="stat.variant"
          @click="handleStatClick(stat)"
        />
      </div>
    </div>

    <!-- قسم إدارة المهام -->
    <div class="task-management-section mb-5">
      <div class="bg-white p-4 rounded-4 border text-center mb-4">
        <h5 class="fw-bold mb-2">{{ t('task_management') }}</h5>
        <p class="text-muted small mb-0">{{ t('create_manage_tasks') }}</p>
      </div>

      <!-- أزرار التصفية -->
      <div class="filter-tabs mb-4 d-flex gap-2 flex-wrap">
        <button 
          v-for="filter in taskFilters" 
          :key="filter.value"
          class="filter-btn"
          :class="{ active: currentFilter === filter.value }"
          @click="currentFilter = filter.value"
        >
          {{ t(filter.label) }}
          <span class="badge ms-2">{{ getTaskCount(filter.value) }}</span>
        </button>
      </div>

      <!-- شبكة المهام -->
      <div class="row g-4">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <TaskCard
            :title="t(task.title)"
            :description="t(task.description)"
            :due-date="task.dueDate"
            :type="task.type"
            :status="task.status"
            :total-students="task.totalStudents"
            :submissions="task.submissions"
            :points="task.points"
            :featured="task.featured"
            @click="viewTaskDetails(task)"
          >
            <template #actions>
              <button class="btn-action" @click.stop="editTask(task)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-action" @click.stop="shareTask(task)">
                <i class="bi bi-link-45deg"></i>
              </button>
              <button class="btn-action text-danger" @click.stop="deleteTask(task)">
                <i class="bi bi-trash"></i>
              </button>
            </template>
          </TaskCard>
        </div>
      </div>
    </div>

    <!-- قسم الطلاب المعرضين للخطر -->
    <div class="at-risk-section">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold">
          {{ t('students_needing_attention') }}
          <span class="badge bg-danger ms-2">{{ atRiskStudents.length }}</span>
        </h5>
        <router-link to="/supervisor/students" class="view-all-link">
          {{ t('view_all') }} <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <div class="row g-4">
        <div 
          v-for="student in atRiskStudents" 
          :key="student.id"
          class="col-12 col-md-6"
        >
          <StudentCard
            :name="student.name"
            :email="student.email"
            :initials="student.initials"
            :company="student.company"
            :program="student.program"
            :status="student.status"
            :hours-completed="student.hoursCompleted"
            :hours-total="student.hoursTotal"
            :tasks-completed="student.tasksCompleted"
            :tasks-total="student.tasksTotal"
            @click="viewStudentDetails(student)"
            @view="viewStudentDetails(student)"
            @note="addNote(student)"
          />
        </div>
      </div>
    </div>

    <!-- مودال إنشاء مهمة جديدة -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
        <div class="modal-content animate__animated animate__fadeInUp">
          <div class="modal-header">
            <h5 class="fw-bold mb-0">{{ t('create_new_task') }}</h5>
            <button class="btn-close" @click="closeCreateModal"></button>
          </div>
          <div class="modal-body">
            <!-- نموذج إنشاء المهمة -->
            <form @submit.prevent="createTask">
              <div class="mb-3">
                <label class="form-label fw-bold">{{ t('task_title') }}</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="newTask.title"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">{{ t('task_description') }}</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="newTask.description"
                  required
                ></textarea>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">{{ t('task_type') }}</label>
                  <select class="form-select" v-model="newTask.type">
                    <option value="assignment">{{ t('assignment') }}</option>
                    <option value="quiz">{{ t('quiz') }}</option>
                    <option value="project">{{ t('project') }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">{{ t('due_date') }}</label>
                  <input type="date" class="form-control" v-model="newTask.dueDate" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">{{ t('points') }}</label>
                <input type="number" class="form-control" v-model="newTask.points" required />
              </div>
              <button type="submit" class="btn-accent-gradient w-100" :disabled="isCreating">
                <span v-if="!isCreating">
                  <i class="bi bi-check-lg me-2"></i>
                  {{ t('create_task') }}
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ t('creating') }}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import StatCard from '@/components/common/StatCard.vue'
import TaskCard from '@/components/common/TaskCard.vue'
import StudentCard from '@/components/common/StudentCard.vue'
import AOS from 'aos'

const { t } = useI18n()
const router = useRouter()

// ========== الإحصائيات السريعة ==========
const quickStats = ref([
  {
    key: 'total_students',
    icon: 'bi bi-people-fill',
    label: 'total_students',
    value: '24',
    trend: '+2 ' + t('this_month'),
    trendUp: true,
    variant: 'primary'
  },
  {
    key: 'pending_tasks',
    icon: 'bi bi-clock-history',
    label: 'pending_tasks',
    value: '18',
    trend: t('due_this_week'),
    variant: 'warning'
  },
  {
    key: 'completed_tasks',
    icon: 'bi bi-check-circle-fill',
    label: 'completed_tasks',
    value: '156',
    trend: '+12 ' + t('this_week'),
    trendUp: true,
    variant: 'success'
  },
  {
    key: 'delayed_tasks',
    icon: 'bi bi-exclamation-triangle-fill',
    label: 'delayed_tasks',
    value: '5',
    trend: t('needs_attention'),
    trendUp: false,
    variant: 'danger'
  }
])

// ========== المهام ==========
const tasks = ref([
  {
    id: 1,
    title: 'graphql_quiz',
    description: 'graphql_quiz_desc',
    dueDate: '2025-01-15',
    type: 'quiz',
    status: 'in-progress',
    totalStudents: 24,
    submissions: 12,
    points: 50,
    featured: false
  },
  {
    id: 2,
    title: 'nextjs_project',
    description: 'nextjs_project_desc',
    dueDate: '2025-01-05',
    type: 'project',
    status: 'late',
    totalStudents: 24,
    submissions: 18,
    points: 200,
    featured: true
  },
  {
    id: 3,
    title: 'rest_api_assignment',
    description: 'rest_api_desc',
    dueDate: '2025-01-08',
    type: 'assignment',
    status: 'pending',
    totalStudents: 24,
    submissions: 0,
    points: 150,
    featured: false
  }
])

// التصفية
const taskFilters = [
  { value: 'all', label: 'all_tasks' },
  { value: 'pending', label: 'pending' },
  { value: 'in-progress', label: 'in_progress' },
  { value: 'completed', label: 'completed' },
  { value: 'late', label: 'late' }
]

const currentFilter = ref('all')

const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') return tasks.value
  return tasks.value.filter(task => task.status === currentFilter.value)
})

const getTaskCount = (filter) => {
  if (filter === 'all') return tasks.value.length
  return tasks.value.filter(t => t.status === filter).length
}

// ========== الطلاب المعرضين للخطر ==========
const atRiskStudents = ref([
  {
    id: 1,
    name: 'Emma Thompson',
    email: 'emma.thompson@email.com',
    initials: 'ET',
    company: 'TechCorp Inc.',
    program: t('program_software'),
    status: 'on-track',
    hoursCompleted: 180,
    hoursTotal: 240,
    tasksCompleted: 12,
    tasksTotal: 15
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    initials: 'SJ',
    company: 'DesignHub',
    program: t('program_ux'),
    status: 'at-risk',
    hoursCompleted: 95,
    hoursTotal: 240,
    tasksCompleted: 5,
    tasksTotal: 15
  }
])

// ========== مودال إنشاء مهمة ==========
const showCreateModal = ref(false)
const isCreating = ref(false)
const newTask = ref({
  title: '',
  description: '',
  type: 'assignment',
  dueDate: '',
  points: 100
})

const openCreateTaskModal = () => {
  showCreateModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeCreateModal = () => {
  showCreateModal.value = false
  document.body.style.overflow = ''
  newTask.value = {
    title: '',
    description: '',
    type: 'assignment',
    dueDate: '',
    points: 100
  }
}

const createTask = async () => {
  isCreating.value = true
  try {
    // محاكاة إنشاء المهمة
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // إضافة المهمة الجديدة للقائمة
    const task = {
      id: tasks.value.length + 1,
      ...newTask.value,
      status: 'pending',
      totalStudents: 24,
      submissions: 0,
      featured: false
    }
    tasks.value.unshift(task)
    
    closeCreateModal()
    // إظهار رسالة نجاح (يمكن إضافة Toast)
  } finally {
    isCreating.value = false
  }
}

// ========== دوال التفاعل ==========
const handleStatClick = (stat) => {
  console.log('Stat clicked:', stat)
}

const viewTaskDetails = (task) => {
  router.push(`/supervisor/task/${task.id}`)
}

const editTask = (task) => {
  console.log('Edit task:', task)
  // فتح مودال التعديل
}

const shareTask = (task) => {
  console.log('Share task:', task)
  // نسخ رابط المهمة
}

const deleteTask = (task) => {
  if (confirm(t('confirm_delete_task'))) {
    tasks.value = tasks.value.filter(t => t.id !== task.id)
  }
}

const viewStudentDetails = (student) => {
  router.push(`/supervisor/student/${student.id}`)
}

const addNote = (student) => {
  console.log('Add note for:', student)
  // فتح مودال إضافة ملاحظة
}

// تهيئة AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out-sine'
  })
})
</script>

<style scoped>
.supervisor-dashboard {
  padding: 20px 0;
}

.filter-tabs {
  margin: 20px 0;
}

.filter-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-muted);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
/* تنسيق أزرار الإجراءات */
.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* تأثير hover عام */
.btn-action:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

/* ألوان مختلفة لكل أيقونة (اختياري) */

/* أيقونة التعديل (pencil) - بنفسجي */
.btn-action:hover i.bi-pencil {
  color: var(--accent);
}

/* أيقونة الحذف (trash) - أحمر */
.btn-action.text-danger:hover,
.btn-action:hover i.bi-trash,
.btn-action:hover i.bi-trash3 {
  background: #fee2e2 !important;
  color: #ef4444 !important;
  border-color: #fecaca !important;
}

/* أيقونة الرابط (link) - أزرق */
.btn-action:hover i.bi-link-45deg {
  color: #3b82f6;
}

/* أيقونة العرض (eye) - أخضر */
.btn-action:hover i.bi-eye {
  color: #22c55e;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-action {
  background: #1e293b;
  border-color: #374151;
  color: #9ca3af;
}

[data-theme="dark"] .btn-action:hover {
  background: rgba(124, 58, 237, 0.2);
  border-color: var(--accent);
}
.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.filter-btn .badge {
  background: rgba(0, 0, 0, 0.1);
  color: currentColor;
  font-size: 10px;
}

/* زر بنفسجي معبأ (solid) */
.btn-accent-solid {
  background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 10px 20px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3) !important;
}

.btn-accent-solid:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4) !important;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
}

.btn-accent-solid:active {
  transform: translateY(0) !important;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-accent-solid {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
}
.filter-btn.active .badge {
  background: rgba(255, 255, 255, 0.2);
}

.view-all-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* مودال */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 24px;
}
/* زر متدرج بنفسجي بعرض كامل */
.btn-accent-gradient {
  background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
  color: white !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
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

.btn-accent-gradient.w-100 {
  width: 100% !important;
}

/* للوضع الليلي */
[data-theme="dark"] .btn-accent-gradient {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
}
.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
}

/* Responsive */
@media (max-width: 768px) {
  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 10px;
    flex-wrap: nowrap;
  }
  
  .filter-btn {
    white-space: nowrap;
  }
}

@media (max-width: 576px) {
  .modal-content {
    max-width: 100%;
  }
}
</style>