<script setup>
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
]
</script>

<template>
  <div class="event-layout">
    <Header />

    <main class="event-main">
      <section class="event-hero">
        <div class="hero-bg">
          <div class="hero-content">
            <h1>Today Arrivals !!</h1>
            <p>Discover the latest gadgets & electronics at StarTech</p>
          </div>
        </div>
      </section>

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

.products-section {
  margin-bottom: 100px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
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

@media (max-width: 992px) {
  
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
}
</style>