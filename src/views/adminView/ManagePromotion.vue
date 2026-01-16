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
            <p class="page-subtitle">Create and manage product promotions and discounts</p>
          </div>
          <div class="header-actions">
            <button v-if="selectedPromotionIds.length > 0" @click="bulkDeletePromotions" class="btn btn-danger">
              <img src="/deleteIcon.png" alt="Delete" class="btn-icon" />
              Delete Selected ({{ selectedPromotionIds.length }})
            </button>
            <button @click="openAddModal" class="btn btn-primary">
              Add Promotion
            </button>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue"><img class="stats-icon" src="/discountIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Promotions</p>
              <h3 class="stat-value">{{ totalPromotions }}</h3>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><img class="stats-icon" src="/verifiedIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Active Promotions</p>
              <h3 class="stat-value">{{ activePromotions }}</h3>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><img class="stats-icon" src="/productIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Promoted Products</p>
              <h3 class="stat-value">{{ promotedProducts }}</h3>
            </div>
          </div>
        </div>

        <div class="promotion-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" alt="Search" class="search-icon" />
              <input 
                v-model="searchQuery" 
                type="text" 
                class="search-input" 
                placeholder="Search by product name..."
              />
            </div>
            <div class="filter-actions">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input 
                      type="checkbox" 
                      class="custom-checkbox"
                      :checked="selectAll"
                      @change="selectAll = !selectAll"
                    />
                  </th>
                  <th>Product Name</th>
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
                <tr v-if="isLoading">
                  <td colspan="9" class="empty-state">
                    <div class="spinner"></div>
                    <p>Loading promotions...</p>
                  </td>
                </tr>
                <tr v-else-if="filteredPromotions.length === 0">
                  <td colspan="9" class="empty-state">
                    <div class="empty-content">
                      <p>No promotions found</p>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="promo in filteredPromotions" :key="promo._id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      class="custom-checkbox"
                      :value="promo._id"
                      v-model="selectedPromotionIds"
                    />
                  </td>
                  <td>
                    <div class="product-name">{{ promo.productName }}</div>
                  </td>
                  <td class="price-cell">${{ promo.originalPrice.toFixed(2) }}</td>
                  <td>
                    <span class="discount-badge">{{ promo.discount.toFixed(0) }}% OFF</span>
                  </td>
                  <td class="sale-price-cell">${{ promo.salePrice.toFixed(2) }}</td>
                  <td class="date-cell">{{ formatDate(promo.startDate) }}</td>
                  <td class="date-cell">{{ formatDate(promo.endDate) }}</td>
                  <td>
                    <span :class="['status-badge', getStatusClass(promo)]">
                      <span class="status-dot"></span>
                      {{ getStatusLabel(promo) }}
                    </span>
                  </td>
                  <td class="action-col">
                    <div class="action-buttons">
                      <button @click="openEditModal(promo)" class="action-btn edit-btn">
                        <img src="/editIcon.png" alt="Edit" class="btn-icon-black" />
                      </button>
                      <button @click="deletePromotion(promo._id)" class="action-btn delete-btn">
                        <img src="/deleteIcon.png" alt="Delete" class="btn-icon-black" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Edit Promotion' : 'Add New Promotion' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="savePromotion" class="promotion-form">
            <div class="form-group">
              <label>Product <span class="required">*</span></label>
              <select v-model="formData.productId" class="form-select" required :disabled="isEditMode">
                <option value="">Select a product</option>
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }} (${{ product.price.toFixed(2) }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Product Image</label>
              <div 
                class="image-upload-area"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
              >
                <div v-if="imagePreview" class="image-preview">
                  <img :src="imagePreview" alt="Preview" />
                  <button 
                    type="button" 
                    @click="imagePreview = ''; imageFile = null"
                    class="remove-image-btn"
                  >
                    ✕ Remove
                  </button>
                </div>
                <div v-else class="upload-placeholder">
                  <img src="/uploadIcon.png" alt="Upload" class="upload-icon" />
                  <p>Drag and drop image here or click to browse</p>
                  <input 
                    type="file" 
                    @change="handleImageUpload"
                    accept="image/*"
                    class="file-input"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Discount (%) <span class="required">*</span></label>
              <input 
                v-model.number="formData.discount" 
                type="number" 
                class="form-input"
                min="1"
                max="99"
                required
              />
            </div>
            <div class="form-group">
              <label>Calculated Sale Price</label>
              <input 
                :value="calculatedPrice" 
                type="text" 
                class="form-input"
                disabled
              />
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

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ isEditMode ? 'Update' : 'Create' }} Promotion
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="toast.show" :class="['toast', toast.type + '-toast']">
      <div class="toast-content">
        <span>{{ toast.message }}</span>
      </div>
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
      discount: 0,
      startDate: '',
      endDate: '',
      status: 'Active'
    });

    const imagePreview = ref('');
    const imageFile = ref(null);

    const showToast = (type, message, duration = 3000) => {
      toast.value = { show: true, type, message };
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
      promotions.value.filter(p => p.status === 'Active' && new Date(p.endDate) >= new Date()).length
    );

    const averageDiscount = computed(() => {
      if (promotions.value.length === 0) return 0;
      const sum = promotions.value.reduce((acc, p) => acc + (p.discount || 0), 0);
      return (sum / promotions.value.length).toFixed(1);
    });

    const promotedProducts = computed(() => 
      new Set(promotions.value.map(p => p.productId)).size
    );

    const calculatedPrice = computed(() => {
      const product = products.value.find(p => p._id === formData.value.productId);
      if (!product || !formData.value.discount) return '$0.00';
      const salePrice = product.price - (product.price * formData.value.discount / 100);
      return `$${salePrice.toFixed(2)}`;
    });

    const filteredPromotions = computed(() => {
      let filtered = promotions.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(p => 
          (p.productName || '').toLowerCase().includes(query)
        );
      }
      
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(p => {
          const now = new Date();
          const endDate = new Date(p.endDate);
          
          if (statusFilter.value === 'active') {
            return p.status === 'Active' && endDate >= now;
          } else if (statusFilter.value === 'inactive') {
            return p.status === 'Inactive';
          } else if (statusFilter.value === 'expired') {
            return endDate < now;
          }
          return true;
        });
      }
      
      return filtered;
    });

    async function fetchPromotions() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/promotions`);
        
        console.log('Raw promotion data:', response.data);
        
        promotions.value = response.data.map(promo => {
          const discount = parseFloat(promo.discountPercentage || promo.discount || 0);
          const originalPrice = parseFloat(promo.originalPrice || 0);
          
          let salePrice = parseFloat(promo.salePrice || 0);
          if (!salePrice && originalPrice && discount) {
            salePrice = originalPrice - (originalPrice * discount / 100);
          }
          
          return {
            _id: promo._id || '',
            productId: promo.productId || '',
            productName: promo.productName || 'Unknown Product',
            originalPrice: originalPrice,
            discount: discount,
            discountPercentage: discount,
            salePrice: salePrice,
            startDate: promo.startDate || '',
            endDate: promo.endDate || '',
            status: promo.status || 'Inactive'
          };
        });
        
        console.log('Mapped promotions:', promotions.value);
        console.log('Total promotions:', promotions.value.length);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        console.error('Error response:', error.response?.data);
        showToast('error', 'Failed to load promotions');
        promotions.value = [];
      } finally {
        isLoading.value = false;
      }
    }

    async function fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/products`);
        products.value = response.data.map(product => ({
          _id: product._id || '',
          name: product.name || 'Unknown',
          price: product.price || 0
        }));
        console.log('Products loaded:', products.value.length);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast('error', 'Failed to load products');
        products.value = [];
      }
    }

    function openAddModal() {
      isEditMode.value = false;
      formData.value = {
        productId: '',
        discount: 0,
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
        discount: parseFloat(promotion.discount) || 0,
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
    }

    async function savePromotion() {
      try {
        const payload = {
          productId: formData.value.productId,
          discount: formData.value.discount,
          discountPercentage: formData.value.discount,
          startDate: new Date(formData.value.startDate).toISOString(),
          endDate: new Date(formData.value.endDate).toISOString(),
          status: formData.value.status
        };

        if (isEditMode.value) {
          await axios.patch(`${API_URL}/promotions/${currentEditId.value}`, payload);
          showToast('success', 'Promotion updated successfully');
        } else {
          await axios.post(`${API_URL}/promotions`, payload);
          showToast('success', 'Promotion created successfully');
        }

        await fetchPromotions();
        closeModal();
      } catch (error) {
        console.error('Failed to save promotion:', error);
        console.error('Error details:', error.response?.data);
        showToast('error', error.response?.data?.message || 'Failed to save promotion');
      }
    }

    async function deletePromotion(id) {
      if (!confirm('Are you sure you want to delete this promotion?')) return;
      
      try {
        await axios.delete(`${API_URL}/promotions/${id}`);
        showToast('success', 'Promotion deleted successfully');
        await fetchPromotions();
      } catch (error) {
        console.error('Failed to delete promotion:', error);
        showToast('error', 'Failed to delete promotion');
      }
    }

    async function bulkDeletePromotions() {
      if (!confirm(`Delete ${selectedPromotionIds.value.length} selected promotions?`)) return;
      
      try {
        await axios.delete(`${API_URL}/promotions/bulk`, {
          data: { ids: selectedPromotionIds.value }
        });
        showToast('success', `${selectedPromotionIds.value.length} promotions deleted`);
        selectedPromotionIds.value = [];
        await fetchPromotions();
      } catch (error) {
        console.error('Failed to delete promotions:', error);
        showToast('error', 'Failed to delete promotions');
      }
    }

    const handleImageUpload = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target?.result;
      };
      reader.readAsDataURL(file);
      
      imageFile.value = file;
      
      // Upload to server
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        formData.value.imageSrc = response.data.url;
        showToast('success', 'Image uploaded successfully');
      } catch (error) {
        console.error('Image upload failed:', error);
        showToast('error', 'Failed to upload image');
        imagePreview.value = '';
        imageFile.value = null;
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.classList.remove('drag-over');
      
      const files = event.dataTransfer?.files;
      if (files?.length > 0) {
        handleImageUpload({ target: { files } });
      }
    };

    function formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    function getStatusClass(promotion) {
      const now = new Date();
      const endDate = new Date(promotion.endDate);
      
      if (endDate < now) return 'expired';
      if (promotion.status === 'Active') return 'active';
      return 'inactive';
    }

    function getStatusLabel(promotion) {
      const now = new Date();
      const endDate = new Date(promotion.endDate);
      
      if (endDate < now) return 'Expired';
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
      imagePreview,
      imageFile,
      handleImageUpload,
      handleDragOver,
      handleDragLeave,
      handleDrop,
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

.stats-icon {
  width: 20px;
  height: 20px;
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

.image-upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.image-upload-area:hover {
  border-color: #0b6cf0;
  background: #f8f9fa;
}

.image-upload-area.drag-over {
  border-color: #0b6cf0;
  background: #e6f0ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  width: 40px;
  height: 40px;
  filter: opacity(0.6);
}

.upload-placeholder p {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.file-input {
  display: none;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.remove-image-btn:hover {
  background: #c82333;
  transform: scale(1.1);
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