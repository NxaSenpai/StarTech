<template>
  <div class="order-page">
    <Header />
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">My Orders</h1>
          <p class="page-subtitle">View and manage your order history</p>
        </div>

        <div v-if="filteredOrders.length > 0" class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="order-item"
            @click="openOrderModal(order)"
          >
            <div class="order-item-header">
              <div class="order-item-id">
                <span class="id-label">Order #</span>
                <span class="id-value">{{ order.id }}</span>
              </div>
              <span :class="['status-badge', order.status]">
                <span class="status-dot"></span>
                {{ formatStatus(order.status) }}
              </span>
            </div>

            <div class="order-item-body">
              <div class="order-products">
                <div class="product-images">
                  <div 
                    v-for="(item, index) in order.items.slice(0, 3)" 
                    :key="index"
                    class="product-thumb"
                  >
                    <img :src="item.image" :alt="item.name">
                  </div>
                  <div v-if="order.items.length > 3" class="more-badge">
                    +{{ order.items.length - 3 }}
                  </div>
                </div>
                <div class="product-summary">
                  <p class="product-count">{{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}</p>
                  <p class="product-preview">{{ getProductPreview(order) }}</p>
                </div>
              </div>

              <div class="order-item-details">
                <div class="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{{ order.date }}</span>
                </div>
                <div class="detail-item price-highlight">
                  <span>${{ order.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="order-item-footer">
              <button class="view-btn" @click.stop="openOrderModal(order)">
                View Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <h3>No orders found</h3>
            <p>{{ searchQuery ? 'Try adjusting your search or filters' : 'Start shopping to see your orders here' }}</p>
            <button class="shop-btn" @click="$router.push('/products')">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title">Order #{{ selectedOrder.id }}</h2>
            <span :class="['status-badge', selectedOrder.status]">
              <span class="status-dot"></span>
              {{ formatStatus(selectedOrder.status) }}
            </span>
          </div>
          <button class="close-btn" @click="closeOrderModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="timeline-section">
            <h3 class="section-title">Order Timeline</h3>
            <div class="timeline">
              <div 
                v-for="(step, index) in orderTimeline" 
                :key="index"
                :class="['timeline-item', { active: step.completed, current: step.current }]"
              >
                <div class="timeline-marker">
                  <div class="timeline-dot"></div>
                </div>
                <div class="timeline-content">
                  <p class="timeline-label">{{ step.label }}</p>
                  <p v-if="step.date" class="timeline-date">{{ step.date }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="items-section">
            <h3 class="section-title">Order Items</h3>
            <div class="modal-items-list">
              <div 
                v-for="item in selectedOrder.items" 
                :key="item.id"
                class="modal-item-row"
              >
                <div class="item-image-wrapper">
                  <img :src="item.image" :alt="item.name" class="item-image">
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-qty">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  <span class="price-amount">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Information Grid -->
          <div class="info-grid">
            <div class="info-card">
              <h3 class="info-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Delivery Address
              </h3>
              <p class="info-content">{{ selectedOrder.delivery.address }}</p>
              <p class="info-content">{{ selectedOrder.delivery.city }}</p>
            </div>

            <div class="info-card">
              <h3 class="info-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Payment Method
              </h3>
              <p class="info-content">{{ selectedOrder.payment }}</p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="modal-summary">
            <h3 class="section-title">Order Summary</h3>
            <div class="summary-rows">
              <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">${{ selectedOrder.subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Delivery</span>
                <span class="summary-value">${{ selectedOrder.delivery.fee.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Tax</span>
                <span class="summary-value">${{ selectedOrder.tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label">Total</span>
                <span class="summary-value">${{ selectedOrder.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="footer-btn secondary" @click="closeOrderModal">Close</button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';

export default {
  name: 'MyOrder',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'all',
      dateFilter: 'all',
      selectedOrder: null,
      orders: [
        {
          id: '932512742319015',
          date: 'Dec 21, 2025',
          status: 'processing',
          items: [
            {
              id: 1,
              name: '15.6" FHD Display Laptop – Intel i7 – Intel HD Graphics 6000',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop',
              price: 999.00,
              quantity: 1
            }
          ],
          payment: 'Visa **69',
          delivery: {
            address: '812 Khan Mean Chey, Phnom Penh',
            city: 'Cambodia',
            fee: 0
          },
          subtotal: 999.00,
          tax: 49.95,
          total: 1048.95
        },
        {
          id: '932512742319016',
          date: 'Dec 18, 2025',
          status: 'delivered',
          items: [
            {
              id: 1,
              name: 'Wireless Bluetooth Headphones Pro Max',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
              price: 299.00,
              quantity: 2
            },
            {
              id: 2,
              name: 'Smart Watch Series 7 GPS',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
              price: 449.00,
              quantity: 1
            }
          ],
          payment: 'Mastercard **42',
          delivery: {
            address: '812 Khan Mean Chey, Phnom Penh',
            city: 'Cambodia',
            fee: 5.00
          },
          subtotal: 1047.00,
          tax: 52.35,
          total: 1104.35
        },
        {
          id: '932512742319017',
          date: 'Dec 15, 2025',
          status: 'shipped',
          items: [
            {
              id: 1,
              name: '4K Ultra HD Smart TV 55 inch',
              image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop',
              price: 799.00,
              quantity: 1
            }
          ],
          payment: 'PayPal',
          delivery: {
            address: '812 Khan Mean Chey, Phnom Penh',
            city: 'Cambodia',
            fee: 15.00
          },
          subtotal: 799.00,
          tax: 39.95,
          total: 853.95
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;

      // Filter by status
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => {
          const idMatch = order.id.toLowerCase().includes(query);
          const itemsMatch = order.items.some(item => 
            item.name.toLowerCase().includes(query)
          );
          return idMatch || itemsMatch;
        });
      }

      return filtered;
    },
    orderTimeline() {
      if (!this.selectedOrder) return [];
      
      const status = this.selectedOrder.status;
      return [
        { label: 'Order Placed', completed: true, date: this.selectedOrder.date },
        { label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status), current: status === 'processing' },
        { label: 'Shipped', completed: ['shipped', 'delivered'].includes(status), current: status === 'shipped' },
        { label: 'Delivered', completed: status === 'delivered', current: status === 'delivered' }
      ];
    }
  },
  methods: {
    formatStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    getProductPreview(order) {
      const firstItem = order.items[0].name;
      if (order.items.length === 1) return firstItem;
      return `${firstItem} and ${order.items.length - 1} more`;
    },
    openOrderModal(order) {
      this.selectedOrder = order;
      document.body.style.overflow = 'hidden';
    },
    closeOrderModal() {
      this.selectedOrder = null;
      document.body.style.overflow = '';
    }
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
}
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 20px 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: left;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

/* Controls Section */
.controls-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.order-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.order-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.order-item-id {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.id-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.id-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipped {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.processing .status-dot {
  animation: pulse 2s infinite;
}

.order-item-body {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.order-products {
  display: flex;
  gap: 16px;
  flex: 1;
}

.product-images {
  display: flex;
  gap: 8px;
}

.product-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-badge {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.product-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
}

.product-preview {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.order-item-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
}

.detail-item svg {
  color: #94a3b8;
}

.price-highlight {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.order-item-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 2px solid #f1f5f9;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn:hover {
  background: #2563eb;
}

/* Empty State */
.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-content svg {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}

.empty-content p {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 32px;
}

.shop-btn {
  padding: 12px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.shop-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #64748b;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
}

.timeline-section {
  margin-bottom: 32px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
  padding-bottom: 24px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-item.active::before {
  background: #3b82f6;
}

.timeline-marker {
  flex-shrink: 0;
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 4px solid white;
  box-shadow: 0 0 0 2px #e2e8f0;
  transition: all 0.3s;
}

.timeline-item.active .timeline-dot {
  background: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
}

.timeline-item.current .timeline-dot {
  animation: pulse 2s infinite;
}

.timeline-content {
  flex: 1;
  padding-top: 2px;
}

.timeline-label {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 4px;
}

.timeline-item.active .timeline-label {
  color: #1e293b;
}

.timeline-date {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
}

/* Modal Items */
.items-section {
  margin-bottom: 32px;
}

.modal-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-item-row {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  align-items: center;
}

.item-image-wrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
  line-height: 1.5;
}

.item-qty {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.item-price {
  flex-shrink: 0;
}

.price-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: #3b82f6;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.info-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
}

.info-title svg {
  color: #3b82f6;
}

.info-content {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 4px;
  line-height: 1.6;
}

/* Modal Summary */
.modal-summary {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.summary-label {
  color: #64748b;
  font-weight: 500;
}

.summary-value {
  color: #1e293b;
  font-weight: 600;
}

.total-row {
  padding-top: 12px;
  margin-top: 8px;
  border-top: 2px solid #cbd5e1;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

/* Modal Footer */
.modal-footer {
  padding: 20px 32px;
  border-top: 2px solid #f1f5f9;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.footer-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.footer-btn.secondary {
  background: #f1f5f9;
  color: #64748b;
}

.footer-btn.secondary:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.footer-btn.primary {
  background: #3b82f6;
  color: white;
}

.footer-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .controls-section {
    flex-direction: column;
  }

  .filter-group {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .order-item-body {
    flex-direction: column;
  }

  .order-item-details {
    align-items: flex-start;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-title-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .modal-item-row {
    flex-direction: column;
    text-align: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }

  .product-images {
    flex-wrap: wrap;
  }
}
</style>