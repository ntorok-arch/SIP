<template>
  <div class="submission-review-page">
    <!-- شريط التنقل العلوي -->
    <nav class="review-navbar">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <router-link to="/supervisor/dashboard" class="back-link">
            <i class="fas fa-arrow-left me-2"></i>
            {{ t('back_dashboard') }}
          </router-link>

          <div class="text-center">
            <h5 class="mb-0 fw-bold">{{ t('submission_review') }}</h5>
            <small class="text-muted">{{ task?.title }}</small>
          </div>

          <span class="text-muted">{{ currentIndex }} {{ t('of') }} {{ totalSubmissions }}</span>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <div class="row g-4">
        <!-- العمود الأيسر - معلومات الطالب والتقديم -->
        <div class="col-lg-7">
          <!-- بطاقة الطالب -->
          <div class="student-card mb-4" data-aos="fade-right">
            <div class="d-flex align-items-center gap-3">
              <div class="avatar-circle" :style="{ background: student.avatarColor }">
                {{ student.initials }}
              </div>
              <div>
                <h5 class="mb-0 fw-bold">{{ student.name }}</h5>
                <p class="mb-1 text-muted small">{{ t('student_id') }}: {{ student.id }}</p>
                <small class="text-muted">
                  <i class="far fa-calendar me-1"></i>
                  {{ t('submitted_on') }}: {{ formatDate(student.submissionDate) }}
                </small>
              </div>
            </div>
          </div>

          <!-- تفاصيل التقديم -->
          <div class="section-card mb-4" data-aos="fade-right" data-aos-delay="100">
            <h6 class="fw-bold mb-3">
              <i class="far fa-file-alt text-primary me-2"></i>
              {{ t('submission_details') }}
            </h6>

            <!-- الملفات المرفوعة -->
            <div 
              v-for="file in submission.files" 
              :key="file.name"
              class="file-box d-flex justify-content-between align-items-center mb-3"
            >
              <div class="d-flex align-items-center gap-3">
                <i :class="getFileIcon(file.name)" class="fa-2x"></i>
                <div>
                  <p class="mb-0 fw-bold">{{ file.name }}</p>
                  <small class="text-muted">{{ file.size }}</small>
                </div>
              </div>
              <button class="btn btn-outline-dark btn-sm" @click="downloadFile(file)">
                <i class="fas fa-download me-1"></i> {{ t('download') }}
              </button>
            </div>

            <!-- أزرار المعاينة -->
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-light border flex-fill" @click="previewFiles">
                <i class="far fa-eye me-1"></i> {{ t('preview_files') }}
              </button>
              <button class="btn btn-light border flex-fill" @click="openInIDE">
                <i class="fas fa-external-link-alt me-1"></i> {{ t('view_in_ide') }}
              </button>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن - التقييم والتعليقات -->
        <div class="col-lg-5">
          <!-- بطاقة الدرجة -->
          <div class="score-box mb-4" data-aos="fade-left">
            <div class="score-icon">
              <i class="fas fa-award"></i>
            </div>

            <div class="row align-items-center g-3">
              <div class="col-6 border-end">
                <small class="text-muted d-block">{{ t('total_score') }}</small>
                <h1 class="display-4 fw-bold mb-0">{{ score }}</h1>
              </div>
              <div class="col-6 text-start ps-4">
                <small class="text-muted d-block">{{ t('out_of') }}</small>
                <h1 class="display-4 fw-bold text-muted mb-0">100</h1>
              </div>
            </div>

            <div class="progress mt-4">
              <div 
                class="progress-bar" 
                :class="scoreClass"
                :style="{ width: score + '%' }"
              ></div>
            </div>
          </div>

          <!-- قوالب التعليقات -->
          <div class="section-card mb-4" data-aos="fade-left" data-aos-delay="100">
            <h6 class="fw-bold mb-3">
              <i class="far fa-comment-dots text-primary me-2"></i>
              {{ t('feedback_templates') }}
            </h6>

            <div class="d-flex flex-wrap gap-2">
              <button 
                v-for="template in feedbackTemplates" 
                :key="template.score"
                class="template-btn"
                @click="applyTemplate(template)"
              >
                {{ t(template.text) }}
              </button>
            </div>
          </div>

          <!-- التعليقات التفصيلية -->
          <div class="section-card mb-4" data-aos="fade-left" data-aos-delay="200">
            <h6 class="fw-bold mb-3">
              <i class="far fa-comment-alt text-success me-2"></i>
              {{ t('detailed_feedback') }}
            </h6>

            <textarea
              class="form-control mb-3"
              rows="5"
              v-model="feedback"
              :placeholder="t('feedback_placeholder')"
            ></textarea>

            <div class="d-flex gap-2">
              <button class="btn btn-light border w-50" @click="resetFeedback">
                <i class="fas fa-sync-alt me-1"></i> {{ t('reset') }}
              </button>
              <button class="btn btn-primary w-50" @click="submitEvaluation" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                  <i class="fas fa-paper-plane me-1"></i> {{ t('submit_evaluation') }}
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ t('submitting') }}
                </span>
              </button>
            </div>
          </div>

          <!-- معلومات إضافية -->
          <div class="info-alert p-3 d-flex align-items-start gap-2">
            <i class="fas fa-info-circle mt-1 flex-shrink-0"></i>
            <span class="small">{{ t('info_alert') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import AOS from 'aos'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// ========== بيانات التقديم ==========
const submission = ref({
  files: [
    { name: 'react-hooks-assignment.zip', size: '2.4 MB' }
  ]
})

const student = ref({
  name: 'Sarah Johnson',
  id: 'S001',
  initials: 'SJ',
  avatarColor: '#7c3aed',
  submissionDate: '2024-12-27T14:30:00'
})

const task = ref({
  title: 'React Hooks Deep Dive Assignment'
})

// ========== حالة التقييم ==========
const score = ref(0)
const feedback = ref('')
const isSubmitting = ref(false)

// ========== قوالب التعليقات ==========
const feedbackTemplates = ref([
  { score: 95, text: 'template1' },
  { score: 75, text: 'template2' },
  { score: 40, text: 'template3' }
])

// ========== دوال مساعدة ==========
const currentIndex = ref(1)
const totalSubmissions = ref(3)

const scoreClass = computed(() => {
  if (score.value >= 85) return 'bg-success'
  if (score.value >= 60) return 'bg-warning'
  return 'bg-danger'
})

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  const icons = {
    zip: 'fas fa-file-archive text-warning',
    pdf: 'fas fa-file-pdf text-danger',
    js: 'fas fa-file-code text-primary'
  }
  return icons[ext] || 'fas fa-file text-muted'
}

// ========== دوال التفاعل ==========
const applyTemplate = (template) => {
  score.value = template.score
  feedback.value += t(template.text) + '\n'
}

const resetFeedback = () => {
  score.value = 0
  feedback.value = ''
}

const submitEvaluation = async () => {
  if (score.value === 0) {
    alert(t('select_score_alert'))
    return
  }

  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(t('submitted_alert'))
    router.push('/supervisor/dashboard')
  } finally {
    isSubmitting.value = false
  }
}

