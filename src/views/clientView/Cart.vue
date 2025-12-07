<template>
  <div class="cart-body " style="color:black">
    <div class="cart-container ">
        
      <h1 class="title">Cart</h1>
        <div v-if="notice.show" :class="['notice-box', notice.type]" class="empty-msg">
            <span>{{ notice.message }}</span>

            <!-- Undo button (only for delete) -->
            <button v-if="notice.canUndo" @click="undoDelete" class="undo-btn">
                Undo
            </button>
        </div>
      <!-- Empty Cart -->
      <div v-if="Cart_data.length === 0" class="empty-msg">
        <hr>
        Your cart is curently empty.
      </div>

      <!-- Cart Table -->
      <table v-else class="cart-table" >
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <!-- Single unified display -->
       <tbody>
            <tr v-for="item in Cart_data" :key="item.id">
                <td class="remove">
                <button @click="removeItem(item.id)">✕</button>
                </td>

                <td class="product-info">
                <img :src="item.image" class="product-img" />
                <span style="color:black">{{ item.name }}</span>
                </td>

                <td>${{ item.price }}</td>

                <td>
                <div class="qty-box">
                    <button @click="updateQty(item.id, item.qty - 1)">-</button>
                    <input type="number" v-model.number="item.qty" @change="updateQty(item.id, item.qty)" />
                    <button @click="updateQty(item.id, item.qty + 1)">+</button>
                </div>
                </td>

                <td>${{ item.qty * item.price }}</td>
            </tr>
        </tbody>

      </table>

      <!-- Cart Totals -->
      <div v-if="Cart_data.length > 0" class="totals-box">
        <h3>Cart Total</h3>

        <div class="totals-row">
          <span>Subtotal:</span>
          <strong>${{ totalAmount }}</strong>
        </div>

        <button class="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: "Cart",
  
  data(){
    return {
      Cart_data: [],
      cartUpdated: false,
      notice: {
      show: false,
      message: "",
      type: "info",   // info | success | warning
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
        this.showNotice("Cart update","success",false)
      }
    },
     showNotice(message, type = "info", canUndo = false) {
        this.notice = {
        show: true,
        message,
        type,
        canUndo
        };

        
        
    },
        removeItem(id) {
        const index = this.Cart_data.findIndex(p => p.id === id);
        if (index !== -1) {
        this.deletedItem = this.Cart_data[index];
        this.Cart_data.splice(index, 1);

        this.showNotice("Item removed", "warning", true);
        }
    },

    undoDelete() {
        if (this.deletedItem) {
        this.Cart_data.push(this.deletedItem);
        this.deletedItem = null;

        this.showNotice("Item restored", "success", false);
        }
    }
    // removeItem(id) {
    //   const index = this.Cart_data.findIndex(p => p.id === id);
    //   if (index !== -1) {
    //     this.Cart_data.splice(index, 1);
    //     this.showUpdateMessage();
    //   }
    // },

    // showUpdateMessage() {
    //   this.cartUpdated = true;
    //   setTimeout(() => {
    //     this.cartUpdated = false;
    //   }, 3000);
    // },
    
  },

  mounted() {
    // Add static items into cart list
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
        name: "Multigroomer All-in-One Trimmer Series 5000, 23 Piece Mens Grooming Kit",
        image: "background_log.jpg",
        price: 44.00,
        qty: 1
      }


    ];
      this.Cart_data = [...this.Cart_data, ...staticItems];
    // this.Cart_data.push(...staticItems);
  }
};
</script>

<style scoped>
.cart-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  display:grid;
  grid-row: 1;
  grid-column: 2;
}

.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.update-message {
  background-color: #f0f9ff;
  border: 1px solid #3b82f6;
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.update-message svg {
  color: #3b82f6;
  flex-shrink: 0;
}

.empty-msg {
  background: #d7d0d7;
  width: 1200px;
  height: 50px;
  display: flex;
  align-items: center;
  text-align:left;
  
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.cart-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.cart-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.cart-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  color: #1f2937;
}

.remove button {
  width: 24px;
  height: 24px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
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
  width: 60px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.product-info span {
  color: #3b82f6;
  font-size: 14px;
  line-height: 1.5;
}

.qty-box {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: fit-content;
}

.qty-box button {
  width: 32px;
  height: 36px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  transition: background-color 0.2s;
}

.qty-box button:hover {
  background-color: #f3f4f6;
}

.qty-box input {
  width: 50px;
  height: 36px;
  border: none;
  border-left: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
  text-align: center;
  font-size: 14px;
  -moz-appearance: textfield;
}

.qty-box input::-webkit-outer-spin-button,
.qty-box input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.totals-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.totals-box h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2c3e50;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.totals-row span {
  color: #6b7280;
  font-size: 14px;
}

.totals-row strong {
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.coupon-text {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
  display: block;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #1a252f;
}

@media (max-width: 768px) {
  .cart-table {
    font-size: 12px;
  }
  
  .product-img {
    width: 50px;
    height: 60px;
  }
  
  .totals-box {
    max-width: 100%;
  }
}
</style>