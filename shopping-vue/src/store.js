import { reactive, computed } from 'vue'
import { PRODUCTS, COUPONS, SHIP_FREE } from './data.js'

// ---------- localStorage 封装 ----------
const LS = {
  get(k, d) {
    try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { /* ignore */ }
  },
}

// ---------- 全局响应式状态 ----------
export const store = reactive({
  view: 'home',          // home | checkout | orders | account
  cat: 'all',
  sort: 'default',
  keyword: '',
  page: 1,
  perPage: 8,
  filters: { min: null, max: null, rate: 0 },

  cart: LS.get('shopCart', {}),
  wish: LS.get('shopWish', []),
  orders: LS.get('shopOrders', []),
  addresses: LS.get('shopAddr', []),
  user: LS.get('shopUser', null),
  coupon: null,
  selAddr: LS.get('shopSelAddr', null),

  detailId: null,
  detailQty: 1,
  detailImg: 0,
  acctTab: 'profile',
  payMethod: 'wechat',

  theme: LS.get('shopTheme', 'light'),

  drawer: '',            // '' | 'cart' | 'wish' | 'order'
  modal: '',             // '' | 'detail' | 'auth' | 'addr' | 'success'
  authMode: 'login',
  addrFormId: null,
  success: null,

  cartMsg: '',
  coMsg: '',
  toastMsg: '',
  toastShow: false,
})

// ---------- 纯函数 / 派生数据 ----------
export const pById = (id) => PRODUCTS.find((p) => p.id == id)
export const money = (n) => '¥' + n
export const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

export const cartCount = computed(() =>
  Object.values(store.cart).reduce((a, b) => a + b, 0)
)
export const cartSub = computed(() =>
  Object.keys(store.cart).reduce(
    (s, id) => s + (pById(id)?.price || 0) * store.cart[id],
    0
  )
)

export function couponDisc(sub) {
  if (!store.coupon) return 0
  const c = COUPONS[store.coupon]
  return c.type === 'pct' ? Math.round(sub * c.val) : Math.min(c.val, sub)
}
export function shipFee(sub) {
  return sub === 0 ? 0 : sub >= SHIP_FREE ? 0 : 10
}

function save() {
  LS.set('shopCart', store.cart)
  LS.set('shopWish', store.wish)
  LS.set('shopOrders', store.orders)
  LS.set('shopAddr', store.addresses)
  LS.set('shopUser', store.user)
  LS.set('shopSelAddr', store.selAddr)
}

// ---------- Toast ----------
let toastTimer = null
export function toast(msg) {
  store.toastMsg = msg
  store.toastShow = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { store.toastShow = false }, 1600)
}

// ---------- 视图导航 ----------
export function go(view) {
  store.drawer = ''
  store.modal = ''
  store.view = view
  store.page = 1
  window.scrollTo({ top: 0 })
}
export function openAccount() {
  store.view = 'account'
  store.acctTab = 'profile'
  store.drawer = ''
  store.modal = ''
  window.scrollTo({ top: 0 })
}

// ---------- 首页筛选 / 排序 ----------
export function setCat(c) { store.cat = c; store.page = 1 }
export function setSort(v) { store.sort = v }
export function applyFilter(min, max) {
  store.filters.min = min ? +min : null
  store.filters.max = max ? +max : null
  store.page = 1
}
export function setRate(r) { store.filters.rate = +r; store.page = 1 }
export function setPage(p) { store.page = p }

// ---------- 商品 / 收藏 ----------
export function addToCart(id, q = 1) {
  const p = pById(id)
  const have = store.cart[id] || 0
  if (have + q > p.stock) { toast('超出库存啦'); return }
  store.cart[id] = have + q
  save()
  toast('已加入购物车 ✓')
}
export function toggleFav(id) {
  if (store.wish.includes(id)) store.wish = store.wish.filter((x) => x !== id)
  else store.wish.push(id)
  save()
}

// ---------- 详情弹窗 ----------
export function openDetail(id) {
  store.detailId = id
  store.detailQty = 1
  store.detailImg = 0
  store.modal = 'detail'
}
export function closeModal() { store.modal = '' }
export function setDetailImg(k) { store.detailImg = k }
export function changeDetailQty(d) {
  const p = pById(store.detailId)
  store.detailQty = Math.min(p.stock, Math.max(1, store.detailQty + d))
}
export function addDetailToCart() {
  const id = store.detailId
  addToCart(id, store.detailQty)
  closeModal()
}

// ---------- 抽屉 ----------
export function openCart() { store.drawer = 'cart' }
export function openWish() { store.drawer = 'wish' }
export function openOrder() { store.drawer = 'order' }
export function closeDrawer() { store.drawer = '' }

