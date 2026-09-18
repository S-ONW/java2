<template>
  <div class="wrap">
    <!-- 轮播 Banner -->
    <div class="slides">
      <div
        v-for="(b, i) in BANNERS"
        :key="i"
        class="slide"
        :class="{ active: i === current }"
        :style="{ background: b.bg }"
      >
        <div>
          <h1>{{ b.h }}</h1>
          <p>{{ b.p }}</p>
          <span class="tag">{{ b.t }}</span>
        </div>
        <div class="deco">{{ b.d }}</div>
      </div>
      <div class="dots">
        <div
          v-for="(b, i) in BANNERS"
          :key="i"
          class="dot"
          :class="{ on: i === current }"
          @click="current = i"
        ></div>
      </div>
    </div>

    <div class="layout">
      <!-- 分类侧栏 -->
      <aside>
        <h3>分类</h3>
        <button
          v-for="c in cats"
          :key="c"
          class="cat"
          :class="{ active: store.cat === c }"
          @click="setCat(c)"
        >
          {{ c === 'all' ? '全部商品' : catLabel(c) }}
        </button>
      </aside>

      <!-- 主区 -->
      <main>
        <div class="toolbar">
          <h2>
            {{ store.cat === 'all' ? '全部商品' : catLabel(store.cat) }}
            <small style="color:var(--muted);font-size:13px">({{ total }})</small>
          </h2>
          <select class="sort" :value="store.sort" @change="onSort">
            <option value="default">综合排序</option>
            <option value="priceAsc">价格从低到高</option>
            <option value="priceDesc">价格从高到低</option>
            <option value="hot">最热优先</option>
            <option value="rate">好评优先</option>
          </select>
        </div>

        <div class="filters">
          <span style="font-size:13px;color:var(--muted)">价格</span>
          <input ref="minP" type="number" placeholder="最低" :value="store.filters.min ?? ''" />
          <span>—</span>
          <input ref="maxP" type="number" placeholder="最高" :value="store.filters.max ?? ''" />
          <button class="btn ghost" @click="onFilter">筛选</button>
          <span style="font-size:13px;color:var(--muted);margin-left:6px">评分</span>
          <span
            v-for="r in [0, 4.5, 4.7, 4.8]"
            :key="r"
            class="chip"
            :class="{ on: store.filters.rate === r }"
            @click="setRate(r)"
          >{{ r === 0 ? '全部评分' : r + '分+' }}</span>
        </div>

        <div class="grid">
          <ProductCard v-for="p in shown" :key="p.id" :product="p" />
          <div v-if="!shown.length" class="empty">😢 没有找到符合条件的商品</div>
        </div>

        <div class="pager" v-if="total > store.perPage">
          <button :disabled="store.page === 1" @click="setPage(store.page - 1)">‹</button>
          <button
            v-for="i in pages"
            :key="i"
            :class="{ on: i === store.page }"
            @click="setPage(i)"
          >{{ i }}</button>
          <button :disabled="store.page === pages" @click="setPage(store.page + 1)">›</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { store, setCat, setRate, setPage, applyFilter } from '../store.js'
import { PRODUCTS, BANNERS } from '../data.js'
import ProductCard from './ProductCard.vue'

const cats = ['all', ...new Set(PRODUCTS.map((p) => p.cat))]
const current = ref(0)
const minP = ref(null)
const maxP = ref(null)

let timer = null
onMounted(() => {
  timer = setInterval(() => { current.value = (current.value + 1) % BANNERS.length }, 4000)
})
onUnmounted(() => clearInterval(timer))

const filtered = computed(() =>
  PRODUCTS.filter((p) => {
    const okCat = store.cat === 'all' || p.cat === store.cat
    const okKw =
      !store.keyword ||
      (p.name + p.desc + p.cat).toLowerCase().includes(store.keyword.toLowerCase())
    const okMin = store.filters.min == null || p.price >= store.filters.min
    const okMax = store.filters.max == null || p.price <= store.filters.max
    const okRate = p.rate >= store.filters.rate
    return okCat && okKw && okMin && okMax && okRate
  })
)
const sorted = computed(() => {
  const list = [...filtered.value]
  if (store.sort === 'priceAsc') list.sort((a, b) => a.price - b.price)
  if (store.sort === 'priceDesc') list.sort((a, b) => b.price - a.price)
  if (store.sort === 'hot') list.sort((a, b) => b.hot - a.hot)
  if (store.sort === 'rate') list.sort((a, b) => b.rate - a.rate)
  return list
})
const total = computed(() => sorted.value.length)
const pages = computed(() => Math.max(1, Math.ceil(total.value / store.perPage)))
const shown = computed(() =>
  sorted.value.slice((store.page - 1) * store.perPage, store.page * store.perPage)
)

watch(pages, (p) => { if (store.page > p) store.page = p })

function catLabel(c) {
  const m = {
    数码: '📱 数码电子', 家居: '🛋️ 家居生活', 美妆: '💄 美妆个护',
    食品: '🍫 食品饮料', 运动: '⚽ 运动户外',
  }
  return m[c] || c
}
function onSort(e) { store.sort = e.target.value }
function onFilter() {
  const min = minP.value?.value
  const max = maxP.value?.value
  applyFilter(min, max)
}
</script>
