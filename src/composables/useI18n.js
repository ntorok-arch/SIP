import { ref, computed } from 'vue'

// ========== استيراد الترجمات الإنجليزية ==========
import enCommon from '@/locales/en/common.json'
import enAuth from '@/locales/en/auth.json'
import enAdmin from '@/locales/en/admin.json'
import enSupervisor from '@/locales/en/supervisor.json'
import enStudent from '@/locales/en/student.json'
import enShared from '@/locales/en/shared.json'
import enCompany from '@/locales/en/company.json'      // ✅ ملف الشركات (إنجليزي)
import enErrors from '@/locales/en/errors.json'        // ✅ ملف الأخطاء (إنجليزي)

// ========== استيراد الترجمات العربية ==========
import arCommon from '@/locales/ar/common.json'
import arAuth from '@/locales/ar/auth.json'
import arAdmin from '@/locales/ar/admin.json'
import arSupervisor from '@/locales/ar/supervisor.json'
import arStudent from '@/locales/ar/student.json'
import arShared from '@/locales/ar/shared.json'
import arCompany from '@/locales/ar/company.json'      // ✅ ملف الشركات (عربي)
import arErrors from '@/locales/ar/errors.json'        // ✅ ملف الأخطاء (عربي)

// ========== دمج جميع الترجمات الإنجليزية ==========
const enTranslations = {
  ...enCommon,
  ...enAuth,
  ...enAdmin,
  ...enSupervisor,
  ...enStudent,
  ...enShared,
  ...enCompany,
  ...enErrors
}

// ========== دمج جميع الترجمات العربية ==========
const arTranslations = {
  ...arCommon,
  ...arAuth,
  ...arAdmin,
  ...arSupervisor,
  ...arStudent,
  ...arShared,
  ...arCompany,
  ...arErrors
}

// عرض إحصائيات الترجمة في الكونسول
console.log('📊 Translation Statistics:')
console.log('✅ English translations loaded:', Object.keys(enTranslations).length, 'keys')
console.log('✅ Arabic translations loaded:', Object.keys(arTranslations).length, 'keys')

// اللغة الحالية (من localStorage أو default 'en')
const currentLang = ref(localStorage.getItem('lang') || 'en')

