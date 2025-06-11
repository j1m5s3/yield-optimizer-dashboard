<template>
  <div class="skeleton" :class="[type, { 'animate': animate }]">
    <div v-if="type === 'table'" class="skeleton-table">
      <div v-for="i in rows" :key="i" class="skeleton-row">
        <div v-for="j in columns" :key="j" class="skeleton-cell"></div>
      </div>
    </div>
    <div v-else-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-header"></div>
      <div class="skeleton-body">
        <div v-for="i in lines" :key="i" class="skeleton-line"></div>
      </div>
    </div>
    <div v-else class="skeleton-line"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'table', 'card'].includes(value)
    },
    rows: {
      type: Number,
      default: 5
    },
    columns: {
      type: Number,
      default: 4
    },
    lines: {
      type: Number,
      default: 3
    },
    animate: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.skeleton {
  background: var(--card-background);
  border-radius: 4px;
  overflow: hidden;
}

.skeleton.animate {
  position: relative;
  overflow: hidden;
}

.skeleton.animate::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-line {
  height: 1rem;
  margin: 0.5rem 0;
  background: var(--border-color);
  border-radius: 4px;
}

.skeleton-table {
  width: 100%;
}

.skeleton-row {
  display: flex;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.skeleton-cell {
  flex: 1;
  height: 1rem;
  margin: 0 0.5rem;
  background: var(--border-color);
  border-radius: 4px;
}

.skeleton-card {
  padding: 1rem;
}

.skeleton-header {
  height: 2rem;
  margin-bottom: 1rem;
  background: var(--border-color);
  border-radius: 4px;
}

.skeleton-body {
  padding: 0.5rem 0;
}
</style> 