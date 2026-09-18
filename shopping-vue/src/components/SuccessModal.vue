<template>
  <div class="modal open" @click.self="closeModal">
    <div class="modal-box" style="max-width:420px">
      <div style="text-align:center;padding:30px 20px">
        <div style="font-size:60px">✅</div>
        <h3 style="margin:10px 0">下单成功！</h3>
        <div style="color:var(--muted)">订单号 {{ store.success?.no }} · 应付 {{ money(store.success?.total || 0) }}</div>
        <p style="color:var(--muted);margin-top:8px">我们会尽快为你发货~</p>
        <button class="btn" style="margin-top:18px" @click="go('orders')">查看订单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store, money, go, closeModal } from '../store.js'
</script>
