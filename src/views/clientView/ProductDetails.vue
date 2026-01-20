<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';

export default {
  name: 'ProductDetails',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      quantity: 1,
      selectedImage: 0,
      images: [
        '/washingMachine.jpg',
        '/washingMachine.jpg',
        '/washingMachine.jpg',
        '/washingMachine.jpg'
      ],
      relatedProducts: [
        {
          id: 1,
          name: 'Smart Refrigerator 25 cu ft',
          price: 1299.00,
          oldPrice: 1499.00,
          image: '/categories/7_fridge.png',
          rating: 4.7,
          badge: 'Sale'
        },
        {
          id: 2,
          name: 'Microwave Oven 1.5 cu ft',
          price: 199.00,
          image: '/categories/5_oven.png',
          rating: 4.5,
          badge: 'New'
        },
        {
          id: 3,
          name: 'Coffee Maker Automatic',
          price: 179.00,
          oldPrice: 249.00,
          image: '/categories/5_oven.png',
          rating: 4.6,
          badge: 'Sale'
        },
        {
          id: 4,
          name: 'Air Purifier Smart',
          price: 299.00,
          image: '/categories/1_AC.png',
          rating: 4.8,
          badge: null
        }
      ]
    };
  },
  mounted() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },
  methods: {
    selectImage(index) {
      this.selectedImage = index;
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      alert(`Added ${this.quantity} item(s) to cart!`);
    },
    addToWishlist() {
      alert('Added to wishlist!');
    },
    viewDetails(productId) {
      this.$router.push({ 
        name: 'pdetails', 
        params: { id: productId } 
      });
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
};
</script>

<template>
  <div class="product-details-page">
    <Header />
    
    <main class="main-content">
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/home">Home</router-link> 
          <span class="separator">/</span> 
          <router-link to="/products">Products</router-link> 
          <span class="separator">/</span> 
          <span class="current">Air Conditioner</span>
        </div>

        <div class="product-section">
          <div class="product-grid">
            <div class="product-images">
              <div class="main-image-wrapper">
                <img src="/washingMachine.jpg" alt="Product" class="main-product-image">
                <div class="badge-sale">-12% OFF</div>
              </div>
            </div>

            <div class="product-details">
              <h1 class="product-title">Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms</h1>
              
              <div class="rating-section">
                <div class="stars">★★★★★</div>
                <span class="reviews-count">(128 reviews)</span>
              </div>

              <div class="price-section">
                <span class="current-price">$139.00</span>
                <span class="original-price">$159.00</span>
                <span class="save-badge">Save $20</span>
              </div>

              <div class="product-meta">
                <div class="meta-item">
                  <span class="meta-label">Brand:</span>
                  <span class="meta-value">CoolAir</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">SKU:</span>
                  <span class="meta-value">AC-5000-2024</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Availability:</span>
                  <span class="meta-value in-stock">In Stock (24 units)</span>
                </div>
              </div>

              <div class="quantity-section">
                <div class="quantity-wrapper">
                  <label>Quantity:</label>
                  <div class="quantity-controls">
                    <button class="quantity-btn" @click="decreaseQuantity">−</button>
                    <input type="number" v-model.number="quantity" class="quantity-input" min="1" readonly>
                    <button class="quantity-btn" @click="increaseQuantity">+</button>
                  </div>
                </div>
                <button class="add-to-cart-btn" @click="addToCart">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  Add to Cart
                </button>
                <button class="wishlist-btn" @click="addToWishlist">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              <div class="payment-section">
                <p class="payment-title">Guaranteed Safe & Secure Checkout</p>
                <div class="payment-icons">
                  <img src="/pdetail/visa.jpg" alt="Visa" class="payment-icon">
                  <img src="/pdetail/aba.png" alt="ABA" class="payment-icon">
                  <img src="/pdetail/ace.png" alt="ACE" class="payment-icon">
                </div>
              </div>
            </div>
          </div>

          <div class="details-tabs-section">
            <div class="tabs">
              <button class="tab active">Description</button>
              <button class="tab">Specifications</button>
              <button class="tab">Reviews</button>
            </div>

            <div class="tab-content">
              <div class="description-content">
                <h3>Product Description</h3>
                <p class="product-description">
                  Experience efficient cooling with our 5000 BTU Air Conditioner, perfect for smaller spaces like bedrooms and guest rooms. 
                  This compact unit delivers powerful cooling performance while maintaining energy efficiency. Features include multiple 
                  fan speeds, adjustable thermostat, and easy-to-use controls.
                </p>
              </div>
            </div>
          </div>

          <div class="related-section">
            <h2 class="section-title">You May Also Like</h2>
            <div class="related-products">
              <div 
                v-for="product in relatedProducts" 
                :key="product.id"
                class="product-card"
                @click="viewDetails(product.id)"
              >
                <div class="product-card-image">
                  <img :src="product.image" :alt="product.name">
                  <div v-if="product.badge" class="card-badge" :class="product.badge.toLowerCase()">
                    {{ product.badge }}
                  </div>
                </div>
                <div class="card-content">
                  <h4 class="product-card-title">{{ product.name }}</h4>
                  <div class="card-rating">
                    ★★★★★ <span>({{ product.rating }})</span>
                  </div>
                  <div class="price-row">
                    <p class="product-card-price">${{ product.price.toFixed(2) }}</p>
                    <p v-if="product.oldPrice" class="old-price">${{ product.oldPrice.toFixed(2) }}</p>
                  </div>
                  <button class="card-btn" @click.stop="addToCart">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.product-details-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 40px 0 80px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.separator {
  color: #cbd5e1;
}

.current {
  color: #1e293b;
  font-weight: 500;
}

.product-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.main-product-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
  padding: 20px;
}

