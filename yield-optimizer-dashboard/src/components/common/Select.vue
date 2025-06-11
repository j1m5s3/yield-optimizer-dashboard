<template>
  <div class="select-wrapper">
    <label v-if="label" :for="id" class="select-label">{{ label }}</label>
    <div class="select-container">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :class="['select', { 'has-error': error }]"
        @change="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <i class="select-icon bi bi-chevron-down"></i>
    </div>
    <span v-if="error" class="select-error">{{ error }}</span>
    <span v-else-if="hint" class="select-hint">{{ hint }}</span>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(option => 
          typeof option === 'object' &&
          'value' in option &&
          'label' in option
        )
      }
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: `select-${Math.random().toString(36).substr(2, 9)}`
    }
  }
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.select-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.select-container {
  position: relative;
}

.select {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-light);
}

.select:disabled {
  background-color: var(--disabled-background);
  cursor: not-allowed;
}

.select.has-error {
  border-color: var(--danger-color);
}

.select.has-error:focus {
  box-shadow: 0 0 0 2px var(--danger-color-light);
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
  pointer-events: none;
}

.select-error {
  font-size: 0.75rem;
  color: var(--danger-color);
}

.select-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style> 