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
            <span class="breadcrumb-item active">Manage Products</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Product Management</h1>
            <p class="page-subtitle">Manage your inventory and product catalog</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" @click="openAddProductModal">
              <img class="btn-icon" src="/addIcon.png">
              Add Product
            </button>
          </div>
        </div>

        <section class="metrics-row">
          <div class="metric-card">
            <div class="metric-icon blue"><img class="manage-icon" src="/productIcon.png" alt=""></div>
            <div class="metric-info">
              <p class="metric-label">Total Products</p>
              <h3 class="metric-value">{{ products.length }}</h3>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon green"><img class="manage-icon" src="/benefitIcon.png" alt=""></div>
            <div class="metric-info">
              <p class="metric-label">Most Sold</p>
              <h3 class="metric-value">ASUS Controller</h3>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon red"><img class="manage-icon" src="/lostIcon.png" alt=""></div>
            <div class="metric-info">
              <p class="metric-label">Least Sold</p>
              <h3 class="metric-value">Galaxy Note 9</h3>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon green"><img class="manage-icon" src="/verifiedIcon.png" alt=""></div>
            <div class="metric-info">
              <p class="metric-label">Active</p>
              <h3 class="metric-value">{{ activeProductsCount }}</h3>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon orange"><img class="manage-icon" src="/alertIcon.png" alt=""></div>
            <div class="metric-info">
              <p class="metric-label">Inactive</p>
              <h3 class="metric-value">{{ inactiveProductsCount }}</h3>
            </div>
          </div>
        </section>

        <section class="product-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search products..." 
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
              <select v-model="categoryFilter" class="filter-select">
                <option value="all">All Categories</option>
                <option value="Game accessory">Game Accessory</option>
                <option value="Mobile Phone">Mobile Phone</option>
              </select>
              <button 
                v-if="selectedProductIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteProducts"
              ><img class="manage-icon-delete" src="/deleteIcon.png" alt="">
                Delete Selected ({{ selectedProductIds.length }})
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
                  <th>Product</th>
                  <th>Stock At</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="10" class="empty-state">
                    <div class="empty-content">
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="product.id" 
                      v-model="selectedProductIds"
                      class="custom-checkbox"
                    >
                  </td>
                  <td class="product-cell">
                    <div class="product-info">
                      <img :src="product.imageSrc" :alt="product.name" class="product-image">
                      <div class="product-details">
                        <span class="product-name">{{ product.name }}</span>
                        <span class="product-sku">SKU: {{ product.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="date-cell">{{ product.stockAt }}</td>
                  <td>{{ product.brand }}</td>
                  <td>
                    <span class="category-badge">{{ product.category }}</span>
                  </td>
                  <td>
                    <span :class="['stock-badge', getStockClass(product.inStock)]">
                      {{ product.inStock }} units
                    </span>
                  </td>
                  <td>{{ product.supplier }}</td>
                  <td>
                    <span :class="['status-badge', product.status.toLowerCase()]">
                      <span class="status-dot"></span>
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="price-cell">${{ product.price }}</td>
                  <td class="action-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn edit-btn" 
                        @click="openEditProductModal(product)"
                        title="Edit"
                      >
                        <img class="btn-icon-black" src="/editIcon.png" alt="">
                      </button>
                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteProduct(product.id)"
                        title="Delete"
                      >
                      <img class="btn-icon-black" src="/deleteIcon.png" alt="">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <div class="pagination-info">
              Showing {{ filteredProducts.length }} of {{ products.length }} products
            </div>
            <div class="pagination-controls">
              <button class="page-btn" disabled>Previous</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">Next</button>
            </div>
          </div>
        </section>

        <!-- Add/Edit Product Modal -->
        <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
          <div class="modal-container large-modal">
            <div class="modal-header">
              <h3>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h3>
              <button class="close-btn" @click="closeProductModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Product Name <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="productForm.name" 
                    placeholder="Enter product name"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Brand <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="productForm.brand" 
                    placeholder="Enter brand"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Category <span class="required">*</span></label>
                  <select v-model="productForm.category" class="form-select">
                    <option value="">Select category</option>
                    <option value="Game accessory">Game Accessory</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Smart TV">Smart TV</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Supplier <span class="required">*</span></label>
                  <input 
                    type="text" 
                    v-model="productForm.supplier" 
                    placeholder="Enter supplier"
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label>Stock Quantity <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model="productForm.inStock" 
                    placeholder="0"
                    class="form-input"
                    min="0"
                  >
                </div>

                <div class="form-group">
                  <label>Price ($) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    v-model="productForm.price" 
                    placeholder="0.00"
                    class="form-input"
                    min="0"
                    step="0.01"
                  >
                </div>

                <div class="form-group">
                  <label>Status <span class="required">*</span></label>
                  <select v-model="productForm.status" class="form-select">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Image URL</label>
                  <input 
                    type="text" 
                    v-model="productForm.imageSrc" 
                    placeholder="/placeholder.png"
                    class="form-input"
                  >
                </div>
              </div>

              <div class="form-group full-width">
                <label>Description</label>
                <textarea 
                  v-model="productForm.description" 
                  placeholder="Enter product description (optional)"
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeProductModal">Cancel</button>
              <button class="btn btn-primary" @click="saveProduct">
                {{ isEditMode ? 'Update' : 'Create' }} Product
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import AdminHeader from '@/components/adminHeader.vue';
import AdminSidebar from '@/components/adminSidebar.vue';

export default {
  name: 'ManageProduct',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const categoryFilter = ref('all');
    const showProductModal = ref(false);
    const isEditMode = ref(false);
    const currentEditId = ref(null);

    const products = ref([
      {
        id: 1,
        name: 'ASUS Controller',
        imageSrc: '/Asus_controller.png',
        stockAt: 'Mon, Aug 23, 2025',
        brand: 'ASUS',
        category: 'Game accessory',
        inStock: 10,
        supplier: 'Asus Company',
        status: 'Active',
        price: 2000
      },
      {
        id: 2,
        name: 'Samsung Galaxy Note 9',
        imageSrc: '/Samsung_Galaxy_Note9.png',
        stockAt: 'Mon, Aug 23, 2025',
        brand: 'SAMSUNG',
        category: 'Mobile Phone',
        inStock: 8,
        supplier: 'Samsung Company',
        status: 'Inactive',
        price: 6400
      }
    ]);

    const selectedProductIds = ref([]);

    const productForm = ref({
      name: '',
      brand: '',
      category: '',
      supplier: '',
      inStock: 0,
      price: 0,
      status: 'Active',
      imageSrc: '/placeholder.png',
      description: ''
    });

    const selectAll = computed({
      get: () => selectedProductIds.value.length === filteredProducts.value.length && filteredProducts.value.length > 0,
      set: (value) => {
        selectedProductIds.value = value ? filteredProducts.value.map(p => p.id) : [];
      }
    });

    const activeProductsCount = computed(() => 
      products.value.filter(p => p.status === 'Active').length
    );

    const inactiveProductsCount = computed(() => 
      products.value.filter(p => p.status === 'Inactive').length
    );

    const filteredProducts = computed(() => {
      let filtered = products.value;

      if (searchQuery.value) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(p => 
          p.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }

      if (categoryFilter.value !== 'all') {
        filtered = filtered.filter(p => 
          p.category === categoryFilter.value
        );
      }

      return filtered;
    });

    let nextId = 3;

    function getStockClass(stock) {
      if (stock <= 5) return 'low';
      if (stock <= 10) return 'medium';
      return 'high';
    }

    function openAddProductModal() {
      isEditMode.value = false;
      productForm.value = {
        name: '',
        brand: '',
        category: '',
        supplier: '',
        inStock: 0,
        price: 0,
        status: 'Active',
        imageSrc: '/placeholder.png',
        description: ''
      };
      showProductModal.value = true;
    }

    function openEditProductModal(product) {
      isEditMode.value = true;
      currentEditId.value = product.id;
      productForm.value = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        supplier: product.supplier,
        inStock: product.inStock,
        price: product.price,
        status: product.status,
        imageSrc: product.imageSrc,
        description: product.description || ''
      };
      showProductModal.value = true;
    }

    function closeProductModal() {
      showProductModal.value = false;
      isEditMode.value = false;
      currentEditId.value = null;
    }

    function saveProduct() {
      if (!productForm.value.name.trim() || !productForm.value.brand.trim()) {
        alert('Product name and brand are required!');
        return;
      }

      if (isEditMode.value) {
        const index = products.value.findIndex(p => p.id === currentEditId.value);
        if (index !== -1) {
          products.value[index] = {
            ...products.value[index],
            ...productForm.value,
            stockAt: products.value[index].stockAt
          };
          alert('Product updated successfully!');
        }
      } else {
        const newProduct = {
          id: nextId++,
          ...productForm.value,
          stockAt: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        };
        products.value.push(newProduct);
        alert('Product added successfully!');
      }

      closeProductModal();
    }

    function deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        products.value = products.value.filter(p => p.id !== id);
      }
    }

    function bulkDeleteProducts() {
      const count = selectedProductIds.value.length;
      if (count === 0) {
        alert('Please select at least one product to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected products?`)) {
        products.value = products.value.filter(p => !selectedProductIds.value.includes(p.id));
        selectedProductIds.value = [];
      }
    }

    function viewProduct(product) {
      alert(`Product: ${product.name}\nBrand: ${product.brand}\nPrice: $${product.price}\nStock: ${product.inStock}`);
    }

    function exportProducts() {
      alert('Exporting products...');
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    return {
      adminName,
      notifications,
      searchQuery,
      statusFilter,
      categoryFilter,
      showProductModal,
      isEditMode,
      products,
      selectedProductIds,
      productForm,
      selectAll,
      activeProductsCount,
      inactiveProductsCount,
      filteredProducts,
      getStockClass,
      openAddProductModal,
      openEditProductModal,
      closeProductModal,
      saveProduct,
      deleteProduct,
      bulkDeleteProducts,
      viewProduct,
      exportProducts,
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
  overflow-y: auto;
  height: calc(100vh - 70px);
  background: #f8f9fa;
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
  filter: invert(1);
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.btn-icon-black {
  width: 15px;
  height: 15px;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(11, 108, 240, 0.15);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.metric-icon.blue { background: #e6f0ff; }
.metric-icon.green { background: #d4edda; }
.metric-icon.orange { background: #fff3e0; }
.metric-icon.red { background: #ffebee; }

.metric-label {
  color: #6c757d;
  font-size: 13px;
  margin: 0 0 4px 0;
}

.metric-value {
  color: #212529;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.manage-icon {
  width: 20px;
  height: 20px;
}

.manage-icon-delete {
  width: 16px;
  height: 16px;
  filter: invert(1);
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  filter: opacity(.6);
  position: absolute;
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
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 16px;
  border-top: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
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

.product-cell {
  min-width: 250px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
  color: #212529;
}

.product-sku {
  font-size: 12px;
  color: #6c757d;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #e6f0ff;
  color: #0b6cf0;
  font-weight: 500;
}

.stock-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.stock-badge.low {
  background: #ffebee;
  color: #dc3545;
}

.stock-badge.medium {
  background: #fff3e0;
  color: #f59e0b;
}

.stock-badge.high {
  background: #d4edda;
  color: #28a745;
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

.price-cell {
  font-weight: 600;
  color: #212529;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 30px;
  height: 30px;
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

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-content p {
  color: #6c757d;
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
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

.modal-container.large-modal {
  max-width: 800px;
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
}

.form-group {
  margin-bottom: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
  margin-top: 20px;
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

@media (max-width: 1200px) {
  .admin-layout {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 968px) {
  .metrics-row {
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

  .metrics-row {
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