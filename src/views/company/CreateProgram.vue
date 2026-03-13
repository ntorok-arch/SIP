<template>
  <div class="create-program">
    <!-- Header -->
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-link me-3" @click="goBack">
        <i class="bi bi-arrow-left fs-4"></i>
      </button>
      <div>
        <h2 class="fw-bold mb-2">{{ t('create_new_program') }}</h2>
        <p class="text-muted mb-0">{{ t('fill_program_details') }}</p>
      </div>
    </div>

    <!-- Form -->
    <div class="form-card">
      <form @submit.prevent="saveProgram">
        <div class="row g-4">
          <!-- Basic Info -->
          <div class="col-12">
            <h5 class="fw-bold mb-3">{{ t('basic_info') }}</h5>
          </div>

          <div class="col-md-8">
            <label class="form-label fw-bold">{{ t('program_title') }} *</label>
            <input type="text" class="form-control" v-model="form.title" required>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">{{ t('duration') }} *</label>
            <input type="text" class="form-control" v-model="form.duration" required>
          </div>

          <div class="col-12">
            <label class="form-label fw-bold">{{ t('description') }} *</label>
            <textarea class="form-control" rows="4" v-model="form.description" required></textarea>
          </div>

          <!-- Details -->
          <div class="col-12">
            <h5 class="fw-bold mb-3">{{ t('program_details') }}</h5>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">{{ t('start_date') }}</label>
            <input type="date" class="form-control" v-model="form.startDate">
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">{{ t('end_date') }}</label>
            <input type="date" class="form-control" v-model="form.endDate">
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">{{ t('capacity') }}</label>
            <input type="number" class="form-control" v-model="form.capacity">
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">{{ t('price') }}</label>
            <input type="number" class="form-control" v-model="form.price">
          </div>

          <div class="col-md-4">
            <label class="form-label fw-bold">{{ t('status') }}</label>
            <select class="form-select" v-model="form.status">
              <option value="draft">{{ t('draft') }}</option>
              <option value="active">{{ t('active') }}</option>
            </select>
          </div>

          <!-- Requirements -->
          <div class="col-12">
            <h5 class="fw-bold mb-3">{{ t('requirements') }}</h5>
          </div>

          <div class="col-12">
            <div v-for="(req, index) in form.requirements" :key="index" class="requirement-item mb-2">
              <div class="input-group">
                <input type="text" class="form-control" v-model="form.requirements[index]" :placeholder="t('requirement_placeholder')">
                <button class="btn btn-outline-danger" type="button" @click="removeRequirement(index)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-link ps-0" type="button" @click="addRequirement">
              <i class="bi bi-plus-circle me-2"></i>{{ t('add_requirement') }}
            </button>
          </div>

          <!-- Buttons -->
          <div class="col-12 mt-4">
            <hr>
            <div class="d-flex justify-content-end gap-3">
              <button type="button" class="btn btn-light" @click="goBack">{{ t('cancel') }}</button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="!isSaving">{{ t('save_program') }}</span>
                <span v-else><span class="spinner-border spinner-border-sm me-2"></span>{{ t('saving') }}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const router = useRouter()
const isSaving = ref(false)

const form = reactive({
  title: '',
  description: '',
  duration: '',
  startDate: '',
  endDate: '',
  capacity: 30,
  price: 0,
  status: 'draft',
  requirements: ['']
})

const addRequirement = () => {
  form.requirements.push('')
}

const removeRequirement = (index) => {
  form.requirements.splice(index, 1)
}

const saveProgram = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(t('program_created'))
    router.push('/company/programs')
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/company/programs')
}
</script>

<style scoped>
.create-program {
  padding: 30px;
}

.form-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #f0f0f0;
  max-width: 900px;
}

.requirement-item {
  max-width: 500px;
}

[data-theme="dark"] .form-card {
  background: #1f2937;
  border-color: #374151;
}
</style>