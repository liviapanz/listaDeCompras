// Key do localStorage
const STORAGE_KEY = 'shoppingList_v1'

function getList(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  }catch(e){
    return []
  }
}

function saveList(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function render(){
  const list = getList()
  const ul = document.getElementById('items')
  ul.innerHTML = ''

  if(list.length === 0){
    const li = document.createElement('li')
    li.className = 'item'
    li.innerHTML = '<span class="name">Lista vazia — adicione itens acima</span>'
    ul.appendChild(li)
    return
  }

  list.forEach(item => {
    const li = document.createElement('li')
    li.className = 'item'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!item.bought
    checkbox.addEventListener('change', ()=> toggleBought(item.id))

    const name = document.createElement('span')
    name.className = 'name' + (item.bought ? ' bought' : '')
    name.textContent = item.name

    const actions = document.createElement('div')
    actions.className = 'actions'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Editar'
    editBtn.className = 'primary'
    editBtn.addEventListener('click', ()=> editItem(item.id))

    const delBtn = document.createElement('button')
    delBtn.textContent = 'Excluir'
    delBtn.addEventListener('click', ()=> deleteItem(item.id))

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    li.appendChild(checkbox)
    li.appendChild(name)
    li.appendChild(actions)

    ul.appendChild(li)
  })
}

function addItem(name){
  if(!name || !name.trim()) return
  const list = getList()
  list.push({id: Date.now(), name: name.trim(), bought:false})
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
  const clearBtn = document.getElementById('clear-btn')

  form.addEventListener('submit', e=>{
    e.preventDefault()
    addItem(input.value)
    input.value = ''
    input.focus()
  })

  clearBtn.addEventListener('click', clearAll)

  render()
})
