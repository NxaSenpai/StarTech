<script setup lang="ts">
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import ProductCard from '@/components/productCard.vue'

console.log("EventView loaded – New Arrivals page!")

const newProducts = [
  { title: 'Multigroomer All-in-One Trimmer Series 3000 10-in-1', price: 44.00, oldPrice: 69.00, rating: 4.5, reviews: 235, sale: true, img: '/Asus_controller.png' },
  { title: 'Smart Speaker with Alexa Compatibility and Premium Sound', price: 79.99, oldPrice: 119.99, rating: 4.7, reviews: 412, sale: false, img: '/Asus_controller.png' },
  { title: 'Home Speaker 500 Smart Wireless Speaker with Alexa', price: 299.00, rating: 4.6, reviews: 189, sale: false, img: '/Asus_controller.png' },
  { title: 'Health and Fitness Smart Watch with Heart Rate Monitor', price: 249.00, oldPrice: 299.00, rating: 4.8, reviews: 567, sale: true, img: '/Asus_controller.png' },
  { title: 'Smart Home Camera 4K UHD with Night Vision', price: 99.99, oldPrice: 149.99, rating: 4.4, reviews: 312, sale: true, img: '/Asus_controller.png' },
  { title: 'Instant Camera with Film Pack', price: 129.00, rating: 4.9, reviews: 890, sale: false, img: '/Asus_controller.png' },
  { title: 'Smart Watch with GPS and Fitness Tracking', price: 399.00, oldPrice: 449.00, rating: 4.7, reviews: 678, sale: true, img: '/Asus_controller.png' },
  { title: 'Vintage Gaming Console Retro Edition', price: 89.99, rating: 4.5, reviews: 234, sale: false, img: '/Asus_controller.png' },
  { title: 'Android Tablet 10" 128GB with Keyboard Case', price: 299.00, oldPrice: 399.00, rating: 4.6, reviews: 456, sale: true, img: ' ' },
  { title: 'iPad Pro 11" (2024) M4 Chip 256GB', price: 999.00, rating: 5.0, reviews: 123, sale: false, img: ' ' },
  { title: '5G Unlocked Smartphone 128GB Dual SIM', price: 699.00, oldPrice: 899.00, rating: 4.8, reviews: 789, sale: true, img: ' ' },
  { title: 'Flagship Unlocked Smartphone 256GB Pro-Grade Camera', price: 1099.00, oldPrice: 1299.00, rating: 4.9, reviews: 1023, sale: true, img: ' ' },
  { title: '13" MacBook Air (M3) 16GB RAM 512GB SSD', price: 1499.00, rating: 4.9, reviews: 345, sale: false, img: ' ' },
  { title: '14" Rugged Ultrabook 4K Touchscreen Intel i7', price: 1299.00, oldPrice: 1599.00, rating: 4.7, reviews: 267, sale: true, img: ' ' },
  { title: 'Ultrabook Gaming Laptop RTX 4070 1TB SSD', price: 1899.00, rating: 4.8, reviews: 512, sale: false, img: ' ' },
  { title: '15" Display Laptop Intel i9 32GB RAM', price: 2199.00, oldPrice: 2499.00, rating: 4.9, reviews: 178, sale: true, img: ' ' },
  { title: 'Built-in Oven Microwave Combo', price: 799.00, oldPrice: 999.00, rating: 4.5, reviews: 89, sale: true, img: ' ' },
  { title: 'Wall Oven with Air Fry', price: 1199.00, rating: 4.6, reviews: 134, sale: false, img: ' ' },
  { title: 'Front Load Washer 5.0 cu.ft.', price: 899.00, oldPrice: 1099.00, rating: 4.7, reviews: 456, sale: true, img: ' ' },
  { title: 'Top Load Washer with Impeller', price: 699.00, rating: 4.4, reviews: 312, sale: false, img: ' ' },
  { title: 'Speed Queen Heavy Duty Top Load Washer', price: 1299.00, oldPrice: 1499.00, rating: 4.8, reviews: 98, sale: true, img: ' ' },
  { title: '10 cu.ft. Combination Washer/Dryer', price: 1599.00, rating: 4.5, reviews: 167, sale: false, img: ' ' },
  { title: 'Double Door In-Door Fridge Freezer', price: 1899.00, oldPrice: 2199.00, rating: 4.7, reviews: 234, sale: true, img: ' ' },
  { title: 'Side-by-Side Refrigerator with Ice Maker', price: 2199.00, rating: 4.8, reviews: 189, sale: false, img: ' ' },
]
</script>

<template>
  <div class="event-layout">
    <Header />

    <main class="event-main">
      <!-- Hero Banner -->
      <section class="event-hero">
        <div class="hero-bg">
          <div class="hero-content">
            <h1>New Arrivals !!</h1>
            <p>Discover the latest gadgets & electronics at StarTech</p>
          </div>
        </div>
      </section>

      <!-- Banners Row -->
      <section class="banners-section">
        <div class="container">
          <div class="banners-grid">
            <div class="banner-left">
              <p>The only case<br>you need.</p>
              <a href="#" class="banner-link">Shop now →</a>
            </div>
            <div class="banner-right">
              <p>Get 30% OFF<br>selected items</p>
              <a href="#" class="banner-link">Shop now →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="products-section">
        <div class="container">
          <div class="products-grid">
            <ProductCard
              v-for="(product, index) in newProducts"
              :key="index"
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
      </section>

      <!-- Bottom Banner -->
      <section class="bottom-banner">
        <div class="container">
          <div class="bottom-inner">
            <h2>Check Out <br>Our Latest Products !!</h2>
            <button class="shop-btn">SHOP NOW</button>
            <div class="bottom-images"> </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.event-layout {
  min-height: 100vh;
  background: #f8fbff;
}

.event-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero */
.event-hero {
  margin-bottom: 60px;
  margin-top: 40px;
}

.hero-bg {
  background: linear-gradient(135deg, #aeccec 0%, #d0deee 100%);
  border-radius: 16px;
  padding: 100px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 900;
  color: #0056b3;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0;
}

/* Banners Row */
.banners-section {
  margin-bottom: 80px;
}

.banners-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.banner-left,
.banner-right {
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 300px;
  position: relative;
}

.banner-left {
    background-color: #b3cae4;
  /* background-image: url('/background_log.jpg');  */
}

.banner-right {
    background-color: #b3cae4;
  /* background-image: url('/background_log.jpg');  */
}

.banner-left p,
.banner-right p {
  font-size: 2.2rem;
  font-weight: 700;
  color: #6b84ea;
  margin: 0 0 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.banner-link {
  font-size: 1.2rem;
  color: #0986a1;
  font-weight: 600;
  text-decoration: none;
}

.banner-link:hover {
  text-decoration: underline;
}

/* Products */
.products-section {
  margin-bottom: 100px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
}

/* Bottom Banner */
.bottom-banner {
  background-color: #b3cae4;
  /* background-image: url('/background_log.jpg');  */
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  color: #fff;
  margin-bottom: 80px;
}

.bottom-inner h2 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 30px;
}

.shop-btn {
  background: #fff;
  color: #007bff;
  border: none;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  margin-bottom: 40px;
}

.shop-btn:hover {
  background: #a4b3ff;
}

/* Responsive */
@media (max-width: 992px) {
  .banners-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-content h1 {
    font-size: 2.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
}

@media (max-width: 640px) {
  .hero-bg {
    padding: 60px 20px;
  }
  
  .hero-content h1 {
    font-size: 2.2rem;
  }
  
  .banner-left p,
  .banner-right p {
    font-size: 1.8rem;
  }
}
</style>