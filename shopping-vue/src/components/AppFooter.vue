<template>
  <footer>
    <div class="foot-in">
      <div>
        <h4>云购商城 · 让好物触手可及</h4>
        <p>精选全球好物，极速发货，七天无理由退换，购物更安心。</p>
        <div class="news">
          <input v-model="email" placeholder="输入邮箱订阅优惠" />
          <button @click="onSubscribe">订阅</button>
        </div>
      </div>
      <div><h4>购物指南</h4><a>新手上路</a><a>支付方式</a><a>配送说明</a><a>售后政策</a></div>
      <div><h4>关于我们</h4><a>品牌故事</a><a>加入我们</a><a>联系方式</a><a>商家入驻</a></div>
      <div><h4>帮助中心</h4><a>常见问题</a><a>退换货</a><a>投诉建议</a><a>隐私条款</a></div>
    </div>
    <div class="copy">© 2026 云购商城 ShopCloud · 本页面为演示 Demo，仅用于前端展示，不含真实交易</div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { subscribe } from '../store.js'

const email = ref('')
function onSubscribe() {
  if (subscribe(email.value.trim())) email.value = ''
}
</script>
