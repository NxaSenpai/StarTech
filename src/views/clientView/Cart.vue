<template>
  <div class="cart-page">
    <Header />
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">Shopping Cart</h1>
          <p class="page-subtitle">Review your items and proceed to checkout</p>
        </div>

        <div v-if="Cart_data.length === 0" class="empty-state">
          <div class="empty-content">
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart</p>
            <button class="shop-btn" @click="$router.push('/products')">
              Browse Products
            </button>
          </div>
        </div>

        <div v-else class="cart-layout">
          <div class="cart-items-section">
            <div class="section-header">
              <h2 class="section-title">Cart Items ({{ Cart_data.length }})</h2>
            </div>

            <div class="items-list">
              <div 
                v-for="item in Cart_data" 
                :key="item.id"
                class="cart-item"
              >
                <div class="item-image-wrapper">
                  <img :src="getImageUrl(item.image)" :alt="item.name" class="item-image">
                </div>

                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-price">${{ item.price.toFixed(2) }}</p>
                </div>

                <div class="item-actions">
                  <div class="quantity-controls">
                    <button 
                      class="qty-btn" 
                      @click="updateQty(item.id, item.qty - 1)"
                      :disabled="item.qty <= 1"
                    >-</button>
                    <input 
                      type="number" 
                      v-model.number="item.qty" 
                      @change="updateQty(item.id, item.qty)"
                      class="qty-input"
                      min="1"
                    />
                    <button 
                      class="qty-btn" 
                      @click="updateQty(item.id, item.qty + 1)"
                    >+</button>
                  </div>

                  <p class="item-subtotal">${{ (item.qty * item.price).toFixed(2) }}</p>

                  <button class="remove-btn" @click="removeItem(item.id)">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-card">
              <h2 class="summary-title">Order Summary</h2>

              <div class="summary-rows">
                <div class="summary-row">
                  <span class="summary-label">Subtotal</span>
                  <span class="summary-value">${{ subtotalAmount }}</span>
                </div>

                <div class="summary-row">
                  <span class="summary-label">Shipping</span>
                  <span class="summary-value shipping-free">Free</span>
                </div>

                <div class="summary-row">
                  <span class="summary-label">Tax (5%)</span>
                  <span class="summary-value">${{ taxAmount }}</span>
                </div>

                <div v-if="appliedCoupon" class="summary-row discount-row">
                  <span class="summary-label">
                    Discount -{{ appliedCoupon.type === 'percentage' ? appliedCoupon.value + '%' : '$' + appliedCoupon.value }}
                    <button class="remove-coupon-btn" @click="removeCoupon">×</button>
                  </span>
                  <span class="summary-value discount-value">-${{ discountAmount }}</span>
                </div>

                <div class="summary-divider"></div>

                <div class="summary-row total-row">
                  <span class="summary-label">Total</span>
                  <span class="summary-value">${{ finalTotal }}</span>
                </div>
              </div>

              <div class="coupon-section">
                <p class="coupon-label">Have a coupon code?</p>
                <div class="coupon-input-wrapper">
                  <input 
                    type="text" 
                    v-model="couponCode"
                    placeholder="Enter code" 
                    class="coupon-input"
                    :disabled="!!appliedCoupon"
                    @keyup.enter="applyCoupon"
                  >
                  <button 
                    class="apply-btn" 
                    @click="applyCoupon"
                    :disabled="!couponCode || !!appliedCoupon || applyingCoupon"
                  >
                    {{ applyingCoupon ? 'Checking...' : 'Apply' }}
                  </button>
                </div>
                <p v-if="couponError" class="coupon-error">{{ couponError }}</p>
                <p v-if="appliedCoupon" class="coupon-success">
                  Coupon applied successfully!
                </p>
              </div>

              <button class="checkout-btn" @click="proceedToCheckout">
                Proceed to Checkout
              </button>

              <div class="continue-shopping">
                <button @click="$router.push('/products')" class="continue-btn">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default {
  name: "Cart",
  components: {
    Header,
    Footer
  },
  
  data() {
    return {
      Cart_data: [],
      couponCode: '',
      appliedCoupon: null,
      couponError: '',
      applyingCoupon: false
    }
  },

  computed: {
    subtotalAmount() {
      return this.Cart_data.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ).toFixed(2);
    },
    taxAmount() {
      return (this.subtotalAmount * 0.05).toFixed(2);
    },
    discountAmount() {
      if (!this.appliedCoupon) return '0.00';
      
      const subtotal = parseFloat(this.subtotalAmount);
      let discount = 0;
      
      if (this.appliedCoupon.type === 'percentage') {
        discount = subtotal * (this.appliedCoupon.value / 100);
      } else {
        discount = this.appliedCoupon.value;
      }
      
      return Math.min(discount, subtotal).toFixed(2);
    },
    finalTotal() {
      const subtotal = parseFloat(this.subtotalAmount);
      const tax = parseFloat(this.taxAmount);
      const discount = parseFloat(this.discountAmount);
      
      return Math.max(0, subtotal + tax - discount).toFixed(2);
    }
  },

  methods: {
    getImageUrl(imageSrc) {
      if (!imageSrc) return '/placeholder.png';
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc;
      if (imageSrc.startsWith('/uploads/')) return `${API_URL}${imageSrc}`;
      if (!imageSrc.startsWith('/')) return `${API_URL}/uploads/${imageSrc}`;
      return imageSrc;
    },

    loadCart() {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          this.Cart_data = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        this.Cart_data = [];
      }
    },

    saveCart() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.Cart_data));
        window.dispatchEvent(new Event('cart-updated'));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    },

    updateQty(id, newQty) {
      if (newQty < 1) newQty = 1;
      const item = this.Cart_data.find(p => p.id === id);
      if (item) {
        item.qty = newQty;
        this.saveCart();
      }
    },

    removeItem(id) {
      const index = this.Cart_data.findIndex(p => p.id === id);
      if (index !== -1) {
        this.Cart_data.splice(index, 1);
        this.saveCart();
      }
    },

    async applyCoupon() {
      if (!this.couponCode.trim()) return;
      
      this.applyingCoupon = true;
      this.couponError = '';
      
      try {
        const response = await axios.get(`${API_URL}/coupons/validate`, {
          params: { code: this.couponCode.toUpperCase() }
        });
        
        const coupon = response.data;
        
        if (coupon.minPurchase && parseFloat(this.subtotalAmount) < coupon.minPurchase) {
          this.couponError = `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`;
          return;
        }
        
        this.appliedCoupon = coupon;
        this.couponCode = '';
        this.couponError = '';
        
      } catch (error) {
        console.error('Coupon validation error:', error);
        this.couponError = error.response?.data?.message || 'Invalid or expired coupon code';
      } finally {
        this.applyingCoupon = false;
      }
    },

    removeCoupon() {
      this.appliedCoupon = null;
      this.couponError = '';
    },

    proceedToCheckout() {
      if (this.Cart_data.length === 0) {
        alert('Your cart is empty');
        return;
      }
      
      if (this.appliedCoupon) {
        sessionStorage.setItem('appliedCoupon', JSON.stringify(this.appliedCoupon));
      } else {
        sessionStorage.removeItem('appliedCoupon');
      }
      
      this.$router.push('/checkout');
    }
  },

  mounted() {
    this.loadCart();
  }
};
</script>

