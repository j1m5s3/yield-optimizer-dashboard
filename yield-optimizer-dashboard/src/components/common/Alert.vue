<template>
  <div
    :class="[
      'alert',
      variant,
      { 'dismissible': dismissible }
    ]"
    role="alert"
  >
    <div class="alert-content">
      <i :class="['alert-icon', iconClass]"></i>
      <div class="alert-message">
        <slot></slot>
      </div>
    </div>
    <button
      v-if="dismissible"
      class="alert-close"
      @click="$emit('close')"
      aria-label="Close"
    >
      <i class="bi bi-x"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    variant: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'danger'].includes(value)
    },
    dismissible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClass() {
      const icons = {
        info: 'bi bi-info-circle-fill',
        success: 'bi bi-check-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        danger: 'bi bi-exclamation-circle-fill'
      }
      return icons[this.variant]
    }
  }
}
</script>

<style scoped>
.alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.alert-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.alert-message {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert-close {
  background: none;
  border: none;
  padding: 0.25rem;
  margin-left: 0.75rem;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

/* Variants */
.alert.info {
  background-color: var(--info-color-light);
  color: var(--info-color-dark);
  border: 1px solid var(--info-color);
}

.alert.success {
  background-color: var(--success-color-light);
  color: var(--success-color-dark);
  border: 1px solid var(--success-color);
}

.alert.warning {
  background-color: var(--warning-color-light);
  color: var(--warning-color-dark);
  border: 1px solid var(--warning-color);
}

.alert.danger {
  background-color: var(--danger-color-light);
  color: var(--danger-color-dark);
  border: 1px solid var(--danger-color);
}
</style> 