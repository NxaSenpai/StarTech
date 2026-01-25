<template>
  <div class="checkout-page">
    <Header />

    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">Checkout</h1>
          <p class="page-subtitle">Complete your purchase</p>
        </div>

        <div class="checkout-layout">
          <div class="checkout-left">
            <div class="checkout-card">
              <div class="card-header">
                <h1 class="num-label">1</h1>
                <h2>Shipping Information</h2>
              </div>

              <div class="shipping-type">
                <label class="shipping-option" :class="{ active: form.shippingType === 'delivery' }">
                  <input type="radio" v-model="form.shippingType" value="delivery" />
                  <div class="option-content">
                    <img src="/deliverIcon.png" class="option-icon">
                    <div class="option-text">
                      <div class="option-title">Home Delivery</div>
                      <div class="option-desc">Delivered to your doorstep</div>
                    </div>
                  </div>
                </label>

                <label class="shipping-option" :class="{ active: form.shippingType === 'pickup' }">
                  <input type="radio" v-model="form.shippingType" value="pickup" />
                  <div class="option-content">
                    <img src="/packageIcon.png" class="option-icon">
                    <div class="option-text">
                      <div class="option-title">Store Pickup</div>
                      <div class="option-desc">Pick up from our store</div>
                    </div>
                  </div>
                </label>
              </div>

              <div class="form-grid">
                <div class="form-field full-width">
                  <label class="field-label">
                    Full Name <span class="required">*</span>
                  </label>
                  <input 
                    v-model="form.fullName" 
                    type="text"
                    class="field-input" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>

                <div class="form-field">
                  <label class="field-label">
                    Email Address <span class="required">*</span>
                  </label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    class="field-input" 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>

                <div class="form-field">
                  <label class="field-label">
                    Phone Number <span class="required">*</span>
                  </label>
                  <input 
                    v-model="form.phone" 
                    type="tel" 
                    class="field-input" 
                    placeholder="067676767" 
                    required 
                  />
                </div>

                <div class="form-field full-width">
                  <label class="field-label">
                    Street Address <span class="required">*</span>
                  </label>
                  <input 
                    v-model="form.address" 
                    type="text"
                    class="field-input" 
                    placeholder="123 Main Street, Apt 4B" 
                    required 
                  />
                </div>

                <div class="form-field">
                  <label class="field-label">
                    City <span class="required">*</span>
                  </label>
                  <input 
                    v-model="form.city" 
                    type="text"
                    class="field-input" 
                    placeholder="Phnom Penh" 
                    required 
                  />
                </div>

                <div class="form-field">
                  <label class="field-label">Postal Code</label>
                  <input 
                    v-model="form.postalCode" 
                    type="text"
                    class="field-input" 
                    placeholder="11000" 
                  />
                </div>
              </div>
            </div>

            <div class="checkout-card">
              <div class="card-header">
                <h1 class="num-label">2</h1>
                <h2>Payment Method</h2>
              </div>

              <div class="payment-options">
                <label class="payment-method" :class="{ active: form.paymentMethod === 'Cash on Delivery' }">
                  <input type="radio" v-model="form.paymentMethod" value="Cash on Delivery" />
                  <div class="method-content">
                    <img src="/greenCashIcon.png" class="method-icon">
                    <div class="method-text">
                      <div class="method-title">Cash on Delivery</div>
                      <div class="method-desc">Pay when you receive</div>
                    </div>
                  </div>
                </label>

                <label class="payment-method" :class="{ active: form.paymentMethod === 'Credit Card' }">
                  <input type="radio" v-model="form.paymentMethod" value="Credit Card" />
                  <div class="method-content">
                    <img src="/creditCardIcon.png" class="method-icon">
                    <div class="method-text">
                      <div class="method-title">Credit/Debit Card</div>
                      <div class="method-desc">Visa, Mastercard, ACELEDA</div>
                    </div>
                  </div>
                </label>

                <label class="payment-method" :class="{ active: form.paymentMethod === 'PayPal' }">
                  <input type="radio" v-model="form.paymentMethod" value="PayPal" />
                  <div class="method-content">
                    <img src="/paypalIcon.png" class="method-icon">
                    <div class="method-text">
                      <div class="method-title">PayPal</div>
                      <div class="method-desc">Fast & secure payment</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div class="terms-section">
              <label class="terms-checkbox">
                <input type="checkbox" v-model="form.agreeTerms" required />
                <span class="checkmark"></span>
                <span class="terms-text">
                  I have read and agree to the 
                  <a href="#" @click.prevent>Terms and Conditions</a> and 
                  <a href="#" @click.prevent>Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>

          <div class="checkout-right">
            <div class="summary-card">
              <div class="summary-header">
                <h2>Order Summary</h2>
                <span class="item-count">{{ cart.length }} {{ cart.length === 1 ? 'item' : 'items' }}</span>
              </div>

              <div class="summary-items">
                <div v-for="item in cart" :key="item.id" class="summary-item">
                  <div class="item-image">
                    <img :src="getImageUrl(item.image)" :alt="item.name" />
                  </div>
                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-meta">Qty: {{ item.qty }} × ${{ item.price.toFixed(2) }}</p>
                  </div>
                  <div class="item-total">
                    ${{ (item.price * item.qty).toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="price-breakdown">
                <div class="price-row">
                  <span class="price-label">Subtotal</span>
                  <span class="price-value">${{ subtotal.toFixed(2) }}</span>
                </div>

                <div class="price-row">
                  <span class="price-label">Tax (5%)</span>
                  <span class="price-value">${{ tax.toFixed(2) }}</span>
                </div>

                <div class="price-row">
                  <span class="price-label">
                    Delivery Fee
                    <span v-if="form.shippingType === 'pickup'" class="free-badge">Free</span>
                  </span>
                  <span class="price-value">
                    <span v-if="form.shippingType === 'pickup'" class="free-text">$0.00</span>
                    <span v-else-if="subtotal > 500" class="free-text">$0.00</span>
                    <span v-else>${{ deliveryFee.toFixed(2) }}</span>
                  </span>
                </div>

                <div v-if="appliedCoupon" class="price-row discount-row">
                  <span class="price-label">
                    Discount ({{ appliedCoupon.code }} -{{ appliedCoupon.type === 'percentage' ? appliedCoupon.value + '%' : '$' + appliedCoupon.value }})
                  </span>
                  <span class="price-value discount-value">-${{ discountAmount.toFixed(2) }}</span>
                </div>

                <div class="price-divider"></div>

                <div class="price-row total-row">
                  <span class="price-label">Total</span>
                  <span class="price-value total-value">${{ total.toFixed(2) }}</span>
                </div>
              </div>

              <div class="summary-actions">
                <button 
                  class="place-order-btn" 
                  :class="{ loading: placingOrder }"
                  :disabled="!canPlaceOrder || placingOrder" 
                  @click="placeOrder"
                >
                  <svg v-if="placingOrder" class="spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span v-if="placingOrder">Processing...</span>
                  <span v-else>Place Order – ${{ total.toFixed(2) }}</span>
                </button>

                <button class="back-btn" @click="$router.push('/cart')">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Back to Cart
                </button>
              </div>

              <div class="security-badge">
                <img class="security-icon" src="/greenShieldIcon.png" alt="">
                <h1>Your data is protected - <span>Source Trust Me Bro</span></h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'
const router = useRouter()

const cart = ref([])
const appliedCoupon = ref(null)
const placingOrder = ref(false)

const form = ref({
  shippingType: 'delivery',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  paymentMethod: 'Cash on Delivery',
  agreeTerms: false
})

const subtotal = computed(() =>
  cart.value.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0)
)

const tax = computed(() => subtotal.value * 0.05)

const deliveryFee = computed(() => {
  if (form.value.shippingType === 'pickup') return 0
  return subtotal.value > 500 ? 0 : 5
})

const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  
  if (appliedCoupon.value.type === 'percentage') {
    return subtotal.value * (appliedCoupon.value.value / 100)
  }
  return appliedCoupon.value.value
})

