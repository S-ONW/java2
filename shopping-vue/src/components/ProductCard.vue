<template>
  <div class="card">
    <span v-if="product.tag" class="tag-badge" :style="{ background: tagColor }">{{ product.tag }}</span>
    <button class="fav" :class="{ on: store.wish.includes(product.id) }" @click="toggleFav(product.id)">
      {{ store.wish.includes(product.id) ? '❤️' : '🤍' }}
    </button>
    <div class="thumb" @click="openDetail(product.id)">{{ product.icon }}</div>
    <div class="body">
      <div class="name" @click="openDetail(product.id)">{{ product.name }}</div>
      <div class="stars">{{ stars(product.rate) }} <small>{{ product.rate }}</small></div>
      <div class="desc">{{ product.desc }}</div>
      <div class="price">{{ money(product.price) }}<small>{{ money(product.old) }}</small></div>
      <div class="stock" :class="{ low: product.stock <= 10 }">{{ stockText }}</div>
      <button class="add" @click="addToCart(product.id)" :disabled="product.stock <= 0">
        {{ product.stock <= 0 ? '已售罄' : '加入购物车' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, stars, money, openDetail, addToCart, toggleFav } from '../store.js'

const props = defineProps({ product: { type: Object, required: true } })

const tagColor = computed(() => {
  const t = props.product.tag
  if (t === '折扣') return '#ff5a3c'
  if (t === '新品') return '#3a5cff'
  return '#1ec98b'
})
const stockText = computed(() => {
  const s = props.product.stock
  return s <= 0 ? '已售罄' : s <= 10 ? '仅剩 ' + s + ' 件' : '库存 ' + s + ' 件'
})
</script>
