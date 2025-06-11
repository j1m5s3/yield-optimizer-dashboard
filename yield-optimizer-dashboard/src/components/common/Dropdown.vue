<template>
  <div class="dropdown" v-click-outside="close">
    <div
      class="dropdown-trigger"
      @click="toggle"
    >
      <slot name="trigger">
        <button
          :class="[
            'dropdown-button',
            variant,
            size,
            { 'icon-only': iconOnly }
          ]"
        >
          <i v-if="icon" :class="['dropdown-icon', icon]"></i>
          <span v-if="!iconOnly" class="dropdown-label">{{ label }}</span>
          <i class="dropdown-arrow bi bi-chevron-down"></i>
        </button>
      </slot>
    </div>
    <transition name="dropdown">
      <div
        v-show="isOpen"
        :class="[
          'dropdown-menu',
          placement,
          { 'full-width': fullWidth }
        ]"
      >
        <div class="dropdown-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
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
    placement: {
      type: String,
      default: 'bottom-start',
      validator: (value) => ['top-start', 'top-end', 'bottom-start', 'bottom-end'].includes(value)
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.modelValue
    }
  },
  watch: {
    modelValue(value) {
      this.isOpen = value
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
      this.$emit('update:modelValue', this.isOpen)
    },
    close() {
      if (this.isOpen) {
        this.isOpen = false
        this.$emit('update:modelValue', false)
      }
    }
  },
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: inline-block;
}

.dropdown-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-button.icon-only {
  padding: 0.5rem;
  border-radius: 50%;
}

.dropdown-icon {
  font-size: 1rem;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.2s;
}

.dropdown-menu {
  position: absolute;
  z-index: 1000;
  min-width: 10rem;
  margin-top: 0.5rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
}

.dropdown-menu.full-width {
  width: 100%;
}

.dropdown-menu.top-start {
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.dropdown-menu.top-end {
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.dropdown-menu.bottom-start {
  top: 100%;
  left: 0;
}

.dropdown-menu.bottom-end {
  top: 100%;
  right: 0;
}

.dropdown-content {
  padding: 0.5rem;
}

/* Variants */
.dropdown-button.primary {
  background-color: var(--primary-color);
  color: white;
}

.dropdown-button.primary:hover {
  background-color: var(--primary-color-dark);
}

.dropdown-button.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.dropdown-button.secondary:hover {
  background-color: var(--secondary-color-dark);
}

.dropdown-button.success {
  background-color: var(--success-color);
  color: white;
}

.dropdown-button.success:hover {
  background-color: var(--success-color-dark);
}

.dropdown-button.danger {
  background-color: var(--danger-color);
  color: white;
}

.dropdown-button.danger:hover {
  background-color: var(--danger-color-dark);
}

.dropdown-button.warning {
  background-color: var(--warning-color);
  color: var(--text-primary);
}

.dropdown-button.warning:hover {
  background-color: var(--warning-color-dark);
}

.dropdown-button.info {
  background-color: var(--info-color);
  color: white;
}

.dropdown-button.info:hover {
  background-color: var(--info-color-dark);
}

/* Sizes */
.dropdown-button.small {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.dropdown-button.small.icon-only {
  padding: 0.375rem;
}

.dropdown-button.large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.dropdown-button.large.icon-only {
  padding: 0.75rem;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style> 