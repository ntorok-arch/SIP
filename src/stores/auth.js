import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userType = computed(() => user.value?.type || null)

  // Actions
  async function initializeAuth() {
    if (isInitialized.value) return
    
    isLoading.value = true
    try {
      // محاولة استرجاع المستخدم من التخزين المحلي
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
        console.log('🔄 Auth initialized:', user.value?.type)
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  async function setUser(userData) {
    user.value = userData
    // حفظ في التخزين المحلي
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('✅ User saved to localStorage:', userData.type)
    } else {
      localStorage.removeItem('user')
      console.log('👋 User removed from localStorage')
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    console.log('👋 User logged out')
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,
    // Getters
    isAuthenticated,
    userType,
    // Actions
    initializeAuth,
    setUser,
    logout
  }
})