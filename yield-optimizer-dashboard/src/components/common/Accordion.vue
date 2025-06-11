<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="accordion-item"
    >
      <button
        :class="[
          'accordion-header',
          { active: modelValue === item.key }
        ]"
        @click="toggleItem(item.key)"
      >
        <div class="accordion-title">
          <i v-if="item.icon" :class="['accordion-icon', item.icon]"></i>
          {{ item.label }}
        </div>
        <i
          :class="[
            'accordion-arrow',
            'bi',
            modelValue === item.key ? 'bi-chevron-up' : 'bi-chevron-down'
          ]"
        ></i>
      </button>
      <transition
        name="accordion"
        @enter="startTransition"
        @after-enter="endTransition"
        @before-leave="startTransition"
        @after-leave="endTransition"
      >
        <div
          v-show="modelValue === item.key"
          class="accordion-content"
        >
          <div class="accordion-body">
            <slot :name="item.key" :item="item">
              {{ item.content }}
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    items: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => 
          typeof item === 'object' &&
          'key' in item &&
          'label' in item
        )
      }
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleItem(key) {
      if (this.multiple) {
        // Handle multiple selection
        const newValue = this.modelValue.includes(key)
          ? this.modelValue.filter(k => k !== key)
          : [...this.modelValue, key]
        this.$emit('update:modelValue', newValue)
      } else {
        // Handle single selection
        this.$emit('update:modelValue', this.modelValue === key ? null : key)
      }
    },
    startTransition(el) {
      el.style.height = el.scrollHeight + 'px'
    },
    endTransition(el) {
      el.style.height = ''
    }
  }
}
</script>

<style scoped>
.accordion {
  width: 100%;
}

.accordion-item {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.accordion-item + .accordion-item {
  margin-top: 0.5rem;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--card-background);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.accordion-header:hover {
  background-color: var(--hover-background);
}

.accordion-header.active {
  background-color: var(--selected-background);
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.accordion-icon {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.accordion-arrow {
  font-size: 1.25rem;
  color: var(--text-secondary);
  transition: transform 0.2s;
}

.accordion-content {
  overflow: hidden;
  background-color: var(--card-background);
}

.accordion-body {
  padding: 1rem;
  color: var(--text-secondary);
}

/* Transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
}
</style> 