<template>
    <div class="admin-layout">
      <header class="admin-header">
        <div class="logo"><img src="/logo.png" alt=""></div>
      </header>
  
      <aside class="sidebar">
        <h3 class="sidebar-title">Pages</h3>
        <nav class="nav-links">
          <a href="#" class="nav-item">Dashboard</a>
          <a href="#" class="nav-item">Manage Product</a>
          <a href="#" class="nav-item active">Manage Orders</a>
          <a href="#" class="nav-item">Manage Users</a>
        </nav>
        <div class="settings">
          <span class="nav-item setting-link">Setting</span>
        </div>
      </aside>
  
      <main class="content-area">
        <div class="page-header">
          <h1 class="page-title">Manage Orders</h1>
        </div>
  
        <div class="main-content">
          <div class="search-box">
            <input type="text" placeholder="Search by Order ID, Customer Name, Email" class="search-input">
          </div>
  
          <div class="dashboard-and-table">
            <div class="stats-dashboard">
              <div class="stat-card blue">
                <p>Orders Today:</p>
                <p class="stat-value">{{ todaysOrderTotal }}</p>
              </div>
              <div class="stat-card yellow">
                <p>Total Pending:</p>
                <p class="stat-value">{{ pendingTotal }}</p>
              </div>
              <div class="stat-card orange">
                <p>Revenue Waiting:</p>
                <p class="stat-value">${{ revenueWaiting }}</p>
              </div>
              <div class="stat-card green">
                <p>Total Sales (This month):</p>
                <p class="stat-value">$1,200.00</p>
              </div>
            </div>
  
            <div class="order-table-container">
              <table class="order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.customer }}</td>
                    <td>{{ order.date }}</td>
                    <td>{{ order.total }}</td>
                    <td>
                      <div class="status-dropdown">
                        <button class="status-button" @click="toggleDropdown(order.id)">
                          <span :class="['status', order.status.toLowerCase()]">{{ order.status }}</span>
                        </button>
                        <ul v-if="dropdownVisible === order.id" class="dropdown-menu">
                          <li @click="updateStatus(order, 'Pending')">Pending</li>
                          <li @click="updateStatus(order, 'Completed')">Completed</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>

<script setup>
import { ref } from 'vue';

const orders = ref([
  { id: '# 0001', customer: 'Dara', date: 'Nov 16, 2025', total: '$129.00', status: 'Pending' },
  { id: '# 0002', customer: 'Dara', date: 'Nov 16, 2025', total: '$129.00', status: 'Pending' },
  { id: '# 0003', customer: 'Dara', date: 'Nov 16, 2025', total: '$129.00', status: 'Pending' },
  { id: '# 0004', customer: 'Dara', date: 'Nov 16, 2025', total: '$129.00', status: 'Pending' },
  { id: '# 0005', customer: 'Dara', date: 'Nov 15, 2025', total: '$129.00', status: 'Completed' },
  { id: '# 0006', customer: 'Dara', date: 'Nov 15, 2025', total: '$129.00', status: 'Completed' },
]);

const dropdownVisible = ref(null);

const toggleDropdown = (id) => {
  dropdownVisible.value = dropdownVisible.value === id ? null : id;
};

const updateStatus = (order, status) => {
  order.status = status;
  dropdownVisible.value = null;
};

const todaysOrderTotal = orders.value.filter(order => order.date === 'Nov 16, 2025').length;
const pendingTotal = orders.value.filter(order => order.status === 'Pending').length;
const revenueWaiting = orders.value
  .filter(order => order.status === 'Pending')
  .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0)
  .toFixed(2);

</script>

<style scoped>


.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar content";
  min-height: 100vh;
  background-color: #f0f2f5;
}

.admin-header {
  grid-area: header;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.admin-header .logo {
  width: 10px;
  height: 100px;
  scale: 0.4;
}



.sidebar {
  grid-area: sidebar;
  background-color: #fff;
  padding: 20px 0;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1em;
  font-weight: 600;
  color: #333;
  padding: 0 20px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.nav-item {
  display: block;
  padding: 12px 20px;
  color: #555;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 0.95em;
  font-weight: 500;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #e6f0ff;
  color: #007bff;
  border-left: 4px solid #007bff;
}

.settings {
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.setting-link {
  padding-left: 20px;
}


.content-area {
  grid-area: content;
  padding: 20px;
  background-color: #f7f7f7;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 1.8em;
  font-weight: 600;
  color: #333;
}



.search-box {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 50%; /* Constrain search bar width */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.95em;
}

.search-input::placeholder {
  color: #aaa;
}

.dashboard-and-table {
  display: grid;
  grid-template-columns: 300px 1fr; 
  gap: 20px;
}

.stats-dashboard {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 0.9em;
  border: 1px solid #eee;
}

.stat-value {
  font-size: 1.6em;
  font-weight: bold;
  margin-top: 5px;
}

/* Stat card colors */
.stat-card.blue { border-left: 4px solid #007bff; color: #007bff; }
.stat-card.yellow { border-left: 4px solid #ffc107; color: #ffc107; }
.stat-card.orange { border-left: 4px solid #fd7e14; color: #fd7e14; }
.stat-card.green { border-left: 4px solid #28a745; color: #28a745; }


.order-table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden; /* Ensures borders are contained */
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.order-table th, .order-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #333;
}


.order-table th {
  background-color: #f5f5f5;
  color: #666; 
  font-weight: 600;
  text-transform: uppercase;
}

.order-table tbody tr:last-child td {
  border-bottom: none;
}

.order-table tbody tr:hover {
  background-color: #fafafa;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85em;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.status.completed {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-dropdown {
  position: relative;
  display: inline-block;
}

.status-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 5px 0;
  margin: 0;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu li:hover {
  background-color: #f5f5f5;
}

</style>