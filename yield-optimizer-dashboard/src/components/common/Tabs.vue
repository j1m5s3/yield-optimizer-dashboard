<template>
  <div class="tabs">
    <div class="tabs-header" :class="[variant, { 'full-width': fullWidth }]">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'tab-button',
          { active: modelValue === tab.key }
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        <i v-if="tab.icon" :class="['tab-icon', tab.icon]"></i>
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    tabs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(tab => 
          typeof tab === 'object' &&
          'key' in tab &&
          'label' in tab
        )
      }
    },
    variant: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'enclosed', 'pill'].includes(value)
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.tabs-header.full-width {
  width: 100%;
}

.tabs-header.full-width .tab-button {
  flex: 1;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--primary-color);
}

.tab-icon {
  font-size: 1rem;
}

/* Line variant */
.tabs-header.line .tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
}

/* Enclosed variant */
.tabs-header.enclosed {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.25rem;
  background-color: var(--card-background);
}

.tabs-header.enclosed .tab-button {
  border-radius: 0.375rem;
}

.tabs-header.enclosed .tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

/* Pill variant */
.tabs-header.pill {
  border: none;
  gap: 0.25rem;
}

.tabs-header.pill .tab-button {
  border-radius: 9999px;
}

.tabs-header.pill .tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

.tabs-content {
  padding: 0.5rem 0;
}
</style> 