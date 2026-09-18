<template>
  <header>
    <div class="nav">
      <div class="logo" @click="go('home')">云购<span>商城</span></div>
      <div class="search">
        <input v-model="keyword" type="text" placeholder="搜索商品，如 耳机 / 咖啡 / 瑜伽…" @keyup.enter="onSearch" />
        <button @click="onSearch">搜索</button>
      </div>
      <button class="icon-btn" @click="openWish" title="收藏夹">❤️ <span class="badge">{{ store.wish.length }}</span></button>
      <button class="icon-btn" @click="go('orders')" title="我的订单">📦 <span class="badge" v-show="store.orders.length">{{ store.orders.length }}</span></button>
      <button class="icon-btn" @click="toggleTheme" title="暗色模式">{{ store.theme === 'dark' ? '☀️' : '🌙' }}</button>
      <button class="icon-btn" @click="openCart" title="购物车">🛒 <span class="badge">{{ cartCount }}</span></button>
      <div class="avatar" @click="openAccount" title="账户">{{ store.user ? store.user.name[0].toUpperCase() : '👤' }}</div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { store, cartCount, go, openCart, openWish, toggleTheme, openAccount } from '../store.js'

const keyword = ref(store.keyword)
function onSearch() {
  store.keyword = keyword.value.trim()
  store.cat = 'all'
  store.page = 1
  go('home')
}
</script>
