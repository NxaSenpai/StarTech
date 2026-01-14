<template>
<AdminHeader :userName="adminName" :notificationCount="notifications" />
      
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

    <!-- Coupons Table -->
    <div class="table-container">
      <table class="coupons-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Type</th>
            <th>Status</th>
            <th>Expiry Date</th>
            <th>Usage</th>
            <th>Min Purchase</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coupon in coupons" :key="coupon.id" 
              :class="{ 'expired-row': isExpired(coupon.expiryDate), 'expiring-soon-row': isExpiringSoon(coupon.expiryDate) }">
            <td>
              <div class="code-cell">
                <span class="code-badge">{{ coupon.code }}</span>
                <span v-if="isExpired(coupon.expiryDate)" class="badge badge-danger">Expired</span>
                <span v-else-if="isExpiringSoon(coupon.expiryDate)" class="badge badge-warning">Expiring Soon</span>
              </div>
            </td>
            <td class="discount-cell">
              <strong>{{ coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}` }}</strong>
            </td>
            <td>
              <span class="type-badge">{{ coupon.type === 'percentage' ? 'Percentage' : 'Fixed' }}</span>
            </td>
            <td>
              <span :class="['status-badge', coupon.active ? 'active' : 'inactive']">
                <span class="status-dot"></span>
                {{ coupon.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td :class="{ 'text-danger': isExpired(coupon.expiryDate), 'text-warning': isExpiringSoon(coupon.expiryDate) }">
              {{ formatDate(coupon.expiryDate) }}
            </td>
            <td>
              <div class="usage-cell">
                <span class="usage-text">{{ coupon.usedCount }} / {{ coupon.maxUses || 50 }}</span>
                <div class="progress-bar-small" v-if="coupon.maxUses">
                  <div class="progress-fill" :style="{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }"></div>
                </div>
              </div>
            </td>
            <td>{{ coupon.minPurchase ? `$${coupon.minPurchase}` : '-' }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editCoupon(coupon)" class="btn-icon btn-edit" title="Edit">
                  Edit
                </button>
                <button @click="toggleStatus(coupon)" class="btn-icon btn-toggle" title="Toggle Status">
                  {{ coupon.active ? 'Deactivate' : 'Activate' }}
                </button>
                <button @click="deleteCoupon(coupon.id)" class="btn-icon btn-delete" title="Delete">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
                :class="{ 'error': codeError }"
                @input="form.code = form.code.toUpperCase()"
              />
              <span v-if="codeError" class="form-error">{{ codeError }}</span>
              <span v-else class="form-hint">Use uppercase letters and numbers</span>
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
                  :min="1"
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
                placeholder="enter total usages"
                class="form-input"
              />
              <span class="form-hint"></span>
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
            <button type="submit" class="btn-primary" :disabled="!!dateError || !!codeError">
              {{ editingCoupon ? 'Update Coupon' : 'Create Coupon' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import AdminHeader from '@/components/adminHeader.vue';
import AdminSidebar from '@/components/adminSidebar.vue';
export default {
  name: "CouponView",
  components: {
    AdminHeader,
    AdminSidebar
  },
  data() {
    return {
      showAddModal: false,
      editingCoupon: null,
      form: {
        code: '',
        type: 'percentage',
        value: 1,
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
          usedCount: 100,
          minPurchase: 50,
          active: true
        },
        {
          id: 2,
          code: 'WELCOME10',
          type: 'fixed',
          value: 10,
          expiryDate: '2026-01-20',
          maxUses: 20,
          usedCount: 5,
          minPurchase: 10,
          active: true
        },
        {
          id: 3,
          code: 'EXPIRED50',
          type: 'percentage',
          value: 50,
          expiryDate: '2025-12-31',
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
      const diffDays = Math.ceil(
        (selectedDate - today) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 2) {
        return "Expiry date must be at least 2 days from today";
      }

      if (diffDays > 365) {
        return "Expiry date cannot be more than 365 days from today";
      }
      
      return '';
    },
    codeError() {
      if (!this.form.code) return '';
      
      const duplicateCoupon = this.coupons.find(c => 
        c.code === this.form.code && 
        (!this.editingCoupon || c.id !== this.editingCoupon.id)
      );
      
      if (duplicateCoupon) {
        return 'This coupon code already exists';
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
      if (this.dateError || this.codeError) return;
      
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
        value: 1,
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
  max-width: 1600px;
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

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.coupons-table {
  width: 100%;
  border-collapse: collapse;
}

.coupons-table thead {
  background: #f7fafc;
  border-bottom: 2px solid #e2e8f0;
}

.coupons-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coupons-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.coupons-table tbody tr:hover {
  background: #f7fafc;
}

.coupons-table tbody tr.expired-row {
  opacity: 0.6;
  background: #fafafa;
}

.coupons-table tbody tr.expiring-soon-row {
  background: #fffaf0;
}

.coupons-table td {
  padding: 1rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.code-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.code-badge {
  
  color: black;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

.badge {
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-danger {
  background: #fed7d7;
  color: #742a2a;
}

.badge-warning {
  background: #feebc8;
  color: #7c2d12;
}

.discount-cell {
  font-size: 1.1rem;
  color: #2d3748;
}

.type-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #4299e1;
  color: white;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
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

.usage-cell {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.usage-text {
  font-weight: 600;
  color: #2d3748;
}

.progress-bar-small {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.progress-fill {
  height: 100%;
  background: #4299e1;
  transition: width 0.3s;
}

.text-danger {
  color: #e53e3e !important;
  font-weight: 600;
}

.text-warning {
  color: #ed8936 !important;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.375rem;
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
  background: white;
  white-space: nowrap;
}

.btn-icon:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  padding-left: 20px;
  margin-right: 5px;
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

@media (max-width: 1200px) {
  .table-container {
    overflow-x: auto;
  }
  
  .coupons-table {
    min-width: 900px;
  }
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
}
</style>