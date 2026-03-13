<template>
  <div class="login-page" :class="loginStyle">
    <div class="login-container">
      <!-- بطاقة تسجيل الدخول -->
      <div class="login-card animate__animated animate__fadeIn">
        <!-- الشعار -->
        <div class="text-center mb-4">
          <div class="logo-box" :style="{ background: `var(--${accentColor})` }">
            <i :class="logoIcon"></i>
          </div>
          <h3 class="fw-bold mb-1" v-text="t(portalTitle)"></h3>
          <p class="text-muted small" v-text="t(portalSubtitle)"></p>
        </div>

        <!-- شارة نوع الوصول - ستظهر حسب نوع الحساب -->
        <span class="access-badge" :class="badgeClass" v-text="t(accessBadge)"></span>

        <!-- اختيار نوع الحساب (لصفحة login الرئيسية فقط) -->
        <div v-if="isMainLogin" class="account-type-selector mb-4">
          <p class="small fw-bold text-muted mb-2">{{ t('select_account_type') }}</p>
          <div class="d-flex gap-2 flex-wrap">
            <button 
              v-for="type in accountTypes" 
              :key="type.value"
              class="type-btn"
              :class="{ active: selectedAccountType === type.value }"
              @click="selectedAccountType = type.value"
            >
              <i :class="type.icon"></i>
              <span>{{ t(type.label) }}</span>
            </button>
          </div>
        </div>

        <!-- نموذج تسجيل الدخول -->
        <form @submit.prevent="handleLogin">
          <!-- معرف المستخدم -->
          <div class="mb-4">
            <label class="form-label fw-bold small" v-text="t(userLabel)"></label>
            <div class="input-group">
              <span class="input-group-text">
                <i :class="userIcon"></i>
              </span>
              <input
                type="text"
                class="form-control"
                :placeholder="t(userPlaceholder)"
                v-model="form.userId"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- كلمة المرور -->
          <div class="mb-3">
            <label class="form-label fw-bold small" v-text="t(passwordLabel)"></label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-lock"></i>
              </span>
              <input
                :type="showPasswordField ? 'text' : 'password'"
                class="form-control"
                :placeholder="t(passwordPlaceholder)"
                v-model="form.password"
                required
                :disabled="isLoading"
              />
              <button
                class="input-group-text password-toggle"
                type="button"
                @click="togglePassword"
              >
                <i :class="showPasswordField ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- خيارات إضافية -->
          <div class="d-flex justify-content-between align-items-center my-3">
            <div class="form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="rememberMe"
                v-model="form.remember"
              />
              <label class="form-check-label small" for="rememberMe" v-text="t('remember_me')"></label>
            </div>
            <a href="#" class="forgot-link" @click.prevent="handleForgot" v-text="t('forgot_password')"></a>
          </div>

          <!-- زر تسجيل الدخول -->
          <button 
            type="submit" 
            class="btn-login" 
            :class="btnClass"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">
              <i :class="btnIcon" class="me-2"></i>
              {{ t(btnText) }}
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ t('signing_in') }}
            </span>
          </button>

          <!-- روابط التسجيل (للمستخدمين الجدد) -->
          <div class="text-center mt-4">
            <small class="text-muted">
              {{ t('no_account') }}
              <a href="#" @click.prevent="goToRegister" class="register-link fw-bold">
                {{ t('register_now') }}
              </a>
            </small>
          </div>
        </form>

        <!-- رابط تسجيل الشركة (يظهر فقط عند اختيار Company) -->
        <div v-if="selectedAccountType === 'company'" class="text-center mt-3">
          <small class="text-muted">
            {{ t('want_register_company') }}
            <a href="#" @click.prevent="goToCompanyRegister" class="register-link">
              {{ t('register_company') }}
            </a>
          </small>
        </div>

        <!-- رسالة للمشرفين -->
        <div v-if="selectedAccountType === 'supervisor'" class="first-time-box mt-4">
          <i class="bi bi-info-circle me-2"></i>
          {{ t('supervisor_first_time') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'

const { t, currentLang } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// تحديد ما إذا كانت هذه صفحة login الرئيسية
const isMainLogin = computed(() => {
  return router.currentRoute.value.path === '/login'
})

// أنواع الحسابات المتاحة
const accountTypes = [
  { value: 'student', icon: 'fas fa-graduation-cap', label: 'student' },
  { value: 'supervisor', icon: 'fas fa-chalkboard-teacher', label: 'supervisor' },
  { value: 'company', icon: 'fas fa-building', label: 'company' },
  { value: 'admin', icon: 'fas fa-user-cog', label: 'admin' }
]

// نوع الحساب المحدد (من المسار أو من الاختيار)
const selectedAccountType = ref('student')

// تحديث نوع الحساب بناءً على المسار
const updateAccountTypeFromPath = () => {
  const path = router.currentRoute.value.path
  if (path.includes('supervisor')) selectedAccountType.value = 'supervisor'
  else if (path.includes('company')) selectedAccountType.value = 'company'
  else if (path.includes('admin')) selectedAccountType.value = 'admin'
  else selectedAccountType.value = 'student'
}

// مراقبة تغيير المسار
watch(() => router.currentRoute.value.path, updateAccountTypeFromPath, { immediate: true })

// إعدادات متغيرة حسب نوع الحساب
const portalTitle = computed(() => {
  const titles = {
    student: 'student_portal',
    supervisor: 'supervisor_portal',
    company: 'company_portal',
    admin: 'admin_portal'
  }
  return titles[selectedAccountType.value] || 'student_portal'
})

const portalSubtitle = computed(() => {
  const subtitles = {
    student: 'student_subtitle',
    supervisor: 'supervisor_subtitle',
    company: 'company_subtitle',
    admin: 'admin_subtitle'
  }
  return subtitles[selectedAccountType.value] || 'student_subtitle'
})

const accessBadge = computed(() => {
  const badges = {
    student: 'student_access',
    supervisor: 'supervisor_access',
    company: 'company_access',
    admin: 'admin_access'
  }
  return badges[selectedAccountType.value] || 'student_access'
})

const badgeClass = computed(() => {
  const classes = {
    student: 'badge-student',
    supervisor: 'badge-supervisor',
    company: 'badge-company',
    admin: 'badge-admin'
  }
  return classes[selectedAccountType.value] || 'badge-student'
})

const loginStyle = computed(() => {
  const styles = {
    student: 'login-style-student',
    supervisor: 'login-style-supervisor',
    company: 'login-style-company',
    admin: 'login-style-admin'
  }
  return styles[selectedAccountType.value] || 'login-style-student'
})

const accentColor = computed(() => {
  const colors = {
    student: 'accent',
    supervisor: 'primary-purple',
    company: 'success-green',
    admin: 'admin-color'
  }
  return colors[selectedAccountType.value] || 'accent'
})

const logoIcon = computed(() => {
  const icons = {
    student: 'fas fa-graduation-cap',
    supervisor: 'fas fa-chalkboard-teacher',
    company: 'fas fa-building',
    admin: 'fas fa-user-cog'
  }
  return icons[selectedAccountType.value] || 'fas fa-graduation-cap'
})

const userLabel = computed(() => {
  const labels = {
    student: 'university_id',
    supervisor: 'university_id',
    company: 'email_label',
    admin: 'admin_id'
  }
  return labels[selectedAccountType.value] || 'university_id'
})

const userPlaceholder = computed(() => {
  const placeholders = {
    student: 'student_id_placeholder',
    supervisor: 'supervisor_id_placeholder',
    company: 'email_placeholder',
    admin: 'admin_id_placeholder'
  }
  return placeholders[selectedAccountType.value] || 'student_id_placeholder'
})

const userIcon = computed(() => {
  const icons = {
    student: 'fas fa-hashtag',
    supervisor: 'fas fa-id-card',
    company: 'fas fa-envelope',
    admin: 'fas fa-user-shield'
  }
  return icons[selectedAccountType.value] || 'fas fa-hashtag'
})

const btnClass = computed(() => {
  const classes = {
    student: 'btn-student',
    supervisor: 'btn-supervisor',
    company: 'btn-company',
    admin: 'btn-admin'
  }
  return classes[selectedAccountType.value] || 'btn-student'
})

const btnIcon = computed(() => {
  const icons = {
    student: 'fas fa-right-to-bracket',
    supervisor: 'fas fa-sign-in-alt',
    company: 'fas fa-arrow-right-to-bracket',
    admin: 'fas fa-lock-open'
  }
  return icons[selectedAccountType.value] || 'fas fa-right-to-bracket'
})

// ✅ الخصائص المحسوبة المضافة (لإصلاح الأخطاء)
const passwordLabel = computed(() => 'password_label')
const passwordPlaceholder = computed(() => 'password_placeholder')
const btnText = computed(() => 'sign_in')

// حالة النموذج
const isLoading = ref(false)
const showPasswordField = ref(false)

const form = reactive({
  userId: '',
  password: '',
  remember: false
})

const togglePassword = () => {
  showPasswordField.value = !showPasswordField.value
}

// معالجة تسجيل الدخول
const handleLogin = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // بيانات المستخدمين للتجربة
    const userData = {
      student: { 
        id: form.userId, 
        name: 'أحمد محمد', 
        type: 'student',
        email: 'ahmed@student.edu',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=7c3aed&color=fff'
      },
      supervisor: { 
        id: form.userId, 
        name: 'د. أحمد', 
        type: 'supervisor',
        email: 'ahmed@supervisor.edu',
        avatar: 'https://ui-avatars.com/api/?name=Dr+Ahmed&background=4f46e5&color=fff'
      },
      company: { 
        id: form.userId, 
        name: 'TechCorp', 
        type: 'company',
        email: 'info@techcorp.com',
        avatar: 'https://ui-avatars.com/api/?name=Tech+Corp&background=10b981&color=fff'
      },
      admin: { 
        id: form.userId, 
        name: 'مدير النظام', 
        type: 'admin',
        email: 'admin@system.edu',
        avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=4f46e5&color=fff'
      }
    }
    
    // حفظ بيانات المستخدم
    await authStore.setUser(userData[selectedAccountType.value])
    console.log('✅ User set in store:', selectedAccountType.value)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // التوجيه للوحة المناسبة
    const routes = {
      student: '/student/dashboard',
      supervisor: '/supervisor/dashboard',
      company: '/company/dashboard',
      admin: '/admin/dashboard'
    }
    
    const targetRoute = routes[selectedAccountType.value]
    console.log('➡️ Redirecting to:', targetRoute)
    
    if (router.currentRoute.value.path !== targetRoute) {
      await router.replace(targetRoute)
    }
    
  } catch (error) {
    console.error('Login failed:', error)
    alert('فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.')
  } finally {
    isLoading.value = false
  }
}

