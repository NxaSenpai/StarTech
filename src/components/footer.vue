<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <!-- Main Footer Content -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">

          <!-- Brand Column -->
          <div class="footer-col brand">
            <h2 class="footer-logo">StarTech</h2>
            <p class="footer-desc">
              We bring you the latest in electronics, gadgets, and smart home solutions—all in one place.
            </p>
          </div>

          <!-- Shop -->
          <div class="footer-col">
            <h3 class="footer-title">Shop</h3>
            <ul class="footer-links">
              <li><a href="#">Hot deals</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Brands</a></li>
              <li><a href="#">Rebates</a></li>
              <li><a href="#">Weekly deals</a></li>
            </ul>
          </div>

          <!-- Need help? -->
          <div class="footer-col">
            <h3 class="footer-title">Need help?</h3>
            <ul class="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Order tracking</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Return policy</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="footer-col">
            <h3 class="footer-title">Contact</h3>
            <ul class="footer-contact">
              <li>123 Fifth Avenue, New York, NY 10160</li>
              <li>contact@info.com</li>
              <li>929-242-6868</li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom Bar with Copyright + Payment Icons -->

    <!-- <div class="footer-bottom">
      <div class="container">
        <div class="bottom-content">
          <p>&copy; 2025 StarTech. All rights reserved.</p>
          <div class="payment-icons">
            <img src="https://simpleicons.org/icons/amazon.svg" alt="Amazon Pay" />
            <img src="https://simpleicons.org/icons/discover.svg" alt="Discover" />
            <img src="https://simpleicons.org/icons/visa.svg" alt="Visa" />
            <img src="https://simpleicons.org/icons/mastercard.svg" alt="Mastercard" />
            <img src="https://simpleicons.org/icons/paypal.svg" alt="PayPal" />
          </div>
        </div>
      </div>
    </div> -->

  </footer>
</template>

<style scoped>
.footer {
  background: #0f172a;
  color: #cbd5e1;
  font-size: 15px;
  margin-top: auto; /* Helps push footer down when content is short */
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Main Grid */
.footer-main {
  padding: 70px 0 50px;
  border-bottom: 1px solid #1e293b;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr 1fr 1fr;
  gap: 50px;
}

.footer-logo {
  font-size: 30px;
  font-weight: 900;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.footer-desc {
  color: #94a3b8;
  line-height: 1.7;
  max-width: 340px;
}

.footer-title {
  font-size: 17px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 36px;
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
}

.footer-links,
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-contact li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
}

.footer-links a:hover {
  color: white;
  transform: translateX(4px);
}

.footer-contact li {
  color: #e2e8f0;
  font-weight: 500;
}

/* Bottom Bar */
.footer-bottom {
  background: #020617;
  padding: 28px 0;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.bottom-content p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.payment-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-icons img {
  height: 30px;
  width: auto;
  filter: grayscale(100%) brightness(0.7);
  transition: all 0.3s ease;
}

.payment-icons img:hover {
  filter: grayscale(0%) brightness(1);
  transform: scale(1.15);
}

/* ——— MOBILE OPTIMIZATION (Beautiful on phones!) ——— */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-main {
    padding: 50px 0 40px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-desc {
    max-width: 100%;
    margin: 0 auto;
  }

  .bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .payment-icons {
    order: -1;
    gap: 20px;
  }

  .payment-icons img {
    height: 36px;
  }
}
</style>