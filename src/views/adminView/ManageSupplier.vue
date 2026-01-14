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
            <span class="breadcrumb-item active">Suppliers</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Supplier Management</h1>
            <p class="page-subtitle">Manage your product suppliers and vendor information</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" @click="openAddModal">
              <img src="/addIcon.png" class="btn-icon">
              Add Supplier
            </button>
          </div>
        </div>

        <section class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue"><img class="manage-icon" src="/supplierIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Suppliers</p>
              <h3 class="stat-value">{{ suppliers.length }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon green"><img class="manage-icon" src="/verifiedIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Active Suppliers</p>
              <h3 class="stat-value">{{ activeSuppliers }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon orange"><img class="manage-icon" src="/productIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Products</p>
              <h3 class="stat-value">{{ totalProducts }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon purple"><img class="manage-icon" src="/trophyIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Top Supplier</p>
              <h3 class="stat-value">{{ topSupplier }}</h3>
            </div>
          </div>
        </section>

        <section class="supplier-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search suppliers..." 
                v-model="searchQuery"
                class="search-input"
              >
            </div>
            <div class="filter-actions">
              <select v-model="sortBy" class="filter-select">
                <option value="name">Sort by Name</option>
                <option value="products">Sort by Products</option>
                <option value="recent">Recently Added</option>
              </select>
              <button 
                v-if="selectedSupplierIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteSuppliers"
              >
                <img src="/deleteIcon.png" class="btn-icon">
                Delete Selected ({{ selectedSupplierIds.length }})
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
                  <th>Company Name</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Products</th>
                  <th>Status</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredSuppliers.length === 0">
                  <td colspan="8" class="empty-state">
                    <div class="empty-content">
                      <p>No suppliers found</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="supplier.id" 
                      v-model="selectedSupplierIds"
                      class="custom-checkbox"
                    >
                  </td>
                  <td class="company-cell">
                    <div class="company-info">
                      <span class="company-name">{{ supplier.companyName }}</span>
                    </div>
                  </td>
                  <td>{{ supplier.contactPerson }}</td>
                  <td class="email-cell">{{ supplier.email }}</td>
                  <td>{{ supplier.phone }}</td>
                  <td>
                    <span class="product-badge">{{ supplier.productCount }} items</span>
                  </td>
                  <td>
                    <span :class="['status-badge', supplier.status.toLowerCase()]">
                      <span class="status-dot"></span>
                      {{ supplier.status }}
                    </span>
                  </td>
                  <td class="action-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn edit-btn" 
                        @click="openEditModal(supplier)"
                        title="Edit"
                      >
                        <img src="/editIcon.png" class="manage-icon-black" alt="">
                      </button>
                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteSupplier(supplier.id)"
                        title="Delete"
                      >
                        <img src="/deleteIcon.png" class="manage-icon-black" alt="">
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
              <h3>{{ isEditMode ? 'Edit Supplier' : 'Add New Supplier' }}</h3>
              <button class="close-btn" @click="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Company Name <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.companyName" 
                    placeholder="Enter company name"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Contact Person <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="formData.contactPerson" 
                    placeholder="Enter contact person"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Email <span class="required">*</span></label>
                  <input 
                    type="email" 
                    v-model="formData.email" 
                    placeholder="supplier@example.com"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Phone <span class="required">*</span></label>
                  <input 
                    type="tel" 
                    v-model="formData.phone" 
                    placeholder="+1 234 567 8900"
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
              </div>

              <div class="form-group full-width">
                <label>Address</label>
                <textarea 
                  v-model="formData.address" 
                  placeholder="Enter supplier address (optional)"
                  class="form-textarea"
                  rows="2"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label>Notes</label>
                <textarea 
                  v-model="formData.notes" 
                  placeholder="Additional notes (optional)"
                  class="form-textarea"
                  rows="2"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button class="btn btn-primary" @click="saveSupplier">
                {{ isEditMode ? 'Update' : 'Create' }} Supplier
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
  name: 'ManageSupplier',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const sortBy = ref('name');
    const showModal = ref(false);
    const isEditMode = ref(false);
    const currentEditId = ref(null);
    const suppliers = ref([]);
    const selectedSupplierIds = ref([]);
    const isLoading = ref(false);

    const toast = ref({
      show: false,
      type: 'success',
      message: ''
    });

    const formData = ref({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      productCount: 0,
      status: 'Active',
      address: '',
      notes: ''
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
      get: () => selectedSupplierIds.value.length === filteredSuppliers.value.length && filteredSuppliers.value.length > 0,
      set: (value) => {
        selectedSupplierIds.value = value ? filteredSuppliers.value.map(s => s.id) : [];
      }
    });

    const activeSuppliers = computed(() => 
      suppliers.value.filter(s => s.status === 'Active').length
    );

    const totalProducts = computed(() => 
      suppliers.value.reduce((sum, s) => sum + s.productCount, 0)
    );

    const topSupplier = computed(() => {
      const sorted = [...suppliers.value].sort((a, b) => b.productCount - a.productCount);
      return sorted.length > 0 ? sorted[0].companyName : 'N/A';
    });

    const filteredSuppliers = computed(() => {
      let filtered = suppliers.value;

      if (searchQuery.value) {
        filtered = filtered.filter(s => 
          s.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          s.contactPerson.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortBy.value === 'name') {
        filtered = [...filtered].sort((a, b) => a.companyName.localeCompare(b.companyName));
      } else if (sortBy.value === 'products') {
        filtered = [...filtered].sort((a, b) => b.productCount - a.productCount);
      } else if (sortBy.value === 'recent') {
        filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
      }

      return filtered;
    });

    async function fetchSuppliers() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/suppliers`);
        console.log('Raw API response:', response.data);
        
        suppliers.value = response.data.map(sup => ({
          id: sup._id,
          companyName: sup.companyName,
          contactPerson: sup.contactPerson,
          email: sup.email,
          phone: sup.phone,
          productCount: sup.productCount || 0,
          status: sup.status,
          address: sup.address || '',
          notes: sup.notes || '',
          createdDate: sup.createdDate || 'N/A'
        }));
        
        console.log('Suppliers loaded:', suppliers.value.length);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        showToast('error', 'Failed to load suppliers. Please check your connection.');
      } finally {
        isLoading.value = false;
      }
    }

    function openAddModal() {
      isEditMode.value = false;
      formData.value = {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        productCount: 0,
        status: 'Active',
        address: '',
        notes: ''
      };
      showModal.value = true;
    }

    function openEditModal(supplier) {
      isEditMode.value = true;
      currentEditId.value = supplier.id;
      formData.value = {
        companyName: supplier.companyName,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        productCount: supplier.productCount,
        status: supplier.status,
        address: supplier.address || '',
        notes: supplier.notes || ''
      };
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
      isEditMode.value = false;
      currentEditId.value = null;
    }

    async function saveSupplier() {
      if (!formData.value.companyName.trim() || !formData.value.contactPerson.trim() || !formData.value.email.trim()) {
        showToast('error', 'Company name, contact person, and email are required!');
        return;
      }

      try {
        if (isEditMode.value) {
          console.log('Updating supplier with ID:', currentEditId.value);
          await axios.patch(`${API_URL}/suppliers/${currentEditId.value}`, {
            companyName: formData.value.companyName,
            contactPerson: formData.value.contactPerson,
            email: formData.value.email,
            phone: formData.value.phone,
            productCount: formData.value.productCount || 0,
            status: formData.value.status,
            address: formData.value.address || '',
            notes: formData.value.notes || ''
          });
          showToast('success', 'Supplier updated successfully!');
        } else {
          await axios.post(`${API_URL}/suppliers`, {
            companyName: formData.value.companyName,
            contactPerson: formData.value.contactPerson,
            email: formData.value.email,
            phone: formData.value.phone,
            productCount: formData.value.productCount || 0,
            status: formData.value.status,
            address: formData.value.address || '',
            notes: formData.value.notes || ''
          });
          showToast('success', 'Supplier added successfully!');
        }
        
        await fetchSuppliers();
        closeModal();
      } catch (error) {
        console.error('Save failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to save supplier. Please try again.';
        showToast('error', errorMsg);
      }
    }

    async function deleteSupplier(id) {
      console.log('Deleting supplier with ID:', id);
      if (confirm('Are you sure you want to delete this supplier?')) {
        try {
          await axios.delete(`${API_URL}/suppliers/${id}`);
          showToast('success', 'Supplier deleted successfully!');
          await fetchSuppliers();
        } catch (error) {
          console.error('Delete failed:', error);
          const errorMsg = error.response?.status === 404 
            ? 'Supplier not found' 
            : error.response?.status === 400
            ? 'Invalid supplier ID format'
            : 'Failed to delete supplier';
          showToast('error', errorMsg);
        }
      }
    }

    async function bulkDeleteSuppliers() {
      const count = selectedSupplierIds.value.length;
      if (count === 0) {
        showToast('error', 'Please select at least one supplier to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected suppliers?`)) {
        try {
          await axios.post(`${API_URL}/suppliers/bulk-delete`, {
            ids: selectedSupplierIds.value
          });
          showToast('success', `${count} suppliers deleted successfully!`);
          selectedSupplierIds.value = [];
          await fetchSuppliers();
        } catch (error) {
          console.error('Bulk delete failed:', error);
          showToast('error', 'Failed to delete suppliers');
        }
      }
    }

    function viewSupplier(supplier) {
      alert(`Company: ${supplier.companyName}\nContact: ${supplier.contactPerson}\nEmail: ${supplier.email}\nPhone: ${supplier.phone}\nProducts: ${supplier.productCount}`);
    }

    function exportSuppliers() {
      try {
        const dataStr = JSON.stringify(suppliers.value, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `suppliers_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('success', 'Suppliers exported successfully!');
      } catch (error) {
        console.error('Export failed:', error);
        showToast('error', 'Failed to export suppliers');
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      console.log('ManageSupplier mounted, fetching data...');
      fetchSuppliers();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      sortBy,
      showModal,
      isEditMode,
      suppliers,
      selectedSupplierIds,
      formData,
      toast,
      selectAll,
      activeSuppliers,
      totalProducts,
      topSupplier,
      filteredSuppliers,
      isLoading,
      openAddModal,
      openEditModal,
      closeModal,
      saveSupplier,
      deleteSupplier,
      bulkDeleteSuppliers,
      viewSupplier,
      exportSuppliers,
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

.manage-icon-black {
  width: 15px;
  height: 15px;
}

.manage-icon{
  width: 20px;
  height: 20px;
}

.supplier-content {
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
  left: 12px;
  width: 15px;
  height: 15px;
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

.company-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #212529;
}

.company-icon {
  font-size: 18px;
}

.email-cell {
  color: #6c757d;
  font-size: 13px;
}

.product-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #e6f0ff;
  color: #0b6cf0;
  font-weight: 500;
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

.empty-content p {
  color: #6c757d;
  margin: 0;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.page-btn.active {
  background: #0b6cf0;
  color: white;
  border-color: #0b6cf0;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
  margin-top: 10px;
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

  .form-grid {
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
}
</style>