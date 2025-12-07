<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import Header from '@/components/header.vue'
import Footer from '@/components/footer.vue'
import ShopByCategory from '@/components/shopByCategory.vue'
import ProductCard from '@/components/productCard.vue'
import DiscountBanner from '@/components/discountBanner.vue'




const categories = [
  { title: 'Air Conditioner',     count: 24, img: '/categories/1_AC.png',    link: '/category/AC' },
  { title: 'Audio & Video',       count: 38, img: '/categories/2_audio.png' , link: '/category/Audio' },
  { title: 'Gadgets',             count: 56, img: '/categories/3_gadget.png', link: '/Gadgets' },
  { title: 'Home Appliances',     count: 19, img: '/categories/4_wash.png',   link: '/category/Home' },
  { title: 'Kitchen Appliances',  count: 15, img: '/categories/5_oven.png',   link: '/category/Kitchen' },
  { title: 'PC & Laptops',        count: 82, img: '/categories/6_pc.png',     link: '/category/Laptops' },
  { title: 'Refrigerator',        count: 82, img: '/categories/7_fridge.png', link: '/category/Fridge' },
  { title: 'Smart Home',          count: 82, img: '/categories/8_smart.png',  link: '/category/Smart' },
]

const products = [
  { title: 'Multigroomer All-in-One Trimmer Series 5000', price: 44.00, oldPrice: 69.00, rating: 4.0, reviews: 128, sale: true, img: '/categories/6_pc.png' },
  { title: 'Wireless Bluetooth Headphones – Noise Cancelling', price: 89.99, oldPrice: 129.99, rating: 4.5, reviews: 342, sale: true, img: '/categories/6_pc.png' },
  { title: 'Smart LED TV 55″ 4K UHD', price: 599.00, oldPrice: 799.00, rating: 4.8, reviews: 87, sale: true, img: '/categories/6_pc.png' },
  { title: 'Portable Air Conditioner 12000 BTU', price: 349.00, oldPrice: 499.00, rating: 4.3, reviews: 201, sale: true, img: '/categories/6_pc.png' },
  { title: 'Gaming Laptop RTX 4070 16GB RAM', price: 1299.00, oldPrice: 1599.00, rating: 4.9, reviews: 523, sale: true, img: '/categories/6_pc.png' },
  { title: 'Smart Watch Series 8 GPS + Cellular', price: 399.00, rating: 4.7, reviews: 892, sale: true, img: '/categories/6_pc.png' },
  { title: 'Coffee Maker Automatic Espresso', price: 179.00, oldPrice: 249.00, rating: 4.6, reviews: 176, sale: true, img: '/categories/6_pc.png' },
  { title: 'Robot Vacuum Cleaner with Mop', price: 299.00, oldPrice: 399.00, rating: 4.4, reviews: 412, sale: true, img: '/categories/6_pc.png' },
]


// Optional: any other logic
console.log("HomeView loaded – StarTech style!")
</script>

