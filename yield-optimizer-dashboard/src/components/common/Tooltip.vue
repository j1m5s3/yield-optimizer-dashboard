<template>
  <div class="tooltip-container" @mouseenter="show = true" @mouseleave="show = false">
    <slot></slot>
    <transition name="tooltip">
      <div v-if="show" :class="['tooltip', position]" role="tooltip">
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    text: {
      type: String,
      required: true
    },
    position: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  z-index: 1000;
  padding: 0.5rem 0.75rem;
  background-color: var(--card-background);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: var(--shadow);
}

.tooltip::before {
  content: '';
  position: absolute;
  border: 6px solid transparent;
}

.tooltip.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
}

.tooltip.top::before {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: var(--border-color);
}

.tooltip.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
}

.tooltip.bottom::before {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: var(--border-color);
}

.tooltip.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 0.5rem;
}

.tooltip.left::before {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: var(--border-color);
}

.tooltip.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 0.5rem;
}

.tooltip.right::before {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: var(--border-color);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style> 