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
            <span class="breadcrumb-item active">Manage Coupons</span>
          </div>
        </div>

        <div class="page-header">
          <div class="header-left">
            <h1 class="page-title">Manage Coupons</h1>
            <p class="page-subtitle">Create and manage discount coupons for your store</p>
          </div>
          <div class="header-actions">
            <button @click="showAddModal = true" class="btn btn-primary">
              <img class="btn-icon" src="/addIcon.png" alt="Add">
              Add Coupon
            </button>
          </div>
        </div>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon blue">
              <img class="manage-icon" src="/couponIcon.png" alt="">
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Coupons</p>
              <h2 class="stat-value">{{ coupons.length }}</h2>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <img class="manage-icon" src="/verifiedIcon.png" alt="">
            </div>
            <div class="stat-info">
              <p class="stat-label">Active Coupons</p>
              <h2 class="stat-value">{{ activeCoupons }}</h2>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <img class="manage-icon" src="/alertIcon.png" alt="">
            </div>
            <div class="stat-info">
              <p class="stat-label">Expiring Soon</p>
              <h2 class="stat-value">{{ expiringSoon }}</h2>
            </div>
          </div>
        </div>

        <div class="coupon-content">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Expiry Date</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th class="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coupon in coupons" :key="coupon.id" class="table-row">
                  <td>
                    <div class="coupon-code-cell">
                      <span class="code-badge">{{ coupon.code }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="discount-value">
                      {{ coupon.type === 'percentage' ? coupon.value + '%' : '$' + coupon.value }}
                    </span>
                  </td>
                  <td>
                    <span class="type-badge">{{ coupon.type }}</span>
                  </td>
                  <td class="date-cell">
                    <span :class="{ 
                      'text-danger': isExpired(coupon.expiryDate),
                      'text-warning': isExpiringSoon(coupon.expiryDate) 
                    }">
                      {{ formatDate(coupon.expiryDate) }}
                    </span>
                  </td>
                  <td>
                    <div class="usage-info">
                      <span>{{ coupon.usedCount || 0 }} / {{ coupon.maxUses || '∞' }}</span>
                      <div v-if="coupon.maxUses" class="usage-bar">
                        <div class="usage-fill" :style="{ width: (coupon.usedCount / coupon.maxUses * 100) + '%' }"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="coupon.active ? 'active' : 'inactive'">
                      <span class="status-dot"></span>
                      {{ coupon.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editCoupon(coupon)" class="action-btn edit-btn" title="Edit">
                        <img class="btn-icon-black" src="/editIcon.png" alt="Edit">
                      </button>
                      <button @click="toggleStatus(coupon)" class="action-btn" title="Toggle Status">
                        <img class="btn-icon-black" :src="coupon.active ? '/pauseIcon.png' : '/playIcon.png'" alt="Toggle">
                      </button>
                      <button @click="deleteCoupon(coupon.id)" class="action-btn delete-btn" title="Delete">
                        <img class="btn-icon-black" src="/deleteIcon.png" alt="Delete">
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="coupons.length === 0" class="empty-state">
              <div class="empty-content">
                <span class="empty-icon">🎟️</span>
                <p>No coupons found</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-container">
            <div class="modal-header">
              <h3>{{ editingCoupon ? 'Edit Coupon' : 'Add New Coupon' }}</h3>
              <button class="close-btn" @click="closeModal">✕</button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="saveCoupon" class="coupon-form">
                <div class="form-row two-col">
                <div class="form-group">
                    <label>Coupon Code <span class="required">*</span></label>
                    <input 
                      v-model="form.code" 
                      type="text" 
                      placeholder="e.g., FASH50"
                      required
                      :style="{ textTransform: 'uppercase' }"
                      class="form-input"
                      :class="{ 'error': codeError }"
                      @input="form.code = form.code.toUpperCase()"
                    />
                    <span v-if="codeError" class="form-error">{{ codeError }}</span>
                    <span v-else class="form-hint">Use uppercase letters and numbers</span>
                  </div>

                  <div class="form-group">
                    <label>Discount Type <span class="required">*</span></label>
                    <select v-model="form.type" class="form-input" required>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                </div>

                <div class="form-row two-col">
                  <div class="form-group">
                    <label>Discount Value <span class="required">*</span></label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">{{ form.type === 'percentage' ? '%' : '$' }}</span>
                      <input 
                        v-model.number="form.value" 
                        type="number" 
                        class="form-input with-prefix"
                        :min="1"
                        :max="form.type === 'percentage' ? 100 : undefined"
                        step="0.01"
                        required
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Expiry Date <span class="required">*</span></label>
                    <input 
                      v-model="form.expiryDate" 
                      type="date" 
                      class="form-input"
                      :class="{ 'error': dateError }"
                      :min="minDate"
                      required
                    >
                    <span v-if="dateError" class="form-error">{{ dateError }}</span>
                  </div>
                </div>

                <div class="form-row two-col">
                  <div class="form-group">
                    <label>Max Uses</label>
                    <input 
                      v-model.number="form.maxUses" 
                      type="number" 
                      class="form-input"
                      placeholder="Unlimited"
                      min="1"
                    >
                    <span class="form-hint">Leave empty for unlimited uses</span>
                  </div>

                  <div class="form-group">
                    <label>Min Purchase Amount ($)</label>
                    <input 
                      v-model.number="form.minPurchase" 
                      type="number" 
                      class="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    >
                  </div>
                </div>
                
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!!dateError || !!codeError">
              {{ editingCoupon ? 'Update Coupon' : 'Create Coupon' }}
            </button>
          </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AdminHeader from '@/components/AdminHeader.vue';
import AdminSidebar from '@/components/AdminSidebar.vue';

export default {
  name: "CouponView",
  components: {
    AdminHeader,
    AdminSidebar
  },
  data() {
    return {
      adminName: 'Admin',
      notifications: 0,
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
          code: 'SUMMER25',
          type: 'percentage',
          value: 25,
          expiryDate: '2026-02-28',
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
          expiryDate: '2026-12-31',
          maxUses: null,
          usedCount: 230,
          minPurchase: 30,
          active: true
        },
        {
          id: 3,
          code: 'FLASH50',
          type: 'percentage',
          value: 50,
          expiryDate: '2026-01-20',
          maxUses: 50,
          usedCount: 48,
          minPurchase: 100,
          active: true
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
    handleSettingsClick() {
      this.$router.push('/settings');
    },
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
          ...this.form,
          code: this.form.code.toUpperCase()
        };
      } else {
        this.coupons.push({
          id: Date.now(),
          ...this.form,
          code: this.form.code.toUpperCase(),
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
        const index = this.coupons.findIndex(c => c.id === id);
        if (index !== -1) {
          this.coupons.splice(index, 1);
        }
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

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.manage-icon {
  width: 20px;
  height: 20px;
}

.coupon-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.table-wrapper {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
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

.action-col {
  width: 150px;
}

.coupon-code-cell {
  display: flex;
  align-items: center;
}

.code-badge {
  background: #0b6cf0;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  letter-spacing: 0.5px;
}

.discount-value {
  font-weight: 700;
  font-size: 16px;
  color: #28a745;
}

.type-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  background: #e6f0ff;
  color: #0b6cf0;
  font-weight: 500;
  text-transform: capitalize;
}

.date-cell {
  color: #495057;
  font-size: 13px;
}

.text-danger {
  color: #dc3545 !important;
  font-weight: 600;
}

.text-warning {
  color: #f59e0b !important;
  font-weight: 600;
}

.usage-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.usage-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  width: 100px;
}

.usage-fill {
  height: 100%;
  background: #0b6cf0;
  transition: width 0.3s;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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

.btn-icon-black {
  width: 15px;
  height: 15px;
}

.edit-btn:hover {
  border-color: #0b6cf0;
  background: #e6f0ff;
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

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
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
  max-width: 600px;
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
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #212529;
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

.coupon-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  margin-bottom: 0;
}

.form-row.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.required {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #0b6cf0;
  box-shadow: 0 0 0 3px rgba(11, 108, 240, 0.1);
}

.form-input.error {
  border-color: #dc3545;
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 12px;
  color: #6c757d;
  font-weight: 600;
  z-index: 1;
}

.form-input.with-prefix {
  padding-left: 32px;
}

.form-hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #6c757d;
}

.form-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #dc3545;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  background: #f8f9fa;
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
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: #0b6cf0;
  border-color: #0b6cf0;
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
  color: #495057;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>