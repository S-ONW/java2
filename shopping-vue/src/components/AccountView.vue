<template>
  <div class="wrap page">
    <div class="acct">
      <div class="acct-side">
        <div class="u">
          <div class="av">{{ initial }}</div>
          <div><b>{{ store.user.nick || store.user.name }}</b><br /><small style="color:var(--muted)">{{ store.user.name }}</small></div>
        </div>
        <div class="tab" :class="{ on: store.acctTab === 'profile' }" @click="setAcctTab('profile')">个人资料</div>
        <div class="tab" :class="{ on: store.acctTab === 'addr' }" @click="setAcctTab('addr')">地址管理</div>
        <div class="tab" @click="go('orders')">我的订单</div>
        <div class="tab" style="margin-top:10px" @click="logout">退出登录</div>
      </div>

      <div class="acct-main">
        <!-- 个人资料 -->
        <template v-if="store.acctTab === 'profile'">
          <div class="stat">
            <div class="b"><div class="n">{{ cartCount }}</div><div class="l">购物车</div></div>
            <div class="b"><div class="n">{{ store.wish.length }}</div><div class="l">收藏</div></div>
            <div class="b"><div class="n">{{ store.orders.length }}</div><div class="l">订单</div></div>
            <div class="b"><div class="n">{{ store.addresses.length }}</div><div class="l">地址</div></div>
          </div>
          <div class="field"><label>账号</label><input :value="store.user.name" disabled /></div>
          <div class="field"><label>昵称</label><input v-model="nick" /></div>
          <button class="btn" @click="save">保存资料</button>
        </template>

        <!-- 地址管理 -->
        <template v-else-if="store.acctTab === 'addr'">
          <button class="btn ghost" style="margin-bottom:14px" @click="openAddrForm(null)">+ 新增地址</button>
          <p v-if="!store.addresses.length" style="color:var(--muted)">还没有地址</p>
          <div
            v-for="a in store.addresses"
            :key="a.id"
            class="addr-card"
            :class="{ on: a.def }"
          >
            <div>
              <b>{{ a.name }}</b> <span style="color:var(--muted)">{{ a.phone }}</span>
              <span v-if="a.def" class="def">默认</span><br />
              <small style="color:var(--muted)">{{ a.area }} {{ a.detail }}</small>
            </div>
            <div class="ops">
              <span @click="editAddr(a.id)">编辑</span>
              <span @click="deleteAddr(a.id)">删除</span>
              <span v-if="!a.def" @click="setDefAddr(a.id)">设默认</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  store, cartCount, saveNick, setAcctTab, openAddrForm,
  editAddr, deleteAddr, setDefAddr, logout, go, openAuth,
} from '../store.js'

const nick = ref(store.user?.nick || store.user?.name || '')
const initial = computed(() => (store.user?.name?.[0] || '👤').toUpperCase())

// 未登录则弹登录框
watch(() => store.user, (u) => { if (!u) openAuth('login') }, { immediate: true })

function save() { saveNick(nick.value) }
</script>
