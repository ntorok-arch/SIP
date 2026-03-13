<template>
  <div class="applicant-details">
    <!-- Header with back button -->
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link me-3" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <div>
        <h2 class="fw-bold mb-2">{{ applicant.name }}</h2>
        <p class="text-muted mb-0">{{ t('applicant_details') }}</p>
      </div>
      <div class="ms-auto">
        <button class="btn btn-outline-primary me-2" @click="sendMessage">
          <i class="bi bi-envelope me-2"></i>{{ t('send_message') }}
        </button>
        <button class="btn btn-success me-2" @click="updateStatus('accepted')">
          <i class="bi bi-check-lg me-2"></i>{{ t('accept') }}
        </button>
        <button class="btn btn-danger" @click="updateStatus('rejected')">
          <i class="bi bi-x-lg me-2"></i>{{ t('reject') }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="row g-4">
      <!-- Left Column - Personal Info -->
      <div class="col-lg-4">
        <!-- Profile Card -->
        <div class="profile-card mb-4">
          <div class="text-center mb-4">
            <div class="avatar-large mx-auto" :style="{ background: applicant.avatarColor }">
              {{ applicant.initials }}
            </div>
            <h4 class="fw-bold mt-3 mb-1">{{ applicant.name }}</h4>
            <p class="text-muted">{{ applicant.email }}</p>
          </div>

          <div class="info-list">
            <div class="info-item">
              <i class="bi bi-telephone text-primary"></i>
              <div>
                <small class="text-muted d-block">{{ t('phone') }}</small>
                <span>{{ applicant.phone }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-geo-alt text-primary"></i>
              <div>
                <small class="text-muted d-block">{{ t('location') }}</small>
                <span>{{ applicant.location }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-mortarboard text-primary"></i>
              <div>
                <small class="text-muted d-block">{{ t('education') }}</small>
                <span>{{ applicant.education }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-briefcase text-primary"></i>
              <div>
                <small class="text-muted d-block">{{ t('experience') }}</small>
                <span>{{ applicant.experience }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Application Status Card -->
        <div class="status-card mb-4">
          <h6 class="fw-bold mb-3">{{ t('application_status') }}</h6>
          <div class="mb-3">
            <span class="badge mb-2" :class="getStatusClass(applicant.status)">
              {{ t(applicant.status) }}
            </span>
          </div>
          <div class="mb-2">
            <small class="text-muted d-block">{{ t('applied_for') }}</small>
            <span class="fw-bold">{{ applicant.program }}</span>
          </div>
          <div class="mb-2">
            <small class="text-muted d-block">{{ t('applied_date') }}</small>
            <span>{{ applicant.appliedDate }}</span>
          </div>
          <div>
            <small class="text-muted d-block">{{ t('last_update') }}</small>
            <span>{{ applicant.lastUpdate }}</span>
          </div>
        </div>
      </div>

      <!-- Right Column - Documents & Notes -->
      <div class="col-lg-8">
        <!-- Documents -->
        <div class="documents-card mb-4">
          <h6 class="fw-bold mb-3">{{ t('submitted_documents') }}</h6>
          <div v-for="doc in applicant.documents" :key="doc.name" class="document-item">
            <div class="d-flex align-items-center gap-3">
              <i :class="getDocumentIcon(doc.type)" class="fs-4" :style="{ color: doc.color }"></i>
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold small">{{ doc.name }}</p>
                <small class="text-muted">{{ doc.size }} • {{ t('uploaded') }} {{ doc.uploadDate }}</small>
              </div>
              <button class="btn btn-sm btn-outline-primary" @click="downloadDocument(doc)">
                <i class="bi bi-download"></i>
              </button>
              <button class="btn btn-sm btn-outline-secondary" @click="viewDocument(doc)">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="notes-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">{{ t('notes') }}</h6>
            <button class="btn btn-sm btn-primary" @click="addNote">
              <i class="bi bi-plus-circle me-2"></i>{{ t('add_note') }}
            </button>
          </div>

          <div v-for="note in applicant.notes" :key="note.id" class="note-item">
            <div class="d-flex justify-content-between mb-2">
              <span class="fw-bold small">{{ note.author }}</span>
              <small class="text-muted">{{ note.date }}</small>
            </div>
            <p class="small mb-0">{{ note.content }}</p>
            <div class="mt-2">
              <button class="btn btn-sm btn-link p-0 me-3" @click="editNote(note)">
                <i class="bi bi-pencil"></i> {{ t('edit') }}
              </button>
              <button class="btn btn-sm btn-link text-danger p-0" @click="deleteNote(note)">
                <i class="bi bi-trash"></i> {{ t('delete') }}
              </button>
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

const applicant = ref({
  id: route.params.id,
  name: 'Emma Thompson',
  initials: 'ET',
  avatarColor: '#7c3aed',
  email: 'emma.thompson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  education: 'BSc Computer Science, Stanford University',
  experience: '2 years as Junior Developer',
  program: 'Software Engineering Internship',
  status: 'pending',
  appliedDate: 'Dec 15, 2024',
  lastUpdate: 'Dec 20, 2024',
  documents: [
    { 
      name: 'resume.pdf', 
      type: 'pdf', 
      size: '2.4 MB', 
      color: '#dc2626',
      uploadDate: 'Dec 15, 2024'
    },
    { 
      name: 'cover_letter.docx', 
      type: 'doc', 
      size: '1.1 MB', 
      color: '#2563eb',
      uploadDate: 'Dec 15, 2024'
    },
    { 
      name: 'portfolio.zip', 
      type: 'zip', 
      size: '15.2 MB', 
      color: '#f59e0b',
      uploadDate: 'Dec 16, 2024'
    }
  ],
  notes: [
    {
      id: 1,
      author: 'Sarah Johnson (HR)',
      date: 'Dec 18, 2024',
      content: 'Candidate has strong technical skills. Schedule technical interview.'
    },
    {
      id: 2,
      author: 'Michael Chen (Tech Lead)',
      date: 'Dec 19, 2024',
      content: 'Impressed with portfolio projects. Recommend moving to next round.'
    }
  ]
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

const getDocumentIcon = (type) => {
  const icons = {
    pdf: 'bi bi-file-earmark-pdf',
    doc: 'bi bi-file-earmark-word',
    docx: 'bi bi-file-earmark-word',
    zip: 'bi bi-file-earmark-zip',
    image: 'bi bi-file-earmark-image'
  }
  return icons[type] || 'bi bi-file-earmark'
}

const goBack = () => {
  router.push('/company/applicants')
}

const sendMessage = () => {
  alert(t('send_message_to', { name: applicant.value.name }))
}

const updateStatus = (status) => {
  applicant.value.status = status
  alert(t('status_updated_to', { status: t(status) }))
}

const downloadDocument = (doc) => {
  alert(t('downloading', { name: doc.name }))
}

const viewDocument = (doc) => {
  alert(t('viewing', { name: doc.name }))
}

const addNote = () => {
  const note = prompt(t('enter_note'))
  if (note) {
    applicant.value.notes.unshift({
      id: Date.now(),
      author: 'You',
      date: new Date().toLocaleDateString(),
      content: note
    })
  }
}

const editNote = (note) => {
  const newContent = prompt(t('edit_note'), note.content)
  if (newContent) {
    note.content = newContent
  }
}

const deleteNote = (note) => {
  if (confirm(t('confirm_delete_note'))) {
    applicant.value.notes = applicant.value.notes.filter(n => n.id !== note.id)
  }
}

onMounted(() => {
  console.log('Loading applicant:', route.params.id)
})
</script>

<style scoped>
.applicant-details {
  padding: 30px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: 600;
}

.info-list {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.info-item i {
  width: 24px;
  font-size: 18px;
}

.status-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.documents-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.document-item {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.document-item:hover {
  border-color: #7c3aed;
  box-shadow: 0 2px 8px rgba(124,58,237,0.1);
}

.notes-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.note-item {
  background: #f9fafb;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.btn-link {
  text-decoration: none;
  font-size: 12px;
}

[data-theme="dark"] .profile-card,
[data-theme="dark"] .status-card,
[data-theme="dark"] .documents-card,
[data-theme="dark"] .notes-card {
  background: #1f2937;
  border-color: #374151;
}

[data-theme="dark"] .info-list {
  border-color: #374151;
}

[data-theme="dark"] .document-item {
  border-color: #374151;
}

[data-theme="dark"] .note-item {
  background: #111827;
}
</style>