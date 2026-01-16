<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import ProductCard from '@/components/productCard.vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

const calculateDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

const dealProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

const fetchActivePromotions = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await axios.get(`${API_URL}/promotions/active`)
    dealProducts.value = response.data.map(promo => ({
      id: promo.product_id,
      title: promo.product_name,
      price: promo.sale_price,
      oldPrice: promo.original_price,
      rating: 4.5,
      reviews: 128,
      sale: true,
      img: promo.product_image || '/placeholder.png',
      discount: promo.discount
    }))
    console.log('Loaded active promotions:', dealProducts.value.length)
  } catch (err) {
    console.error('Failed to fetch active promotions:', err)
    error.value = 'Failed to load promotions'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchActivePromotions()
})
</script>

<template>
  <div class="deal-layout">
    <Header />

    <main class="deal-main">
      <section class="deal-hero">
        <div class="hero-bg">
          <div class="hero-content">
            <div class="top-badge">LIMITED TIME ONLY</div>
            <h1>Best Deals of the Week</h1>
            <p>Save up you money by buying products from STARTECH</p>
          </div>
        </div>
      </section>

      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <h2><span class="emoji">🔥</span> Hot Offers</h2>
          </div>
          
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading deals...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button @click="fetchActivePromotions" class="retry-btn">Try Again</button>
          </div>

          <!-- Empty State -->
          <div v-else-if="dealProducts.length === 0" class="empty-state">
            <p>No active promotions at the moment. Check back soon!</p>
          </div>

          <!-- Products Grid -->
          <div v-else class="products-grid">
            <div v-for="(product, index) in dealProducts" :key="index" class="product-wrapper">
              <div class="discount-tag">
                -{{ product.discount }}%
              </div>

              <ProductCard
                :title="product.title"
                :price="product.price"
                :oldPrice="product.oldPrice"
                :rating="product.rating"
                :reviewCount="product.reviews"
                :isOnSale="product.sale"
                :image="product.img"
                :productId="product.id"
              />
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.deal-layout {
  min-height: 100vh;
  background: #f4f7fa; 
}

.deal-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.deal-hero {
  margin: 40px 0;
}

.hero-bg {
  background: linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%);
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 15px 35px rgba(255, 95, 109, 0.2);
}

.top-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: inline-block;
  text-transform: uppercase;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.products-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 80px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #1a1a1a;
  font-weight: 800;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 16px;
}

.error-state {
  text-align: center;
  padding: 80px 20px;
}

.error-message {
  color: #ef4444;
  font-size: 18px;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 32px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #2563eb;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  font-size: 18px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
}

.product-wrapper {
  position: relative;
}

.discount-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

:deep(.add-button), 
:deep(button[class*="add"]) {
  background-color: #c6d9ff !important; 
  color: #003399 !important; 
  border-radius: 50px !important;
  font-weight: 700 !important;
  transition: all 0.2s ease;
}

:deep(.add-button:hover) {
  background-color: #b0caff !important;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.2rem; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>