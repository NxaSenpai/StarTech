<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <AdminHeader :userName="adminName" :notificationCount="notifications" />
      
      <AdminSidebar @settings-click="handleSettingsClick" />

      <main class="content-area">
        <div class="top-row">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Dashboard</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">Manage Promotions</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Manage Promotions</h1>
            <p class="page-subtitle">Create and manage product discounts</p>
          </div>
          <div class="header-actions">
            <button 
              v-if="selectedPromotionIds.length > 0" 
              @click="bulkDeletePromotions" 
              class="btn btn-danger"
            >
              <img class="btn-icon" src="/deleteIcon.png" alt="">
              Delete Selected ({{ selectedPromotionIds.length }})
            </button>
            <button @click="openAddModal" class="btn btn-primary">
              <img class="btn-icon" src="/addIcon.png" alt="">
              Add Promotion
            </button>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue">
              <img class="manage-icon" src="/discountIcon.png" alt="">
            </div>
            <div>
              <p class="stat-label">Total Promotions</p>
              <h2 class="stat-value">{{ totalPromotions }}</h2>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <img class="manage-icon" src="/verifiedIcon.png" alt="">
            </div>
            <div>
              <p class="stat-label">Active Promotions</p>
              <h2 class="stat-value">{{ activePromotions }}</h2>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <img class="manage-icon" src="/productIcon.png" alt="">
            </div>
            <div>
              <p class="stat-label">Products on Sale</p>
              <h2 class="stat-value">{{ promotedProducts }}</h2>
            </div>
          </div>
        </div>

        <div class="promotion-content">
          <div class="table-controls">
            <div class="search-box">
              <img class="search-icon" src="/searchIcon.png" alt="">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search promotions..." 
                class="search-input"
              />
            </div>
            
            <div class="filter-actions">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div class="table-wrapper">
            <table v-if="!isLoading && filteredPromotions.length > 0">
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input 
                      type="checkbox" 
                      v-model="selectAll"
                      class="custom-checkbox"
                    />
                  </th>
                  <th>Product</th>
                  <th>Original Price</th>
                  <th>Discount</th>
                  <th>Sale Price</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="promotion in filteredPromotions" 
                  :key="promotion._id"
                  class="table-row"
                >
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="promotion._id"
                      v-model="selectedPromotionIds"
                      class="custom-checkbox"
                    />
                  </td>
                  <td>
                    <div class="product-name">{{ promotion.productName }}</div>
                  </td>
                  <td class="price-cell">${{ promotion.originalPrice.toFixed(2) }}</td>
                  <td>
                    <span class="discount-badge">-{{ promotion.discountPercentage }}%</span>
                  </td>
                  <td class="sale-price-cell">${{ promotion.discountedPrice.toFixed(2) }}</td>
                  <td class="date-cell">{{ formatDate(promotion.startDate) }}</td>
                  <td class="date-cell">{{ formatDate(promotion.endDate) }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      :class="getStatusClass(promotion)"
                    >
                      <span class="status-dot"></span>
                      {{ getStatusLabel(promotion) }}
                    </span>
                  </td>
                  <td class="action-col">
                    <div class="action-buttons">
                      <button 
                        @click="openEditModal(promotion)" 
                        class="action-btn edit-btn"
                        title="Edit"
                      >
                        <img class="btn-icon-black" src="/editIcon.png" alt="">
                      </button>
                      <button 
                        @click="deletePromotion(promotion._id)" 
                        class="action-btn delete-btn"
                        title="Delete"
                      >
                        <img class="btn-icon-black" src="/deleteIcon.png" alt="">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else-if="isLoading" class="empty-state">
              <div class="spinner"></div>
              <p>Loading promotions...</p>
            </div>

            <div v-else class="empty-state">
              <div class="empty-content">
                <p>No promotions found</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <div class="modal-header">
              <h3>{{ isEditMode ? 'Edit Promotion' : 'Add New Promotion' }}</h3>
              <button class="close-btn" @click="closeModal">✕</button>
            </div>

            <div class="modal-body">
              <form class="promotion-form">
                <div class="form-group">
                  <label>Product <span class="required">*</span></label>
                  <select v-model="formData.productId" class="form-select" required>
                    <option value="">Select a product</option>
                    <option 
                      v-for="product in products" 
                      :key="product._id" 
                      :value="product._id"
                    >
                      {{ product.name }} - ${{ product.price.toFixed(2) }}
                    </option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Discount % <span class="required">*</span></label>
                    <input 
                      v-model.number="formData.discountPercentage" 
                      type="number"
                      min="1"
                      max="99"
                      class="form-input"
                      placeholder="e.g., 20"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label>Sale Price</label>
                    <input 
                      :value="calculatedPrice" 
                      type="text"
                      class="form-input"
                      readonly
                      disabled
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Start Date <span class="required">*</span></label>
                    <input 
                      v-model="formData.startDate" 
                      type="date"
                      class="form-input"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label>End Date <span class="required">*</span></label>
                    <input 
                      v-model="formData.endDate" 
                      type="date"
                      class="form-input"
                      :min="formData.startDate"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Status <span class="required">*</span></label>
                  <select v-model="formData.status" class="form-select" required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button @click="closeModal" class="btn btn-secondary">Cancel</button>
              <button @click="savePromotion" class="btn btn-primary">
                {{ isEditMode ? 'Update' : 'Create' }} Promotion
              </button>
            </div>
          </div>
        </div>

        <!-- Toast Notification -->
        <div v-if="toast.show" class="toast" :class="toast.type + '-toast'">
          <div class="toast-content">
            <span>{{ toast.message }}</span>
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
  name: 'ManagePromotion',
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
    const promotions = ref([]);
    const products = ref([]);
    const selectedPromotionIds = ref([]);
    const isLoading = ref(false);

    const toast = ref({
      show: false,
      type: 'success',
      message: ''
    });

    const formData = ref({
      productId: '',
      productName: '',
      originalPrice: 0,
      discountPercentage: 0,
      discountedPrice: 0,
      startDate: '',
      endDate: '',
      status: 'Active'
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
      get: () => selectedPromotionIds.value.length === filteredPromotions.value.length && filteredPromotions.value.length > 0,
      set: (value) => {
        if (value) {
          selectedPromotionIds.value = filteredPromotions.value.map(p => p._id);
        } else {
          selectedPromotionIds.value = [];
        }
      }
    });

    const totalPromotions = computed(() => promotions.value.length);
    
    const activePromotions = computed(() => 
      promotions.value.filter(p => {
        const now = new Date();
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        return p.status === 'Active' && now >= start && now <= end;
      }).length
    );

    const averageDiscount = computed(() => {
      if (promotions.value.length === 0) return 0;
      const sum = promotions.value.reduce((acc, p) => acc + p.discountPercentage, 0);
      return (sum / promotions.value.length).toFixed(1);
    });

    const promotedProducts = computed(() => 
      new Set(promotions.value.map(p => p.productId)).size
    );

    const calculatedPrice = computed(() => {
      const selectedProduct = products.value.find(p => p._id === formData.value.productId);
      if (!selectedProduct || !formData.value.discountPercentage) return '$0.00';
      
      const discount = selectedProduct.price * (formData.value.discountPercentage / 100);
      const salePrice = selectedProduct.price - discount;
      return `$${salePrice.toFixed(2)}`;
    });

    const filteredPromotions = computed(() => {
      let filtered = promotions.value;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(p =>
          p.productName.toLowerCase().includes(query)
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(p => {
          if (statusFilter.value === 'Expired') {
            return new Date(p.endDate) < new Date();
          }
          return p.status === statusFilter.value;
        });
      }

      return filtered;
    });

    async function fetchPromotions() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/promotions`);
        promotions.value = response.data;
        console.log('Promotions loaded:', promotions.value.length);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        showToast('error', 'Failed to load promotions');
      } finally {
        isLoading.value = false;
      }
    }

    async function fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/products`);
        products.value = response.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast('error', 'Failed to load products');
      }
    }

    function openAddModal() {
      isEditMode.value = false;
      currentEditId.value = null;
      formData.value = {
        productId: '',
        productName: '',
        originalPrice: 0,
        discountPercentage: 0,
        discountedPrice: 0,
        startDate: '',
        endDate: '',
        status: 'Active'
      };
      showModal.value = true;
    }

    function openEditModal(promotion) {
      isEditMode.value = true;
      currentEditId.value = promotion._id;
      formData.value = {
        productId: promotion.productId,
        productName: promotion.productName,
        originalPrice: promotion.originalPrice,
        discountPercentage: promotion.discountPercentage,
        discountedPrice: promotion.discountedPrice,
        startDate: promotion.startDate.split('T')[0],
        endDate: promotion.endDate.split('T')[0],
        status: promotion.status
      };
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
      isEditMode.value = false;
      currentEditId.value = null;
      formData.value = {
        productId: '',
        productName: '',
        originalPrice: 0,
        discountPercentage: 0,
        discountedPrice: 0,
        startDate: '',
        endDate: '',
        status: 'Active'
      };
    }

    async function savePromotion() {
      if (!formData.value.productId || !formData.value.discountPercentage || 
          !formData.value.startDate || !formData.value.endDate) {
        showToast('error', 'Please fill all required fields');
        return;
      }

      const selectedProduct = products.value.find(p => p._id === formData.value.productId);
      if (!selectedProduct) {
        showToast('error', 'Invalid product selected');
        return;
      }

      const promotionData = {
        productId: formData.value.productId,
        productName: selectedProduct.name,
        originalPrice: selectedProduct.price,
        discountPercentage: formData.value.discountPercentage,
        discountedPrice: 0, // Will be calculated by backend
        startDate: formData.value.startDate,
        endDate: formData.value.endDate,
        status: formData.value.status
      };

      try {
        if (isEditMode.value) {
          await axios.patch(`${API_URL}/promotions/${currentEditId.value}`, promotionData);
          showToast('success', 'Promotion updated successfully!');
        } else {
          await axios.post(`${API_URL}/promotions`, promotionData);
          showToast('success', 'Promotion created successfully!');
        }
        
        closeModal();
        fetchPromotions();
      } catch (error) {
        console.error('Failed to save promotion:', error);
        showToast('error', 'Failed to save promotion');
      }
    }

    async function deletePromotion(id) {
      if (!confirm('Are you sure you want to delete this promotion?')) return;

      try {
        await axios.delete(`${API_URL}/promotions/${id}`);
        showToast('success', 'Promotion deleted successfully!');
        fetchPromotions();
      } catch (error) {
        console.error('Failed to delete promotion:', error);
        showToast('error', 'Failed to delete promotion');
      }
    }

    async function bulkDeletePromotions() {
      if (!confirm(`Delete ${selectedPromotionIds.value.length} promotions?`)) return;

      try {
        await axios.post(`${API_URL}/promotions/bulk-delete`, {
          ids: selectedPromotionIds.value
        });
        showToast('success', `Deleted ${selectedPromotionIds.value.length} promotions`);
        selectedPromotionIds.value = [];
        fetchPromotions();
      } catch (error) {
        console.error('Failed to bulk delete:', error);
        showToast('error', 'Failed to delete promotions');
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    function getStatusClass(promotion) {
      const now = new Date();
      const end = new Date(promotion.endDate);
      
      if (end < now) return 'expired';
      if (promotion.status === 'Active') return 'active';
      return 'inactive';
    }

    function getStatusLabel(promotion) {
      const now = new Date();
      const end = new Date(promotion.endDate);
      
      if (end < now) return 'Expired';
      return promotion.status;
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      fetchPromotions();
      fetchProducts();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      statusFilter,
      showModal,
      isEditMode,
      promotions,
      products,
      selectedPromotionIds,
      isLoading,
      toast,
      formData,
      selectAll,
      totalPromotions,
      activePromotions,
      averageDiscount,
      promotedProducts,
      calculatedPrice,
      filteredPromotions,
      openAddModal,
      openEditModal,
      closeModal,
      savePromotion,
      deletePromotion,
      bulkDeletePromotions,
      formatDate,
      getStatusClass,
      getStatusLabel,
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

.top-row {
  flex-shrink: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
.stat-icon.purple { background: #f3e5f5; }

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

.promotion-content {
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
  width: 15px;
  height: 15px;
  filter: opacity(0.6);
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
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
  width: 120px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0b6cf0;
}

.product-name {
  font-weight: 500;
  color: #212529;
}

.price-cell {
  font-weight: 600;
  color: #6c757d;
  text-decoration: line-through;
}

.sale-price-cell {
  font-weight: 700;
  color: #28a745;
  font-size: 16px;
}

.discount-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #fff3e0;
  color: #f59e0b;
  font-weight: 700;
}

.date-cell {
  color: #495057;
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

.status-badge.expired {
  background: #e2e3e5;
  color: #383d41;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon-black {
  width: 15px;
  height: 15px;
}

.edit-btn:hover {
  border-color: #0b6cf0;
  background: #e6f0ff;
}

.delete-btn:hover {
  border-color: #dc3545;
  background: #ffebee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0b6cf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  max-width: 600px;
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

.promotion-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.required {
  color: #dc3545;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
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

  .form-row {
    grid-template-columns: 1fr;
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

  .toast {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>