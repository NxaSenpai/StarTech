<script>
export default {
  name: 'ManageProduct',
  data() {
    return {
      activeThumb: 1,
      thumbnailImages: [
        '/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms.png',
        '/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 2.png',
        '/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 4.png',
        '/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms - Image 3.png'
      ],
      quantity: 1,
      mainImage: '/Item → Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms.png'
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
      alert(`Added item(s) to cart!`);
    }
  }
};
</script>

<template>
  <div class="container">
    <!-- Section 1: Product Details -->
    <div class="product-grid">
      <div class="product-images">
        <img :src="mainImage" alt="Air Conditioner" class="main-product-image">
        
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
        <h2 class="product-title">Air Conditioner 5000 BTU, Efficient Cooling for Smaller Areas Like Bedrooms and Guest Rooms</h2>
        
        <div class="price-section">
          <span class="original-price">$159.00</span>
          <span class="current-price">$139.00</span>
        </div>

        <p class="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin consequat iusto in cursus. Proin non velit quam. Etiam diam turpis, elementum in gravida maximus, efficitur quis nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit eimet interdum lorem. Mauris elementum justo id ante ornare consectetur.</p>

        <div class="key-features">
          <h3>Key Features</h3>
          <ul class="features-list">
            <li>Newest technology</li>
            <li>Best in class components</li>
            <li>Dimensions: 69.5 × 75.0 × 169.0</li>
            <li>Maintenance free</li>
            <li>12 years warranty</li>
          </ul>
        </div>

        <div class="quantity-section">
          <div class="quantity-controls">
            <button class="quantity-btn" @click="decreaseQuantity">-</button>
            <input type="number" class="quantity-input" v-model.number="quantity" min="1">
            <button class="quantity-btn" @click="increaseQuantity">+</button>
          </div>
          <button class="add-to-cart-btn" @click="addToCart()">Add to cart</button>
        </div>

        <p class="category">Category: <a href="#">Air conditioner</a></p>
        <hr>
        <div class="payment-section">
          <p class="payment-title">Guaranteed Safe Checkout</p>
          <div class="payment-icons">
            <img src="/visa.jpg" class="payment-icon visa">
            <img src="/visa.jpg" class="payment-icon visa">
            <img src="/visa.jpg" class="payment-icon visa">
            <img src="/visa.jpg" class="payment-icon visa">
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: More About the Product -->
    <div class="section-2">
      <h2 class="section-title">More about the product</h2>
      <p class="section-description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin consequat iusto in cursus. 
        Proin non velit quam. Etiam diam turpis, elementum in gravida maximus, efficitur quis nulla. Lorem ipsum 
        dolor sit amet, consectetur adipiscing elit. Vivamus sit eimet interdum lorem.
      </p>

      <div class="feature-showcase">
        <div class="feature-image-container">
          <img src="" alt="Product Feature" class="feature-image">
          <div class="feature-overlay">
            <p class="overlay-text">
              Cras vehicula semper ex id fermentum turtor varius eget estension et malesuada fames ac ante ipsum, eget.
            </p>
          </div>
        </div>

        <div class="feature-content">
          <h3 class="feature-title">Product's Features</h3>
          <p class="feature-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin consequat iusto in cursus. 
            Proin non velit quam. Etiam diam turpis.
          </p>
          <ul class="feature-bullets">
            <li>Sed ut perspiciatis unde omnis iste</li>
            <li>Nemo enim ipsam voluptatem</li>
            <li>Dolorem eum fugiat quo voluptas</li>
          </ul>
        </div>
      </div>

      <div class="feature-showcase reverse">
        <div class="feature-content">
          <h3 class="feature-title">Item Blanditiis quidem praesentius tuttifes</h3>
          <p class="feature-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin consequat iusto in cursus. 
            Proin non velit quam. Etiam diam turpis, elementum in gravida maximus, efficitur quis nulla.
          </p>
        </div>

        <div class="feature-image-container">
          <img src="" alt="Product Feature" class="feature-image">
        </div>
      </div>

      <h2 class="section-title">Related products</h2>
      <div class="related-products">
        <h1>component</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-product-image {
  width: 100%;
  height: 550px;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  object-fit: contain;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-top: 10px;
}

.thumbnail {
  width: 128px;
  height: 130px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #4CAF50;
}

.thumbnail.active {
  border-color: #4CAF50;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 24px;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 18px;
}

.current-price {
  color: #4CAF50;
  font-size: 24px;
  font-weight: 700;
}

.product-description {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.key-features {
  margin-top: 5px;
}

.key-features h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.features-list {
  list-style: none;
}

.features-list li {
  padding: 5px 0;
  color: #666;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.features-list li:before {
  content: "✓";
  color: #4CAF50;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.quantity-controls {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.quantity-btn {
  background: #f5f5f5;
  border: none;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s;
}

.quantity-btn:hover {
  background: #e0e0e0;
}

.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  font-size: 14px;
}

.add-to-cart-btn {
  background: #333;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.3s;
}

.add-to-cart-btn:hover {
  background: #555;
}

.category {
  color: #666;
  font-size: 14px;
}

.category a {
  color: #4CAF50;
  text-decoration: none;
}

.category a:hover {
  text-decoration: underline;
}

hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 10px 0;
}

.payment-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

.payment-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.payment-icon {
  width: 50px;
  height: 32px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Section 2 Styles */
.section-2 {
  margin-top: 60px;
}

.section-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.section-description {
  color: #666;
  line-height: 1.8;
  font-size: 14px;
  margin-bottom: 40px;
}

.feature-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
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
  border-radius: 8px;
  overflow: hidden;
  background: #e0e0e0;
}

.feature-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.feature-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 30px;
}

.overlay-text {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.feature-content {
  padding: 20px;
}

.feature-title {
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-description {
  color: #666;
  line-height: 1.8;
  font-size: 14px;
  margin-bottom: 20px;
}

.feature-bullets {
  list-style: none;
  padding: 0;
}

.feature-bullets li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  position: relative;
  padding-left: 25px;
}

.feature-bullets li:before {
  content: "✓";
  color: #4CAF50;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.related-products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-card-image {
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card-title {
  padding: 15px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.product-card-price {
  padding: 0 15px 15px;
  font-size: 18px;
  color: #4CAF50;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 15px;
  }

  .feature-showcase {
    grid-template-columns: 1fr;
  }

  .related-products {
    grid-template-columns: 1fr;
  }
}
</style>