const total = computed(() => 
  Math.max(0, subtotal.value + tax.value + deliveryFee.value - discountAmount.value)
)

const canPlaceOrder = computed(() => {
  return form.value.fullName && 
         form.value.email && 
         form.value.phone && 
         form.value.address &&
         form.value.city &&
         form.value.agreeTerms &&
         cart.value.length > 0
})

function getImageUrl(imageSrc) {
  if (!imageSrc) return '/placeholder.png'
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc
  if (imageSrc.startsWith('/uploads/')) return `${API_URL}${imageSrc}`
  if (!imageSrc.startsWith('/')) return `${API_URL}/uploads/${imageSrc}`
  return imageSrc
}

async function placeOrder() {
  if (!canPlaceOrder.value) {
    alert('Please fill all required fields and agree to the terms')
    return
  }

  placingOrder.value = true

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    const orderData = {
      userId: user.email || 'guest',
      userEmail: form.value.email,
      username: form.value.fullName, 
      items: cart.value.map(item => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.qty
      })),
      payment: form.value.paymentMethod,
      delivery: {
        address: form.value.address,
        city: form.value.city,
        postalCode: form.value.postalCode || null,
        phone: form.value.phone
      },
      coupon: appliedCoupon.value ? {
        code: appliedCoupon.value.code,
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        discountAmount: discountAmount.value
      } : null,
      calculatedSubtotal: subtotal.value,
      calculatedTax: tax.value,
      calculatedDeliveryFee: deliveryFee.value,
      calculatedTotal: total.value
    }

    console.log('Placing order with data:', orderData)

    const response = await axios.post(`${API_URL}/orders`, orderData)
    
    if (response.status === 201 || response.status === 200) {
      localStorage.removeItem('cart')
      sessionStorage.removeItem('appliedCoupon')
      window.dispatchEvent(new Event('cart-updated'))
      
      router.push('/orders')
    }
  } catch (error) {
    console.error('Order placement error:', error)
    console.error('Error details:', error.response?.data)
    
    const errorMsg = error.response?.data?.message || 'Failed to place order. Please try again.'
  } finally {
    placingOrder.value = false
  }
}