// تطبيق اتجاه اللغة على الصفحة
const applyLanguageDirection = (lang) => {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

// تطبيق اللغة الحالية عند التحميل
applyLanguageDirection(currentLang.value)

export function useI18n() {
  /**
   * دالة الترجمة الرئيسية
   * @param {string} key - مفتاح الترجمة
   * @param {Object} params - المتغيرات المراد استبدالها (مثل {name: 'أحمد'})
   * @returns {string} - النص المترجم
   */
  const t = (key, params = {}) => {
    // اختيار الترجمات حسب اللغة الحالية
    const translations = currentLang.value === 'ar' ? arTranslations : enTranslations
    
    // البحث عن الترجمة
    let text = translations[key]
    
    // إذا لم يتم العثور على الترجمة
    if (!text) {
      // البحث عن مصدر المفتاح المفقود للمساعدة في التصحيح
      const sources = []
      
      // البحث في الملفات الإنجليزية
      if (enCommon && enCommon[key]) sources.push('common.json (EN)')
      if (enAuth && enAuth[key]) sources.push('auth.json (EN)')
      if (enAdmin && enAdmin[key]) sources.push('admin.json (EN)')
      if (enSupervisor && enSupervisor[key]) sources.push('supervisor.json (EN)')
      if (enStudent && enStudent[key]) sources.push('student.json (EN)')
      if (enShared && enShared[key]) sources.push('shared.json (EN)')
      if (enCompany && enCompany[key]) sources.push('company.json (EN)')
      if (enErrors && enErrors[key]) sources.push('errors.json (EN)')
      
      // البحث في الملفات العربية
      if (arCommon && arCommon[key]) sources.push('common.json (AR)')
      if (arAuth && arAuth[key]) sources.push('auth.json (AR)')
      if (arAdmin && arAdmin[key]) sources.push('admin.json (AR)')
      if (arSupervisor && arSupervisor[key]) sources.push('supervisor.json (AR)')
      if (arStudent && arStudent[key]) sources.push('student.json (AR)')
      if (arShared && arShared[key]) sources.push('shared.json (AR)')
      if (arCompany && arCompany[key]) sources.push('company.json (AR)')
      if (arErrors && arErrors[key]) sources.push('errors.json (AR)')
      
      if (sources.length > 0) {
        console.warn(`⚠️ Missing translation: "${key}" - موجود في: ${sources.join(', ')}`)
      } else {
        console.warn(`⚠️ Missing translation: "${key}" - غير موجود في أي ملف`)
      }
      
      // إرجاع المفتاح بين قوسين للوضوح
      return `[${key}]`
    }
    
    // استبدال المتغيرات في النص
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        const regex = new RegExp(`\\{${param}\\}`, 'g')
        text = text.replace(regex, params[param])
      })
    }
    
    return text
  }
  
  /**
   * تغيير اللغة
   * @param {string} lang - اللغة المطلوبة ('ar' أو 'en')
   */
  const changeLanguage = (lang) => {
    if (lang !== 'ar' && lang !== 'en') {
      console.error(`❌ Unsupported language: ${lang}`)
      return
    }
    
    if (lang === currentLang.value) return
    
    currentLang.value = lang
    localStorage.setItem('lang', lang)
    applyLanguageDirection(lang)
    
    // إعادة تحميل الصفحة لتطبيق التغييرات على جميع المكونات
    window.location.reload()
  }
  
  /**
   * الحصول على نص مع صيغة الجمع
   * @param {string} key - مفتاح الترجمة الأساسي
   * @param {number} count - العدد
   * @param {Object} params - متغيرات إضافية
   */
  const tPlural = (key, count, params = {}) => {
    const pluralKey = count === 1 ? `${key}_one` : `${key}_other`
    return t(pluralKey, { count, ...params })
  }
  
  /**
   * تنسيق التاريخ حسب اللغة
   * @param {Date|string} date - التاريخ
   * @param {Object} options - خيارات التنسيق
   */
  const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    const locale = currentLang.value === 'ar' ? 'ar-EG' : 'en-US'
    return new Date(date).toLocaleDateString(locale, { ...defaultOptions, ...options })
  }
  
  /**
   * تنسيق الوقت النسبي (منذ دقيقة، ساعة، الخ)
   * @param {Date|string} date - التاريخ
   */
  const timeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffMin < 1) return t('just_now')
    if (diffMin < 60) return t('minutes_ago', { count: diffMin })
    if (diffHour < 24) return t('hours_ago', { count: diffHour })
    if (diffDay < 30) return t('days_ago', { count: diffDay })
    
    return formatDate(date, { month: 'short', day: 'numeric' })
  }
  
  /**
   * التحقق من وجود ترجمة لمفتاح معين
   * @param {string} key - مفتاح الترجمة
   */
  const hasTranslation = (key) => {
    const translations = currentLang.value === 'ar' ? arTranslations : enTranslations
    return !!translations[key]
  }
  
  /**
   * الحصول على جميع المفاتيح المتاحة
   */
  const getAvailableKeys = () => {
    return Object.keys(currentLang.value === 'ar' ? arTranslations : enTranslations)
  }
  
  return {
    // الحالة
    currentLang: computed(() => currentLang.value),
    isRTL: computed(() => currentLang.value === 'ar'),
    isLTR: computed(() => currentLang.value === 'en'),
    
    // دوال الترجمة
    t,
    tPlural,
    changeLanguage,
    
    // دوال مساعدة
    formatDate,
    timeAgo,
    hasTranslation,
    getAvailableKeys
  }
}

// ========== تصدير دوال إضافية للاستخدام المباشر ==========
export const i18nHelpers = {
  getCurrentLang: () => currentLang.value,
  isRTL: () => currentLang.value === 'ar',
  changeLanguage: (lang) => {
    if (lang === 'ar' || lang === 'en') {
      currentLang.value = lang
      localStorage.setItem('lang', lang)
      applyLanguageDirection(lang)
      window.location.reload()
    }
  }
}