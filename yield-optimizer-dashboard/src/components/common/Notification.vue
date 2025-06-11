<template>
  <transition name="notification">
    <div v-if="show" :class="['notification', type]" role="alert">
      <div class="notification-content">
        <i :class="iconClass"></i>
        <span>{{ message }}</span>
      </div>
      <button v-if="dismissible" class="notification-close" @click="$emit('close')">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    message: {
      type: String,
      required: true
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    iconClass() {
      const icons = {
        success: 'bi bi-check-circle-fill',
        error: 'bi bi-exclamation-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill'
      };
      return icons[this.type];
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification i {
  font-size: 1.25rem;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.notification.success {
  background-color: var(--success-color);
  color: white;
}

.notification.error {
  background-color: var(--danger-color);
  color: white;
}

.notification.warning {
  background-color: var(--warning-color);
  color: #1e293b;
}

.notification.info {
  background-color: var(--primary-color);
  color: white;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}
</style> 