// روابط إضافية
const handleForgot = () => {
  alert(t('forgot_password_message'))
}

const goToRegister = () => {
  router.push('/register')
}

const goToCompanyRegister = () => {
  router.push('/company/register')
}

// تهيئة الصفحة
onMounted(async () => {
  document.documentElement.lang = currentLang.value
  document.documentElement.dir = currentLang.value === 'ar' ? 'rtl' : 'ltr'
  
  // إذا كان المستخدم مسجل دخوله بالفعل
  if (authStore.isAuthenticated) {
    const dashboardPath = `/${authStore.userType}/dashboard`
    if (router.currentRoute.value.path !== dashboardPath) {
      await router.replace(dashboardPath)
    }
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* أنماط مختلفة لكل نوع */
.login-style-student {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-style-supervisor {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-style-company {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.login-style-admin {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo-box {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: white;
  font-size: 30px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.access-badge {
  display: block;
  width: fit-content;
  margin: 0 auto 30px;
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 13px;
}

.badge-student {
  background: #f3f0ff;
  color: #7c3aed;
}

.badge-supervisor {
  background: #e0e7ff;
  color: #4f46e5;
}

.badge-company {
  background: #d1fae5;
  color: #10b981;
}

.badge-admin {
  background: #e0e7ff;
  color: #4f46e5;
}

.account-type-selector {
  margin-top: 20px;
}

.type-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.type-btn i {
  font-size: 20px;
}

.type-btn span {
  font-size: 12px;
  font-weight: 500;
}

.type-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.type-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #1e293b;
}

.input-group {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: v-bind('`var(--${accentColor})`');
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
}

.input-group-text {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0 15px;
}

.form-control {
  border: none;
  padding: 12px 15px 12px 0;
  font-size: 15px;
  background: transparent;
}

.form-control:focus {
  box-shadow: none;
  outline: none;
}

.password-toggle {
  cursor: pointer;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 0 15px;
}

.password-toggle:hover {
  color: v-bind('`var(--${accentColor})`');
}

.form-check-input:checked {
  background-color: v-bind('`var(--${accentColor})`');
  border-color: v-bind('`var(--${accentColor})`');
}

.forgot-link {
  color: v-bind('`var(--${accentColor})`');
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: 20px;
}

.btn-student {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
}

.btn-supervisor {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.btn-company {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.btn-admin {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  color: v-bind('`var(--${accentColor})`');
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.first-time-box {
  background: #eff6ff;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  font-size: 13px;
  color: #1e40af;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* الوضع الليلي */
[data-theme="dark"] .login-card {
  background: #1e293b;
  border-color: #334155;
}

[data-theme="dark"] .form-label {
  color: #f3f4f6;
}

[data-theme="dark"] .form-control {
  color: #f3f4f6;
}

[data-theme="dark"] .form-control::placeholder {
  color: #9ca3af;
}

[data-theme="dark"] .input-group {
  border-color: #4b5563;
}

[data-theme="dark"] .first-time-box {
  background: #1e3a8a33;
  color: #93c5fd;
  border-color: #2563eb33;
}

/* Responsive */
@media (max-width: 576px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .logo-box {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  .btn-login {
    padding: 12px;
    font-size: 15px;
  }
  
  .type-btn {
    min-width: 60px;
  }
  
  .type-btn span {
    font-size: 10px;
  }
}
</style>