<style scoped>
.cart-page {
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
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
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

.notice-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.3s ease;
  background: #fef3c7;
  color: #92400e;
  border-left: 4px solid #f59e0b;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notice-box svg {
  flex-shrink: 0;
}

.undo-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.undo-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.empty-state {
  padding: 100px 20px;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-content svg {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-content h3 {
  font-size: 1.75rem;
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
  padding: 14px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
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

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 32px;
  align-items: start;
}

.cart-items-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.cart-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.item-image-wrapper {
  width: 120px;
  height: 120px;
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

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.quantity-controls {
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 4px;
}

 .qty-btn {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #1e293b;
}

 .qty-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

 .qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

 .qty-input {
  width: 50px;
  height: 36px;
  border: none;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  background: transparent;
}

 .qty-input::-webkit-outer-spin-button,
 .qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-subtotal {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.remove-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #64748b;
}

.remove-icon {
  width: 20px;
  height: 20px;
}

.remove-btn:hover {
  background: #fee2e2;
  border-color: #ef4444;
  color: #ef4444;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 140px;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  font-size: 1rem;
}

.summary-label {
  color: #64748b;
  font-weight: 500;
}

.remove-coupon-btn {
  margin-left: 8px;
  background: #e1eaff;
  border: none;
  border-radius: 30px;
  color: black;
  font-size: 1.25rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  text-align: center;
  transition: all 0.3s;
}

.remove-coupon-btn:hover {
  background: #ffbebe;
  border: solid 1px #f63b3b;
  color: rgb(0, 0, 0);
}

.summary-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 1.125rem;
}

.shipping-free {
  color: #10b981;
  font-weight: 700;
}

.summary-divider {
  height: 2px;
  background: #f1f5f9;
  margin: 8px 0;
}

.total-row {
  padding-top: 8px;
}

.total-row .summary-label,
.total-row .summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.coupon-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.coupon-label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 12px;
  font-weight: 500;
}

.coupon-input-wrapper {
  display: flex;
  gap: 8px;
}

.coupon-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.3s;
}

.coupon-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.coupon-success {
  color: #10b981;
  font-size: 0. nine five rem;
  margin-top: 8px;
  font-weight: 500;
}

.coupon-error {
  color: #ef4444;
  font-size: 0. nine five rem;
  margin-top: 8px;
  font-weight: 500;
}

.apply-btn {
  padding: 10px 20px;
  background: #f8fafc;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}



.apply-btn:hover {
  background: #3b82f6;
  color: white;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.checkout-btn:hover {
  background: #2563eb;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.continue-shopping {
  margin-top: 16px;
  text-align: center;
}

.continue-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-btn:hover {
  color: #3b82f6;
  gap: 12px;
}


@media (max-width: 1200px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px 60px;
  }

  .page-title {
    font-size: 2rem;
  }

  .cart-items-section {
    padding: 24px 20px;
  }

  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }

  .item-image-wrapper {
    width: 80px;
    height: 80px;
  }

  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .summary-card {
    padding: 24px 20px;
  }

  .cart-summary {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .cart-item {
    padding: 16px;
  }

  .item-name {
    font-size: 0.95rem;
  }

  .quantity-controls {
    flex: 1;
  }
}
</style>