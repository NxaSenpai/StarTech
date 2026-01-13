<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <AdminHeader :userName="adminName" :notificationCount="notifications" />
      
      <AdminSidebar @settings-click="handleSettingsClick" />

      <main class="content-area">
        <div class="top-row">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Manage Product</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">Categories</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Product Categories</h1>
            <p class="page-subtitle">Manage and organize your product categories</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" @click="openAddModal">
              <img src="/addIcon.png" class="btn-icon">
              Add Category
            </button>
          </div>
        </div>

        <section class="category-content">
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon blue"><img class="manage-icon" src="/categoryIcon.png" alt=""></div>
              <div class="stat-info">
                <p class="stat-label">Total Categories</p>
                <h3 class="stat-value">{{ categories.length }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange"><img class="manage-icon" src="/productIcon.png" alt=""></div>
              <div class="stat-info">
                <p class="stat-label">Total Products</p>
                <h3 class="stat-value">{{ totalProductsCount }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green"><img class="manage-icon" src="/verifiedIcon.png" alt=""></div>
              <div class="stat-info">
                <p class="stat-label">Active Categories</p>
                <h3 class="stat-value">{{ activeCategoriesCount }}</h3>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon red"><img class="manage-icon" src="/alertIcon.png" alt=""></div>
              <div class="stat-info">
                <p class="stat-label">Inactive Categories</p>
                <h3 class="stat-value">{{ inactiveCategoriesCount }}</h3>
              </div>
            </div>
          </div>

          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search categories..." 
                v-model="searchQuery"
                class="search-input"
              >
            </div>
            <div class="filter-actions">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button 
                v-if="selectedCategoryIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteCategories"
              >
                <img src="/deleteIcon.png" class="btn-icon">
                Delete Selected ({{ selectedCategoryIds.length }})
              </button>
            </div>
          </div>
        
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input type="checkbox" v-model="selectAll" class="custom-checkbox">
                  </th>
                  <th>Category Name</th>
                  <th>Total Products</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredCategories.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-content">
                      <p>No categories found</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="category in filteredCategories" :key="category.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="category.id" 
                      v-model="selectedCategoryIds"
                      class="custom-checkbox"
                    >
                  </td>
                  <td class="name-cell">
                    <div class="category-name">
                      <span class="name-text">{{ category.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="product-count">{{ category.productCount }} items</span>
                  </td>
                  <td>
                    <span :class="['status-badge', category.status.toLowerCase()]">
                      <span class="status-dot"></span>
                      {{ category.status }}
                    </span>
                  </td>
                  <td class="date-cell">{{ category.createdDate }}</td>
                  <td class="action-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn edit-btn" 
                        @click="openEditModal(category)"
                        title="Edit"
                      >
                        <img src="/editIcon.png" class="btn-icon-black" alt="">
                      </button>

                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteCategory(category.id)"
                        title="Delete"
                      >
                        <img src="/deleteIcon.png" class="btn-icon-black" alt="">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="toast.show && toast.type === 'success'" class="toast success-toast">
          <div class="toast-content">
            <span>{{ toast.message }}</span>
          </div>
        </div>

        <div v-if="toast.show && toast.type === 'error'" class="toast error-toast">
          <div class="toast-content">
            <span>{{ toast.message }}</span>
          </div>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <div class="modal-header">
              <h3>{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h3>
              <button class="close-btn" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Category Name <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="formData.name" 
                  placeholder="Enter category name"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label>Total Products</label>
                <input 
                  type="number" 
                  v-model="formData.productCount" 
                  placeholder="0"
                  class="form-input"
                  min="0"
                >
              </div>
              <div class="form-group">
                <label>Status <span class="required">*</span></label>
                <select v-model="formData.status" class="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="formData.description" 
                  placeholder="Enter category description (optional)"
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button class="btn btn-primary" @click="saveCategory">
                {{ isEditMode ? 'Update' : 'Create' }} Category
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: 'ManageCategory',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const showModal = ref(false);
    const isEditMode = ref(false);
    const currentEditId = ref(null);
    const categories = ref([]);
    const selectedCategoryIds = ref([]);
    const isLoading = ref(false);

    const toast = ref({
      show: false,
      type: 'success',
      message: ''
    });

    const formData = ref({
      name: '',
      productCount: 0,
      status: 'Active',
      description: ''
    });

    const showToast = (type, message, duration = 3000) => {
      toast.value = {
        show: true,
        type,
        message
      };
      setTimeout(() => {
        toast.value.show = false;
      }, duration);
    };

    const selectAll = computed({
      get: () => selectedCategoryIds.value.length === filteredCategories.value.length && filteredCategories.value.length > 0,
      set: (value) => {
        selectedCategoryIds.value = value ? filteredCategories.value.map(c => c.id) : [];
      }
    });

    const activeCategoriesCount = computed(() => 
      categories.value.filter(c => c.status === 'Active').length
    );

    const inactiveCategoriesCount = computed(() => 
      categories.value.filter(c => c.status === 'Inactive').length
    );

    const totalProductsCount = computed(() => 
      categories.value.reduce((sum, c) => sum + c.productCount, 0)
    );

    const filteredCategories = computed(() => {
      let filtered = categories.value;

      if (searchQuery.value) {
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(c => 
          c.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }

      return filtered;
    });

    async function fetchCategories() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/categories`);
        console.log('Raw API response:', response.data);
        
        categories.value = response.data.map(cat => {
          console.log('Processing category:', cat);
          return {
            id: cat._id,
            name: cat.name,
            productCount: cat.productCount || 0,
            status: cat.status,
            createdDate: cat.createdDate || 'N/A',
            description: cat.description || ''
          };
        });
        
        console.log('Categories loaded:', categories.value.length);
        console.log('First category:', categories.value[0]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        showToast('error', 'Failed to load categories. Please check your connection.');
      } finally {
        isLoading.value = false;
      }
    }

    function openAddModal() {
      isEditMode.value = false;
      formData.value = {
        name: '',
        productCount: 0,
        status: 'Active',
        description: ''
      };
      showModal.value = true;
    }

    function openEditModal(category) {
      isEditMode.value = true;
      currentEditId.value = category.id;
      formData.value = {
        name: category.name,
        productCount: category.productCount,
        status: category.status,
        description: category.description || ''
      };
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
      isEditMode.value = false;
      currentEditId.value = null;
    }

    async function saveCategory() {
      if (!formData.value.name.trim()) {
        showToast('error', 'Category name is required!');
        return;
      }

      try {
        if (isEditMode.value) {
          await axios.patch(`${API_URL}/categories/${currentEditId.value}`, {
            name: formData.value.name,
            productCount: formData.value.productCount,
            status: formData.value.status,
            description: formData.value.description
          });
          showToast('success', 'Category updated successfully!');
        } else {
          await axios.post(`${API_URL}/categories`, {
            name: formData.value.name,
            productCount: formData.value.productCount || 0,
            status: formData.value.status,
            description: formData.value.description || ''
          });
          showToast('success', 'Category added successfully!');
        }
        
        await fetchCategories();
        closeModal();
      } catch (error) {
        console.error('Save failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to save category. Please try again.';
        showToast('error', errorMsg);
      }
    }

    async function deleteCategory(id) {
      if (confirm('Are you sure you want to delete this category?')) {
        try {
          await axios.delete(`${API_URL}/categories/${id}`);
          showToast('success', 'Category deleted successfully!');
          await fetchCategories();
        } catch (error) {
          console.error('Delete failed:', error);
          const errorMsg = error.response?.status === 404 
            ? 'Category not found' 
            : 'Failed to delete category';
          showToast('error', errorMsg);
        }
      }
    }

    async function bulkDeleteCategories() {
      const count = selectedCategoryIds.value.length;
      if (count === 0) {
        showToast('error', 'Please select categories to delete');
        return;
      }
      
      if (confirm(`Are you sure you want to delete ${count} selected categories?`)) {
        try {
          await axios.post(`${API_URL}/categories/bulk-delete`, {
            ids: selectedCategoryIds.value
          });
          showToast('success', `${count} categories deleted successfully!`);
          selectedCategoryIds.value = [];
          await fetchCategories();
        } catch (error) {
          console.error('Bulk delete failed:', error);
          showToast('error', 'Failed to delete categories');
        }
      }
    }

    function viewCategoryDetails(category) {
      alert(`Viewing details for: ${category.name}\nProducts: ${category.productCount}\nStatus: ${category.status}\nDescription: ${category.description || 'N/A'}`);
    }

    function exportCategories() {
      try {
        const dataStr = JSON.stringify(categories.value, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `categories_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('success', 'Categories exported successfully!');
      } catch (error) {
        console.error('Export failed:', error);
        showToast('error', 'Failed to export categories');
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      console.log('ManageCategory mounted, fetching data...');
      fetchCategories();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      statusFilter,
      showModal,
      isEditMode,
      categories,
      selectedCategoryIds,
      formData,
      toast,
      selectAll,
      activeCategoriesCount,
      inactiveCategoriesCount,
      totalProductsCount,
      filteredCategories,
      isLoading,
      openAddModal,
      openEditModal,
      closeModal,
      saveCategory,
      deleteCategory,
      bulkDeleteCategories,
      viewCategoryDetails,
      exportCategories,
      handleSettingsClick
    };
  }
};
</script>

<style scoped>
.page-wrapper {
  background: #f8f9fa;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.admin-layout {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
}

.content-area {
  color: black;
  grid-area: content;
  padding: 30px 40px;
  overflow: hidden;
  height: calc(100vh - 70px);
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  flex-shrink: 0;
}

.breadcrumb-item {
  color: #6c757d;
}

.breadcrumb-item.active {
  color: #0b6cf0;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #dee2e6;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.header-left .page-title {
  color: #111;
  font-weight: 700;
  font-size: 28px;
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #0b6cf0;
  color: white;
}

.btn-primary:hover {
  background: #0958c9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 108, 240, 0.3);
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-icon {
  width: 15px;
  height: 15px;
  filter: invert(1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  flex-shrink: 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(11, 108, 240, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.blue { background: #e6f0ff; }
.stat-icon.green { background: #d4edda; }
.stat-icon.orange { background: #fff3e0; }
.stat-icon.red { background: #ffebee; }

.stat-label {
  color: #6c757d;
  font-size: 13px;
  margin: 0 0 4px 0;
}

.stat-value {
  color: #212529;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.manage-icon {
  width: 20px;
  height: 20px;
}

.category-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-shrink: 0;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  filter: opacity(0.6);
  width: 15px;
  height: 15px;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.table-wrapper {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8f9fa;
}

td {
  padding: 16px;
  border-top: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

tbody {
  background: white;
}

.table-row:hover {
  background: #f8f9fa;
}

.checkbox-col {
  width: 50px;
}

.action-col {
  width: 150px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0b6cf0;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #212529;
}

.product-count {
  color: #6c757d;
  font-size: 13px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.date-cell {
  color: #6c757d;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-black {
  width: 15px;
  height: 15px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
  border-color: #0b6cf0;
  background: #e6f0ff;
}

.view-btn:hover {
  border-color: #6c757d;
  background: #f8f9fa;
}

.delete-btn:hover {
  border-color: #dc3545;
  background: #ffebee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-content p {
  color: #6c757d;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #212529;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f8f9fa;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
}

.toast {
  position: fixed;
  top: 100px;
  right: 30px;
  z-index: 3000;
  animation: slideIn 0.4s ease-out;
  min-width: 300px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-content {
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: white;
}

.success-toast .toast-content {
  background: #28a745;
}

.error-toast .toast-content {
  background: #dc3545;
}

@media (max-width: 768px) {
  .toast {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}

@media (max-width: 1200px) {
  .admin-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 968px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 20px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 12px 8px;
  }
}
</style>