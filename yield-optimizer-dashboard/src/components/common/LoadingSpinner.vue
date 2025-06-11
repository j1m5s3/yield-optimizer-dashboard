<template>
  <div :class="['loading-spinner', size]" role="status">
    <div class="spinner"></div>
    <span v-if="text" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.loading-spinner.small .spinner {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.loading-spinner.medium .spinner {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.loading-spinner.large .spinner {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 