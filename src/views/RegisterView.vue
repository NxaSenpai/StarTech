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
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
}

.login-container {
  color:black;
  position: fixed;
  inset: 0;
  display: flex;
  width: 100%;
  height: 100vh;
  max-width: none;
  background-color: #fff;
  overflow: hidden;
  box-shadow: none;
  z-index: 10;
}

/* Left panel behavior */
.login-left {
  flex: 1 1 50%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  overflow-y: auto; /* allow scrolling if content overflows */
}

/* Right panel covers full height and keeps image aspect */
.login-right {
  flex: 1 1 50%;
  background-color: #e0f2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
}

.login-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Keep brand and content layout, center content on narrower screens */
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
  margin: 0;
}

/* form styles remain the same */
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

/* form layout */
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

/* Responsive styles */
@media (max-width: 1024px) {
  .login-container {
    max-width: 100%;
  }
  .brand-logo {
    margin-bottom: 3rem;
  }
  .logo-img {
    max-width: 140px;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: none;
    box-shadow: none;
    border-radius: 0;
  }

  .login-right {
    display: none; /* hide right image on small screens */
  }

  .login-left {
    padding: 2rem 1.5rem;
    width: 100%;
    flex: none;
    align-items: center;
    min-height: 100vh; /* left fills viewport when right hidden */
    justify-content: center;
    overflow-y: auto;
  }

  .login-content {
    max-width: none;
    margin: 0;
  }

  .brand-logo {
    margin-bottom: 2rem;
  }

  .logo-img {
    max-width: 120px;
  }

  .login-title {
    font-size: 1.8em;
    margin-bottom: 1.5rem;
  }

  .shopping-tag {
    font-size: 0.85em;
  }

  .form-group {
    margin-bottom: 1.2rem;
  }

  .form-group input {
    padding: 0.75rem 0.9rem;
    font-size: 16px;
  }

  .login-button {
    padding: 0.9rem;
    font-size: 1em;
    margin-top: 0.8rem;
  }

  .signup-prompt {
    margin-top: 1.5rem;
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .login-left {
    padding: 1.5rem 1rem;
  }

  .brand-logo {
    margin-bottom: 1.5rem;
  }

  .logo-img {
    max-width: 100px;
  }

  .login-title {
    font-size: 1.5em;
    margin-bottom: 1rem;
  }

  .shopping-tag {
    font-size: 0.8em;
  }

  .login-content {
    width: 100%;
  }

  .form-group label {
    font-size: 0.9em;
  }

  .form-group input {
    padding: 0.7rem 0.8rem;
    font-size: 16px;
    border-radius: 6px;
  }

  .login-button {
    padding: 0.8rem;
    font-size: 0.95em;
  }

  .error-message {
    font-size: 0.85em;
  }
}
</style>

  <style>
html, body, #app {
  min-height: 100vh;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
