<template>
  <div class="drawer" :class="{ open: store.drawer === 'cart' }">
    <header>
      <h3>我的购物车</h3>
      <button class="close" @click="closeDrawer">✕</button>
    </header>
    <div class="items">
      <div v-if="!ids.length" class="empty">购物车还是空的 🛒</div>
      <div v-for="id in ids" :key="id" class="item">
        <div class="ic">{{ pById(id).icon }}</div>
        <div class="info">
          <div class="n">{{ pById(id).name }}</div>
          <div class="pp">
            {{ money(pById(id).price) }} × {{ store.cart[id] }} =
            {{ money(pById(id).price * store.cart[id]) }}
          </div>
          <div class="qty">
            <button @click="cartInc(id)">−</button>
            <span>{{ store.cart[id] }}</span>
            <button @click="cartDec(id)">+</button>
          </div>
        </div>
        <button class="del" @click="cartDel(id)">移除</button>
      </div>
    </div>
    <div class="coupon">
      <input v-model="couponInput" placeholder="优惠码（SAVE20 / WELCOME10 / VIP30）" />
      <button @click="onApply">使用</button>
    </div>
    <div class="disc">{{ store.cartMsg }}</div>
    <div class="foot">
      <div class="row"><span>商品小计</span><span>{{ money(cartSub) }}</span></div>
      <div class="row" v-show="disc > 0">
        <span>优惠减免</span><span style="color:var(--ok)">-{{ money(disc) }}</span>
      </div>
      <div class="row"><span>运费</span><span>{{ ship === 0 ? '包邮' : money(ship) }}</span></div>
      <div class="row total"><span>合计</span><span class="t-price">{{ money(total) }}</span></div>
      <button class="btn block" @click="toCheckout">去结算</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  store, pById, money, cartSub, couponDisc, shipFee,
  cartInc, cartDec, cartDel, applyCartCoupon, toCheckout, closeDrawer,
} from '../store.js'

const ids = computed(() => Object.keys(store.cart))
const couponInput = ref(store.coupon || '')
const disc = computed(() => couponDisc(cartSub.value))
const ship = computed(() => shipFee(cartSub.value))
const total = computed(() => Math.max(0, cartSub.value - disc.value) + ship.value)

function onApply() { applyCartCoupon(couponInput.value) }
</script>