const downloadFile = (file) => {
  alert(t('downloading', { name: file.name }))
}

const previewFiles = () => {
  alert(t('previewing_files'))
}

const openInIDE = () => {
  alert(t('opening_in_ide'))
}

// تهيئة AOS
onMounted(() => {
  AOS.init({
    duration: 800,
    once: true
  })
})
</script>

<style scoped>
.submission-review-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 50px;
}

[data-theme="dark"] .submission-review-page {
  background: var(--main-bg);
}

.review-navbar {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-link {
  text-decoration: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: var(--accent);
}

.student-card {
  background: #f3efff;
  border-radius: 15px;
  padding: 20px;
}

[data-theme="dark"] .student-card {
  background: rgba(124, 58, 237, 0.1);
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.section-card {
  background: var(--card-bg);
  border-radius: 15px;
  border: 1px solid var(--border-color);
  padding: 20px;
}

.file-box {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 15px;
  background: #fafafa;
}

[data-theme="dark"] .file-box {
  background: #1e293b;
}

.score-box {
  background: #f0f7ff;
  border-radius: 15px;
  padding: 30px;
  position: relative;
}

[data-theme="dark"] .score-box {
  background: rgba(59, 130, 246, 0.1);
}

.score-icon {
  position: absolute;
  right: 20px;
  top: 20px;
  color: var(--accent);
  font-size: 2rem;
  opacity: 0.3;
}

.progress {
  height: 10px;
  border-radius: 5px;
  background: var(--border-color);
}

.template-btn {
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-dark);
  border-radius: 8px;
  padding: 6px 15px;
  font-size: 13px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.template-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.form-control {
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px;
  color: var(--text-dark);
}

.form-control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
}

.info-alert {
  background: #eef6ff;
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-dark);
}

[data-theme="dark"] .info-alert {
  background: rgba(59, 130, 246, 0.1);
}

.btn-primary {
  background: var(--accent);
  border: none;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #6d28d9;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .review-navbar .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .score-box {
    padding: 20px;
  }
  
  .score-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .student-card .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .file-box {
    flex-direction: column;
    gap: 10px;
  }
  
  .file-box .d-flex {
    width: 100%;
  }
  
  .file-box button {
    width: 100%;
  }
}
</style>