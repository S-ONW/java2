<template>
  <div class="wrap page">
    <div class="section-title">确认订单 <span class="back" @click="go('home')">← 继续购物</span></div>
    <div v-if="!ids.length" class="empty">购物车是空的，去逛逛吧 🛒</div>
    <div class="ck" v-else>
      <div>
        <div class="panel">
          <h3>收货地址</h3>
          <div v-if="store.addresses.length">
            <div
              v-for="a in store.addresses"
              :key="a.id"
              class="addr-card"
              :class="{ on: store.selAddr === a.id }"
              @click="selectAddr(a.id)"
            >
              <div>
                <b>{{ a.name }}</b> <span style="color:var(--muted)">{{ a.phone }}</span>
                <span v-if="a.def" class="def">默认</span><br />
                <small style="color:var(--muted)">{{ a.area }} {{ a.detail }}</small>
              </div>
              <div class="ops">
                <span @click.stop="editAddr(a.id)">编辑</span>
                <span @click.stop="deleteAddr(a.id)">删除</span>
              </div>
            </div>
          </div>
          <p v-else style="color:var(--muted)">还没有收货地址，请先添加。</p>
          <button class="btn ghost" @click="openAddrForm(null)">+ 新增地址</button>
        </div>

        <div class="panel">
          <h3>支付方式</h3>
          <div class="pay">
            <div
              v-for="[v, i, n] in pays"
              :key="v"
              class="opt"
              :class="{ on: store.payMethod === v }"
              @click="setPayMethod(v)"
            >
              <div class="ic">{{ i }}</div>
              <div class="nm">{{ n }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3>优惠券</h3>
          <div class="coupon" style="padding:0;border:none">
            <input v-model="coInput" placeholder="优惠码（SAVE20 / WELCOME10 / VIP30）" />
            <button @click="onApply">使用</button>
          </div>
          <div class="disc">{{ store.coMsg }}</div>
        </div>
      </div>

      <div class="panel" style="align-self:start">
        <h3>订单摘要</h3>
        <div class="ck-list">
          <div v-for="id in ids" :key="id" class="ci">
            <div class="ic">{{ pById(id).icon }}</div>
            <div class="nm">
              {{ pById(id).name }}<br />
              <small style="color:var(--muted)">{{ money(pById(id).price) }} × {{ store.cart[id] }}</small>
            </div>
            <div class="pr">{{ money(pById(id).price * store.cart[id]) }}</div>
          </div>
        </div>
        <div class="sum-row"><span>商品小计</span><span>{{ money(cartSub) }}</span></div>
        <div class="sum-row"><span>优惠减免</span><span style="color:var(--ok)">-{{ money(disc) }}</span></div>
        <div class="sum-row"><span>运费</span><span>{{ ship === 0 ? '包邮' : money(ship) }}</span></div>
        <div class="sum-row big"><span>应付</span><span class="t">{{ money(total) }}</span></div>
        <button class="btn block" @click="placeOrder">提交订单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  store, pById, money, cartSub, couponDisc, shipFee,
  go, selectAddr, editAddr, deleteAddr, setPayMethod, openAddrForm,
  applyCheckoutCoupon, placeOrder, toast,
} from '../store.js'

const pays = [['wechat', '💚', '微信支付'], ['alipay', '🔵', '支付宝'], ['cod', '📦', '货到付款']]
const ids = computed(() => Object.keys(store.cart))
const coInput = ref(store.coupon || '')
const disc = computed(() => couponDisc(cartSub.value))
const ship = computed(() => shipFee(cartSub.value))
const total = computed(() => Math.max(0, cartSub.value - disc.value) + ship.value)

function onApply() { applyCheckoutCoupon(coInput.value) }

watch(
  ids,
  (v) => { if (!v.length) { toast('购物车是空的'); go('home') } },
  { immediate: true }
)
</script>
