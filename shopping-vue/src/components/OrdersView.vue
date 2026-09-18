<template>
  <div class="wrap page">
    <div class="section-title">我的订单 <span class="back" @click="go('home')">← 返回</span></div>
    <div v-if="!store.orders.length" class="empty">还没有订单，去逛逛吧 🛒</div>
    <div v-else>
      <div class="order-card" v-for="o in list" :key="o.no">
        <div class="oh"><span>订单号 {{ o.no }}</span><span>{{ o.time }}</span></div>
        <div class="oi">{{ itemsText(o) }}</div>
        <div class="oh">
          <span>实付 <b style="color:var(--primary)">{{ money(o.total) }}</b> · {{ payText(o.pay) }}</span>
          <span class="status" :class="'st-' + o.status">{{ o.status }}</span>
        </div>
        <div class="acts">
          <button class="btn" v-if="o.status === '待收货'" @click="confirmRecv(o.no)">确认收货</button>
          <button class="btn ghost" v-if="o.status === '待发货'" @click="cancelOrder(o.no)">取消订单</button>
          <button class="btn blue" v-if="o.status === '待发货'" @click="payOrder(o.no)">去支付</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, pById, money, go, confirmRecv, cancelOrder, payOrder } from '../store.js'

const list = computed(() => store.orders.slice().reverse())
function itemsText(o) { return o.items.map((i) => pById(i.id).name + ' ×' + i.q).join('，') }
function payText(p) { return p === 'cod' ? '货到付款' : p === 'alipay' ? '支付宝' : '微信支付' }
</script>