.badge-sale {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.thumbnail-gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.thumbnail {
  width: 100px;
  height: 100px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 28px;
  color: #1e293b;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  color: #fbbf24;
  font-size: 20px;
  letter-spacing: 2px;
}

.reviews-count {
  color: #64748b;
  font-size: 15px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 36px;
  font-weight: 800;
  color: #164be9;
}

.original-price {
  color: #94a3b8;
  text-decoration: line-through;
  font-size: 24px;
}

.save-badge {
  background: #dcfce7;
  color: #16a34a;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.meta-label {
  color: #64748b;
  font-weight: 500;
}

.meta-value {
  color: #1e293b;
  font-weight: 600;
}

.meta-value.in-stock {
  color: #16a34a;
}

.quantity-section {
  display: flex;
  gap: 12px;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-wrapper label {
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
}

.quantity-controls {
  padding: 0px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
}

.quantity-btn {
  background: white;
  border: none;
  width: 40px;
  height: 44px;
  cursor: pointer;
  font-size: 20px;
  color: #1e293b;
  font-weight: bold;
  transition: all 0.3s;
}

.quantity-btn:hover {
  background: #3b82f6;
  color: white;
}

.quantity-input {
  color: #1e293b;
  width: 60px;
  text-align: center;
  border: none;
  border-left: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
  font-size: 16px;
  font-weight: 600;
  background: white;
}

.add-to-cart-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.wishlist-btn {
  background: white;
  border: 2px solid #e2e8f0;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

.payment-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e2e8f0;
}

.payment-title {
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 600;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.payment-icon {
  width: 60px;
  height: 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  object-fit: contain;
  padding: 4px;
  transition: all 0.3s;
}

.payment-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.details-tabs-section {
  margin-bottom: 60px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 30px;
}

.tab {
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tab:hover {
  color: #3b82f6;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  padding: 20px 0;
}

.description-content h3 {
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 16px;
  font-weight: 700;
}

.product-description {
  color: #64748b;
  line-height: 1.8;
  font-size: 15px;
  margin-bottom: 32px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.features-list li {
  padding: 12px 12px 12px 40px;
  color: #1e293b;
  font-size: 15px;
  position: relative;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 500;
}

.features-list li:before {
  content: "✓";
  color: #3b82f6;
  font-weight: bold;
  position: absolute;
  left: 12px;
  font-size: 18px;
}

.related-section {
  margin-top: 60px;
}

.section-title {
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 32px;
  font-weight: 700;
  text-align: center;
}

.related-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
}

.product-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  border-color: #3b82f6;
}

.product-card-image {
  width: 100%;
  height: 240px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-card-image img {
  transform: scale(1.1);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.card-badge.sale {
  background: #ef4444;
}

.card-badge.new {
  background: #10b981;
}

.card-content {
  padding: 20px;
}

.product-card-title {
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.4;
}

.card-rating {
  color: #fbbf24;
  font-size: 14px;
  margin-bottom: 12px;
}

.card-rating span {
  color: #64748b;
  font-size: 13px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.product-card-price {
  font-size: 20px;
  color: #3b82f6;
  font-weight: 800;
  margin: 0;
}

.old-price {
  font-size: 16px;
  color: #94a3b8;
  text-decoration: line-through;
  margin: 0;
}

.card-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.card-btn:hover {
  background: #2563eb;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .main-product-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 0 40px;
  }

  .product-section {
    padding: 24px;
  }

  .product-title {
    font-size: 22px;
  }

  .current-price {
    font-size: 28px;
  }

  .quantity-section {
    flex-direction: column;
    align-items: stretch;
  }

  .add-to-cart-btn {
    justify-content: center;
    width: 100%;
  }

  .related-products {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .tabs {
    overflow-x: auto;
  }
}

@media (max-width: 480px) {
  .product-title {
    font-size: 20px;
  }

  .current-price {
    font-size: 24px;
  }

  .related-products {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>