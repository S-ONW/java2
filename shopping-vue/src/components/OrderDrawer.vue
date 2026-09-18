<template>
  <div class="drawer left" :class="{ open: store.drawer === 'order' }">
    <header>
      <h3>我的订单</h3>
      <button class="close" @click="closeDrawer">✕</button>
    </header>
    <div class="items">
      <div v-if="!store.orders.length" class="empty">还没有订单，去逛逛吧 🛒</div>
      <div v-for="o in orderList" :key="o.no" class="order-card">
        <div class="oh"><span>订单号 {{ o.no }}</span><span>{{ o.time }}</span></div>
        <div class="oi">{{ itemsText(o) }}</div>
        <div class="oh">
          <span>实付 <b style="color:var(--primary)">{{ money(o.total) }}</b> · {{ payText(o.pay) }}</span>
          <span class="status" :class="'st-' + o.status">{{ o.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, pById, money, closeDrawer } from '../store.js'

const orderList = computed(() => store.orders.slice().reverse())
function itemsText(o) {
  return o.items.map((i) => pById(i.id).name + ' ×' + i.q).join('，')
}
function payText(p) {
  return p === 'cod' ? '货到付款' : p === 'alipay' ? '支付宝' : '微信支付'
}
</script>
