<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <header class="admin-header">
        <h2 class="logo-text">StarTech</h2>
      </header>

      <aside class="sidebar">
        <nav class="nav-links">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          <a href="#" class="nav-item active">Manage Product</a>
          <router-link to="/manageorder" class="nav-item">Manage Orders</router-link>
          <router-link to="/manageuser" class="nav-item">Manage Users</router-link>
          <a href="#" class="nav-item">Setting</a>
        </nav>
      </aside>

      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Manage Products</h1>
        </div>

        <section class="metrics-row">
          <div class="metric-card sold-card">
            <span class="icon">🟢</span>
            <div class="details">
              <span class="label">Most Sold</span>
              <span class="value">ASUS Constroller</span>
            </div>
          </div>
          <div class="metric-card sold-card">
            <span class="icon">📈</span>
            <div class="details">
              <span class="label">Most Sold</span>
              <span class="value">ASUS Constroller</span>
            </div>
          </div>
          <div class="metric-card least-sold-card">
            <span class="icon">🛑</span>
            <div class="details">
              <span class="label">Least Sold</span>
              <span class="value">Samsung Galaxy Note 9</span>
            </div>
          </div>
          <div class="metric-card active-card">
            <span class="icon">✅</span>
            <div class="details">
              <span class="label">Active</span>
              <span class="value">+1000</span>
            </div>
          </div>
          <div class="metric-card inactive-card">
            <span class="icon">🛒</span>
            <div class="details">
              <span class="label">Inactive</span>
              <span class="value">500</span>
            </div>
          </div>
        </section>

        <section class="product-content">
          <div class="product-header">
            <h2 class="section-title">Product</h2>
            <div class="actions">
              <div class="search-product-box">
                <input type="text" placeholder="Search product ..." class="search-product-input">
                <button class="search-icon-btn">🔍</button>
              </div>
              <button class="add-product-btn" @click="addProduct">Add Product</button>
              <button class="edit-bulk-btn" @click="bulkEditProducts">Edit Bulk</button>
            </div>
          </div>
          
          <div class="product-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox"></th>
                  <th>Name/SKU</th>
                  <th>Stock at</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td><input type="checkbox" :value="product.id" v-model="selectedProductIds"></td>
                  <td class="product-name-cell">
                    <div class="product-info">
                      <img :src="product.imageSrc" :alt="product.name + ' icon'" class="product-icon">
                      <span>{{ product.name }}</span>
                    </div>
                  </td>
                  <td>{{ product.stockAt }}</td>
                  <td>{{ product.brand }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.inStock }}</td>
                  <td>{{ product.supplier }}</td>
                  <td :class="['status-cell', product.status === 'Active' ? 'active-status' : 'inactive-status']">
                    <span>{{ product.status === 'Active' ? '🟢 Active' : '🔴 Inactive' }}</span>
                  </td>
                  <td>{{ product.price }} $</td>
                  <td class="action-cell">
                    <button class="action-btn edit-btn" @click="editProduct(product.id)">📝</button>
                    <button class="action-btn delete-btn" @click="deleteProduct(product.id)">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive list of products
const products = ref([
  {
    id: 1,
    name: 'ASUS Constroller',
    imageSrc: '/Asus_controller.png',
    stockAt: 'Mon,Aug 23,2025',
    brand: 'ASUS',
    category: 'Game accessory',
    inStock: 10,
    supplier: 'Asus company',
    status: 'Active',
    price: 2000
  },
  {
    id: 2,
    name: 'Samsung Galaxy Note 9',
    imageSrc: '/Samsung_Galaxy_Note9.png',
    stockAt: 'Mon,Aug 23,2025',
    brand: 'SAMSUNG',
    category: 'Mobile Phone',
    inStock: 8,
    supplier: 'Samsung Company',
    status: 'Inactive',
    price: 6400
  }
]);

// Reactive state to track selected products for bulk actions
const selectedProductIds = ref([]);

let nextId = 3;

// --- CRUD Operations ---

function addProduct() {
  const newProduct = {
    id: nextId++,
    name: 'New Item (Click Edit)',
    imageSrc: '/new_product.png',
    stockAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    brand: 'New Brand',
    category: 'New Category',
    inStock: 1,
    supplier: 'Unknown',
    status: 'Active',
    price: 0
  };
  products.value.push(newProduct);
}

function deleteProduct(id) {
  products.value = products.value.filter(p => p.id !== id);
}

/**
 * SINGLE-PRODUCT EDIT LOGIC
 * @param {number} id - The ID of the product to edit.
 */
