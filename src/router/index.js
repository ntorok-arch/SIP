import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ========== مسارات المصادقة ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/supervisor/login',
    name: 'SupervisorLogin',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/company/login',
    name: 'CompanyLogin',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/CreateAccount.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/company/register',
    name: 'CompanyRegister',
    component: () => import('@/views/auth/CompanyRegistration.vue'),
    meta: { requiresAuth: false }
  },

  // ========== مسارات المدير (Admin) ==========
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/Users.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/companies',
    name: 'AdminCompanies',
    component: () => import('@/views/admin/Companies.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: () => import('@/views/admin/Reports.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // ========== مسارات المشرف (Supervisor) ==========
  {
    path: '/supervisor',
    redirect: '/supervisor/dashboard',
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  {
    path: '/supervisor/dashboard',
    name: 'SupervisorDashboard',
    component: () => import('@/views/supervisor/SupervisorDashboard.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  {
    path: '/supervisor/students',
    name: 'SupervisorStudents',
    component: () => import('@/views/supervisor/Students.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  {
    path: '/supervisor/student/:id',
    name: 'StudentFullDetails',
    component: () => import('@/views/supervisor/StudentFullDetails.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  {
    path: '/supervisor/weekly-tasks',
    name: 'WeeklyTasksMonitoring',
    component: () => import('@/views/supervisor/WeeklyTasksMonitoring.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },
  {
    path: '/supervisor/reports',
    name: 'TrainerReports',
    component: () => import('@/views/supervisor/TrainerReports.vue'),
    meta: { requiresAuth: true, role: 'supervisor' }
  },

  // ========== مسارات الطالب (Student) ==========
  {
    path: '/student',
    redirect: '/student/dashboard',
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/dashboard',
    name: 'StudentDashboard',
    component: () => import('@/views/student/StudentDashboard.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/workspace',
    name: 'TrainingWorkspace',
    component: () => import('@/views/student/TrainingWorkspace.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/application-status',
    name: 'ApplicationStatus',
    component: () => import('@/views/student/ApplicationStatus.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/browse-programs',
    name: 'BrowseTrainingPrograms',
    component: () => import('@/views/student/BrowseTrainingPrograms.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/program/:id',
    name: 'TrainingProgramDetails',
    component: () => import('@/views/student/TrainingProgramDetails.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/submit-task/:taskId',
    name: 'SubmitWeeklyTask',
    component: () => import('@/views/student/SubmitWeeklyTask.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/accreditation',
    name: 'FinalAccreditationStatus',
    component: () => import('@/views/student/FinalAccreditationStatus.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },

  // ========== مسارات الشركة (Company) ========== ✅ قسم جديد
  {
    path: '/company',
    redirect: '/company/dashboard',
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/dashboard',
    name: 'CompanyDashboard',
    component: () => import('@/views/company/CompanyDashboard.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/programs',
    name: 'CompanyPrograms',
    component: () => import('@/views/company/Programs.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/programs/create',
    name: 'CompanyCreateProgram',
    component: () => import('@/views/company/CreateProgram.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/programs/:id',
    name: 'CompanyProgramDetails',
    component: () => import('@/views/company/ProgramDetails.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/applicants',
    name: 'CompanyApplicants',
    component: () => import('@/views/company/Applicants.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },
  {
    path: '/company/applicants/:id',
    name: 'CompanyApplicantDetails',
    component: () => import('@/views/company/ApplicantDetails.vue'),
    meta: { requiresAuth: true, role: 'company' }
  },

  {
  path: '/company/reports',
  name: 'CompanyReports',
  component: () => import('@/views/company/Reports.vue'),
  meta: { requiresAuth: true, role: 'company' }
},

  // ========== المسارات المشتركة ==========
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/shared/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/shared/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/submission-review/:id',
    name: 'SubmissionReview',
    component: () => import('@/views/shared/SubmissionReview.vue'),
    meta: { requiresAuth: true }
  },

  // ========== مسار إعادة التوجيه الافتراضي ==========
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// حماية المسارات المحسنة
router.beforeEach(async (to, from, next) => {
  // تهيئة الـ store
  const authStore = useAuthStore()
  
  // منع التحذير عند التنقل المكرر
  if (to.path === from.path) {
    next(false) // إلغاء التنقل المكرر بصمت
    return
  }

  // انتظار تحميل حالة المصادقة إذا كانت غير معرفة
  if (authStore.isInitialized === false) {
    await authStore.initializeAuth()
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.meta.role

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // غير مسجل دخول - التوجيه لتسجيل الدخول مع حفظ المسار المطلوب
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else if (requiredRole && authStore.userType !== requiredRole) {
      // دور غير مناسب - التوجيه للوحة المناسبة
      const dashboardPath = `/${authStore.userType}/dashboard`
      if (to.path !== dashboardPath) {
        next(dashboardPath)
      } else {
        next(false)
      }
    } else {
      // كل شيء تمام
      next()
    }
  } else {
    // صفحات عامة
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register' || to.path.includes('/login'))) {
      // مسجل دخول ويحاول الدخول لصفحة تسجيل الدخول
      const dashboardPath = `/${authStore.userType}/dashboard`
      if (from.path !== dashboardPath) {
        next(dashboardPath)
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
})

export default router