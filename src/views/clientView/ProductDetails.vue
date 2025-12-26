<script>
import Footer from '@/components/footer.vue';
import Header from '@/components/header.vue';

export default {
  name: 'ManageProduct',
   components: {
    Header,
    Footer
  },
  data() {
    return {
      activeThumb: 1,
      thumbnailImages: [
        '/pdetail/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms.png',
        '/pdetail/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 2.png',
        '/pdetail/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 4.png',
        '/pdetail/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 3.png'
      ],
      quantity: 1,
      mainImage: '/pdetail/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms.png'
    };
  },
  mounted() {
    console.log('ManageProduct component loaded');
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
    selectThumb(index) {
      this.activeThumb = index;
      this.mainImage = this.thumbnailImages[index - 1];
      console.log('Selected thumbnail:', index);
    },
    addToCart() {
      console.log(`Added item(s) to cart`);
      alert("Added "+ this.quantity+ " to cart!");
    }
  }
};
</script>


<template>
 <Header />
  <div class="page-wrapper">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="#">Home</a> / <a href="#">Products</a> / <span>Air Conditioner</span>
      </div>

      <!-- Section 1: Product Details -->
      <div class="product-grid">
        <div class="product-images">
          <div class="main-image-wrapper">
            <img :src="mainImage" alt="Air Conditioner" class="main-product-image">
          </div>
          
          <div class="thumbnail-gallery">
            <div 
              v-for="index in 4" 
              :key="index"
              class="thumbnail"
              :class="{ active: activeThumb === index }"
              @click="selectThumb(index)"
            >
              <img :src="thumbnailImages[index - 1]" alt="">
            </div>
          </div>
        </div>

        <div class="product-details">
          <div class="rating-section">
            <div class="stars">
              ★★★★★
            </div>
            <span class="reviews-count">(128 reviews)</span>
          </div>

          <h1 class="product-title">Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms</h1>
          
          <div class="price-section">
            <span class="current-price">$139.00</span>
            <span class="original-price">$159.00</span>
          </div>

          <p class="product-description">Experience optimal comfort with our 5000 BTU air conditioner. Perfect for cooling smaller spaces like bedrooms and guest rooms. Energy-efficient design ensures lower electricity bills while maintaining ideal temperatures throughout the day.</p>

          <div class="key-features">
            <h3>Key Features</h3>
            <ul class="features-list">
              <li>Newest cooling technology for maximum efficiency</li>
              <li>Best in class components with premium quality</li>
              <li>Compact dimensions: 69.5 × 75.0 × 169.0 cm</li>
              <li>Maintenance free operation</li>
              <li>12 years comprehensive warranty</li>
            </ul>
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
              <span class="cart-icon"></span>Add to cart
            </button>
            <button class="wishlist-btn">♡</button>
          </div>

          <div class="product-meta">
            <p class="category">
              <strong>Category:</strong> <a href="#">Air Conditioner</a>
            </p>
            <p class="sku"><strong>SKU:</strong> AC-5000-BTU-001</p>
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

      <!-- Section 2: More About the Product -->
      <div class="section-2">
        <div class="tabs-section">
          <div class="tabs">
            <button class="tab active">Description</button>
          </div>
        </div>


        <div class="feature-showcase">
          <div class="feature-image-container">
            <img src="/pdetail/air1.webp" alt="Product Feature" class="feature-image">
          </div>

          <div class="feature-content">
            <h3 class="feature-title">Advanced Cooling Technology</h3>
            <p class="feature-description">
              Our air conditioner uses state-of-the-art cooling technology to provide efficient temperature control. 
              With smart sensors and automatic adjustments, it maintains the perfect climate in your space.
            </p>
            <ul class="feature-bullets">
              <li>Smart temperature sensing and auto-adjustment</li>
              <li>Whisper-quiet operation for peaceful sleep</li>
              <li>Eco-friendly refrigerant for environmental protection</li>
            </ul>
          </div>
        </div>

        <div class="feature-showcase reverse">
          <div class="feature-content">
            <h3 class="feature-title">Easy Installation & User-Friendly Design</h3>
            <p class="feature-description">
              Designed with convenience in mind, our air conditioner features a simple installation process and 
              intuitive controls. The sleek modern design complements any room décor while providing powerful cooling performance.
            </p>
          </div>

          <div class="feature-image-container">
            <img src="/pdetail/air2.webp" alt="Product Feature" class="feature-image">
          </div>
        </div>

        <h2 class="section-title">You May Also Like</h2>
        <div class="related-products">
          <div class="product-card">
            <div class="product-card-image">
              <img src="/pdetail/air1.webp" alt="Product">
              <span class="card-badge">NEW</span>
            </div>
            <h4 class="product-card-title">Air Conditioner 8000 BTU</h4>
            <div class="card-rating">★★★★☆ (64)</div>
            <p class="product-card-price">$189.00</p>
            <button class="card-btn">Quick View</button>
          </div>

          <div class="product-card">
            <div class="product-card-image">
              <img src="/pdetail/air2.webp" alt="Product">
            </div>
            <h4 class="product-card-title">Portable AC 10000 BTU</h4>
            <div class="card-rating">★★★★★ (92)</div>
            <p class="product-card-price">$229.00</p>
            <button class="card-btn">Quick View</button>
          </div>

          <div class="product-card">
            <div class="product-card-image">
              <img src="/pdetail/air1.webp" alt="Product">
              <span class="card-badge sale">-20%</span>
            </div>
            <h4 class="product-card-title">Window AC 6000 BTU</h4>
            <div class="card-rating">★★★★☆ (47)</div>
            <p class="product-card-price">$159.00</p>
            <button class="card-btn">Quick View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page-wrapper {
  min-height: 100vh;
  
}

