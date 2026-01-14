<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <!-- Hero Section -->
    <section class="px-6 py-16 md:py-24 md:px-12 lg:px-24 bg-gradient-to-br from-blue-50 to-white flex justify-center items-center">
      <div class="max-w-7xl w-full grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

        <!-- Left column: Text -->
        <div class="space-y-8 text-center md:text-left flex flex-col justify-center">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
            Power Your Digital Life
          </h1>
          <p class="text-gray-700 text-xl md:text-2xl leading-relaxed">
            We bring the latest electronic devices, trusted brands, and unbeatable service — right to your doorstep.
          </p>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition shadow-md mx-auto md:mx-0 block">
            Learn More
          </button>
        </div>

        <!-- Right column: Images Grid -->
        <div class="grid grid-cols-2 grid-rows-2 gap-4 w-64 md:w-100 mx-auto">
          <!-- Column 1 -->
          <img src="/cat_profie.png" class="w-full h-full object-cover rounded-lg" alt="Cat Profile" />
          <div></div> <!-- empty grid cell to create layout -->

          <img src="/kitchengadget.png" class="w-full h-full object-cover rounded-lg" alt="Kitchen Gadget" />

          <!-- Column 2 spans both rows -->
          <img src="/videogame.png" class="w-full h-full row-span-2 object-cover rounded-lg" alt="Video Game" />
        </div>

      </div>
    </section>
    <!-- Supplier -->
    <section  class=" px-6 py-16 md:py-2 md:px-12 lg:px-24 bg-gradient-to-br from-gray-400 to-white flex justify-center items-center">
          <div class="max-w-7xl w-full grid md:grid-rows-2 ">
            
            <!-- Section Title -->
            <h2 class="text-3xl md:text-4xl font-bold text-left text-gray-900 py-2">
              Our Suppliers
            </h2>

            <!-- Supplier Logos / Names -->
             <div class="flex flex-wrap justify-center justify-between gap-50">
              <span class="text-xl md:text-2xl font-serif text-gray-700">Apple</span>
              <span class="text-xl md:text-2xl font-serif text-gray-700">Samsung</span>
              <span class="text-xl md:text-2xl font-serif text-gray-700">Xbox</span>
              <span class="text-xl md:text-2xl font-serif text-gray-700">LG</span>
            </div>


              </div>
    </section>
    <section class="px-6 py-16 md:py-24 md:px-12 lg:px-24 bg-white flex justify-center items-center">
      <div class="max-w-7xl mx-auto text-center space-y-10">

        <!-- Section Title -->
        <h2 class="text-4xl md:text-5xl text-start font-serif font-bold text-gray-900 py-10">
          We Offer You
        </h2>

        <!-- Product Grid -->
        <div class="flex flex-wrap gap-10 justify-between justify-center">
      
        <!-- Card 1 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
          <img src="/Samsung_Galaxy_Note9.png" alt="Smartphones" class="w-full h-48 object-cover">
          <div class="p-6 space-y-2 text-center">
            <h3 class="text-xl font-serif font-bold text-gray-900">Smartphones & Accessories</h3>
            <p class="text-gray-600 text-base">Latest smartphones, cases, chargers, and more.</p>
            <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
              View Products
            </button>
          </div>
        </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <img src="/categories/6_pc.png" alt="Laptops & Tablets" class="w-full h-48 object-cover">
            <div class="p-6 space-y-2 text-center">
              <h3 class="text-xl font-serif font-bold text-gray-900">Laptops, Tablets & Computers</h3>
              <p class="text-gray-600 text-base">High-performance devices for work and play.</p>
              <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                View Products
              </button>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <img src="/categories/7_fridge.png" alt="Smart Home Devices" class="w-full h-48 object-cover">
            <div class="p-6 space-y-2 text-center">
              <h3 class="text-xl font-serif font-bold text-gray-900">Smart Home Devices</h3>
              <p class="text-gray-600 text-base">Automation, security, and comfort at home.</p>
              <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                View Products
              </button>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <img src="/videogame.png" alt="Gaming Gear" class="w-full h-48 object-cover">
            <div class="p-6 space-y-2 text-center">
              <h3 class="text-xl font-serif font-bold text-gray-900">Gaming Gear & Consoles</h3>
              <p class="text-gray-600 text-base">Consoles, controllers, and accessories for gamers.</p>
              <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                View Products
              </button>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <img src="/discounts/1_headphone.png" alt="Audio Devices" class="w-full h-48 object-cover">
            <div class="p-6 space-y-2 text-center">
              <h3 class="text-xl font-serif font-bold text-gray-900">Audio Devices</h3>
              <p class="text-gray-600 text-base">Headphones, earbuds, and speakers for all tastes.</p>
              <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                View Products
              </button>
            </div>
          </div>
      </div>

        <!-- Hero Image / Card -->
        <div class="flex justify-center mt-8">
          <grok-card data-id="957924" data-type="image_card" data-arg-size="LARGE" />
        </div>


      </div>
    </section>
    <section class="px-6 py-16 md:py-24 md:px-12 lg:px-25 flex justify-center items-center bg-[url('/backgrounds/trust.png')] bg-cover bg-center h-full"> 
        
        <!-- Why Choose Us -->
        <div class="max-w-7xl mx-auto text-center space-y-10">

          <h2 class="text-4xl md:text-5xl font-serif font-bold  text-center py-10  text-white">
            Why Shop With Us?
          </h2>

          <div class="flex flex-wrap justify-center justify-between gap-30">

            <!-- Item 1 -->
            <div class="flex items-start space-x-4 hover:bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-2xl p-6 gap-2">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow text-blue-600 text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-white">Genuine Products</h3>
                <p class="text-gray-100">Authorized suppliers only, no counterfeits</p>
              </div>
            </div>

            <!-- Item 2 -->
            <div class="flex items-start space-x-4 hover:bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-2xl p-6 gap-2">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow text-blue-600 text-xl font-bold">
                →
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-white">Fast Delivery</h3>
                <p class="text-gray-600">Reliable & secure nationwide shipping</p>
              </div>
            </div>

            <!-- Item 3 -->
            <div class="flex items-start space-x-4  hover:bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-2xl p-6 gap-2">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow text-blue-600 text-xl font-bold">
                ↺
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-white">Easy Returns</h3>
                <p class="text-gray-600">Hassle-free returns with warranty</p>
              </div>
            </div>

            <!-- Item 4 -->
            <div class="fflex items-start space-x-4 hover:bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-2xl p-6 gap-2">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow text-blue-600 text-xl font-bold">
                $
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-white">Secure Payments</h3>
                <p class="text-gray-600">Safe checkout including COD</p>
              </div>
            </div>

            <!-- Item 5 -->
            <div class="flex items-start space-x-4  hover:bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-2xl p-6 gap-2">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow text-blue-600 text-xl font-bold">
                ?
              </div>
              <div>
                <h3 class="font-serif font-bold text-xl text-white">Real Support</h3>
                <p class="text-gray-600">Chat, email & phone assistance</p>
              </div>
            </div>

          </div>

        </div>

    </section>


    
    <section class="px-6 py-16 md:py-24 md:px-12 lg:px-24
                bg-gradient-to-br from-blue-50 to-white
                flex justify-center items-center">

  <div class="max-w-5xl mx-auto space-y-24">

    <!-- Mission / Vision / Promise -->
    <div class="text-center space-y-16">

      <!-- Mission -->
      <div>
        <h2 class="text-4xl font-serif font-medium tracking-wide text-gray-900">
          Our Mission
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mt-6 leading-relaxed">
          To deliver reliable, innovative, and authentic electronic products that
          enhance everyday life — while building long-term trust through transparency
          and customer-first service.
        </p>
      </div>

      <!-- Vision -->
      <div>
        <h2 class="text-4xl font-serif font-medium tracking-wide text-gray-900">
          Our Vision
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mt-6 leading-relaxed">
          To become the most trusted and customer-centric online electronics platform
          in Cambodia and the region, known for quality, reliability, and innovation.
        </p>
      </div>

      <!-- Promise -->
      <div class="bg-white p-12 rounded-2xl shadow-sm max-w-4xl mx-auto">
        <h3 class="text-3xl font-serif font-medium mb-6 text-gray-900">
          Our Promise
        </h3>
        <p class="text-lg md:text-xl italic text-gray-800 leading-relaxed">
          Transparency in every transaction, uncompromised product quality,
          and real human support — from purchase to after-sales care.
        </p>
      </div>

    </div>

    <!-- Core Values -->
    <div class="text-center space-y-12">

      <h2 class="text-4xl font-serif font-medium tracking-wide text-gray-900">
        Our Core Values
      </h2>

      <div class="grid md:grid-cols-3 gap-8">

        <div class="bg-gray-50 p-8 rounded-xl shadow-sm">
          <h4 class="font-serif text-xl font-medium text-gray-900 mb-2">
            Trust & Authenticity
          </h4>
          <p class="text-gray-600 leading-relaxed">
            We sell only genuine products from authorized partners and distributors.
          </p>
        </div>

        <div class="bg-gray-50 p-8 rounded-xl shadow-sm">
          <h4 class="font-serif text-xl font-medium text-gray-900 mb-2">
            Customer First
          </h4>
          <p class="text-gray-600 leading-relaxed">
            Every decision we make is guided by what benefits our customers the most.
          </p>
        </div>

        <div class="bg-gray-50 p-8 rounded-xl shadow-sm">
          <h4 class="font-serif text-xl font-medium text-gray-900 mb-2">
            Continuous Innovation
          </h4>
          <p class="text-gray-600 leading-relaxed">
            We stay ahead with the latest technology and improve constantly.
          </p>
        </div>

      </div>

    </div>

    <!-- CTA -->
    <div class="text-center pt-16">
      <a href="/shop"
         class="inline-block bg-blue-600 hover:bg-blue-700 text-white
                px-12 py-6 rounded-xl text-xl md:text-2xl font-medium
                transition shadow-lg">
        Shop Now → With Confidence
      </a>
    </div>

  </div>
</section>


    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

export default {
  name: "AboutUs",
  components: { Header, Footer }
};
</script>
