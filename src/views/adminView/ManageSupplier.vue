<template>
  <div class="page-wrapper">
    <div class="admin-layout">
      
      <header class="admin-header">
        <img class = "logo-img" src="/logo.png" alt="">
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
                
                <router-link to="/product/category" class="nav-sub-item">
                   Category
                </router-link>
                
                <router-link to="/product/supplier" class="nav-sub-item active">
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
          <h1 class="page-title">Manage Suppliers</h1> 
        </div>

        <section class="supplier-content">
          <div class="content-header">
            <h2 class="section-title">Product Suppliers</h2>
            <div class="actions">
              <button class="add-btn" @click="addSupplier">Add Supplier</button>
              <button class="delete-bulk-btn" @click="bulkDeleteSuppliers">Delete Bulk</button>
            </div>
          </div>
          
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" v-model="selectAll"></th>
                  <th>Company Name</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Total Products</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supplier in suppliers" :key="supplier.id">
                  <td><input type="checkbox" :value="supplier.id" v-model="selectedSupplierIds"></td>
                  <td class="name-cell">{{ supplier.companyName }}</td>
                  <td>{{ supplier.contactPerson }}</td>
                  <td>{{ supplier.email }}</td>
                  <td>{{ supplier.productCount }}</td>
                  <td class="action-cell">
                    <button class="action-btn edit-btn" @click="editSupplier(supplier.id)">📝</button>
                    <button class="action-btn delete-btn" @click="deleteSupplier(supplier.id)">🗑️</button>
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

const suppliers = ref([
  { id: 101, companyName: 'ASUS Company', contactPerson: 'Jane Doe', email: 'jane@asus.com', productCount: 25 },
  { id: 102, companyName: 'Samsung Company', contactPerson: 'John Smith', email: 'john@samsung.com', productCount: 45 },
  { id: 103, companyName: 'IBTS Company', contactPerson: 'Alice Brown', email: 'alice@ibts.net', productCount: 12 },
]);

const selectedSupplierIds = ref([]);

const selectAll = computed({
  get: () => selectedSupplierIds.value.length === suppliers.value.length && suppliers.value.length > 0,
  set: (value) => {
    selectedSupplierIds.value = value ? suppliers.value.map(s => s.id) : [];
  }
});

let nextId = 104;

// --- CRUD Functions ---

function addSupplier() {
    const companyName = prompt('Enter Supplier Company Name:');
    if (!companyName || companyName.trim() === '') {
        alert('Supplier creation cancelled: Company Name is required.');
        return;
    } 
    
    const contactPerson = prompt(`Enter Contact Person for ${companyName}:`);
    const email = prompt(`Enter Email for ${companyName}:`);
    
    // Prompt for Total Products
    let productCountInput = prompt(`Enter the initial Total Products count supplied by "${companyName}":`, 0);
    let productCountValue = parseInt(productCountInput);
    
    if (productCountInput === null || isNaN(productCountValue) || productCountValue < 0) {
        alert('Invalid product count. Supplier creation cancelled.');
        return;
    }

    const newSupplier = {
        id: nextId++,
        companyName: companyName.trim(),
        contactPerson: contactPerson ? contactPerson.trim() : 'N/A',
        email: email ? email.trim() : 'N/A',
        productCount: productCountValue, 
    };
    suppliers.value.push(newSupplier);
    alert(`Supplier "${companyName}" added successfully with ${productCountValue} associated products.`);
}

function editSupplier(id) {
    const supplier = suppliers.value.find(s => s.id === id);
    if (!supplier) return;
    
    let isUpdated = false;

    // 1. Edit Company Name (MISSING ACTION 1 ADDED)
    const newCompanyName = prompt(`Edit Company Name (Current: ${supplier.companyName}):`, supplier.companyName);
    if (newCompanyName && newCompanyName.trim() !== '') {
        supplier.companyName = newCompanyName.trim();
        isUpdated = true;
    }

    // 2. Edit Contact Person 
    const newContactPerson = prompt(`Edit Contact Person (Current: ${supplier.contactPerson}):`, supplier.contactPerson);
    if (newContactPerson && newContactPerson.trim() !== '') {
        supplier.contactPerson = newContactPerson.trim();
        isUpdated = true;
    }
    
    // 3. Edit Email (MISSING ACTION 2 ADDED)
    const newEmail = prompt(`Edit Email (Current: ${supplier.email}):`, supplier.email);
    if (newEmail && newEmail.trim() !== '') {
        supplier.email = newEmail.trim();
        isUpdated = true;
    }

    // 4. Edit Total Products (MISSING ACTION 3 ADDED)
    const currentProductCount = supplier.productCount;
    let newProductCountInput = prompt(`Edit Total Products (Current: ${currentProductCount}):`, currentProductCount);

    if (newProductCountInput !== null) {
        let newProductCountValue = parseInt(newProductCountInput);
        if (!isNaN(newProductCountValue) && newProductCountValue >= 0) {
            supplier.productCount = newProductCountValue;
            isUpdated = true;
        } else if (newProductCountInput.trim() !== "") {
            alert('Invalid product count entered. Product count not updated.');
        }
    }

    if (isUpdated) {
        alert(`Supplier "${supplier.companyName}" updated successfully.`);
    }
}

function deleteSupplier(id) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        suppliers.value = suppliers.value.filter(s => s.id !== id);
    }
}

function bulkDeleteSuppliers() {
  const count = selectedSupplierIds.value.length;
  if (count === 0) {
    alert('Please select at least one supplier to delete.');
    return;
  }
  if (confirm(`Are you sure you want to delete ${count} selected suppliers?`)) {
    suppliers.value = suppliers.value.filter(s => !selectedSupplierIds.value.includes(s.id));
    selectedSupplierIds.value = [];
    // Removed alert(`${count} suppliers successfully deleted.`);
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

.supplier-content {
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

/* Table Styles - Shared with Category */
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