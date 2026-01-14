<template>
  <div class="coupon-management">
    <div class="header">
      <div class="header-content">
        <h1>Coupon Management</h1>
        <p class="subtitle">Create and manage discount coupons for your store</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">
        Add New Coupon
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <p class="stat-label">Total Coupons</p>
          <p class="stat-value">{{ coupons.length }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <p class="stat-label">Active Coupons</p>
          <p class="stat-value">{{ activeCoupons }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <p class="stat-label">Expiring Soon</p>
          <p class="stat-value">{{ expiringSoon }}</p>
        </div>
      </div>
    </div>

    <!-- Coupons List -->
    <div class="coupons-grid">
      <div v-for="coupon in coupons" :key="coupon.id" 
           :class="['coupon-card', { expired: isExpired(coupon.expiryDate), 'expiring-soon': isExpiringSoon(coupon.expiryDate) }]">
        <div class="coupon-ribbon" v-if="isExpired(coupon.expiryDate)">
          <span>Expired</span>
        </div>
        <div class="coupon-ribbon warning" v-else-if="isExpiringSoon(coupon.expiryDate)">
          <span>Expiring Soon</span>
        </div>
        
        <div class="coupon-header">
          <div class="code-badge">
            <span class="code-text">{{ coupon.code }}</span>
          </div>
          <span :class="['status-badge', coupon.active ? 'active' : 'inactive']">
            <span class="status-dot"></span>
            {{ coupon.active ? 'Active' : 'Inactive' }}
          </span>
        </div>
        
        <div class="discount-display">
          <div class="discount-value">
            {{ coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}` }}
          </div>
          <div class="discount-label">OFF</div>
        </div>

        <div class="coupon-details">
          <div class="detail-item">
            <div class="detail-content">
              <span class="detail-label">Expires</span>
              <span class="detail-value" :class="{ 'text-danger': isExpired(coupon.expiryDate), 'text-warning': isExpiringSoon(coupon.expiryDate) }">
                {{ formatDate(coupon.expiryDate) }}
              </span>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-content">
              <span class="detail-label">Usage</span>
              <span class="detail-value">
                {{ coupon.usedCount }} / {{ coupon.maxUses || '50' }}
              </span>
            </div>
          </div>

          <div class="detail-item" v-if="coupon.minPurchase">
            <div class="detail-content">
              <span class="detail-label">Min Purchase</span>
              <span class="detail-value">${{ coupon.minPurchase }}</span>
            </div>
          </div>
        </div>

        <div class="progress-bar" v-if="coupon.maxUses">
          <div class="progress-fill" :style="{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }"></div>
        </div>

        <div class="coupon-actions">
          <button @click="editCoupon(coupon)" class="btn-action btn-edit">
            Edit
          </button>
          <button @click="toggleStatus(coupon)" class="btn-action btn-toggle">
            {{ coupon.active ? 'Deactivate' : 'Activate' }}
          </button>
          <button @click="deleteCoupon(coupon.id)" class="btn-action btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingCoupon ? 'Edit Coupon' : 'Create New Coupon' }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="saveCoupon" class="coupon-form">
          <div class="form-row">
            <div class="form-group">
              <label>Coupon Code <span class="required">*</span></label>
              <input 
                v-model="form.code" 
                type="text" 
                placeholder="e.g., SAVE20"
                required
                class="form-input"
                @input="form.code = form.code.toUpperCase()"
              />
              <span class="form-hint">Use uppercase letters and numbers</span>
            </div>
          </div>

          <div class="form-row two-col">
            <div class="form-group">
              <label>Discount Type <span class="required">*</span></label>
              <select v-model="form.type" required class="form-input">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Discount Value <span class="required">*</span></label>
              <div class="input-with-prefix">
                <span class="input-prefix">{{ form.type === 'percentage' ? '%' : '$' }}</span>
                <input 
                  v-model.number="form.value" 
                  type="number" 
                  :min="0"
                  :max="form.type === 'percentage' ? 100 : undefined"
                  step="0.01"
                  required
                  class="form-input with-prefix"
                />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Expiry Date <span class="required">*</span></label>
              <input 
                v-model="form.expiryDate" 
                type="date" 
                :min="minDate"
                required
                class="form-input"
                :class="{ 'error': dateError }"
              />
              <span v-if="dateError" class="form-error">{{ dateError }}</span>
              <span v-else class="form-hint">Coupon will expire at the end of this date</span>
            </div>
          </div>

          <div class="form-row two-col">
            <div class="form-group">
              <label>Maximum Uses</label>
              <input 
                v-model.number="form.maxUses" 
                type="number" 
                min="1"
                placeholder="Unlimited"
                class="form-input"
              />
              <span class="form-hint">Leave empty for unlimited</span>
            </div>

            <div class="form-group">
              <label>Minimum Purchase</label>
              <div class="input-with-prefix">
                <span class="input-prefix">$</span>
                <input 
                  v-model.number="form.minPurchase" 
                  type="number" 
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  class="form-input with-prefix"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="form.active" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">Set as Active</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="!!dateError">
              {{ editingCoupon ? 'Update Coupon' : 'Create Coupon' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CouponView",
  data() {
    return {
      showAddModal: false,
      editingCoupon: null,
      form: {
        code: '',
        type: 'percentage',
        value: 0,
        expiryDate: '',
        maxUses: null,
        minPurchase: null,
        active: true
      },
      coupons: [
        {
          id: 1,
          code: 'SAVE20',
          type: 'percentage',
          value: 20,
          expiryDate: '2026-12-31',
          maxUses: 100,
          usedCount: 45,
          minPurchase: 50,
          active: true
        },
        {
          id: 2,
          code: 'WELCOME10',
          type: 'fixed',
          value: 10,
          expiryDate: '2026-01-20',
          maxUses: null,
          usedCount: 128,
          minPurchase: null,
          active: true
        },
        {
          id: 3,
          code: 'EXPIRED50',
          type: 'percentage',
          value: 50,
          expiryDate: '2024-12-31',
          maxUses: 50,
          usedCount: 30,
          minPurchase: 100,
          active: false
        }
      ]
    };
  },
  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    dateError() {
      if (!this.form.expiryDate) return '';
      
      const selectedDate = new Date(this.form.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Expiry date cannot be in the past';
      }
      
      return '';
    },
    activeCoupons() {
      return this.coupons.filter(c => c.active && !this.isExpired(c.expiryDate)).length;
    },
    expiringSoon() {
      return this.coupons.filter(c => this.isExpiringSoon(c.expiryDate) && !this.isExpired(c.expiryDate)).length;
    }
  },
  methods: {
    isExpired(date) {
      const expiryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate < today;
    },
    isExpiringSoon(date) {
      const expiryDate = new Date(date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    },
    saveCoupon() {
      if (this.dateError) return;
      
      if (this.editingCoupon) {
        const index = this.coupons.findIndex(c => c.id === this.editingCoupon.id);
        this.coupons[index] = { 
          ...this.editingCoupon, 
          ...this.form 
        };
      } else {
        this.coupons.push({
          id: Date.now(),
          ...this.form,
          usedCount: 0
        });
      }
      this.closeModal();
    },
    editCoupon(coupon) {
      this.editingCoupon = coupon;
      this.form = { ...coupon };
      this.showAddModal = true;
    },
    deleteCoupon(id) {
      if (confirm('Are you sure you want to delete this coupon?')) {
        this.coupons = this.coupons.filter(c => c.id !== id);
      }
    },
    toggleStatus(coupon) {
      coupon.active = !coupon.active;
    },
    closeModal() {
      this.showAddModal = false;
      this.editingCoupon = null;
      this.form = {
        code: '',
        type: 'percentage',
        value: 0,
        expiryDate: '',
        maxUses: null,
        minPurchase: null,
        active: true
      };
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.coupon-management {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.header-content h1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.subtitle {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-left: 4px solid #4299e1;
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  margin: 0.5rem 0 0 0;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 700;
}

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.coupon-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.coupon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.coupon-card.expired {
  opacity: 0.6;
  background: #f7fafc;
}

.coupon-card.expiring-soon {
  border: 2px solid #f56565;
}

.coupon-ribbon {
  position: absolute;
  top: 15px;
  right: -35px;
  background: #e53e3e;
  color: white;
  padding: 5px 40px;
  transform: rotate(45deg);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.coupon-ribbon.warning {
  background: #ed8936;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.code-badge {
  background: #4299e1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.code-text {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1px;
  font-family: 'Courier New', monospace;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.active .status-dot {
  background: #22543d;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.inactive .status-dot {
  background: #742a2a;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.discount-display {
  text-align: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 2px dashed #cbd5e0;
}

.discount-value {
  font-size: 3rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.discount-label {
  font-size: 1rem;
  font-weight: 600;
  color: #718096;
  letter-spacing: 2px;
}

.coupon-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

.detail-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-value {
  color: #2d3748;
  font-weight: 600;
  font-size: 0.9rem;
}

.text-danger {
  color: #e53e3e !important;
}

.text-warning {
  color: #ed8936 !important;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: #4299e1;
  transition: width 0.3s;
}

.coupon-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  flex: 1;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  background: white;
  color: #4a5568;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-edit {
  color: #3182ce;
  border-color: #3182ce;
}

.btn-edit:hover {
  background: #ebf8ff;
}

.btn-toggle {
  color: #d69e2e;
  border-color: #d69e2e;
}

.btn-toggle:hover {
  background: #fefcbf;
}

.btn-delete {
  color: #e53e3e;
  border-color: #e53e3e;
}

.btn-delete:hover {
  background: #fff5f5;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: 1px solid #cbd5e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f7fafc;
  border-color: #a0aec0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a202c;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #2d3748;
}

.coupon-form {
  padding: 2rem;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-row.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.required {
  color: #e53e3e;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 0.875rem;
  color: #718096;
  font-weight: 600;
  z-index: 1;
}

.form-input.with-prefix {
  padding-left: 2.25rem;
}

.form-hint {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.8rem;
  color: #718096;
}

.form-error {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.8rem;
  color: #e53e3e;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  transition: all 0.3s;
}

.checkbox-label:hover {
  background: #edf2f7;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-input:checked + .checkbox-custom {
  background: #4299e1;
  border-color: #4299e1;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-text {
  font-weight: 500;
  color: #2d3748;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .form-row.two-col {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .coupons-grid {
    grid-template-columns: 1fr;
  }
}
</style>