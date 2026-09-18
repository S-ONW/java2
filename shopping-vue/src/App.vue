<template>
  <AppHeader />

  <main>
    <HomeView v-if="store.view === 'home'" />
    <CheckoutView v-else-if="store.view === 'checkout'" />
    <OrdersView v-else-if="store.view === 'orders'" />
    <AccountView v-else-if="store.view === 'account'" />
  </main>

  <AppFooter />

  <!-- 抽屉遮罩 -->
  <div class="overlay" :class="{ open: store.drawer }" @click="closeDrawer"></div>

  <!-- 抽屉（常驻 DOM，靠 .open 类切换滑入） -->
  <CartDrawer />
  <WishDrawer />
  <OrderDrawer />

  <!-- 弹窗：按需挂载 -->
  <DetailModal v-if="store.modal === 'detail'" />
  <AuthModal v-if="store.modal === 'auth'" />
  <AddrModal v-if="store.modal === 'addr'" />
  <SuccessModal v-if="store.modal === 'success'" />

  <!-- 返回顶部 & Toast -->
  <button class="to-top" :class="{ show: showToTop }" @click="scrollTop">↑</button>
  <Toast />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { store, closeDrawer } from './store.js'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HomeView from './components/HomeView.vue'
import CheckoutView from './components/CheckoutView.vue'
import OrdersView from './components/OrdersView.vue'
import AccountView from './components/AccountView.vue'
import CartDrawer from './components/CartDrawer.vue'
import WishDrawer from './components/WishDrawer.vue'
import OrderDrawer from './components/OrderDrawer.vue'
import DetailModal from './components/DetailModal.vue'
import AuthModal from './components/AuthModal.vue'
import AddrModal from './components/AddrModal.vue'
import SuccessModal from './components/SuccessModal.vue'
import Toast from './components/Toast.vue'

const showToTop = ref(false)
function onScroll() { showToTop.value = window.scrollY > 300 }
function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => {
  const t = localStorage.getItem('shopTheme')
  const theme = t || store.theme
  store.theme = theme
  document.documentElement.setAttribute('data-theme', theme)
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
