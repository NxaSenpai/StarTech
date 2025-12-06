<template>
  <div class="page-wrapper">
    <div class="admin-layout">

      <!-- TOP BAR -->
      <header class="admin-header">
        <h2 class="logo-text">StarTech</h2>
      </header>

      <!-- SIDEBAR -->
      <aside class="sidebar">

        <nav class="nav-links">
          <a href="#" class="nav-item">Dashboard</a>
          <a href="#" class="nav-item">Manage Product</a>
          <a href="#" class="nav-item active">Manage Orders</a>
          <router-link to="/manageuser" class="nav-item">Manage Users</router-link>
        </nav>

        <div class="settings">
          <a href="#" class="nav-item">Setting</a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="content-area">

        <div class="top-row">
          <h1 class="page-title">Manage Orders</h1>

          <div class="search-box">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Email"
              class="search-input"
            >
          </div>
        </div>


        <div class="layout-grid">

          <!-- TABLE -->
          <div class="order-table-box">
            <div class="table-header">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            <div
              class="table-row"
              v-for="order in orders"
              :key="order.id"
            >
              <span>{{ order.id }}</span>
              <span>{{ order.customer }}</span>
              <span>{{ order.date }}</span>
              <span>{{ order.total }}</span>

              <span
                :class="['status', order.status.toLowerCase()]"
                @click="toggleDropdown(order.id)"
                style="cursor: pointer; position: relative;"
              >
                {{ order.status }}
                <div
                  v-if="dropdownVisible === order.id"
                  class="dropdown-menu"
                  @click.stop
                >
                  <button
                    v-if="order.status !== 'Pending'"
                    @click="updateStatus(order, 'Pending')"
                    class="dropdown-item"
                  >Pending</button>
                  <button
                    v-if="order.status !== 'Completed'"
                    @click="updateStatus(order, 'Completed')"
                    class="dropdown-item"
                  >Completed</button>
                </div>
              </span>
            </div>
          </div>


          <!-- STATS -->
          <div class="stats-dashboard">
            <div class="stat-card blue">
              <p>Orders Today:</p>
              <h2>{{ todaysOrderTotal }}</h2>
            </div>

            <div class="stat-card orange">
              <p>Total Pending:</p>
              <h2>{{ pendingTotal }} orders</h2>
            </div>

            <div class="stat-card orange">
              <p>Revenue Waiting:</p>
              <h2>${{ revenueWaiting }}</h2>
            </div>

            <div class="stat-card green">
              <p>Total Sales (This month):</p>
              <h2>${{ totalSalesThisMonth }}</h2>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';

const orders = ref([
  { id: '# 0001', customer: 'Kitty', date: 'Nov 16, 2025', total: '$999.00', status: 'Pending' },
  { id: '# 0002', customer: 'Puthika', date: 'Nov 16, 2025', total: '$529.00', status: 'Pending' },
  { id: '# 0003', customer: 'Srey Nuth', date: 'Nov 16, 2025', total: '$129.00', status: 'Pending' },
  { id: '# 0004', customer: 'Dara', date: 'Nov 16, 2025', total: '$59.00', status: 'Pending' },
  { id: '# 0005', customer: 'Daro', date: 'Nov 15, 2025', total: '$19.00', status: 'Completed' },
  { id: '# 0006', customer: 'Liza', date: 'Nov 15, 2025', total: '$129.00', status: 'Completed' },
]);

const dropdownVisible = ref(null);

const toggleDropdown = (id) => {
  dropdownVisible.value = dropdownVisible.value === id ? null : id;
};

const updateStatus = (order, status) => {
  order.status = status;
  dropdownVisible.value = null;
};

const todaysOrderTotal = computed(() =>
  orders.value.filter(order => order.date === 'Nov 16, 2025').length
);

const pendingTotal = computed(() =>
  orders.value.filter(order => order.status === 'Pending').length
);

const revenueWaiting = computed(() =>
  orders.value
    .filter(order => order.status === 'Pending')
    .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0)
    .toFixed(2)
);

// Add this for Total Sales (This month)
const totalSalesThisMonth = computed(() =>
  orders.value
    .filter(order =>
      order.status === 'Completed' &&
      order.date.includes('Nov')
    )
    .reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0)
    .toFixed(2)
);

</script>

<style scoped>
.page-wrapper {
  background: #ffffff;
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

/* ===== HEADER ===== */
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

/* ===== SIDEBAR ===== */
.sidebar {
  grid-area: sidebar;
  border-right: 1px solid #eee;
  padding: 20px;
  background: white;

  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
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

/* ===== CONTENT ===== */
.content-area {
  overflow-y: auto;
  height: calc(100vh - 70px);
}

.page-title {
  color: #111;
  font-weight: 700;
}
.table-header span {
  color: #222;
}
.table-row span {
  color: #333;
}

.search-box input {
  margin-top: 10px;
  border: 1px solid #ddd;
  padding: 10px 15px;
  width: 350px;
  border-radius: 8px;
}

/* ===== LAYOUT ===== */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 30px;
  margin-top: 25px;
  align-items: start;
}

/* ===== TABLE ===== */

.order-table-box {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 700px;
  overflow-y: auto;
  background: white;
  border-radius: 10px;
  border: 1px solid #eee;
  position: relative;
}

.table-header {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  padding: 15px 20px;
  border-radius: 10px 10px 0 0;
  align-items: center;
  background: #e0e0e0;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}

.table-row {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  padding: 15px 20px;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.table-row:hover {
  background: #eef4ff;
  transition: 0.2s ease;
}


/* ===== STATUS ===== */
.status {
  position: relative;
  padding: 6px 12px;
  border-radius: 20px;
  width: fit-content;
  cursor: pointer;
}

.status.pending {
  color: orange;
}

.status.completed {
  color: green;
}

.dropdown-menu {
  position: absolute;
  top: 36px;
  left: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.dropdown-item {
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  color: #333;
  font-size: 15px;
}

.dropdown-item:hover {
  background: #e6f0ff;
}

/* ===== STATS ===== */
.stats-dashboard {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  padding: 15px;
  border-radius: 10px;
  border: 2px solid;
}

.stat-card.blue {
  border-color: #0b6cf0;
  color: #0b6cf0;
}

.stat-card.orange {
  border-color: orange;
  color: orange;
}

.stat-card.green {
  border-color: green;
  color: green;
}

</style>