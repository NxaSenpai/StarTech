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
                <option v-for="category in availableCategories" :key="category" :value="category">
                  {{ category }}
                </option>
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
                      <img 
                        :src="getImageUrl(product.imageSrc)" 
                        :alt="product.name" 
                        class="product-image"
                        @error="handleImageError"
                      >
                      <div class="product-details">
                        <div class="product-name">{{ product.name }}</div>
                        <div class="product-sku">{{ product.category }}</div>
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
        </section>
        
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
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                  <small v-if="categories.length === 0" class="form-hint">
                    No active categories available. Please add categories first.
                  </small>
                </div>

                <div class="form-group">
                  <label>Supplier <span class="required">*</span></label>
                  <select v-model="productForm.supplier" class="form-select">
                    <option value="">Select supplier</option>
                    <option v-for="supplier in suppliers" :key="supplier" :value="supplier">
                      {{ supplier }}
                    </option>
                  </select>
                  <small v-if="suppliers.length === 0" class="form-hint">
                    No active suppliers available. Please add suppliers first.
                  </small>
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

                <div class="form-group full-width">
                  <label>Product Image <span class="required">*</span></label>
                  <div 
                    class="image-upload-area"
                    :class="{ 'has-image': !!productForm.imageSrc }"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      ref="imageInput"
                      @change="handleImageUpload"
                      accept="image/*"
                      style="display: none;"
                    >
                    
                    <div v-if="!!productForm.imageSrc" class="image-preview">
                      <div class="preview-container">
                        <img 
                          :src="getImageUrl(productForm.imageSrc)" 
                          alt="Product preview"
                          @error="handleImageError"
                        >
                      </div>
                      <div style="display: flex; gap: 12px;">
                        <button
                          type="button"
                          class="change-image-btn"
                          @click="triggerFileInput"
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                          </svg>
                          Change Image
                        </button>
                        <button
                          type="button"
                          class="remove-image-btn"
                          @click="removeImage"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div v-else class="upload-placeholder" @click="triggerFileInput">
                      <div v-if="isUploading" class="upload-loading">
                        <div class="spinner"></div>
                        <p>Uploading...</p>
                      </div>
                      <div v-else class="upload-content">
                        <div class="upload-icon-wrapper">
                          <img src="/uploadIcon.png" class="upload-icon" alt="Upload Icon">
                        </div>
                        <p class="upload-text">Click to upload or drag and drop</p>
                        <p class="upload-hint">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
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
        <div v-if="toast.show && toast.type === 'success'" class="toast success-toast">
          <div class="toast-content">
            <span class="toast-icon">✓</span>
            <span>{{ toast.message }}</span>
          </div>
        </div>

        <div v-if="toast.show && toast.type === 'error'" class="toast error-toast">
          <div class="toast-content">
            <span class="toast-icon">✕</span>
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
    const products = ref([]);
    const selectedProductIds = ref([]);
    const isLoading = ref(false);
    const isUploading = ref(false);
    const imageInput = ref(null);

    const categories = ref([]);
    const suppliers = ref([]);

    const toast = ref({
      show: false,
      type: 'success',
      message: ''
    });

    const productForm = ref({
      name: '',
      brand: '',
      category: '',
      supplier: '',
      inStock: 0,
      price: 0,
      status: 'Active',
      imageSrc: '',
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

    const availableCategories = computed(() => {
      const uniqueCategories = [...new Set(products.value.map(p => p.category))];
      return uniqueCategories.filter(c => c);
    });

    async function fetchCategories() {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        categories.value = response.data
          .filter(cat => cat.status === 'Active')
          .map(cat => cat.name);
        console.log('Categories loaded:', categories.value);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        showToast('error', 'Failed to load categories');
      }
    }

    async function fetchSuppliers() {
      try {
        const response = await axios.get(`${API_URL}/suppliers`);
        suppliers.value = response.data
          .filter(sup => sup.status === 'Active')
          .map(sup => sup.companyName);
        console.log('Suppliers loaded:', suppliers.value);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        showToast('error', 'Failed to load suppliers');
      }
    }

    async function fetchProducts() {
      isLoading.value = true;
      try {
        const response = await axios.get(`${API_URL}/products`);
        console.log('Products loaded:', response.data);
        
        products.value = response.data.map(prod => ({
          id: prod._id,
          name: prod.name,
          brand: prod.brand,
          category: prod.category,
          supplier: prod.supplier,
          inStock: prod.inStock,
          price: prod.price,
          status: prod.status,
          imageSrc: prod.imageSrc,
          description: prod.description || '',
          stockAt: prod.stockAt
        }));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast('error', 'Failed to load products');
      } finally {
        isLoading.value = false;
      }
    }

    function getStockClass(stock) {
      if (stock <= 5) return 'low';
      if (stock <= 10) return 'medium';
      return 'high';
    }

    function openAddProductModal() {
      isEditMode.value = false;
      currentEditId.value = null;
      productForm.value = {
        name: '',
        brand: '',
        category: '',
        supplier: '',
        inStock: 0,
        price: 0,
        status: 'Active',
        imageSrc: '',
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
        imageSrc: product.imageSrc || '',
        description: product.description || ''
      };
      showProductModal.value = true;
    }

    function closeProductModal() {
      showProductModal.value = false;
      isEditMode.value = false;
      currentEditId.value = null;
    }

    async function handleImageUpload(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('error', 'Please select an image file');
        if (event?.target) event.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Image size must be less than 5MB');
        if (event?.target) event.target.value = '';
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        isUploading.value = true;

        const response = await axios.post(`${API_URL}/upload`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        });

        if (response.data?.url) {
          productForm.value.imageSrc = response.data.url;
          showToast('success', 'Image uploaded successfully!');
        } else {
          throw new Error('No URL in response');
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          'Failed to upload image';
        showToast('error', errorMsg);
      } finally {
        isUploading.value = false;
        if (event?.target) event.target.value = '';
      }
    }

    function triggerFileInput() {
      imageInput.value?.click();
    }

    function removeImage() {
      productForm.value.imageSrc = '';
      if (imageInput.value) imageInput.value.value = '';
    }

    async function saveProduct() {
      if (!productForm.value.name.trim() || !productForm.value.brand.trim()) {
        showToast('error', 'Product name and brand are required!');
        return;
      }

      if (!productForm.value.category) {
        showToast('error', 'Please select a category!');
        return;
      }

      if (!productForm.value.supplier) {
        showToast('error', 'Please select a supplier!');
        return;
      }

      try {
        const payload = {
          name: productForm.value.name,
          brand: productForm.value.brand,
          category: productForm.value.category,
          supplier: productForm.value.supplier,
          inStock: parseInt(productForm.value.inStock) || 0,
          price: parseFloat(productForm.value.price) || 0,
          status: productForm.value.status,
          imageSrc: productForm.value.imageSrc,
          description: productForm.value.description || ''
        };

        if (isEditMode.value) {
          await axios.patch(`${API_URL}/products/${currentEditId.value}`, payload);
          showToast('success', 'Product updated successfully!');
        } else {
          await axios.post(`${API_URL}/products`, payload);
          showToast('success', 'Product added successfully!');
        }

        await fetchProducts();
        closeProductModal();
      } catch (error) {
        console.error('Save failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to save product';
        showToast('error', errorMsg);
      }
    }

    async function deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          await axios.delete(`${API_URL}/products/${id}`);
          showToast('success', 'Product deleted successfully!');
          await fetchProducts();
        } catch (error) {
          console.error('Delete failed:', error);
          showToast('error', 'Failed to delete product');
        }
      }
    }

    async function bulkDeleteProducts() {
      const count = selectedProductIds.value.length;
      if (count === 0) {
        showToast('error', 'Please select products to delete');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected products?`)) {
        try {
          await axios.post(`${API_URL}/products/bulk-delete`, {
            ids: selectedProductIds.value
          });
          showToast('success', `${count} products deleted successfully!`);
          selectedProductIds.value = [];
          await fetchProducts();
        } catch (error) {
          console.error('Bulk delete failed:', error);
          showToast('error', 'Failed to delete products');
        }
      }
    }

    function exportProducts() {
      try {
        const dataStr = JSON.stringify(products.value, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `products_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showToast('success', 'Products exported successfully!');
      } catch (error) {
        console.error('Export failed:', error);
        showToast('error', 'Failed to export products');
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    function getImageUrl(imageSrc) {
      console.log("This is image url : " + imageSrc)
      if (!imageSrc) {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E';
      }
      
      // If it's already a full URL, return it
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
        return imageSrc;
      }
      
      // If it's a data URL, return it
      if (imageSrc.startsWith('data:')) {
        return imageSrc;
      }
      
      // If it's a relative path starting with /uploads/, return with API_URL
      if (imageSrc.startsWith('/uploads/')) {
        return `${API_URL}${imageSrc}`;
      }
      
      // If it's just a filename, add the /uploads/ prefix
      if (!imageSrc.startsWith('/')) {
        return `${API_URL}/uploads/${imageSrc}`;
      }
      
      return imageSrc;
    }

    function handleImageError(event) {
      // Prevent infinite loop by checking if we've already set placeholder
      if (event.target.src.includes('placeholder.png')) {
        console.warn('Placeholder image also failed to load');
        return;
      }
      
      console.warn('Failed to load image:', event.target.src);
      
      // Use a data URL as fallback instead of another file path
      event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="16" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    onMounted(() => {
      console.log('ManageProduct mounted, fetching data...');
      Promise.all([
        fetchCategories(),
        fetchSuppliers(),
        fetchProducts()
      ]);
    });

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
      toast,
      isLoading,
      isUploading,
      imageInput,
      categories,
      suppliers,
      availableCategories,
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
      exportProducts,
      handleSettingsClick,
      triggerFileInput,
      removeImage,
      handleImageError,
      getImageUrl
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
  flex-shrink: 0;
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

.product-content {
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

.form-hint {
  display: block;
  font-size: 12px;
  color: #f59e0b;
  margin-top: 4px;
  font-style: italic;
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

.image-upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
}

.image-upload-area:hover {
  border-color: #0b6cf0;
  background: #f8f9fa;
}

.image-upload-area.drag-over {
  border-color: #0b6cf0;
  background: #e6f0ff;
  border-style: solid;
}

.image-upload-area.has-image {
  background: white;
  border-style: solid;
  padding: 20px;
}

.upload-placeholder {
  width: 100%;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b6cf0;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.upload-hint {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0b6cf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.image-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.preview-container {
  width: 100%;
  max-width: 400px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
}

.preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.remove-image-btn,
.change-image-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.remove-image-btn {
  background: #dc3545;
  color: white;
}

.remove-image-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.change-image-btn {
  background: #0b6cf0;
  color: white;
}

.change-image-btn:hover {
  background: #0958c9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 108, 240, 0.3);
}

@media (max-width: 768px) {
  .image-upload-area {
    min-height: 200px;
    padding: 20px;
  }
  
  .preview-container {
    height: 180px;
  }
}
</style>