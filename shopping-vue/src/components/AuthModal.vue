<template>
  <div class="modal open" @click.self="closeModal">
    <div class="modal-box" style="max-width:400px">
      <div class="modal-head">
        <h3>{{ store.authMode === 'login' ? '登录' : '注册' }}云购</h3>
        <button class="close" @click="closeModal">✕</button>
      </div>
      <div class="modal-body">
        <div class="field"><label>邮箱</label><input v-model="email" placeholder="you@example.com" /></div>
        <div class="field"><label>密码</label><input v-model="pwd" type="password" placeholder="至少 6 位" /></div>
        <div class="field" v-if="store.authMode === 'register'"><label>昵称</label><input v-model="nick" placeholder="展示名称" /></div>
        <button class="btn block" @click="submit">{{ store.authMode === 'login' ? '登录' : '注册并登录' }}</button>
        <p style="text-align:center;margin-top:12px;font-size:13px;color:var(--muted)">
          {{ store.authMode === 'login' ? '还没有账号？' : '已有账号？' }}
          <a style="color:var(--primary);cursor:pointer" @click="switchAuth">{{ store.authMode === 'login' ? '去注册' : '去登录' }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store, closeModal, switchAuth, submitAuth } from '../store.js'

const email = ref('')
const pwd = ref('')
const nick = ref('')

function submit() {
  submitAuth(email.value.trim(), pwd.value, nick.value.trim())
  email.value = pwd.value = nick.value = ''
}
</script>
