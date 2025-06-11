<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div
          :class="['modal', size]"
          @click.stop
        >
          <div class="modal-header">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <button v-if="closeable" class="modal-close" @click="$emit('update:modelValue', false)">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
    },
    closeable: {
      type: Boolean,
      default: true
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    handleOverlayClick() {
      if (this.closeOnOverlayClick) {
        this.$emit('update:modelValue', false)
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background-color: var(--card-background);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal.small {
  max-width: 24rem;
}

.modal.medium {
  max-width: 32rem;
}

.modal.large {
  max-width: 48rem;
}

.modal.full {
  max-width: 100%;
  height: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.5rem;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(-1rem);
}
</style> 