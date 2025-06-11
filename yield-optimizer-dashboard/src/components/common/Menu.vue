<template>
  <div class="menu">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      :class="[
        'menu-item',
        {
          'active': modelValue === item.key,
          'disabled': item.disabled,
          'divider': item.divider
        }
      ]"
      @click="!item.disabled && !item.divider && handleClick(item)"
    >
      <template v-if="!item.divider">
        <i v-if="item.icon" :class="['menu-icon', item.icon]"></i>
        <span class="menu-label">{{ item.label }}</span>
        <i
          v-if="item.children"
          :class="[
            'menu-arrow',
            'bi',
            isExpanded(item.key) ? 'bi-chevron-up' : 'bi-chevron-down'
          ]"
        ></i>
      </template>
      <div
        v-if="item.children && isExpanded(item.key)"
        class="menu-submenu"
      >
        <div
          v-for="child in item.children"
          :key="child.key"
          :class="[
            'menu-item',
            {
              'active': modelValue === child.key,
              'disabled': child.disabled
            }
          ]"
          @click="!child.disabled && handleClick(child)"
        >
          <i v-if="child.icon" :class="['menu-icon', child.icon]"></i>
          <span class="menu-label">{{ child.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
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
    }
  },
  data() {
    return {
      expandedItems: new Set()
    }
  },
  methods: {
    handleClick(item) {
      if (item.children) {
        this.toggleExpand(item.key)
      } else {
        this.$emit('update:modelValue', item.key)
        this.$emit('select', item)
      }
    },
    toggleExpand(key) {
      if (this.expandedItems.has(key)) {
        this.expandedItems.delete(key)
      } else {
        this.expandedItems.add(key)
      }
    },
    isExpanded(key) {
      return this.expandedItems.has(key)
    }
  }
}
</script>

<style scoped>
.menu {
  min-width: 12rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.menu-item:hover:not(.disabled):not(.divider) {
  background-color: var(--hover-background);
}

.menu-item.active {
  background-color: var(--selected-background);
  color: var(--primary-color);
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-item.divider {
  height: 1px;
  padding: 0;
  margin: 0.5rem 0;
  background-color: var(--border-color);
  cursor: default;
}

.menu-icon {
  font-size: 1rem;
  color: var(--text-secondary);
}

.menu-label {
  flex: 1;
  font-size: 0.875rem;
}

.menu-arrow {
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: transform 0.2s;
}

.menu-submenu {
  background-color: var(--card-background);
  border-top: 1px solid var(--border-color);
}

.menu-submenu .menu-item {
  padding-left: 2.5rem;
}
</style> 