<template>
  <div :class="['card', { 'hoverable': hoverable }]">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    hoverable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card.hoverable {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-header-background);
}

.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  padding: 1rem;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--card-footer-background);
}
</style> 