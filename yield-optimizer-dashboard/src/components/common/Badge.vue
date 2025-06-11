<template>
  <span
    :class="[
      'badge',
      variant,
      size,
      { 'outline': outline }
    ]"
  >
    <i v-if="icon" :class="['badge-icon', icon]"></i>
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'Badge',
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
    outline: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.badge-icon {
  font-size: 0.875em;
}

/* Sizes */
.badge.small {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
}

.badge.medium {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.badge.large {
  font-size: 1rem;
  padding: 0.375rem 0.75rem;
}

/* Variants */
.badge.primary {
  background-color: var(--primary-color);
  color: white;
}

.badge.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.badge.success {
  background-color: var(--success-color);
  color: white;
}

.badge.danger {
  background-color: var(--danger-color);
  color: white;
}

.badge.warning {
  background-color: var(--warning-color);
  color: var(--text-primary);
}

.badge.info {
  background-color: var(--info-color);
  color: white;
}

/* Outline variants */
.badge.outline {
  background-color: transparent;
}

.badge.outline.primary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.badge.outline.secondary {
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
}

.badge.outline.success {
  border: 1px solid var(--success-color);
  color: var(--success-color);
}

.badge.outline.danger {
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
}

.badge.outline.warning {
  border: 1px solid var(--warning-color);
  color: var(--warning-color);
}

.badge.outline.info {
  border: 1px solid var(--info-color);
  color: var(--info-color);
}
</style> 