<template>
<Header />
  <div class="min-h-screen bg-gray-50 py-12 px-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-semibold text-gray-800 mb-8">My Order</h1>

      <!-- Order Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <!-- Order Header -->
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">
            Order ID: {{ order.id }}
          </h2>
          <p class="text-gray-500">
            <span class="font-medium">Order Date:</span> {{ order.date }}
          </p>
        </div>

        <!-- Order Items -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex items-center gap-6 py-4"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-24 h-24 object-cover border border-gray-200 rounded"
            />
            <div class="flex-1">
              <h3 class="text-gray-800 font-medium">{{ item.name }}</h3>
            </div>
            <div class="text-right">
              <p class="text-xl font-semibold text-gray-800">${{ item.price.toFixed(2) }}</p>
              <p class="text-gray-500 text-sm mt-1">Qty: {{ item.quantity }}</p>
            </div>
          </div>
        </div>

        <!-- Payment and Summary Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Side: Payment & Delivery -->
          <div>
            <!-- Payment -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-3">Payment</h3>
              <p class="text-gray-600">{{ order.payment }}</p>
            </div>

            <!-- Delivery -->
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-3">Delivery</h3>
              <p class="text-gray-600">{{ order.delivery.address }}</p>
              <p class="text-gray-600">{{ order.delivery.city }}</p>
            </div>
          </div>

          <!-- Right Side: Order Summary -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span class="font-medium">${{ order.summary.subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span class="font-medium">${{ order.summary.delivery.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span class="font-medium">${{ order.summary.tax.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t-2 border-gray-300">
                <span>Total:</span>
                <span>${{ order.summary.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  </div>
 <Footer />
</template>

<script>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
export default {
  name: 'MyOrder',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      order: {
        id: '932512742319015',
        date: 'Dec 21, 2025',
        items: [
          {
            id: 1,
            name: '15.6" FHD Display Laptop – Intel i7 – Intel HD Graphics 6000, Webcam, WiFi, Bluetooth, HDMI, Windows 11,Grey',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop',
            price: 999.00,
            quantity: 1
          }
        ],
        payment: 'Visa **69',
        delivery: {
          address: '812 Khan Mean Chey, Phnom Penh,',
          city: 'Cambodia'
        },
        summary: {
          subtotal: 999.00,
          delivery: 0,
          tax: 49,
          total: 1048
        }
      }
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>