// Keys do localStorage
const STORAGE_KEY = 'shoppingList_v1'
const THEME_KEY = 'shoppingListTheme'

function getList(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  }catch(e){
    return []
  }
 }

function getTheme(){
  return localStorage.getItem(THEME_KEY) || 'light'
}

function saveTheme(theme){
  localStorage.setItem(THEME_KEY, theme)
}

function applyTheme(theme){
  document.body.classList.toggle('theme-dark', theme === 'dark')
  const select = document.getElementById('theme-select')
  if(select){
    select.value = theme
  }
}

function saveList(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function render(){
  const list = getList()
  const ul = document.getElementById('items')
  const summary = document.getElementById('summary-info')
  ul.innerHTML = ''

  if(list.length === 0){
    summary.textContent = 'Nenhum item adicionado ainda. Comece adicionando produtos e quantidades.'
    const li = document.createElement('li')
    li.className = 'item'
    li.innerHTML = '<span class="name">Lista vazia — adicione itens acima</span>'
    ul.appendChild(li)
    return
  }

  const totalUnits = list.reduce((sum, item) => sum + item.quantity, 0)
  const boughtUnits = list.filter(item => item.bought).reduce((sum, item) => sum + item.quantity, 0)
  summary.textContent = `${list.length} produtos / ${totalUnits} unidades — ${boughtUnits} compradas`

  list.forEach(item => {
    const li = document.createElement('li')
    li.className = 'item' + (item.bought ? ' bought' : '')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!item.bought
    checkbox.addEventListener('change', ()=> toggleBought(item.id))

    const info = document.createElement('div')
    info.className = 'info'

    const name = document.createElement('span')
    name.className = 'name' + (item.bought ? ' bought' : '')
    name.textContent = item.name

    const details = document.createElement('div')
    details.className = 'details'
    details.innerHTML = `<span class="badge">x${item.quantity}</span><span>${item.bought ? 'Status: Comprado' : 'Status: Pendente'}</span>`

    info.appendChild(name)
    info.appendChild(details)

    const actions = document.createElement('div')
    actions.className = 'actions'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Editar'
    editBtn.className = 'primary'
    editBtn.addEventListener('click', ()=> editItem(item.id))

    const delBtn = document.createElement('button')
    delBtn.textContent = 'Excluir'
    delBtn.className = 'danger'
    delBtn.addEventListener('click', ()=> deleteItem(item.id))

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    li.appendChild(checkbox)
    li.appendChild(info)
    li.appendChild(actions)

    ul.appendChild(li)
  })
}

function addItem(name, quantity){
  if(!name || !name.trim()) return
  const qty = Math.max(1, Number(quantity) || 1)
  const list = getList()
  list.push({id: Date.now(), name: name.trim(), quantity: qty, bought:false})
  saveList(list)
  render()
}

function toggleBought(id){
  const list = getList()
  const idx = list.findIndex(i=>i.id===id)
  if(idx===-1) return
  list[idx].bought = !list[idx].bought
  saveList(list)
  render()
}

function editItem(id){
  const list = getList()
  const idx = list.findIndex(i=>i.id===id)
  if(idx===-1) return
  const newName = prompt('Editar item', list[idx].name)
  if(newName === null) return
  if(!newName.trim()) return
  list[idx].name = newName.trim()
  saveList(list)
  render()
}

function deleteItem(id){
  let list = getList()
  list = list.filter(i=>i.id!==id)
  saveList(list)
  render()
}

function clearAll(){
  if(!confirm('Deseja realmente limpar toda a lista?')) return
  saveList([])
  render()
}

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('add-form')
  const input = document.getElementById('item-input')
  const quantityInput = document.getElementById('quantity-input')
  const clearBtn = document.getElementById('clear-btn')
  const themeSelect = document.getElementById('theme-select')

  const savedTheme = getTheme()
  applyTheme(savedTheme)

  if(themeSelect){
    themeSelect.addEventListener('change', ()=>{
      const selected = themeSelect.value
      applyTheme(selected)
      saveTheme(selected)
    })
  }

  form.addEventListener('submit', e=>{
    e.preventDefault()
    addItem(input.value, quantityInput.value)
    input.value = ''
    quantityInput.value = '1'
    input.focus()
  })

  clearBtn.addEventListener('click', clearAll)

  render()
})
