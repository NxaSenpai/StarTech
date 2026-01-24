<script setup>
  import Header from '@/components/header.vue'
  import Footer from '@/components/footer.vue'
  import ProductCard from '@/components/productCard.vue'
  import { ref, onMounted } from 'vue'

  const isLoaded = ref(false)
  const products = ref([])

  function isNewArrival(product) {
    if (!product.createdAt && !product.stockAt) return false
    const created = new Date(product.createdAt || product.stockAt)
    const now = new Date()
    const diffDays = (now - created) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  function getDiscount(product) {
    if (typeof product.discount === 'number' && product.discount > 0) return product.discount
    const price = product.price ?? 0
    const oldPrice = product.oldPrice ?? product.originalPrice ?? 0
    if (oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100)
    }
    return 0
  }

  function addToCart(product) {
    if ((product.inStock || 0) === 0) {
      alert(`Sorry, "${product.name}" is currently out of stock.`)
      return
    }

    let cart = []
    try {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        cart = JSON.parse(cartData)
      }
    } catch (error) {
      console.error('Error reading cart:', error)
    }
    
    const existingIndex = cart.findIndex(item => item.id === product._id)
    
    if (existingIndex !== -1) {
      if (cart[existingIndex].qty >= product.inStock) {
        alert(`Cannot add more. Only ${product.inStock} items available in stock.`)
        return
      }
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1
      alert(`Increased quantity of "${product.name}" in cart!`)
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        qty: 1,
        maxStock: product.inStock || 0
      })
      alert(`Added "${product.name}" to cart!`)
    }
    
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
      
      window.dispatchEvent(new CustomEvent('cart-updated', { 
        detail: { itemCount: cart.reduce((sum, item) => sum + item.qty, 0) }
      }))
    } catch (error) {
      console.error('Error saving cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  onMounted(async () => {
    setTimeout(() => {
      isLoaded.value = true
    }, 100)

    try {
      const productsRes = await fetch('http://localhost:3000/products')
      const productsData = await productsRes.json()
      
      const promotionsRes = await fetch('http://localhost:3000/promotions/active')
      const promotionsData = await promotionsRes.json()
      
      console.log('Products loaded:', productsData.length)
      console.log('Active promotions:', promotionsData.length)
      
      products.value = Array.isArray(productsData)
        ? productsData.slice(0, 8).map(p => {
            const promotion = promotionsData.find(promo => 
              promo.product_id === p._id || promo.productId === p._id
            )
            
            let displayPrice = p.price
            let originalPrice = null
            let discount = 0
            
            if (promotion) {
              originalPrice = p.price
              displayPrice = promotion.sale_price || promotion.salePrice || p.price
              discount = promotion.discount || promotion.discountPercentage || 0
              
              console.log(`Product "${p.name}" has promotion:`, {
                originalPrice,
                displayPrice,
                discount
              })
            } else {
              discount = getDiscount(p)
              if (discount > 0) {
                originalPrice = p.oldPrice || p.originalPrice
              }
            }
            
            return {
              _id: p._id,
              name: p.name,
              price: displayPrice,
              originalPrice: originalPrice,
              discount: discount,
              image: p.imageSrc || p.image || p.image_src || p.img || '',
              isNew: isNewArrival(p),
              inStock: p.inStock || 0
            }
          })
        : []
      
      console.log('Processed products:', products.value)
      console.log('Products with discount:', products.value.filter(p => p.discount > 0).length)
      console.log('New products:', products.value.filter(p => p.isNew).length)
    } catch (err) {
      console.error('Failed to load products:', err)
      products.value = []
    }
  })

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
                <router-link to="/best-deals" class="shop-now-btn secondary">View Deals</router-link>
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
  
      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <div class="section-header-left">
              <span class="section-tag">Trending</span>
              <h2 class="section-title">Featured Products</h2>
            </div>
          </div>
          <div class="products-grid">
            <div
              v-for="(product, i) in products"
              :key="product._id || i"
              :style="{ animationDelay: `${i * 0.08}s`, position: 'relative' }"
            >
              <div v-if="product.discount > 0" class="discount-badge">
                -{{ product.discount }}%
              </div>
              
              <div v-if="product.isNew" class="new-badge">
                NEW
              </div>

              <ProductCard
                :title="product.name"
                :price="product.price"
                :oldPrice="product.discount > 0 ? product.originalPrice : undefined"
                :rating="4.5"
                :reviewCount="100"
                :isOnSale="product.discount > 0"
                :image="product.image"
                :productId="product._id"
                @add-to-cart="addToCart(product)"
              />
            </div>
          </div>
          <div class="load-more">
            <router-link to="/products" class="load-more-btn">Load More Products</router-link>
          </div>
        </div>
      </section>
    </main>
  
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
    margin-top: 70px;
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
  

  @media (max-width: 1024px) {
    .hero-section h1 {
      font-size: 2.8rem;
    }
    
    .section-title {
      font-size: 1.75rem;
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
  }

  .headerClass {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .discount-badge {
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
  
  .new-badge {
    position: absolute;
    top: 12px;
    left: 210px;
    background: #10b981;
    color: white;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    z-index: 10;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  </style>