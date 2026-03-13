<template>
  <div class="notifications-page">
    <!-- رأس الصفحة -->
    <div class="notifications-header mb-4" data-aos="fade-down">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-bell-main">
            <i class="bi bi-bell-fill"></i>
          </div>
          <div>
            <h4 class="fw-bold mb-0">{{ t('notifications') }}</h4>
            <p class="text-muted small mb-0">
              {{ unreadCount }} {{ t('unread_notifications') }}
            </p>
          </div>
        </div>
        
        <button class="btn-mark-all" @click="markAllAsRead">
          <i class="bi bi-check2-all me-1"></i>
          {{ t('mark_all_read') }}
        </button>
      </div>
    </div>

    <!-- قائمة الإشعارات -->
    <div class="notifications-list">
      <div v-for="notif in notifications" :key="notif.id" class="mb-3">
        <NotificationCard
          :title="notif.title"
          :description="notif.description"
          :time="notif.time"
          :unread="notif.unread"
          :type="notif.type"
          :category="notif.category"
          @click="viewNotification(notif)"
          @mark-read="markAsRead(notif)"
          @delete="deleteNotification(notif)"
        />
      </div>
    </div>

    <!-- زر تحميل المزيد -->
    <div class="text-center mt-5">
      <button 
        class="btn-load-more" 
        @click="loadMore"
        :disabled="isLoadingMore"
      >
        <span v-if="!isLoadingMore">
          <i class="bi bi-arrow-down-circle me-2"></i>
          {{ t('load_more') }}
        </span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2"></span>
          {{ t('loading') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import NotificationCard from '@/components/common/NotificationCard.vue'
import AOS from 'aos'

const { t } = useI18n()
const router = useRouter()

// ========== بيانات الإشعارات ==========
const notifications = ref([
  {
    id: 1,
    title: 'course_completed',
    description: 'course_completed_desc',
    time: new Date(Date.now() - 5 * 60000), // 5 دقائق
    unread: true,
    type: 'success',
    category: 'course'
  },
  {
    id: 2,
    title: 'new_course_available',
    description: 'new_course_desc',
    time: new Date(Date.now() - 2 * 3600000), // ساعتين
    unread: true,
    type: 'info',
    category: 'course'
  },
  {
    id: 3,
    title: 'assignment_reviewed',
    description: 'assignment_reviewed_desc',
    time: new Date(Date.now() - 1 * 86400000), // يوم
    unread: false,
    type: 'warning',
    category: 'assignment'
  }
])

// ========== دوال مساعدة ==========
const unreadCount = computed(() => {
  return notifications.value.filter(n => n.unread).length
})

// ========== دوال التفاعل ==========
const markAsRead = (notif) => {
  notif.unread = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.unread = false)
}

const deleteNotification = (notif) => {
  notifications.value = notifications.value.filter(n => n.id !== notif.id)
}

const viewNotification = (notif) => {
  // التوجيه للصفحة المناسبة حسب نوع الإشعار
  console.log('View notification:', notif)
}

// ========== تحميل المزيد ==========
const isLoadingMore = ref(false)

const loadMore = async () => {
  isLoadingMore.value = true
  try {
    // محاكاة تحميل المزيد من الإشعارات
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // إضافة إشعارات جديدة
    const moreNotifications = [
      {
        id: notifications.value.length + 1,
        title: 'new_message',
        description: 'new_message_desc',
        time: new Date(),
        unread: true,
        type: 'info',
        category: 'message'
      },
      {
        id: notifications.value.length + 2,
        title: 'profile_update',
        description: 'profile_update_desc',
        time: new Date(),
        unread: true,
        type: 'warning',
        category: 'system'
      }
    ]
    
    notifications.value.push(...moreNotifications)
  } finally {
    isLoadingMore.value = false
  }
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
.notifications-page {
  padding: 20px 0;
  max-width: 900px;
  margin: 0 auto;
}

.icon-bell-main {
  width: 45px;
  height: 45px;
  background: var(--accent);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.btn-mark-all {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  min-height: 42px;
}

.btn-mark-all:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.btn-load-more {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 30px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
}

.btn-load-more:hover:not(:disabled) {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-header {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .btn-mark-all {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .notifications-page {
    padding: 15px;
  }
  
  .btn-load-more {
    width: 100%;
  }
}
</style>