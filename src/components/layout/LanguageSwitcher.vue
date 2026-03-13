<template>
  <select 
    class="lang-select" 
    :value="currentLang"
    @change="switchLanguage"
    :aria-label="t('select_language')"
  >
    <option value="en">🇬🇧 EN</option>
    <option value="ar">🇸🇦 AR</option>
  </select>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const { currentLang, changeLanguage, t } = useI18n()

const switchLanguage = (event) => {
  const newLang = event.target.value
  console.log('🔄 Changing language to:', newLang)
  changeLanguage(newLang)
}
</script>

<style scoped>
.lang-select {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px 12px;
  height: 40px;
  color: var(--text-dark);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 80px;
  outline: none;
}

.lang-select:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.lang-select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

/* دعم اللغة العربية */
[dir="rtl"] .lang-select {
  background-position: left 10px center;
  padding: 8px 12px;
}

/* الوضع الليلي */
[data-theme="dark"] .lang-select {
  background: var(--input-bg);
  color: var(--text-dark);
  border-color: var(--border-color);
}

[data-theme="dark"] .lang-select:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

/* Responsive */
@media (max-width: 576px) {
  .lang-select {
    padding: 6px 8px;
    font-size: 12px;
    min-width: 60px;
  }
}
</style>