function editProduct(id) {
  const productIndex = products.value.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    const product = products.value[productIndex];

    // 1. Name
    const newName = prompt(`Enter new Name (Current: ${product.name}):`, product.name);
    if (newName !== null && newName.trim() !== '') {
      product.name = newName.trim();
    }

    // 2. Brand
    const newBrand = prompt(`Enter new Brand (Current: ${product.brand}):`, product.brand);
    if (newBrand !== null && newBrand.trim() !== '') {
      product.brand = newBrand.trim();
    }
    
    // 3. Category
    const newCategory = prompt(`Enter new Category (Current: ${product.category}):`, product.category);
    if (newCategory !== null && newCategory.trim() !== '') {
      product.category = newCategory.trim();
    }
    
    // 4. Supplier
    const newSupplier = prompt(`Enter new Supplier (Current: ${product.supplier}):`, product.supplier);
    if (newSupplier !== null && newSupplier.trim() !== '') {
      product.supplier = newSupplier.trim();
    }
    
    // 5. In Stock (Numeric)
    const newInStock = prompt(`Enter new Stock quantity (Current: ${product.inStock}):`, product.inStock);
    const stockValue = parseInt(newInStock);
    if (!isNaN(stockValue) && stockValue >= 0) {
      product.inStock = stockValue;
    }
    
    // 6. Price (Numeric)
    const newPrice = prompt(`Enter new Price (Current: ${product.price}):`, product.price);
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue >= 0) {
      product.price = priceValue;
    }
    
    // 7. Status
    const newStatus = prompt(`Enter new Status (Active/Inactive, Current: ${product.status}):`, product.status);
    if (newStatus !== null) {
      const lowerStatus = newStatus.toLowerCase();
      if (lowerStatus === 'active' || lowerStatus === 'inactive') {
        product.status = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
      }
    }
    
    alert(`Successfully edited all details for ${product.name}. Check the table for changes.`);
  }
}

/**
 *  BULK EDIT LOGIC
 * Applies one common change based on a single input to ALL selected products.
 */
function bulkEditProducts() {
  const count = selectedProductIds.value.length;

  if (count === 0) {
    alert('Please select at least one product using the checkboxes to bulk edit.');
    return;
  }
  
  // Ask for ONE common value to apply to ALL selected products
  const stockIncrease = prompt(`Enter the amount to ADD to 'In Stock' for all ${count} selected products:`, 5);
  
  const increaseValue = parseInt(stockIncrease);

  if (isNaN(increaseValue) || stockIncrease === null) {
      alert('Bulk edit cancelled or invalid stock value entered.');
      return;
  }
  
  products.value.forEach(product => {
    if (selectedProductIds.value.includes(product.id)) {
      // Apply the COMMON change to all selected items
      product.inStock += increaseValue;
      
      // Also apply a common status change: forcing all selected to be active
      product.status = 'Active';
    }
  });

  alert(`${count} products successfully updated in bulk. (Stock +${increaseValue}, Status forced to Active)`);
  
  // Clear the selection after the action is complete
  selectedProductIds.value = [];
}
</script>

<style scoped>
/*
  LAYOUT STYLES
*/
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
  grid-template-columns: 240px 1fr;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    "header header"
    "sidebar content";
  border-radius: 0;
}

.admin-header {
  grid-area: header;
  background: #0b6cf0;
  display: flex;
  align-items: center;
  padding-left: 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-text {
  color: white;
  font-weight: bold;
}

.sidebar {
  grid-area: sidebar;
  border-right: 1px solid #eee;
  padding: 20px;
  background: white;
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
}

.nav-links {
  margin-bottom: 20px;
}

.nav-item {
  display: block;
  padding: 12px;
  margin: 5px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
}
.nav-item.active {
  background: #e6f0ff;
  color: #0b6cf0;
}

.content-area {
  grid-area: content;
  padding: 40px;
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.page-title {
  color: #111;
  font-weight: 700;
  font-size: 24px;
}

.top-row {
    display: flex;
    justify-content: flex-start; 
    align-items: center;
    margin-bottom: 25px;
}

/* --- PRODUCT COMPONENT STYLES --- */

.metrics-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.metric-card {
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    flex-grow: 1;
    border: 1px solid #eee;
}

.metric-card .icon {
    font-size: 24px;
    margin-right: 10px;
}

.metric-card .details {
    display: flex;
    flex-direction: column;
}

.metric-card .label {
    font-size: 12px;
    color: #555;
    margin-bottom: 2px;
}

.metric-card .value {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.product-content {
    margin-top: 25px;
    min-height: 400px;
    padding: 0;
    background: transparent;
    border: none;
}

.product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 0 10px; 
}

.section-title {
    font-size: 20px;
    font-weight: 700;
    color: #111;
}

.actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-product-box {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
}

.search-product-input {
    padding: 10px 15px;
    width: 250px;
    border: none;
    outline: none;
    margin-top: 0 !important;
}

.search-icon-btn {
    background: transparent;
    border: none;
    padding: 0 10px;
    cursor: pointer;
    font-size: 16px;
    color: #777;
}

.add-product-btn {
    background: #0b6cf0;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.edit-bulk-btn {
    background: #ffc107;
    color: #333;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

/* Table Styles */
.product-table-wrapper {
    background: white;
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

thead {
    background: #f8f9fa;
}

th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    font-weight: 600;
    color: #333; 
    text-transform: uppercase;
    font-size: 12px;
}

tbody tr:hover {
    background-color: #f5f5f5;
}

tbody td {
    color: #333; 
}

.product-name-cell .product-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-name-cell .product-icon {
    width: 40px; 
    height: 40px;
}

.status-cell span {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
}

.active-status span {
    background-color: #e6ffe6;
    color: #008000;
}

.inactive-status span {
    background-color: #fff0f0;
    color: #cc0000;
}

.action-cell {
    white-space: nowrap;
}

.action-btn {
    background: transparent;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    margin-right: 5px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    transition: background 0.2s;
}

.action-btn:hover {
    background: #f0f0f0;
}

.delete-btn {
    color: #dc3545;
}

.edit-btn {
    color: #0b6cf0;
}
</style>