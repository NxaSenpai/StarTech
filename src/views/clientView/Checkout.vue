<!-- src/views/clientView/Checkout.vue -->
<template>
  <div class="checkout-page">
    <Header />

    <main class="main-content">
      <div class="container">
        <h1 class="title">Checkout</h1>
        <div class="split-layout">
          <div class="left">
            <div class="checkout-card">
              <h2>Shipping Information</h2>

              <!-- Delivery / Pickup -->
              <div class="method-row">
                <label class="method">
                  <input type="radio" v-model="form.shippingType" value="delivery" checked />
                  <span class="icon">🚚</span>
                  <span>Delivery</span>
                </label>
                <label class="method">
                  <input type="radio" v-model="form.shippingType" value="pickup" />
                  <span class="icon">📦</span>
                  <span>Pick up</span>
                </label>
              </div>

              <!-- Form fields -->
              <div class="form">
                <div class="field">
                  <label>Full name *</label>
                  <input v-model="form.fullName" placeholder="Enter full name" required />
                </div>

                <div class="field">
                  <label>Email address *</label>
                  <input v-model="form.email" type="email" placeholder="Enter email address" required />
                </div>

                <div class="field">
                  <label>Phone number *</label>
                  <div class="phone-group">
                    <select class="code">
                      <option>+855</option>
                      <option>+1</option>
                    </select>
                    <input v-model="form.phone" placeholder="Enter phone number" required />
                  </div>
                </div>

                <div class="field">
                  <label>Country *</label>
                  <select v-model="form.country" required>
                    <option value="">Choose country</option>
                    <option>Cambodia</option>
                    <option>United States</option>
                  </select>
                </div>

                <div class="row">
                  <div class="field">
                    <label>City</label>
                    <input v-model="form.city" placeholder="Enter city" />
                  </div>
                  <div class="field">
                    <label>Province/State</label>
                    <input v-model="form.province" placeholder="Enter province/state" />
                  </div>
                  <div class="field">
                    <label>ZIP Code</label>
                    <input v-model="form.zip" placeholder="Enter ZIP code" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms checkbox -->
            <div class="terms">
              <label class="terms-label">
                <input type="checkbox" v-model="form.agreeTerms" required />
                <span>I have read and agree to the <a href="#">Terms and Conditions</a>.</span>
              </label>
            </div>
          </div>

          <!-- RIGHT: Review your cart + Pay Now button inside the card -->
          <div class="right">
            <div class="review-card">
              <h2>Review your cart</h2>

              <div class="cart-items">
                <div v-for="item in cart" :key="item._id" class="cart-row">
                  <div class="item-thumb"></div>
                  <div class="item-info">
                    <div class="item-name">{{ item.name || 'Product' }}</div>
                    <div class="item-qty">{{ item.qty }}x</div>
                  </div>
                  <div class="item-price">${{ (item.price * item.qty).toFixed(2) }}</div>
                </div>
              </div>
            

              <div class="totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span v-if="form.shippingType === 'pickup'">Free</span>
                  <span v-else>$5.00</span>
                </div>
                <hr />
                <div class="grand-total">
                  <span>Total</span>
                  <span>${{ total.toFixed(2) }}</span>
                </div>
              </div>

              <button class="pay-now" :disabled="!form.agreeTerms" @click="placeOrder">
                Pay Now – ${{ total.toFixed(2) }}
              </button>
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

const router = useRouter()

const cart = ref([])
const form = ref({
  shippingType: 'delivery',
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  province: '',
  zip: '',
  agreeTerms: false
})

const subtotal = computed(() =>
  cart.value.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0)
)

const shippingCost = computed(() => form.value.shippingType === 'pickup' ? 0 : 5)
const total = computed(() => subtotal.value + shippingCost.value)

function placeOrder() {
  if (!form.value.fullName || !form.value.email || !form.value.phone) {
    alert('Please fill required fields')
    return
  }
  if (!form.value.agreeTerms) {
    alert('You must agree to the terms')
    return
  }
  alert('Order placed (demo mode)')
  router.push('/thank-you')
}

onMounted(() => {
  cart.value = [
    { _id: '1', name: 'Wireless Headphones', price: 179.99, qty: 2 },
    { _id: '2', name: 'IronOne Desk', price: 40.00, qty: 1 }
  ]
})
</script>

<style>
.checkout-page {
  background: #f9fafb;
  min-height: 100vh;
}

.main-content {
  padding: 40px 20px;
  max-width: 1280px;
  margin: 0 auto;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 40px;
  color: #111827;
}



.split-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .split-layout {
    grid-template-columns: 1fr;
  }
}


.left {
  align-self: start;
}

.checkout-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

h2 {
  margin: 0 0 24px;
  font-size: 1.6rem;
  color: #111827;
}

.method-row {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  color:#374151
}

.method {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
}

.method input {
  display: none;
}

.method input:checked + span + span {
  font-weight: 600;
  color: #2563eb;
}

.method input:checked ~ * {
  border-color: #2563eb;
  background: #eff6ff;
}

.icon {
  font-size: 1.8rem;
}

.field {
  margin-bottom: 24px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

input, select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #111827;
}

.phone-group {
  display: flex;
  gap: 8px;
}

.code {
  width: 100px;
  flex-shrink: 0;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.terms {
  margin: 32px 0;
  font-size: 1rem;
  color: #374151;
}

.terms-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.terms-label input {
  width: 18px;
  height: 18px;
}

.terms-label span {
  flex: 1;
}

.terms-label a {
  color: #2563eb;
}


.right {
  align-self: start;
  position: sticky;
  top: 40px;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-top: -38px;
}

.cart-items {
  margin-bottom: 32px;
}

.cart-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.item-thumb {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 8px;
}

.contianer{
    display: flex;
    justify-content: center;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #374151;
}

.item-qty {
  color: #6b7280;
  font-size: 0.95rem;
}

.item-price {
  font-weight: 700;
  color: #2563eb;
}

.totals .total-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  color: #374151;
  font-size: 1.05rem;
}

.grand-total {
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  color: #111827;
}

.pay-now {
  width: 100%;
  padding: 18px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 32px;
}

.pay-now:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
