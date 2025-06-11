<template>
  <button
    :class="[
      'btn',
      variant,
      size,
      { 'loading': loading, 'disabled': disabled }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="small" />
    <i v-else-if="icon" :class="icon"></i>
    <span v-if="$slots.default" class="btn-text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'Button',
  components: {
    LoadingSpinner
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn.loading {
  cursor: wait;
}

.btn-text {
  line-height: 1;
}

/* Sizes */
.btn.small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn.medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn.large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Variants */
.btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
}

.btn.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background-color: var(--secondary-color-dark);
}

.btn.success {
  background-color: var(--success-color);
  color: white;
}

.btn.success:hover:not(:disabled) {
  background-color: var(--success-color-dark);
}

.btn.danger {
  background-color: var(--danger-color);
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background-color: var(--danger-color-dark);
}

.btn.warning {
  background-color: var(--warning-color);
  color: var(--text-primary);
}

.btn.warning:hover:not(:disabled) {
  background-color: var(--warning-color-dark);
}

.btn.info {
  background-color: var(--info-color);
  color: white;
}

.btn.info:hover:not(:disabled) {
  background-color: var(--info-color-dark);
}

/* Outline variants */
.btn.outline {
  background-color: transparent;
}

.btn.outline.primary {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn.outline.primary:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
}

.btn.outline.secondary {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.btn.outline.secondary:hover:not(:disabled) {
  background-color: var(--secondary-color);
  color: white;
}

/* Icon only */
.btn.icon-only {
  padding: 0.5rem;
  border-radius: 50%;
}

.btn.icon-only.small {
  padding: 0.375rem;
}

.btn.icon-only.large {
  padding: 0.75rem;
}
</style> 