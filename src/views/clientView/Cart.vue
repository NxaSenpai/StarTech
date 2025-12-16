<template>
  <Header />
  <div class="cart-body" style="color:black">
    <div class="cart-container">
        
      <h1 class="title">Cart</h1>
      <hr class="title-divider">

      <!-- Notice Box -->
      <div v-if="notice.show" :class="['notice-box', notice.type]">
        <svg v-if="notice.type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>{{ notice.message }}</span>

        <!-- Undo button (only for delete) -->
        <button v-if="notice.canUndo" @click="undoDelete" class="undo-btn">
          Undo?
        </button>
      </div>

      <!-- Empty Cart -->
      <div v-if="Cart_data.length === 0" class="empty-msg">
        Your cart is currently empty.
      </div>

      <!-- Cart Layout -->
      <div v-else class="cart-layout">
        <!-- Cart Table -->
        <div class="cart-table-wrapper">
          <table class="cart-table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in Cart_data" :key="item.id">
                <td class="remove">
                  <button @click="removeItem(item.id)">✕</button>
                </td>

                <td class="product-info">
                  <img :src="item.image" class="product-img" />
                  <span>{{ item.name }}</span>
                </td>

                <td class="price-cell">${{ item.price.toFixed(2) }}</td>

                <td>
                  <div class="qty-box">
                    <button @click="updateQty(item.id, item.qty - 1)">-</button>
                    <input type="number" v-model.number="item.qty" @change="updateQty(item.id, item.qty)" />
                    <button @click="updateQty(item.id, item.qty + 1)">+</button>
                  </div>
                </td>

                <td class="subtotal-cell">${{ (item.qty * item.price).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cart Totals -->
        <div class="totals-box">
          <h3>Cart totals</h3>

          <div class="totals-row">
            <span>Subtotal</span>
            <strong>${{ totalAmount }}</strong>
          </div>

          <div class="totals-row total-row">
            <span>Total</span>
            <strong>${{ totalAmount }}</strong>
          </div>

          <p class="coupon-text">Have a coupon?</p>

          <button class="checkout-btn">
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

export default {
  name: "Cart",
  components: {
    Header,
    Footer
  },
  
  data() {
    return {
      Cart_data: [],
      notice: {
        show: false,
        message: "",
        type: "info",
        canUndo: false
      },
      deletedItem: null
    }
  },

  computed: {
    totalAmount() {
      return this.Cart_data.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ).toFixed(2);
    }
  },

  methods: {
    updateQty(id, newQty) {
      if (newQty < 1) newQty = 1;
      const item = this.Cart_data.find(p => p.id === id);
      if (item) {
        item.qty = newQty;
        this.showNotice("Cart updated.", "success", false);
      }
    },

    showNotice(message, type = "info", canUndo = false) {
      this.notice = {
        show: true,
        message,
        type,
        canUndo
      };

      // Auto-hide after 5 seconds if no undo
      if (!canUndo) {
        setTimeout(() => {
          this.notice.show = false;
        }, 5000);
      }
    },

    removeItem(id) {
      const index = this.Cart_data.findIndex(p => p.id === id);
      if (index !== -1) {
        this.deletedItem = this.Cart_data[index];
        this.Cart_data.splice(index, 1);
        this.showNotice(`"${this.deletedItem.name}" removed from cart.`, "warning", true);
      }
    },

    undoDelete() {
      if (this.deletedItem) {
        this.Cart_data.push(this.deletedItem);
        this.deletedItem = null;
        this.showNotice("Item restored to cart.", "success", false);
      }
    }
  },

  mounted() {
    const staticItems = [
      {
        id: "static-1",
        name: "Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit",
        image: "smart_wifi.png",
        price: 44.00,
        qty: 3
      },
      {
        id: "static-2",
        name: "0.9 Cubic Feet Capacity 900 Watts Kitchen Essentials for the Countertop Stainless Steel",
        image: "background_log.jpg",
        price: 559.00,
        qty: 5
      }
    ];
    this.Cart_data = [...staticItems];
  }
};
</script>

<style scoped>
.cart-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f7f7f7;
  min-height: 100vh;
  padding: 40px 20px;
}

.cart-container {
  max-width: 1400px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 0;
  color: #2c3e50;
}

.title-divider {
  border: none;
  border-top: 3px solid #3e9dfb;
  margin: 10px 0 20px 0;
  width: 100%;
}

/* Notice Box */
.notice-box {
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.notice-box.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-left: 4px solid #28a745;
  color: #155724;
}

.notice-box.warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-left: 4px solid #ffc107;
  color: #856404;
}

.notice-box svg {
  flex-shrink: 0;
}

.undo-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.undo-btn:hover {
  color: #004999;
}

/* Empty Cart */
.empty-msg {
  background: white;
  padding: 20px;
  border: 1px solid #ddd;
  text-align: center;
  color: #666;
}

/* Cart Layout */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* Cart Table */
.cart-table-wrapper {
  background: white;
  border: 1px solid #ddd;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table thead {
  background-color: #1d88f4;
  
}

.cart-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: white;
  text-transform: capitalize;
}

.cart-table th:first-child {
  width: 50px;
}

.cart-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.cart-table tbody tr:last-child {
  border-bottom: none;
}

.cart-table td {
  padding: 20px 16px;
  vertical-align: middle;
  color: #333;
}

.remove button {
  width: 26px;
  height: 26px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #999;
  transition: all 0.2s;
}

.remove button:hover {
  background-color: #fee;
  border-color: #ef4444;
  color: #ef4444;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.product-info span {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.price-cell {
  font-weight: 500;
  color: #333;
}

.qty-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  width: fit-content;
  background: white;
}

.qty-box button {
  width: 32px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: background-color 0.2s;
}

.qty-box button:hover {
  background-color: #e0e0e0;
}

.qty-box input {
  width: 50px;
  height: 36px;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  -moz-appearance: textfield;
}

.qty-box input::-webkit-outer-spin-button,
.qty-box input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.subtotal-cell {
  font-weight: 600;
  color: #0066cc;
  font-size: 16px;
}

/* Cart Totals */
.totals-box {
  background: white;
  padding: 25px;
  border: 1px solid #ddd;
  position: sticky;
  top: 20px;
}

.totals-box h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.totals-row.total-row {
  border-bottom: none;
  padding-top: 15px;
  margin-top: 10px;
  border-top: 2px solid #ddd;
}

.totals-row span {
  color: #666;
  font-size: 15px;
}

.totals-row strong {
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.coupon-text {
  color: #666;
  font-size: 14px;
  margin: 15px 0;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #1a252f;
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  
  .totals-box {
    position: static;
    max-width: 500px;
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .cart-table {
    font-size: 12px;
  }
  
  .product-img {
    width: 60px;
    height: 60px;
  }
  
  .totals-box {
    max-width: 100%;
  }
}
</style>