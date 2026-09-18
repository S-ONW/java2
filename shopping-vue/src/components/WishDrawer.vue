<template>
  <div class="drawer left" :class="{ open: store.drawer === 'wish' }">
    <header>
      <h3>我的收藏</h3>
      <button class="close" @click="closeDrawer">✕</button>
    </header>
    <div class="items">
      <div v-if="!store.wish.length" class="empty">还没有收藏的商品 ❤️</div>
      <div v-for="id in store.wish" :key="id" class="item">
        <div class="ic">{{ pById(id).icon }}</div>
        <div class="info">
          <div class="n">{{ pById(id).name }}</div>
          <div class="pp">{{ money(pById(id).price) }}</div>
        </div>
        <button class="del" @click="toggleFav(id)">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store, pById, money, toggleFav, closeDrawer } from '../store.js'
</script>
