<script setup>
  import Header from '@/components/header.vue'
  import Footer from '@/components/footer.vue'
  import ShopByCategory from '@/components/shopByCategory.vue'
  import ProductCard from '@/components/productCard.vue'
  import DiscountBanner from '@/components/discountBanner.vue'
  import { ref, onMounted } from 'vue'
  
  const isLoaded = ref(false)
  
  onMounted(() => {
    setTimeout(() => {
      isLoaded.value = true
    }, 100)
  })
  
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
  
  console.log("HomeView loaded – StarTech style!")
  </script>
  
  <template>
    <div class="home-layout" :class="{ loaded: isLoaded }">
      <header class="headerClass">
        <Header />
      </header>
      
      <main class="main-content">
  
        <section class="banner">
          <div class="hero-section" style="--hero-image: url('/banner_image.jpg');">
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
            
            <div class="hero-content">
              <span class="hero-badge">#1 Electronics Store in Cambodia</span>
              <h1>Welcome to <span class="gradient-text">StarTech</span></h1>
              <p>Discover premium laptops, gadgets & electronics with unbeatable prices</p>
              <div class="hero-buttons">
                <router-link to="/products" class="shop-now-btn primary">
                  <span>Shop Now</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </router-link>
                <router-link to="/bestdeal" class="shop-now-btn secondary">View Deals</router-link>
              </div>
              <div class="trust-badges">
                <div class="badge">
                  <img src="/freeshipIcon.png" class="badge-icon">
                  <span>Free Shipping</span>
                </div>
                <div class="badge">
                  <img src="/shield.png" class="badge-icon">
                  <span>2 Year Warranty</span>
                </div>
                <div class="badge">
                  <img src="/return.png" class="badge-icon">
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <section class="shop-by-category">
          <div class="container">
            <div class="section-header">
              <div class="section-header-left">
                <span class="section-tag">Browse</span>
                <h2 class="section-title">Shop by Category</h2>
              </div>
              <a href="/category" class="view-all-link">
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
            <div class="categories-grid">
              <ShopByCategory
                v-for="(cat, index) in categories"
                :key="cat.title"
                :title="cat.title"
                :productCount="cat.count"
                :imageUrl="cat.img"
                :categoryLink="cat.link"
                :style="{ animationDelay: `${index * 0.1}s` }"
                class="category-item"
              />
            </div>
          </div>
        </section>
  
        <section class="discounts-section">
          <div class="container">
            <div class="section-header">
              <div class="section-header-left">
                <span class="section-tag">Hot Deals</span>
                <h2 class="section-title">Limited Time Offers</h2>
              </div>
            </div>
            <div class="discounts-grid">
              <DiscountBanner
                title="Wireless headphones"
                startingPrice="$49"
                image="/wirelessheadphone.png"
              />
              <DiscountBanner
                title="Gagdets"
                startingPrice="$39"
                image="/kitchengadget.png"
              />
              <DiscountBanner
                title="Video games"
                startingPrice="$49"
                image="/videogame.png"
              />
            </div>
          </div>
        </section>
  
        <section class="products-section">
          <div class="container">
            <div class="section-header">
              <div class="section-header-left">
                <span class="section-tag">Trending</span>
                <h2 class="section-title">Featured Products</h2>
              </div>
            </div>
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
                :style="{ animationDelay: `${i * 0.08}s` }"
                class="product-item"
              />
            </div>
            <div class="load-more">
              <router-link to="/products" class="load-more-btn">Load More Products</router-link>
            </div>
          </div>
        </section>
      </main>
  
      <section class="brand-deal-banner">
        <div class="brand-deal-inner">
          <div class="deal-text">
            <span class="deal-badge">Brand's Deal</span>
            <h2>Save up to <span class="highlight">$200</span> on select<br><strong>Samsung washing machines</strong></h2>
            <p class="desc">Limited time offer • Free delivery & installation</p>
            <div class="deal-features">
              <div class="feature">
                <img src="/verifiedIcon.png" class="feature-icon">
                <span>Free Installation</span>
              </div>
              <div class="feature">
                <img src="/verifiedIcon.png" class="feature-icon">
                <span>1 Year Warranty</span>
              </div>
            </div>
            <router-link to="/products" class="shop-now-link">
              Shop now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
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
  
      <Footer />
  
    </div>
  </template>
  
  <style scoped>
  :root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --accent: #8b5cf6;
    --dark: #1e293b;
    --gray: #64748b;
    --light-gray: #f1f5f9;
    --white: #ffffff;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.12);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-xl: 24px;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .home-layout {
    margin-top: 130px;
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    overflow-x: hidden;
  }
  
  .main-content {
    padding: 0 20px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .section-header-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .section-tag {
    font-size: 0.85rem;
    color: #3b82f6;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  
  .section-title {
    font-size: 2rem;
    color: #1e293b;
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
  }
  
  .view-all-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .view-all-link:hover {
    gap: 10px;
    color: #2563eb;
  }
  
  .banner {
    padding: 40px 0;
  }
  
  .hero-section {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 80px 40px 100px;
    border-radius: 24px;
    background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--hero-image) center/cover no-repeat;
    filter: blur(4px) brightness(0.3);
    transform: scale(1.1);
    z-index: 0;
  }
  
  .floating-shapes {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
    filter: blur(40px);
  }
  
  .shape-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -50px;
    animation: float 8s ease-in-out infinite;
  }
  
  .shape-2 {
    width: 200px;
    height: 200px;
    bottom: -50px;
    left: 10%;
    animation: float 10s ease-in-out infinite reverse;
  }
  
  .shape-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    left: -30px;
    animation: float 12s ease-in-out infinite;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    color: #ffffff;
    max-width: 800px;
  }
  
  .hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transform: all 1s ease;
  }

  .hero-badge:hover{
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
  }
  
  .hero-section h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.1;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-section p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 32px;
    line-height: 1.6;
  }
  
  .hero-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;
  }
  
  .shop-now-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }
  
  .shop-now-btn.primary {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
  }
  
  .shop-now-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
  }
  
  .shop-now-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  }
  
  .shop-now-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .trust-badges {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }
  
  .badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .badge-icon {
    filter: invert(1);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  
  .shop-by-category {
    padding: 80px 0;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .category-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
  }
  
  .home-layout.loaded .category-item {
    opacity: 1;
  }
  
  .discounts-section {
    padding: 80px 0;
    background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.03), transparent);
  }
  
  .discounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
  
  .products-section {
    padding: 80px 0;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .product-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
  }
  
  .home-layout.loaded .product-item {
    opacity: 1;
  }
  
  .load-more {
    text-align: center;
    margin-top: 48px;
  }
  
  .load-more-btn {
    padding: 16px 48px;
    background: white;
    border: 2px solid #e2e8f0;
    color: #1e293b;
    font-weight: 700;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .load-more-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  }
  
  .brand-deal-banner {
    max-width: 1400px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }
  
  .brand-deal-inner {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  
  .deal-text {
    flex: 1;
    padding: 60px;
  }
  
  .deal-badge {
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 20px;
  }
  
  .deal-text h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1e293b;
    line-height: 1.2;
    margin: 0 0 16px;
  }
  
  .deal-text h2 .highlight {
    color: #3b82f6;
  }
  
  .deal-text .desc {
    font-size: 1.1rem;
    color: #64748b;
    margin: 0 0 24px;
  }
  
  .deal-features {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .feature {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: #1e293b;
    font-weight: 500;
  }
  
  .feature-icon {
    width: 20px;
    height: 20px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }
  
  .shop-now-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1e293b;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 14px 32px;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .shop-now-link:hover {
    background: #0f172a;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(30, 41, 59, 0.3);
  }
  
  .deal-image {
    flex: 1;
    height: 450px;
    position: relative;
  }
  
  .deal-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    .hero-section h1 {
      font-size: 2.8rem;
    }
    
    .section-title {
      font-size: 1.75rem;
    }
    
    .deal-text {
      padding: 40px;
    }
    
    .deal-text h2 {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .hero-section {
      padding: 60px 24px 80px;
      min-height: 450px;
    }
    
    .hero-section h1 {
      font-size: 2.2rem;
    }
    
    .hero-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .shop-now-btn {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
    
    .trust-badges {
      gap: 16px;
    }
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .brand-deal-inner {
      flex-direction: column;
    }
    
    .deal-text {
      padding: 40px 24px;
      text-align: center;
    }
    
    .deal-features {
      justify-content: center;
    }
    
    .deal-image {
      height: 280px;
      width: 100%;
    }
    
    .newsletter-inner {
      flex-direction: column;
      text-align: center;
    }
    
    .newsletter-form {
      flex-direction: column;
      width: 100%;
      max-width: none;
    }
    
    .newsletter-btn {
      width: 100%;
    }
    
    .discounts-grid {
      grid-template-columns: 1fr;
    }
    
    .countdown {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  
  @media (max-width: 480px) {
    .hero-section h1 {
      font-size: 1.8rem;
    }
    
    .hero-badge {
      font-size: 0.8rem;
      padding: 6px 14px;
    }
    
    .hero-section p {
      font-size: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
    
    .categories-grid,
    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }
    
    .deal-text h2 {
      font-size: 1.5rem;
    }
  }

  .headerClass {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  </style>