export function cartInc(id) {
  const p = pById(id)
  if ((store.cart[id] || 0) + 1 > p.stock) { toast('超出库存'); return }
  store.cart[id]++
  save()
}
export function cartDec(id) {
  store.cart[id]--
  if (store.cart[id] <= 0) delete store.cart[id]
  save()
}
export function cartDel(id) { delete store.cart[id]; save() }

export function applyCartCoupon(code) {
  code = (code || '').trim().toUpperCase()
  if (!code) { store.cartMsg = '请输入优惠码'; return }
  if (COUPONS[code]) { store.coupon = code; store.cartMsg = '已生效：' + COUPONS[code].label }
  else { store.coupon = null; store.cartMsg = '优惠码无效' }
}
export function applyCheckoutCoupon(code) {
  code = (code || '').trim().toUpperCase()
  if (COUPONS[code]) { store.coupon = code; store.coMsg = '已生效：' + COUPONS[code].label }
  else if (code) { store.coupon = null; store.coMsg = '优惠码无效' }
  else { store.coupon = null; store.coMsg = '' }
}
export function toCheckout() { store.drawer = ''; go('checkout') }

// ---------- 登录 / 注册 ----------
export function openAuth(mode) { store.authMode = mode || 'login'; store.modal = 'auth' }
export function switchAuth() { store.authMode = store.authMode === 'login' ? 'register' : 'login' }
export function submitAuth(email, pwd, nick) {
  store.user = { name: email, nick: store.authMode === 'register' ? nick : email.split('@')[0] }
  save()
  store.modal = ''
  toast(store.authMode === 'login' ? '欢迎回来 👋' : '注册成功，已登录')
}

// ---------- 地址 ----------
export function openAddrForm(id) { store.addrFormId = id || null; store.modal = 'addr' }
export function editAddr(id) { openAddrForm(id) }
export function saveAddr(f) {
  const { name, phone, area, detail, def } = f
  if (def) store.addresses.forEach((x) => (x.def = false))
  if (store.addrFormId) {
    const a = store.addresses.find((x) => x.id === store.addrFormId)
    if (a) Object.assign(a, { name, phone, area, detail, def })
  } else {
    const na = { id: Date.now(), name, phone, area, detail, def }
    store.addresses.push(na)
    if (!store.selAddr) store.selAddr = na.id
  }
  save()
  store.modal = ''
  toast('地址已保存')
}
export function setPayMethod(v) { store.payMethod = v }
export function selectAddr(id) { store.selAddr = id }
export function deleteAddr(id) {
  store.addresses = store.addresses.filter((x) => x.id != id)
  if (store.selAddr == id) store.selAddr = store.addresses[0]?.id || null
  save()
}
export function setDefAddr(id) {
  store.addresses.forEach((x) => (x.def = false))
  const a = store.addresses.find((x) => x.id == id)
  if (a) a.def = true
  save()
}

// ---------- 下单 / 订单 ----------
export function placeOrder() {
  if (!store.user) { openAuth('login'); return false }
  if (!store.addresses.length) { openAddrForm(null); toast('请先填写收货地址'); return false }
  if (!store.selAddr) { toast('请选择收货地址'); return false }
  const sub = cartSub.value
  const disc = couponDisc(sub)
  const ship = shipFee(sub)
  const total = Math.max(0, sub - disc) + ship
  const no = 'YC' + Date.now().toString().slice(-10)
  const addr = store.addresses.find((a) => a.id === store.selAddr) || store.addresses[0]
  store.orders.push({
    no,
    time: new Date().toLocaleString('zh-CN'),
    status: '待发货',
    total,
    items: Object.keys(store.cart).map((id) => ({ id: +id, q: store.cart[id] })),
    addr,
    pay: store.payMethod,
  })
  store.cart = {}
  store.coupon = null
  save()
  store.success = { no, total }
  store.modal = 'success'
  return true
}
export function confirmRecv(no) {
  const o = store.orders.find((x) => x.no == no)
  if (o) { o.status = '已完成'; save(); toast('已确认收货 🎉') }
}
export function cancelOrder(no) {
  const o = store.orders.find((x) => x.no == no)
  if (o) { o.status = '已取消'; save(); toast('订单已取消') }
}
export function payOrder(no) {
  const o = store.orders.find((x) => x.no == no)
  if (o) { o.status = '待发货'; save(); toast('支付成功') }
}

// ---------- 账户 ----------
export function logout() { store.user = null; save(); toast('已退出登录') }
export function saveNick(nick) {
  if (store.user) { store.user.nick = nick || store.user.name; save(); toast('已保存') }
}
export function setAcctTab(t) { store.acctTab = t }

// ---------- 主题 ----------
export function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', store.theme)
  localStorage.setItem('shopTheme', store.theme)
}

// ---------- 订阅 ----------
export function subscribe(email) {
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('订阅成功 📧'); return true }
  toast('请输入有效邮箱')
  return false
}
