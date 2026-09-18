<template>
  <div class="modal open" @click.self="closeModal">
    <div class="modal-box" style="max-width:420px">
      <div class="modal-head">
        <h3>{{ editing ? '编辑地址' : '新增地址' }}</h3>
        <button class="close" @click="closeModal">✕</button>
      </div>
      <div class="modal-body">
        <div class="field"><label>收货人</label><input v-model="f.name" placeholder="姓名" /></div>
        <div class="field"><label>手机号</label><input v-model="f.phone" placeholder="手机号" /></div>
        <div class="field"><label>地区</label><input v-model="f.area" placeholder="如 广东省深圳市南山区" /></div>
        <div class="field"><label>详细地址</label><input v-model="f.detail" placeholder="街道/门牌号" /></div>
        <label style="font-size:13px;display:flex;gap:8px;align-items:center">
          <input type="checkbox" v-model="f.def" /> 设为默认地址
        </label>
        <button class="btn block" style="margin-top:14px" @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { store, closeModal, saveAddr } from '../store.js'

const addr = computed(() => store.addresses.find((x) => x.id === store.addrFormId))
const editing = computed(() => !!addr.value)
const f = reactive({
  name: '',
  phone: '',
  area: '',
  detail: '',
  def: false,
})
// 编辑时回填
watch(
  () => store.addrFormId,
  () => {
    const a = addr.value
    f.name = a?.name || ''
    f.phone = a?.phone || ''
    f.area = a?.area || ''
    f.detail = a?.detail || ''
    f.def = a?.def || false
  },
  { immediate: true }
)

function save() {
  saveAddr({ name: f.name.trim(), phone: f.phone.trim(), area: f.area.trim(), detail: f.detail.trim(), def: f.def })
}
</script>
