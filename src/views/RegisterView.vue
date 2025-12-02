<template>
    <div class="login-page">
      <div class="login-container">
  
        <!-- LEFT SIDE -->
        <div class="login-left">
          <div class="brand-logo">
            <img src="/logo.png" alt="StarTech Logo" class="logo-img" />
          </div>
  
          <div class="login-content">
            <p class="shopping-tag">Create your account</p>
            <h1 class="login-title">Register Now!</h1>
  
            <form @submit.prevent="handleRegister" class="login-form">
  
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="name"
                  required
                  placeholder="Enter your full name"
                />
              </div>
  
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
  
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Create a password"
                />
              </div>
  
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  placeholder="Confirm your password"
                />
              </div>
  
              <button type="submit" class="login-button" :disabled="loading">
                {{ loading ? 'Registering...' : 'Register' }}
              </button>
            </form>
  
            <p class="signup-prompt">
              Already have an account?
              <router-link to="/login" class="signup-link">Login</router-link>
            </p>
  
            <!-- Error message -->
            <p v-if="error" class="error-message">{{ error }}</p>
          </div>
        </div>
  
        <!-- RIGHT SIDE -->
        <div class="login-right">
          <img src="/background_log.jpg" alt="Tech Background" class="background-img" />
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const error = ref(null)
  
  const router = useRouter()
  
  const handleRegister = async () => {
    loading.value = true
    error.value = null
  
    if (password.value !== confirmPassword.value) {
      error.value = "Passwords don't match"
      loading.value = false
      return
    }
  
    console.log('Registering:', name.value, email.value, password.value)
  
    await new Promise(resolve => setTimeout(resolve, 1500))
  
    // Mock success
    localStorage.setItem('userToken', 'mock-jwt-token')
    router.push('/')
  
    loading.value = false
  }
  </script>
  
  <style scoped>
  /* ✅ SAME STYLE — NOTHING CHANGED */
  
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f7f7f7;
    font-family: Arial, sans-serif;
  }
  
  .login-container {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
  
  .login-left {
    flex: 1 1 50%;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  
  .login-right {
    flex: 1 1 50%;
    background-color: #e0f2f7;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .login-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .brand-logo {
    margin-bottom: 5rem;
  }
  
  .logo-img {
    max-width: 150px;
    height: auto;
  }
  
  .login-content {
    width: 100%;
    max-width: 400px;
  }
  
  .shopping-tag {
    color: #555;
    font-size: 0.9em;
    margin-bottom: 0.5rem;
  }
  
  .login-title {
    font-size: 2.5em;
    color: #333;
    margin-bottom: 2rem;
    font-weight: bold;
  }
  
  .login-form {
    width: 100%;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1em;
    box-sizing: border-box;
  }
  
  .form-group input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
  
  .login-button {
    width: 100%;
    padding: 1rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 1rem;
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .login-button:disabled {
    background-color: #a8d1ff;
    cursor: not-allowed;
  }
  
  .signup-prompt {
    margin-top: 2rem;
    font-size: 0.9em;
    color: #666;
    text-align: center;
  }
  
  .signup-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  
  .signup-link:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: #dc3545;
    margin-top: 1rem;
    text-align: center;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .login-container {
      flex-direction: column;
    }
  
    .login-right {
      display: none;
    }
  
    .login-left {
      padding: 2rem 1.5rem;
      width: 100%;
      align-items: center;
      min-height: 100vh;
    }
  
    .login-content {
      max-width: none;
    }
  }
  </style>
  