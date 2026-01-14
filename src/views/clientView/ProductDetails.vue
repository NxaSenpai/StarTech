<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';

export default {
  name: 'ProductDetails',
  components: {
    Header,
    Footer
  },

  mounted() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  },
  methods: {
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
 <Header />
  <div class="page-wrapper">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/home">Home</router-link> 
        <span class="separator">/</span> 
        <router-link to="/products">Products</router-link> 
        <span class="separator">/</span> 
        <span class="current">Air Conditioner</span>
      </div>

      <div class="product-grid">
        <div class="product-images">
          <div class="main-image-wrapper">
            <img src="/washingMachine.jpg" alt="washingMachine" class="main-product-image">
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
              <span class="meta-label">Category:</span>
              <router-link to="/category" class="meta-value">Air Conditioner</router-link>
            </div>
            <div class="meta-item">
              <span class="meta-label">SKU:</span>
              <span class="meta-value">AC-5000-BTU-001</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Availability:</span>
              <span class="meta-value in-stock">In Stock</span>
            </div>
          </div>

          <div class="quantity-section">
            <div class="quantity-wrapper">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button class="quantity-btn" @click="decreaseQuantity">−</button>
                <input class="quantity-input" v-model.number="quantity" min="1">
                <button class="quantity-btn" @click="increaseQuantity">+</button>
              </div>
            </div>
            <button class="add-to-cart-btn" @click="addToCart()">
              Add to Cart
            </button>
            <button class="wishlist-btn">♡</button>
          </div>

          <div class="payment-section">
            <p class="payment-title">Guaranteed Safe & Secure Checkout</p>
            <div class="payment-icons">
              <img src="/pdetail/visa.jpg" class="payment-icon" alt="Visa">
              <img src="/pdetail/aba.png" class="payment-icon" alt="ABA">
              <img src="/pdetail/ace.png" class="payment-icon" alt="ACE">
              <img src="/pdetail/pay.png" class="payment-icon" alt="Pay">
            </div>
          </div>
        </div>
      </div>

      <div class="section-2">
        <div class="tabs-section">
          <div class="tabs">
            <button class="tab active">Description</button>
            <button class="tab">Reviews (128)</button>
          </div>
        </div>

        <div class="tab-content">
          <div class="description-content">
            <h3>Product Description</h3>
            <p class="product-description">
              Experience optimal comfort with our 5000 BTU air conditioner. Perfect for cooling smaller spaces like bedrooms and guest rooms. Energy-efficient design ensures lower electricity bills while maintaining ideal temperatures throughout the day.
            </p>
            
            <h3>Key Features</h3>
            <ul class="features-list">
              <li>5000 BTU cooling capacity - ideal for rooms up to 150 sq ft</li>
              <li>Energy-efficient operation with eco-friendly refrigerant</li>
              <li>Multiple fan speeds and cooling modes</li>
              <li>Easy-to-use mechanical controls</li>
              <li>Washable and reusable air filter</li>
              <li>Compact and lightweight design</li>
            </ul>
          </div>
        </div>

        <div class="related-section">
          <h2 class="section-title">You May Also Like</h2>
          <div class="related-products">
            <div class="product-card" @click="viewDetails(1)">
              <div class="product-card-image">
                <img src="/washingMachine.jpg" alt="Product">
                <span class="card-badge">NEW</span>
              </div>
              <div class="card-content">
                <h4 class="product-card-title">Air Conditioner 8000 BTU</h4>
                <div class="card-rating">★★★★☆ (64)</div>
                <p class="product-card-price">$189.00</p>
                <button class="card-btn">Quick View</button>
              </div>
            </div>

            <div class="product-card" @click="viewDetails(2)">
              <div class="product-card-image">
                <img src="/washingMachine.jpg" alt="Product">
              </div>
              <div class="card-content">
                <h4 class="product-card-title">Portable AC 10000 BTU</h4>
                <div class="card-rating">★★★★★ (92)</div>
                <p class="product-card-price">$229.00</p>
                <button class="card-btn">Quick View</button>
              </div>
            </div>

            <div class="product-card" @click="viewDetails(3)">
              <div class="product-card-image">
                <img src="/washingMachine.jpg" alt="Product">
                <span class="card-badge sale">-20%</span>
              </div>
              <div class="card-content">
                <h4 class="product-card-title">Window AC 6000 BTU</h4>
                <div class="card-rating">★★★★☆ (47)</div>
                <p class="product-card-price">$159.00</p>
                <button class="card-btn">Quick View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8fafc;
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

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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
  background: rgb(99, 234, 99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 30px;
  font-weight: 800;
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
  text-decoration: none;
}

.meta-value.in-stock {
  color: #16a34a;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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
  display: flex;
  color: black;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  background: black;
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
  width: 160px;
  height: 40px;
  padding: 2px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
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
  height: 44px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 24px;
  color: #64748b;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

.payment-section {
  background: rgb(244, 238, 238);
  padding: 25px;
  border-radius: 12px;
  border: 300px;
  text-align: center;
  border-color: red;
  margin: 5px;
}

.payment-title {
  font-size: 15px;
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

.section-2 {
  margin-top: 60px;
}

.tabs-section {
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
  background: white;
  padding: 0 20px;
  border-radius: 12px 12px 0 0;
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
  background: white;
  padding: 40px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.description-content h3 {
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 16px;
  font-weight: 700;
}

.product_description {
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

.product-card-price {
  font-size: 20px;
  color: #3b82f6;
  font-weight: 800;
  margin: 0 0 16px;
}

.card-btn {
  width: 100%;
  background: rgb(114, 114, 230);
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
  .page-wrapper {
    padding: 20px 0 40px;
  }

  .product-grid {
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

  .tab-content {
    padding: 24px;
  }
}
</style>