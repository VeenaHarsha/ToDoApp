//Creating List (Category)
const listForm = document.getElementById('list-form')
const listName = document.getElementById('list-name')
const ul = document.querySelector('UL') // For building UI 
const listBlock = document.querySelector('.list-container')
const taskForm = document.getElementById('task-form')
const taskBlock = document.querySelector('.task-container')
const taskListBlock = document.querySelector('.tasklist-container') 
const taskNotes = document.getElementById('task-note')
const dueDate = document.getElementById('due-date')
const priority = document.getElementById('prId')

let listItems = localStorage.getItem('listItems') ?
    JSON.parse(localStorage.getItem('listItems')) : []

let taskItems = localStorage.getItem('taskItems') ?
    JSON.parse(localStorage.getItem('taskItems')) : []

displayTasks()
function displayTasks() {
    listItems.forEach(ele => buildListItems(ele))
}
function buildListItems(list) {
    console.log("List to build : "+list.liName)
    const li = document.createElement('LI')
   // const input = document.createElement('INPUT')
   // input.setAttribute('type','checkbox')
   // li.appendChild(input)
    li.textContent = list.liName
    ul.appendChild(li)
}
listForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const categoryObject = {
        id:listItems.length === 0 ? 1:listItems[listItems.length-1].id+1 ,
        liName:listName.value
    }
    listItems.push(categoryObject)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    localStorage.setItem(categoryObject.id,JSON.stringify(categoryObject))
   buildListItems(categoryObject)
    listName.value = ''
})
function buildTaskItems(task){
    console.log("Tasks r : "+task)
}
taskForm.addEventListener('submit',(event)=>{
    event.preventDefault()
    const taskObject = {
        id:taskItems.length === 0 ? 1:taskItems[taskItems.length-1].id+1 ,
        listCatId:listItems.id,
        notes:taskNotes,
        dueDate:dueDate,
        priority:priority[priority.selectedIndex].value
    }
    taskItems.push(taskObject)
    localStorage.setItem('taskItems', JSON.stringify(taskItems))
    localStorage.setItem(taskObject.id,JSON.stringify(taskObject))
    buildTaskItems(taskObject)
})
ul.addEventListener('click', () => {
    if(taskBlock.style.display === 'none') {
        taskBlock.style.display = 'block'
        listBlock.style.display='none'
    }else{
         taskBlock.style.display = 'none'
         listBlock.style.display='block'
    }
})
function listView(event){
    console.log(event.target.value)
    if(taskListBlock.style.display === 'none') {
        taskListBlock.style.display = 'block'
        taskBlock.style.display = 'none'
        listBlock.style.display='none'
    }else{
        taskListBlock.style.display = 'none'
         listBlock.style.display='block'
    }
}





























/*
const listItems = localStorage.getItem('category') ? JSON.parse(localStorage.getItem('category')):[]
const catForm = document.querySelector('#cat-form')
const catInput = document.querySelector('#cat-name')
const catList = document.querySelector('#cat-list')

function buildList(cValue){
    let li = document.createElement('LI')
    let text = document.createTextNode(cValue)
    li.appendChild(text)
    catList.appendChild(li)
}
function displayTasks(){
    catItemArr.forEach(element => {
        buildList(element)
    });
    JSON.parse(localStorage.getItem('category'))
}
catForm.addEventListener('submit',(event) => {
    event.preventDefault()
    catItemArr.push(catInput.value)
    localStorage.setItem('category',JSON.stringify(catItemArr))
    buildList(catInput.value)
    catInput.value=''
})

displayTasks()

catList.addEventListener('dblclick',(event)=>{

})*/