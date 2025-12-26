<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <header class="admin-header">
        <img class="logo-img" src="/logo.png" alt="">
      </header>

      <aside class="sidebar">
        <nav class="nav-links">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          
          <div class="nav-dropdown-group">
            <a href="#" class="nav-item nav-dropdown-toggle active" @click.prevent="toggleProductMenu">
               Manage Product
              <span :class="['dropdown-icon', { 'open': isProductMenuOpen }]">⌄</span>
            </a>
            
            <transition name="dropdown"> 
              <div v-show="isProductMenuOpen" class="nav-dropdown-menu">
                
                <router-link to="/manageproduct" class="nav-sub-item">
                   Product Listing
                </router-link>
                
                <router-link to="/product/category" class="nav-sub-item active">
                   Category
                </router-link>
                
                <router-link to="/product/supplier" class="nav-sub-item">
                   Supplier
                </router-link>
                
              </div>
            </transition>
          </div>
          <router-link to="/manageorder" class="nav-item">Manage Orders</router-link>
          <router-link to="/manageuser" class="nav-item">Manage Users</router-link>
          <a href="#" class="nav-item">Setting</a>
        </nav>
      </aside>

      <main class="content-area">
        <div class="top-row">
          <h1 class="page-title">Manage Categories</h1> 
        </div>

        <section class="category-content">
          <div class="content-header">
            <h2 class="section-title">Product Categories</h2>
            <div class="actions">
              <button class="add-btn" @click="addCategory">Add Category</button>
              <button class="delete-bulk-btn" @click="bulkDeleteCategories">Delete Bulk</button>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" v-model="selectAll"></th>
                  <th>Category Name</th>
                  <th>Total Products</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.id">
                  <td><input type="checkbox" :value="category.id" v-model="selectedCategoryIds"></td>
                  <td class="name-cell">{{ category.name }}</td>
                  <td>{{ category.productCount }}</td>
                  <td :class="['status-cell', category.status === 'Active' ? 'active-status' : 'inactive-status']">
                    <span>{{ category.status === 'Active' ? '🟢 Active' : '🔴 Inactive' }}</span>
                  </td>
                  <td class="action-cell">
                    <button class="action-btn edit-btn" @click="editCategory(category.id)">📝</button>
                    <button class="action-btn delete-btn" @click="deleteCategory(category.id)">🗑️</button>
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
import { ref, computed } from 'vue';

const isProductMenuOpen = ref(true); 

function toggleProductMenu() {
  isProductMenuOpen.value = !isProductMenuOpen.value;
}

const categories = ref([
  { id: 1, name: 'Game accessory', productCount: 45, status: 'Active' },
  { id: 2, name: 'Mobile Phone', productCount: 120, status: 'Active' },
  { id: 3, name: 'Laptops', productCount: 65, status: 'Active' },
  { id: 4, name: 'Software/Keys', productCount: 15, status: 'Inactive' },
]);

const selectedCategoryIds = ref([]);

const selectAll = computed({
  get: () => selectedCategoryIds.value.length === categories.value.length && categories.value.length > 0,
  set: (value) => {
    selectedCategoryIds.value = value ? categories.value.map(c => c.id) : [];
  }
});

let nextId = 5;

// --- CRUD Functions ---

function addCategory() {
    // 1. Get Name
    const newName = prompt('Enter the Name of the New Category:');
    if (!newName || newName.trim() === '') {
        alert('Category creation cancelled: Name is required.');
        return;
    } 

    // 2. Get Product Count
    let productCountInput = prompt(`Enter the initial Total Products count for "${newName}":`, 0);
    let productCountValue = parseInt(productCountInput);
    if (productCountInput === null || isNaN(productCountValue) || productCountValue < 0) {
        alert('Invalid product count. Category creation cancelled.');
        return;
    }

    // 3. Get Status
    let newStatus = prompt(`Enter the Status (Active or Inactive) for "${newName}":`, 'Active');
    const statusLower = (newStatus || '').toLowerCase();
    
    if (statusLower !== 'active' && statusLower !== 'inactive') {
        newStatus = 'Active'; // Default if invalid or canceled
    } else {
        newStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
    }
    
    // Create new category object
    const newCategory = {
        id: nextId++,
        name: newName.trim(),
        productCount: productCountValue, 
        status: newStatus 
    };
    
    categories.value.push(newCategory);
    alert(`Category "${newName}" added successfully with Status: ${newStatus} and ${productCountValue} products.`);
}