<template>
  <div class="home-layout">

    <!-- 1. The Header-->
    <Header />

    <!-- 2. Main contents -->
    <main class="main-content">

      <!-- a. Hero Banner -->
    <section class="banner">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Welcome to <span>StarTech</span></h1>
        <p>Best place for laptops, gadgets & electronics in Cambodia</p>
        <button class="shop-now-btn">Shop Now</button>
      </div>
    </div>
  </section>

      <!-- b. ShopByCategory grids -->
    <section class="ShopByCatetgory">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="categories-grid">
          <ShopByCategory
            v-for="cat in categories"
            :key="cat.title"
            :title="cat.title"
            :productCount="cat.count"
            :imageUrl="cat.img"
            :categoryLink="cat.link"
          />
        </div>
      </div>
    </section>

    <!-- c. Discount banners -->
  <section class="discounts-section">
    <div class = "container">
      <h2 class="section-title">Our shop best Deal</h2>
      <div class="discounts-grid">
        <DiscountBanner
          title="Wireless headphones"
          startingPrice="$49"
          image="/washingMachine.jpg"
        />
        <DiscountBanner
          title="Grooming"
          startingPrice="$39"
          image="/discounts/trimmer.png"
        />
        <DiscountBanner
          title="Video games"
          startingPrice="$49"
          image="/discounts/gameboy.png"
        />
    </div>
  </div>

  </section>

      <!-- d. Today's best deal grids -->
      <section class="ProductCard">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="(product, i) in products"
            :key="i"
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

    <!-- e. Product Brands banner(no component) -->
    <section class="brand-deal-banner">
      <div class="brand-deal-inner">
        <!-- Left: Text -->
        <div class="deal-text">
          <p class="tag">Brand's deal</p>
          <h2>Save up to $200 on select<br><strong>Samsung washing machines</strong></h2>
          <p class="desc">Limited time offer • Free delivery & installation</p>
          <a href="/category/washing-machines" class="shop-now">Shop now</a>
        </div>

  
        <div class="deal-image">
          <img 
            src="/washingMachine.jpg" 
            alt="Samsung Washing Machine Deal" 
            loading="lazy"
          />
        </div>

      </div>
    </section>


    <!-- 3. Footer -->
    <Footer />

  </div>
</template>

<style scoped>

.section-title{
  color: black;
  font-weight: 500;
  margin-top: 70px;
  margin-bottom: 50px;
}

.home-layout {
  min-height: 100vh;
  background: #f8fbff;
}

.main-content {
  padding: 40px 20px;
  max-width: 1400px;
  margin: auto;
}

.hero-section {
  text-align: center;
  padding:100px 20px;
  background: linear-gradient(135deg, #aeccec 0%, #d0deee 100%);
  border-radius: 16px;

  /* background: linear-gradient(rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.58)),
              url('/background_log.jpg') center/cover no-repeat; */
}

.hero-section h1 {
  font-size: 3.4rem;
  color: lab(53.37% 21.92 -73.11);
  margin-bottom: 16px;
}

.hero-section h1 span {
  color: #0056b3;
  font-weight: 900;
}

.hero-section p {
  font-size: 1.4rem;
  color: #444;
  margin-bottom: 32px;
}

.shop-now-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 14px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s;
}

.shop-now-btn:hover {
  background: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4);
}

/* Category Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 35px;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 35px;
}

.discounts-section {
  margin: 80px auto;
  padding: 0 20px;
  display: grid;
  flex-direction: column;
  gap: 24px;
}

.discounts-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 35px;
}


@media (max-width: 640px) {
  .discounts-section { margin: 60px auto; gap: 20px; }
}
/* Brand Deal Banner – Clean & Modern */
.brand-deal-banner {
  max-width: 1400px;
  margin: 80px auto;
  padding: 0 20px;
}



/* brands deal banner (no component) */
.brand-deal-inner {
  display: flex;
  align-items: center;
  background: rgb(191, 217, 236);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}

.deal-text {
  flex: 1;
  padding: 60px 50px;
}

.deal-text .tag {
  font-size: 0.95rem;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.deal-text h2 {
  font-size: 2.6rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin: 0 0 16px;
}

.deal-text h2 strong {
  color: #1e293b;
}

.deal-text .desc {
  font-size: 1.1rem;
  color: #475569;
  margin: 0 0 28px;
}

.shop-now {
  display: inline-block;
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 12px 32px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.shop-now:hover {
  background: #2563eb;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.deal-image {
  flex: 1;
  height: 380px;
}

.deal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Mobile */
@media (max-width: 900px) {
  .brand-deal-inner {
    flex-direction: column;
  }
  .deal-text {
    padding: 40px 30px;
    text-align: center;
  }
  .deal-text h2 {
    font-size: 2.2rem;
  }
  .deal-image {
    height: 300px;
  }
}


</style>