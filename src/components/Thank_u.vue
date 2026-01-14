<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <!-- Popup -->
      <transition name="scale">
        <div
          class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-4"
        >
          <h2 class="font-serif text-3xl font-semibold text-gray-900">
            Thank You!
          </h2>
          <p class="font-sans text-gray-700">
            Your order has been received. We truly appreciate your trust in us!
          </p>

          <!-- Actions -->
          <div class="flex justify-center gap-4 pt-4">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              @click="proceedToShop"
            >
              Continue Shopping
            </button>
            <button
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
              @click="closePopup"
            >
              Close
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ThankYouPopup",
  props: {
    show: { type: Boolean, default: false },
  },
  emits: ["update:show"],
   watch: {
    show(newVal) {
      if (newVal) {
        // Auto-hide after 3 seconds
        setTimeout(() => {
          this.closePopup();
        }, 1000);
      }
    },
  },
  methods: {
    closePopup() {
      this.$emit("update:show", false);
    },
    proceedToShop() {
      this.closePopup();
      this.$router.push("/products");
    },
  },
};
</script>

<style>
/* Simple transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: transform 0.3s, opacity 0.3s;
}
.scale-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.scale-leave-active {
  transition: transform 0.2s, opacity 0.2s;
}
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
