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
            <span class="breadcrumb-item active">Manage Orders</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Order Management</h1>
            <p class="page-subtitle">Track and manage customer orders</p>
          </div>
        </div>

        <section class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue"><img class="manage-icon" src="/orderIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Orders Today</p>
              <h3 class="stat-value">{{ todaysOrderTotal }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon orange"><img class="manage-icon" src="/pendingIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Pending Orders</p>
              <h3 class="stat-value">{{ pendingTotal }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon red"><img class="manage-icon" src="/cashIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Revenue Waiting</p>
              <h3 class="stat-value">${{ revenueWaiting }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon green"><img class="manage-icon" src="/benefitIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Sales (Month)</p>
              <h3 class="stat-value">${{ totalSalesThisMonth }}</h3>
            </div>
          </div>
        </section>

        <section class="order-content">
          <div class="table-controls">
            <div class="search-box">
              <img src="/searchIcon.png" class="search-icon">
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer Name, Email..." 
                v-model="searchQuery"
                class="search-input"
              >
            </div>
            <div class="filter-actions">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select v-model="dateFilter" class="filter-select">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button 
                v-if="selectedOrderIds.length > 0" 
                class="btn btn-danger" 
                @click="bulkDeleteOrders"
              >
                <img src="/deleteIcon.png" class="btn-icon">
                Delete Selected ({{ selectedOrderIds.length }})
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="9" class="empty-state">
                    <div class="empty-content">
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="order in filteredOrders" :key="order.id" class="table-row">
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :value="order.id" 
                      v-model="selectedOrderIds"
                      class="custom-checkbox"
                    >
                  </td>
                  <td class="order-id-cell">
                    <span class="order-id">{{ order.id }}</span>
                  </td>
                  <td class="customer-cell">
                    <div class="customer-info">
                      <div class="customer-details">
                        <span class="customer-name">{{ order.customer }}</span>
                        <span class="customer-email">{{ order.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="date-cell">
                    <div class="date-info">
                      <span class="date">{{ order.date }}</span>
                      <span class="time">{{ order.time }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="items-badge">{{ order.items }} items</span>
                  </td>
                  <td class="price-cell">${{ order.total }}</td>
                  <td>
                    <span :class="['payment-badge', order.payment.toLowerCase().replace(' ', '-')]">
                      {{ order.payment }}
                    </span>
                  </td>
                  <td>
                    <div class="status-dropdown">
                      <span 
                        :class="['status-badge', order.status.toLowerCase()]"
                        @click="toggleDropdown(order.id)"
                      >
                        <span class="status-dot"></span>
                        {{ order.status }}
                        <span class="dropdown-arrow">▼</span>
                      </span>
                      <div 
                        v-if="dropdownVisible === order.id" 
                        class="dropdown-menu"
                        @click.stop
                      >
                        <button 
                          v-for="status in availableStatuses.filter(s => s !== order.status)"
                          :key="status"
                          @click="updateStatus(order, status)"
                          class="dropdown-item"
                        >
                          {{ status }}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td class="action-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn view-btn" 
                        @click="viewOrderDetails(order)"
                        title="View Details"
                      >
                        <img class="btn-icon-black" src="/viewIcon.png" alt="">
                      </button>
                      <button 
                        class="action-btn delete-btn" 
                        @click="deleteOrder(order.id)"
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

        <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
          <div class="modal-container large-modal">
            <div class="modal-header">
              <div>
                <h3>Order Details - {{ selectedOrder.id }}</h3>
                <p class="modal-subtitle">{{ selectedOrder.date }} at {{ selectedOrder.time }}</p>
              </div>
              <button class="close-btn" @click="closeDetailsModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="details-section">
                <h4 class="section-title">Customer Information</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{{ selectedOrder.customer }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ selectedOrder.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{{ selectedOrder.phone }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Address:</span>
                    <span class="info-value">{{ selectedOrder.address }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4 class="section-title">Order Items</h4>
                <div class="order-items">
                  <div class="item-header">
                    <span>Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                  </div>
                  <div 
                    v-for="item in selectedOrder.products" 
                    :key="item.id" 
                    class="item-row"
                  >
                    <div class="item-product">
                      <img :src="item.image" :alt="item.name" class="item-image">
                      <div class="item-details">
                        <span class="item-name">{{ item.name }}</span>
                        <span class="item-sku">SKU: {{ item.sku }}</span>
                      </div>
                    </div>
                    <span class="item-price">${{ item.price }}</span>
                    <span class="item-quantity">{{ item.quantity }}</span>
                    <span class="item-subtotal">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h4 class="section-title">Order Summary</h4>
                <div class="summary-box">
                  <div class="summary-row">
                    <span class="summary-label">Subtotal:</span>
                    <span class="summary-value">${{ selectedOrder.subtotal }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Shipping:</span>
                    <span class="summary-value">${{ selectedOrder.shipping }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Tax (10%):</span>
                    <span class="summary-value">${{ selectedOrder.tax }}</span>
                  </div>
                  <div class="summary-row total">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value">${{ selectedOrder.total }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Payment Method:</span>
                    <span :class="['payment-badge', selectedOrder.payment.toLowerCase().replace(' ', '-')]">
                      {{ selectedOrder.payment }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Order Status:</span>
                    <span :class="['status-badge', selectedOrder.status.toLowerCase()]">
                      <span class="status-dot"></span>
                      {{ selectedOrder.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';

export default {
  name: 'ManageOrder',
  components: {
    AdminHeader,
    AdminSidebar
  },
  setup() {
    const adminName = ref('Admin');
    const notifications = ref(3);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const dateFilter = ref('all');
    const dropdownVisible = ref(null);
    const showDetailsModal = ref(false);
    const selectedOrder = ref(null);

    const orders = ref([
      { 
        id: '#0001', 
        customer: 'Kitty Smith', 
        email: 'kitty@example.com',
        phone: '+1 234 567 8901',
        address: '123 Main St, New York, NY 10001',
        date: 'Nov 16, 2025', 
        time: '10:30 AM',
        items: 3,
        total: '999.00',
        subtotal: '909.09',
        shipping: '0.00',
        tax: '89.91',
        payment: 'Credit Card',
        status: 'Pending',
        products: [
          { id: 1, name: 'ASUS Controller', sku: 'ASC-001', price: 250.00, quantity: 2, image: '/Asus_controller.png' },
          { id: 2, name: 'Samsung Galaxy Note 9', sku: 'SGN-009', price: 499.00, quantity: 1, image: '/Samsung_Galaxy_Note9.png' }
        ]
      },
      { 
        id: '#0002', 
        customer: 'Puthika Johnson', 
        email: 'puthika@example.com',
        phone: '+1 234 567 8902',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        date: 'Nov 16, 2025', 
        time: '11:45 AM',
        items: 2,
        total: '529.00',
        subtotal: '481.82',
        shipping: '0.00',
        tax: '47.18',
        payment: 'PayPal',
        status: 'Processing',
        products: [
          { id: 3, name: 'ASUS Controller', sku: 'ASC-001', price: 250.00, quantity: 1, image: '/Asus_controller.png' },
          { id: 4, name: 'Wireless Mouse', sku: 'WM-101', price: 29.99, quantity: 1, image: '/placeholder.png' }
        ]
      },
      { 
        id: '#0003', 
        customer: 'Srey Nuth Brown', 
        email: 'sreynuth@example.com',
        phone: '+1 234 567 8903',
        address: '789 Pine Rd, Chicago, IL 60601',
        date: 'Nov 16, 2025', 
        time: '02:15 PM',
        items: 1,
        total: '129.00',
        subtotal: '117.27',
        shipping: '0.00',
        tax: '11.73',
        payment: 'Cash',
        status: 'Pending',
        products: [
          { id: 5, name: 'Gaming Headset', sku: 'GH-201', price: 129.00, quantity: 1, image: '/placeholder.png' }
        ]
      },
      { 
        id: '#0004', 
        customer: 'Dara Wilson', 
        email: 'dara@example.com',
        phone: '+1 234 567 8904',
        address: '321 Elm St, Houston, TX 77001',
        date: 'Nov 15, 2025', 
        time: '09:20 AM',
        items: 2,
        total: '59.00',
        subtotal: '53.64',
        shipping: '0.00',
        tax: '5.36',
        payment: 'Credit Card',
        status: 'Completed',
        products: [
          { id: 6, name: 'USB Cable', sku: 'UC-301', price: 15.00, quantity: 2, image: '/placeholder.png' }
        ]
      },
      { 
        id: '#0005', 
        customer: 'Daro Martinez', 
        email: 'daro@example.com',
        phone: '+1 234 567 8905',
        address: '654 Maple Dr, Phoenix, AZ 85001',
        date: 'Nov 15, 2025', 
        time: '03:45 PM',
        items: 1,
        total: '19.00',
        subtotal: '17.27',
        shipping: '0.00',
        tax: '1.73',
        payment: 'PayPal',
        status: 'Completed',
        products: [
          { id: 7, name: 'Phone Case', sku: 'PC-401', price: 19.00, quantity: 1, image: '/placeholder.png' }
        ]
      },
      { 
        id: '#0006', 
        customer: 'Liza Anderson', 
        email: 'liza@example.com',
        phone: '+1 234 567 8906',
        address: '987 Birch Ln, Philadelphia, PA 19101',
        date: 'Nov 15, 2025', 
        time: '04:30 PM',
        items: 4,
        total: '129.00',
        subtotal: '117.27',
        shipping: '0.00',
        tax: '11.73',
        payment: 'Credit Card',
        status: 'Completed',
        products: [
          { id: 8, name: 'Keyboard', sku: 'KB-501', price: 89.00, quantity: 1, image: '/placeholder.png' },
          { id: 9, name: 'Mouse Pad', sku: 'MP-601', price: 19.99, quantity: 2, image: '/placeholder.png' }
        ]
      },
    ]);

    const selectedOrderIds = ref([]);
    const availableStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

    const selectAll = computed({
      get: () => selectedOrderIds.value.length === filteredOrders.value.length && filteredOrders.value.length > 0,
      set: (value) => {
        selectedOrderIds.value = value ? filteredOrders.value.map(o => o.id) : [];
      }
    });

    const todaysOrderTotal = computed(() =>
      orders.value.filter(order => order.date === 'Nov 16, 2025').length
    );

    const pendingTotal = computed(() =>
      orders.value.filter(order => order.status === 'Pending').length
    );

    const revenueWaiting = computed(() =>
      orders.value
        .filter(order => order.status === 'Pending')
        .reduce((sum, order) => sum + parseFloat(order.total), 0)
        .toFixed(2)
    );

    const totalSalesThisMonth = computed(() =>
      orders.value
        .filter(order => order.status === 'Completed' && order.date.includes('Nov'))
        .reduce((sum, order) => sum + parseFloat(order.total), 0)
        .toFixed(2)
    );

    const filteredOrders = computed(() => {
      let filtered = orders.value;

      if (searchQuery.value) {
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          o.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          o.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(o => 
          o.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }

      if (dateFilter.value === 'today') {
        filtered = filtered.filter(o => o.date === 'Nov 16, 2025');
      }

      return filtered;
    });

    function toggleDropdown(id) {
      dropdownVisible.value = dropdownVisible.value === id ? null : id;
    }

    function updateStatus(order, status) {
      order.status = status;
      dropdownVisible.value = null;
      alert(`Order ${order.id} status updated to ${status}`);
    }

    function viewOrderDetails(order) {
      selectedOrder.value = order;
      showDetailsModal.value = true;
    }

    function closeDetailsModal() {
      showDetailsModal.value = false;
      selectedOrder.value = null;
    }

    function deleteOrder(id) {
      if (confirm('Are you sure you want to delete this order?')) {
        orders.value = orders.value.filter(o => o.id !== id);
        selectedOrderIds.value = selectedOrderIds.value.filter(sid => sid !== id);
        alert('Order deleted successfully!');
      }
    }

    function bulkDeleteOrders() {
      const count = selectedOrderIds.value.length;
      if (count === 0) {
        alert('Please select at least one order to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected order(s)?`)) {
        orders.value = orders.value.filter(o => !selectedOrderIds.value.includes(o.id));
        selectedOrderIds.value = [];
        alert(`${count} order(s) deleted successfully!`);
      }
    }

    function printOrder(order) {
      alert(`Printing invoice for order ${order.id}...`);
    }

    function exportOrders() {
      alert('Exporting orders...');
    }

    function printOrders() {
      alert('Printing all orders...');
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    return {
      adminName,
      notifications,
      searchQuery,
      statusFilter,
      dateFilter,
      dropdownVisible,
      showDetailsModal,
      selectedOrder,
      orders,
      selectedOrderIds,
      availableStatuses,
      selectAll,
      todaysOrderTotal,
      pendingTotal,
      revenueWaiting,
      totalSalesThisMonth,
      filteredOrders,
      toggleDropdown,
      updateStatus,
      viewOrderDetails,
      closeDetailsModal,
      deleteOrder,
      bulkDeleteOrders,
      printOrder,
      exportOrders,
      printOrders,
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
.stat-icon.red { background: #ffebee; }

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

.manage-icon{
  width: 20px;
  height: 20px;
}

.order-content {
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

.order-id-cell {
  font-weight: 600;
  color: #0b6cf0;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 500;
  color: #212529;
}

.customer-email {
  font-size: 12px;
  color: #6c757d;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date {
  color: #212529;
}

.time {
  font-size: 12px;
  color: #6c757d;
}

.items-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #e6f0ff;
  color: #0b6cf0;
  font-weight: 500;
}

.price-cell {
  font-weight: 600;
  color: #212529;
}

.payment-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.payment-badge.credit {
  background: #e6f0ff;
  color: #0b6cf0;
}

.payment-badge.paypal {
  background: #fff3e0;
  color: #f59e0b;
}

.payment-badge.cash {
  background: #d4edda;
  color: #28a745;
}

.payment-badge.credit-card {
  background: #e6f0ff;
  color: #0b6cf0;
}

.status-dropdown {
  position: relative;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f59e0b;
}

.status-badge.processing {
  background: #e6f0ff;
  color: #0b6cf0;
}

.status-badge.completed {
  background: #d4edda;
  color: #28a745;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #dc3545;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 2px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 120px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #495057;
  font-size: 13px;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
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

.btn-icon-black{
  width: 15px;
  height: 15px;
}

.view-btn:hover {
  border-color: #0b6cf0;
  background: #e6f0ff;
}

.print-btn:hover {
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
  max-width: 900px;
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
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #212529;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6c757d;
  font-weight: normal;
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

.details-section {
  margin-bottom: 30px;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #212529;
}

.order-items {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.item-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 16px;
  background: #f8f9fa;
  font-weight: 600;
  font-size: 13px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 16px;
  align-items: center;
  border-top: 1px solid #e9ecef;
}

.item-product {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-weight: 500;
  color: #212529;
  font-size: 14px;
}

.item-sku {
  font-size: 12px;
  color: #6c757d;
}

.item-price,
.item-quantity,
.item-subtotal {
  color: #495057;
  font-size: 14px;
}

.item-subtotal {
  font-weight: 600;
}

.summary-box {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.summary-row.total {
  border-top: 2px solid #dee2e6;
  margin-top: 8px;
  padding-top: 16px;
  font-size: 16px;
  font-weight: 600;
}

.summary-label {
  color: #6c757d;
}

.summary-value {
  color: #212529;
  font-weight: 500;
}

.summary-row.total .summary-label,
.summary-row.total .summary-value {
  color: #0b6cf0;
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

  .info-grid {
    grid-template-columns: 1fr;
  }

  .item-header,
  .item-row {
    grid-template-columns: 1fr;
    gap: 10px;
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

.btn-danger {
  width: 500px;
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.selected-info {
  color: #0b6cf0;
  font-weight: 600;
}

</style>