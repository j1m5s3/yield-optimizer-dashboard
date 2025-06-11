<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-container">
      <i v-if="prefixIcon" :class="['input-icon', 'prefix', prefixIcon]"></i>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'input',
          { 'has-prefix': prefixIcon, 'has-suffix': suffixIcon }
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <i v-if="suffixIcon" :class="['input-icon', 'suffix', suffixIcon]"></i>
    </div>
    <span v-if="error" class="input-error">{{ error }}</span>
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    },
    readonly: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: `input-${Math.random().toString(36).substr(2, 9)}`
    }
  }
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-light);
}

.input:disabled {
  background-color: var(--disabled-background);
  cursor: not-allowed;
}

.input:read-only {
  background-color: var(--readonly-background);
}

.input.has-prefix {
  padding-left: 2.5rem;
}

.input.has-suffix {
  padding-right: 2.5rem;
}

.input-icon {
  position: absolute;
  color: var(--text-secondary);
  font-size: 1rem;
}

.input-icon.prefix {
  left: 0.75rem;
}

.input-icon.suffix {
  right: 0.75rem;
}

.input-error {
  font-size: 0.75rem;
  color: var(--danger-color);
}

.input-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style> 