onMounted(() => {
  try {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      cart.value = JSON.parse(cartData)
    }
  } catch (error) {
    console.error('Error loading cart:', error)
  }

  try {
    const couponData = sessionStorage.getItem('appliedCoupon')
    if (couponData) {
      appliedCoupon.value = JSON.parse(couponData)
      console.log('Applied coupon loaded:', appliedCoupon.value)
    }
  } catch (error) {
    console.error('Error loading coupon:', error)
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.email) {
      form.value.email = user.email
      form.value.fullName = user.name || ''
    }
  } catch (error) {
    console.error('Error loading user:', error)
  }

  if (cart.value.length === 0) {
    alert('Your cart is empty')
    router.push('/cart')
  }
})
</script>

<style scoped>
.checkout-page {
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
  margin-bottom: 40px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 32px;
  align-items: start;
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.card-header svg {
  color: #3b82f6;
  flex-shrink: 0;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.num-label {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.shipping-type {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.shipping-option {
  position: relative;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.shipping-option:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.shipping-option.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.shipping-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-icon {
  width: 30px;
  height: 30px;
}

.option-text {
  flex: 1;
}

.option-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 0.875rem;
  color: #64748b;
}

.shipping-option.active .check-mark {
  opacity: 1;
  transform: scale(1);
}

.check-mark svg {
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: span 2;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.field-input {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.3s ease;
  font-family: inherit;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input::placeholder {
  color: #94a3b8;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method {
  position: relative;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-method:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.payment-method.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.payment-method input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.method-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.method-text {
  display: flex;
  flex-direction: column;
}

.method-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.method-desc {
  font-size: 0.875rem;
  color: #64748b;
}

.terms-section {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  position: relative;
}

.terms-checkbox input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
}

.terms-checkbox input:checked ~ .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.terms-checkbox input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: 700;
}

.terms-text {
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.6;
}

.terms-text a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.terms-text a:hover {
  text-decoration: underline;
}

.checkout-right {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.summary-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.item-count {
  font-size: 0.875rem;
  color: #717171;
  background: #d2e9ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 24px;
  padding-right: 8px;
}

.summary-items::-webkit-scrollbar {
  width: 6px;
}

.summary-items::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.summary-items::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.summary-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.item-total {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.price-breakdown {
  padding: 20px 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 0.9375rem;
}

.price-label {
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-value {
  color: #1e293b;
  font-weight: 600;
}

.free-badge {
  background: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 700;
}

.free-text {
  color: #10b981;
}

_discount-row {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 12px 16px;
  border-radius: 12px;
  margin: 8px 0;
}

_discount-row .price-label {
  color: #15803d;
  font-weight: 600;
}

_discount-value {
  color: #15803d !important;
  font-weight: 700;
}

.price-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 16px 0;
}

.total-row {
  padding: 16px 0 0;
  font-size: 1.125rem;
}

.total-row .price-label {
  color: #1e293b;
  font-weight: 700;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e40af;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.place-order-btn {
  width: 100%;
  padding: 18px 24px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.place-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
}

.place-order-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.place-order-btn.loading {
  pointer-events: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-btn {
  width: 100%;
  padding: 14px 24px;
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.back-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  font-size: 0.875rem;
  color: #15803d;
  font-weight: 600;
}


.security-badge span {
  font-style: italic;
  color: #065f46;
}

.security-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-right {
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px 60px;
  }

  .page-title {
    font-size: 2rem;
  }

  .checkout-card {
    padding: 24px;
  }

  .shipping-type {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field.full-width {
    grid-column: span 1;
  }

  .summary-card {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .checkout-card {
    padding: 20px;
  }

  .card-header h2 {
    font-size: 1.25rem;
  }

  .summary-header h2 {
    font-size: 1.25rem;
  }
}
</style>