.container {
  max-width: 1500px;
  margin: 0 auto;
  background: white;
  padding: 40px;
}

.breadcrumb {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.breadcrumb a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #764ba2;
}

.breadcrumb span {
  color: #333;
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 20px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.main-product-image {
  width: 100%;
  height: 550px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
  padding: 40px;
  object-fit: contain;
  transition: transform 0.3s;
}

.main-image-wrapper:hover .main-product-image {
  transform: scale(1.05);
}

.badge-sale {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.thumbnail-gallery {
  display: flex;
  gap: 15px;
  overflow-x: auto;
}

.thumbnail {
  width: 130px;
  height: 150px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 3px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 10px;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transform: translateY(-4px);
}

.thumbnail.active {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transform: translateY(-4px);
}

.product-details {
  display: flex;
  flex-direction: column;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  color: #ffc107;
  font-size: 18px;
  letter-spacing: 2px;
}

.reviews-count {
  color: #666;
  font-size: 14px;
}

.product-title {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.current-price {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 20px;
}

.save-badge {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.product-description {
  color: #555;
  line-height: 1.8;
  font-size: 10px;
}

.key-features {
  padding: 5px;
  border-radius: 12px;
}

.key-features h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: 10px 0;
  color: #444;
  font-size: 14px;
  position: relative;
  padding-left: 30px;
  font-weight: 500;
}

.features-list li:before {
  content: "✓";
  color: #ff6b6b;
  font-weight: bold;
  position: absolute;
  left: 0;
  font-size: 18px;
}

.availability {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.stock-badge {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.stock-badge.in-stock {
  background: #d4edda;
  color: #155724;
}

.delivery-info {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 25px 0;
  flex-wrap: wrap;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-wrapper label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quantity-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  color: white;
  font-weight: bold;
  transition: all 0.3s;
}

.quantity-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.quantity-input {
color: #000000;
  width: 60px;
  text-align: center;
  border: none;
  font-size: 16px;
  font-weight: 600;
  background: white;
}

.add-to-cart-btn {
  background: rgb(145, 235, 145);
  color: white;
  border: none;
  width: 140px;
  height: 40px;
  padding: 2px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-to-cart-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.5);
}


.wishlist-btn {
  background: white;
  border: 2px solid #e0e0e0;
  width: 50px;
  height: 43px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
}

.wishlist-btn:hover {
  border-color: #f5576c;
  color: #f5576c;
  transform: scale(1.1);
}

.product-meta {
  display: flex;
  gap: 30px;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.product-meta p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.product-meta a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.product-meta a:hover {
  text-decoration: underline;
}

.payment-section {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  padding: 25px;
  border-radius: 12px;
  text-align: center;
}

.payment-title {
  font-size: 15px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.payment-icon {
  width: 70px;
  height: 45px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
  object-fit: contain;
  padding: 5px;
}

.payment-icon:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Section 2 Styles */
.section-2 {
  margin-top: 80px;
}

.tabs-section {
  margin-bottom: 40px;
}

.tabs {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  background: none;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab:hover {
  color: #667eea;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 60px;
}

.benefit-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.benefit-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.benefit-card h4 {
  font-size: 18px;
  color: #333;
  margin: 10px 0;
  font-weight: 700;
}

.benefit-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.section-title {
  font-size: 36px;
  color: #1a1a1a;
  margin-bottom: 30px;
  font-weight: 700;
  text-align: center;
}

.feature-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
  align-items: center;
}

.feature-showcase.reverse {
  grid-template-columns: 1fr 1fr;
}

.feature-showcase.reverse .feature-content {
  order: 1;
}

.feature-showcase.reverse .feature-image-container {
  order: 2;
}

.feature-image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.feature-image {
  width: 100%;
  height: 450px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s;
}

.feature-image-container:hover .feature-image {
  transform: scale(1.1);
}

.feature-content {
  padding: 20px;
}

.feature-title {
  font-size: 28px;
  color: #1a1a1a;
  margin-bottom: 20px;
  font-weight: 700;
  line-height: 1.3;
}

.feature-description {
  color: #555;
  line-height: 1.8;
  font-size: 15px;
  margin-bottom: 25px;
}

.feature-bullets {
  list-style: none;
  padding: 0;
}

.feature-bullets li {
  padding: 12px 0;
  color: #555;
  font-size: 15px;
  position: relative;
  padding-left: 35px;
  font-weight: 500;
}

.feature-bullets li:before {
  content: "✓";
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
  font-size: 20px;
}

.related-products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.product-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.product-card-image {
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
  transform: scale(1.15);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.card-badge.sale {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.product-card-title {
  padding: 20px 20px 10px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.card-rating {
  padding: 0 20px;
  color: #ffc107;
  font-size: 14px;
  margin-bottom: 10px;
}

.product-card-price {
  padding: 0 20px 20px;
  font-size: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  margin: 0;
}

.card-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.card-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

@media (max-width: 1024px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 20px 10px;
  }

  .container {
    padding: 20px;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .product-title {
    font-size: 24px;
  }

  .current-price {
    font-size: 32px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .feature-showcase,
  .feature-showcase.reverse {
    grid-template-columns: 1fr;
  }

  .related-products {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
  }

  .quantity-section {
    flex-direction: column;
    align-items: stretch;
  }

  .add-to-cart-btn {
    justify-content: center;
  }
}
</style>