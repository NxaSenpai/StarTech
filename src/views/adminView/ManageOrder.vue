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
              <p class="stat-label">Total Orders</p>
              <h3 class="stat-value">{{ orders.length }}</h3>
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
              <p class="stat-label">Processing Orders</p>
              <h3 class="stat-value">{{ processingTotal }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon green"><img class="manage-icon" src="/benefitIcon.png" alt=""></div>
            <div class="stat-info">
              <p class="stat-label">Total Revenue</p>
              <h3 class="stat-value">${{ totalRevenue.toFixed(2) }}</h3>
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
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
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
          
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading orders...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="fetchOrders">Retry</button>
          </div>

          <div v-else class="table-wrapper">
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
                    <span class="order-id">{{ order.orderNumber }}</span>
                  </td>
                  <td class="customer-cell">
                    <div class="customer-info">
                      <div class="customer-details">
                        <span class="customer-name">{{ order.customerName }}</span>
                        <span class="customer-email">{{ order.email }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="date-cell">
                    <div class="date-info">
                      <span class="date">{{ formatDate(order.createdAt) }}</span>
                      <span class="time">{{ formatTime(order.createdAt) }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="items-badge">{{ order.itemCount }} items</span>
                  </td>
                  <td class="price-cell">${{ order.total.toFixed(2) }}</td>
                  <td>
                    <span :class="['payment-badge', getPaymentClass(order.payment)]">
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
                        {{ formatStatus(order.status) }}
                        <span class="dropdown-arrow">▼</span>
                      </span>
                      <div 
                        v-if="dropdownVisible === order.id" 
                        class="dropdown-menu"
                        @click.stop
                      >
                        <button 
                          v-for="status in availableStatuses.filter(s => s.toLowerCase() !== order.status.toLowerCase())"
                          :key="status"
                          @click="updateStatus(order, status.toLowerCase())"
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

        <div v-if="showDetailsModal && selectedOrder" class="modal-overlay" @click.self="closeDetailsModal">
          <div class="modal-container large-modal">
            <div class="modal-header">
              <div>
                <h3>Order Details - {{ selectedOrder.orderNumber }}</h3>
                <p class="modal-subtitle">{{ formatDate(selectedOrder.createdAt) }} at {{ formatTime(selectedOrder.createdAt) }}</p>
              </div>
              <button class="close-btn" @click="closeDetailsModal">✕</button>
            </div>
            <div class="modal-body">
              <div class="details-section">
                <h4 class="section-title">Customer Information</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{{ selectedOrder.customerName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ selectedOrder.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">{{ selectedOrder.phone || 'N/A' }}</span>
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
                    v-for="item in selectedOrder.items" 
                    :key="item.productId" 
                    class="item-row"
                  >
                    <div class="item-product">
                      <img :src="getImageUrl(item.image)" :alt="item.name" class="item-image">
                      <div class="item-details">
                        <span class="item-name">{{ item.name }}</span>
                        <span class="item-sku">ID: {{ item.productId }}</span>
                      </div>
                    </div>
                    <span class="item-price">${{ item.price.toFixed(2) }}</span>
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
                    <span class="summary-value">${{ selectedOrder.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Delivery Fee:</span>
                    <span class="summary-value">${{ selectedOrder.deliveryFee.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Tax:</span>
                    <span class="summary-value">${{ selectedOrder.tax.toFixed(2) }}</span>
                  </div>
                  <div v-if="selectedOrder.coupon" class="summary-row discount-row">
                    <span class="summary-label">
                      Discount ({{ selectedOrder.coupon.code }}):
                    </span>
                    <span class="summary-value">-${{ selectedOrder.coupon.discountAmount.toFixed(2) }}</span>
                  </div>
                  <div class="summary-row total">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value">${{ selectedOrder.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Payment Method:</span>
                    <span :class="['payment-badge', getPaymentClass(selectedOrder.payment)]">
                      {{ selectedOrder.payment }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Order Status:</span>
                    <span :class="['status-badge', selectedOrder.status.toLowerCase()]">
                      <span class="status-dot"></span>
                      {{ formatStatus(selectedOrder.status) }}
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
import { ref, computed, onMounted } from 'vue';
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

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
    const dropdownVisible = ref(null);
    const showDetailsModal = ref(false);
    const selectedOrder = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const orders = ref([]);
    const selectedOrderIds = ref([]);
    const availableStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const selectAll = computed({
      get: () => selectedOrderIds.value.length === filteredOrders.value.length && filteredOrders.value.length > 0,
      set: (value) => {
        selectedOrderIds.value = value ? filteredOrders.value.map(o => o.id) : [];
      }
    });

    const pendingTotal = computed(() =>
      orders.value.filter(order => order.status === 'pending').length
    );

    const processingTotal = computed(() =>
      orders.value.filter(order => order.status === 'processing').length
    );

    const totalRevenue = computed(() =>
      orders.value
        .filter(order => ['delivered', 'processing', 'shipped'].includes(order.status))
        .reduce((sum, order) => sum + parseFloat(order.total), 0)
    );

    const filteredOrders = computed(() => {
      let filtered = orders.value;

      if (searchQuery.value) {
        filtered = filtered.filter(o => 
          o.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          o.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(o => 
          o.status.toLowerCase() === statusFilter.value.toLowerCase()
        );
      }

      return filtered;
    });

    async function fetchOrders() {
      loading.value = true;
      error.value = null;

      try {
        const response = await axios.get(`${API_URL}/orders/all`);
        
        console.log('Admin orders response:', response.data);
        
        orders.value = response.data.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.userName || 'Guest',
          email: order.userEmail,
          phone: order.delivery?.phone || 'N/A',
          address: `${order.delivery?.address}, ${order.delivery?.city}`,
          createdAt: order.createdAt,
          itemCount: order.items?.length || 0,
          items: order.items || [],
          total: order.total,
          subtotal: order.subtotal,
          tax: order.tax,
          deliveryFee: order.deliveryFee,
          payment: order.payment,
          status: order.status,
          coupon: order.coupon || null
        }));
        
        console.log('Transformed admin orders:', orders.value);
      } catch (err) {
        console.error('Error fetching orders:', err);
        error.value = err.response?.data?.message || 'Failed to load orders';
      } finally {
        loading.value = false;
      }
    }

    function getImageUrl(imageSrc) {
      if (!imageSrc) return '/placeholder.png';
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc;
      if (imageSrc.startsWith('/uploads/')) return `${API_URL}${imageSrc}`;
      if (!imageSrc.startsWith('/')) return `${API_URL}/uploads/${imageSrc}`;
      return imageSrc;
    }

    function formatDate(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return dateString;
      }
    }

    function formatTime(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch {
        return '';
      }
    }

    function formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function getPaymentClass(payment) {
      const normalized = payment.toLowerCase().replace(/\s+/g, '-');
      return normalized;
    }

    function toggleDropdown(id) {
      dropdownVisible.value = dropdownVisible.value === id ? null : id;
    }

    async function updateStatus(order, newStatus) {
      try {
        await axios.patch(`${API_URL}/orders/${order.id}/status`, { 
          status: newStatus 
        });
        
        order.status = newStatus;
        dropdownVisible.value = null;
        
        await fetchOrders();
      } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update order status');
      }
    }

    function viewOrderDetails(order) {
      selectedOrder.value = order;
      showDetailsModal.value = true;
    }

    function closeDetailsModal() {
      showDetailsModal.value = false;
      selectedOrder.value = null;
    }

    async function deleteOrder(id) {
      if (confirm('Are you sure you want to delete this order?')) {
        try {
          await axios.delete(`${API_URL}/orders/${id}`);
          
          orders.value = orders.value.filter(o => o.id !== id);
          selectedOrderIds.value = selectedOrderIds.value.filter(sid => sid !== id);
        } catch (err) {
          console.error('Error deleting order:', err);
          alert('Failed to delete order');
        }
      }
    }

    async function bulkDeleteOrders() {
      const count = selectedOrderIds.value.length;
      if (count === 0) {
        alert('Please select at least one order to delete.');
        return;
      }

      if (confirm(`Are you sure you want to delete ${count} selected order(s)?`)) {
        try {
          await Promise.all(
            selectedOrderIds.value.map(id => axios.delete(`${API_URL}/orders/${id}`))
          );
          
          orders.value = orders.value.filter(o => !selectedOrderIds.value.includes(o.id));
          selectedOrderIds.value = [];
        } catch (err) {
          console.error('Error deleting orders:', err);
          alert('Failed to delete some orders');
        }
      }
    }

    function handleSettingsClick() {
      console.log('Settings clicked');
    }

    onMounted(() => {
      fetchOrders();
    });

    return {
      adminName,
      notifications,
      searchQuery,
      statusFilter,
      dropdownVisible,
      showDetailsModal,
      selectedOrder,
      loading,
      error,
      orders,
      selectedOrderIds,
      availableStatuses,
      selectAll,
      pendingTotal,
      processingTotal,
      totalRevenue,
      filteredOrders,
      fetchOrders,
      getImageUrl,
      formatDate,
      formatTime,
      formatStatus,
      getPaymentClass,
      toggleDropdown,
      updateStatus,
      viewOrderDetails,
      closeDetailsModal,
      deleteOrder,
      bulkDeleteOrders,
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #0b6cf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1rem;
  color: #6c757d;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
}

.error-state p {
  font-size: 1rem;
  color: #dc3545;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 32px;
  background: #0b6cf0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #0958c9;
  transform: translateY(-2px);
}

.discount-row {
  background: #f0fdf4;
  padding: 4px 0;
  border-radius: 4px;
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

.payment-badge.cash-on-delivery {
  background: #d4edda;
  color: #28a745;
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

.status-badge.shipped {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.delivered {
  background: #d4edda;
  color: #28a745;
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