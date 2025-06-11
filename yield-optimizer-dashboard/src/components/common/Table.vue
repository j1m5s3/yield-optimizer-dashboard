<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th v-if="selectable" class="select-column">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="{ sortable: column.sortable }"
              @click="column.sortable && handleSort(column.key)"
            >
              {{ column.label }}
              <i
                v-if="column.sortable"
                :class="[
                  'sort-icon',
                  {
                    'bi-arrow-up': sortKey === column.key && sortOrder === 'asc',
                    'bi-arrow-down': sortKey === column.key && sortOrder === 'desc'
                  }
                ]"
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in paginatedData"
            :key="index"
            :class="{ selected: selectedRows.includes(row) }"
          >
            <td v-if="selectable" class="select-column">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row)"
                @change="toggleSelect(row)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.class"
            >
              <slot
                :name="column.key"
                :row="row"
                :value="row[column.key]"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="selectable ? columns.length + 1 : columns.length" class="empty-message">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination" class="table-pagination">
      <div class="pagination-info">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalItems }} entries
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <div class="pagination-pages">
          <button
            v-for="page in displayedPages"
            :key="page"
            class="pagination-btn"
            :class="{ active: page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(column => 
          typeof column === 'object' &&
          'key' in column &&
          'label' in column
        )
      }
    },
    selectable: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: false
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    emptyMessage: {
      type: String,
      default: 'No data available'
    }
  },
  data() {
    return {
      selectedRows: [],
      currentPage: 1,
      sortKey: '',
      sortOrder: 'asc'
    }
  },
  computed: {
    isAllSelected() {
      return this.paginatedData.length > 0 && this.selectedRows.length === this.paginatedData.length
    },
    sortedData() {
      if (!this.sortKey) return this.data

      return [...this.data].sort((a, b) => {
        const aValue = a[this.sortKey]
        const bValue = b[this.sortKey]

        if (typeof aValue === 'string') {
          return this.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return this.sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue
      })
    },
    totalItems() {
      return this.data.length
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
    },
    displayedPages() {
      const pages = []
      const maxPages = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2))
      let end = Math.min(this.totalPages, start + maxPages - 1)

      if (end - start + 1 < maxPages) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    },
    paginatedData() {
      if (!this.pagination) return this.sortedData

      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.sortedData.slice(start, end)
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedRows = []
      } else {
        this.selectedRows = [...this.paginatedData]
      }
      this.$emit('selection-change', this.selectedRows)
    },
    toggleSelect(row) {
      const index = this.selectedRows.indexOf(row)
      if (index === -1) {
        this.selectedRows.push(row)
      } else {
        this.selectedRows.splice(index, 1)
      }
      this.$emit('selection-change', this.selectedRows)
    },
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
    }
  },
  watch: {
    data() {
      this.currentPage = 1
      this.selectedRows = []
    }
  }
}
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-wrapper {
  min-width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.table th {
  background-color: var(--card-header-background);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background-color: var(--hover-background);
}

.sort-icon {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

.table tbody tr:hover {
  background-color: var(--hover-background);
}

.table tbody tr.selected {
  background-color: var(--selected-background);
}

.select-column {
  width: 3rem;
  text-align: center;
}

.empty-message {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-primary);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--hover-background);
}

.pagination-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 