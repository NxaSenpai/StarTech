<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import ProductCard from '@/components/productCard.vue'

const timeLeft = ref({ hours: 12, minutes: 44, seconds: 49 })
let timerInterval = null

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeLeft.value.seconds > 0) timeLeft.value.seconds--
    else {
      if (timeLeft.value.minutes > 0) {
        timeLeft.value.minutes--
        timeLeft.value.seconds = 59
      } else if (timeLeft.value.hours > 0) {
        timeLeft.value.hours--
        timeLeft.value.minutes = 59
        timeLeft.value.seconds = 59
      }
    }
  }, 1000)
}

const calculateDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

const dealProducts = [
  { title: 'Multigroomer All-in-One Trimmer Series 3000 10-in-1', price: 44.00, oldPrice: 69.00, rating: 4.5, reviews: 235, sale: false, img: '/Asus_controller.png' },
  { title: 'Smart Speaker with Alexa Compatibility and Premium Sound', price: 79.99, oldPrice: 119.99, rating: 4.7, reviews: 412, sale: false, img: '/Asus_controller.png' },
  { title: 'Home Speaker 500 Smart Wireless Speaker with Alexa', price: 219.00, oldPrice: 299.00, rating: 4.6, reviews: 189, sale: false, img: '/Asus_controller.png' },
  { title: 'Health and Fitness Smart Watch with Heart Rate Monitor', price: 249.00, oldPrice: 299.00, rating: 4.8, reviews: 567, sale: false, img: '/Asus_controller.png' },
  { title: 'Smart Home Camera 4K UHD with Night Vision', price: 99.99, oldPrice: 149.99, rating: 4.4, reviews: 312, sale: false, img: '/Asus_controller.png' },
  { title: 'Instant Camera with Film Pack', price: 89.00, oldPrice: 129.00, rating: 4.9, reviews: 890, sale: false, img: '/Asus_controller.png' },
  { title: 'Smart Watch with GPS and Fitness Tracking', price: 399.00, oldPrice: 449.00, rating: 4.7, reviews: 678, sale: false, img: '/Asus_controller.png' },
  { title: 'Vintage Gaming Console Retro Edition', price: 59.99, oldPrice: 89.99, rating: 4.5, reviews: 234, sale: false, img: '/Asus_controller.png' },
]

onMounted(() => startTimer())
onUnmounted(() => clearInterval(timerInterval))
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
            <p>Save up to 60% OFF on top-rated electronics</p>
          </div>
        </div>
      </section>

      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <h2><span class="emoji">🔥</span> Hot Offers</h2>
            <div class="timer">
              Ends in: 
              <span>{{ String(timeLeft.hours).padStart(2, '0') }}h : </span>
              <span>{{ String(timeLeft.minutes).padStart(2, '0') }}m : </span>
              <span>{{ String(timeLeft.seconds).padStart(2, '0') }}s</span>
            </div>
          </div>
          
          <div class="products-grid">
            <div v-for="(product, index) in dealProducts" :key="index" class="product-wrapper">
              <div class="discount-tag">
                -{{ calculateDiscount(product.price, product.oldPrice) }}%
              </div>

              <ProductCard
                :title="product.title"
                :price="product.price"
                :oldPrice="product.oldPrice"
                :rating="product.rating"
                :reviewCount="product.reviews"
                :isOnSale="product.sale"
                :image="product.img"
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

.timer {
  background: #fff5f5;
  color: #ff4d4f;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  border: 1px solid #ffd8d8;
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
  top: 15px;
  left: 15px;
  background: #ff5a5a;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.8rem;
  z-index: 5;
  box-shadow: 0 4px 10px rgba(255, 90, 90, 0.3);
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