function editCategory(id) {
    const category = categories.value.find(c => c.id === id);
    if (!category) return;
    
    let isUpdated = false;

    // 1. Edit Category Name
    const newName = prompt(`Edit Category Name (Current: ${category.name}):`, category.name);
    if (newName && newName.trim() !== '') {
        category.name = newName.trim();
        isUpdated = true;
    }
    
    // 2. Edit Status
    const newStatus = prompt(`Edit Status (Active/Inactive, Current: ${category.status}):`, category.status);
    if (newStatus !== null) {
        const lowerStatus = newStatus.toLowerCase();
        if (lowerStatus === 'active' || lowerStatus === 'inactive') {
            category.status = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
            isUpdated = true;
        }
    }

    // 3. Edit Total Products (MISSING ACTION ADDED)
    const currentProductCount = category.productCount;
    let newProductCountInput = prompt(`Edit Total Products (Current: ${currentProductCount}):`, currentProductCount);

    if (newProductCountInput !== null) {
        let newProductCountValue = parseInt(newProductCountInput);
        if (!isNaN(newProductCountValue) && newProductCountValue >= 0) {
            category.productCount = newProductCountValue;
            isUpdated = true;
        } else if (newProductCountInput.trim() !== "") {
            alert('Invalid product count entered. Product count not updated.');
        }
    }

    if (isUpdated) {
        alert(`Category "${category.name}" updated successfully.`);
    }
}

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        categories.value = categories.value.filter(c => c.id !== id);
    }
}

function bulkDeleteCategories() {
  const count = selectedCategoryIds.value.length;
  if (count === 0) {
    alert('Please select at least one category to delete.');
    return;
  }
  if (confirm(`Are you sure you want to delete ${count} selected categories?`)) {
    categories.value = categories.value.filter(c => !selectedCategoryIds.value.includes(c.id));
    selectedCategoryIds.value = [];
    // Removed alert(`${count} categories successfully deleted.`);
  }
}
</script>

<style scoped>
/* LAYOUT STYLES COPIED FROM ManageProduct.vue 
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
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-img {
  scale: .4;
  margin-left: -90px;
  filter: brightness(0) invert(1);
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
  display: flex; 
  align-items: center; 
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

/* --- Dropdown Styles --- */

.nav-dropdown-group {
    position: relative;
}

.nav-dropdown-toggle {
    cursor: pointer;
    justify-content: space-between; 
}

.dropdown-icon {
    font-size: 20px;
    line-height: 1;
    transition: transform 0.3s;
    font-weight: bold;
}

.dropdown-icon.open {
    transform: rotate(180deg);
}

.nav-dropdown-menu {
    padding: 5px 0;
    margin-left: 10px; 
    border-left: 2px solid #0b6cf0;
    overflow: hidden;
    width: 100%; 
    box-sizing: border-box; 
}

.nav-sub-item {
    display: flex;
    align-items: center;
    padding: 8px 12px; 
    margin: 2px 0;
    border-radius: 8px;
    text-decoration: none;
    color: #555;
    font-size: 14px; 
}

.nav-sub-item.active {
    background: #e6f0ff;
    color: #0b6cf0;
    font-weight: 500;
}

/* Transition for smooth dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  max-height: 300px; 
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

/* --- Content Area Styles --- */
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
/* END OF LAYOUT STYLES 
*/

.category-content {
    margin-top: 25px;
    background: transparent;
    color: #555;
}

.content-header {
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

.add-btn {
    background: #0b6cf0;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
}

.delete-bulk-btn {
    background: #dc3545;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
}

/* Table Styles - Adjusted for Category/Supplier */
.table-wrapper {
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
    font-size: 14px;
}

tbody tr:hover {
    background-color: #f5f5f5;
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