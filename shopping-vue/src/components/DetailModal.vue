<template>
  <div class="modal open" @click.self="closeModal">
    <div class="modal-box">
      <div class="modal-head">
        <h3>商品详情</h3>
        <button class="close" @click="closeModal">✕</button>
      </div>
      <div class="modal-body" v-if="p">
        <div class="detail">
          <div class="gallery">
            <div class="big">{{ p.g[store.detailImg] }}</div>
            <div class="thumbs">
              <div
                v-for="(g, k) in p.g"
                :key="k"
                :class="{ on: k === store.detailImg }"
                @click="setDetailImg(k)"
              >{{ g }}</div>
            </div>
          </div>
          <div class="meta">
            <h3>{{ p.name }}</h3>
            <div class="stars">{{ stars(p.rate) }} <small>{{ p.rate }} 分 · {{ p.hot }} 人想要</small></div>
            <div class="price">{{ money(p.price) }} <small>{{ money(p.old) }}</small></div>
            <p>{{ p.desc }}。正品保障，支持七天无理由退换，下单后 24h 内发货。</p>
            <div class="stock" :class="{ low: p.stock <= 10 }">{{ stockText }}</div>
            <div class="qty-pick">
              <span>数量</span>
              <button @click="changeDetailQty(-1)">−</button>
              <span class="n">{{ store.detailQty }}</span>
              <button @click="changeDetailQty(1)">+</button>
            </div>
            <button class="add-big" @click="addDetailToCart" :disabled="p.stock <= 0">
              {{ p.stock <= 0 ? '已售罄' : '加入购物车' }}
            </button>
          </div>
        </div>

        <div class="reviews">
          <h4>用户评价（{{ revs.length }}）</h4>
          <div v-for="(r, i) in revs" :key="i" class="rv">
            <div class="top"><span class="u">{{ r.u }}</span><span class="s">{{ r.s }}</span></div>
            <p>{{ r.t }}</p>
          </div>
        </div>

        <div class="related" v-if="related.length">
          <h4>相关推荐</h4>
          <div class="grid">
            <ProductCard v-for="x in related" :key="x.id" :product="x" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  store, pById, stars, money, setDetailImg, changeDetailQty, addDetailToCart, closeModal,
} from '../store.js'
import { PRODUCTS, REVIEW_POOL } from '../data.js'
import ProductCard from './ProductCard.vue'

const p = computed(() => (store.detailId != null ? pById(store.detailId) : null))
const stockText = computed(() => {
  const s = p.value.stock
  return s <= 0 ? '已售罄' : s <= 10 ? '仅剩 ' + s + ' 件' : '库存 ' + s + ' 件'
})
const revs = computed(() => {
  const id = store.detailId
  return [0, 2, 4].map((k) => {
    const r = REVIEW_POOL[(id + k) % REVIEW_POOL.length]
    return { ...r, s: stars(4 + Math.random()) }
  })
})
const related = computed(() =>
  p.value ? PRODUCTS.filter((x) => x.cat === p.value.cat && x.id !== p.value.id).slice(0, 4) : []
)
</script>
