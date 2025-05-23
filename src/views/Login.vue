<template>
  <div class="login-container">
    <h2 class="login-title">Login</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-input"
        />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    alert('Please fill in all fields.')
    return
  }

  // Emit or handle the login logic here
  localStorage.setItem('token', password.value) // Simulating token storage
  router.push({ path: '/' }) // Redirect to home page after login
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 30px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}

.form-input {
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.login-button {
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>