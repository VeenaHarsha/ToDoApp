const listForm = document.getElementById('list-form')
const listBlock = document.querySelector('.list-container')
const taskAddBlock = document.querySelector('.task-container')
const listName = document.getElementById('list-name')
const mainDivList = document.getElementById('main-div-list')
const uiDiv = document.querySelector('.ui-list-div') 
const taskList = document.querySelector('.show-taskList')
const taskNotes = document.getElementById('task-note')
const dueDate = document.getElementById('due-date')
const priority = document.getElementById('prId')
const moreInfoBtn = document.getElementById('more-info-btn')
const moreInfo = document.querySelector('.show-more-info')
const taskDiv = document.querySelector('.task-div') 
const newListBtn = document.getElementById('listId')
const goBackBtn = document.getElementById('goback')
const taskDiv2 = document.getElementById('task-div-2')
const taskName = document.getElementById('task-name')
const selectTask = document.getElementById('selTask')
const taskFormDiv = document.getElementById('task-form')
const searchForm = document.getElementById('search-form')
const searchBtn = document.getElementById('searchList')
const search = document.getElementById('search')

let currListId , currTaskId
let isTaskDone = false

let listItems = localStorage.getItem('listItems') ?
    JSON.parse(localStorage.getItem('listItems')) : []
let taskItems = localStorage.getItem('taskItems') ?
    JSON.parse(localStorage.getItem('taskItems')) : []
//DIsplay Items on Load
loadLists()
function loadLists(){
    console.log("1")
    mainDivList.innerHTML=''
    // taskAddBlock.style.display = 'none'
    listItems.forEach(ele => buildListItems(ele))
}
//Display Add List form on clicking List button
newListBtn.addEventListener('click', () => {
    console.log("2")
    if (listForm.style.display === 'none') {
        listForm.style.display = 'block'
    } else {
        listForm.style.display = 'none'
    }
})
//Create List item
function createList(event) {
    console.log("3")
    event.preventDefault()
    const listObject = {
        id: listItems.length === 0 ? 1 : listItems[listItems.length - 1].id + 1,
        listName: listName.value
    }
    listItems.push(listObject)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    buildListItems(listObject)
    listName.value = ''
    listForm.style.display = 'none'
}
//building list dynamically
function buildListItems(list) {
    console.log("4")
    const div1 = document.createElement('DIV')
    const div2 = document.createElement('DIV')
    const outerP = document.createElement('P')
    const innerP = document.createElement('P')
    const liDelete = document.createElement('i')
    liDelete.setAttribute('class', 'fa fa-trash')
    liDelete.addEventListener('click',deleteListItem)
    div2.setAttribute('id', list.id)
    div1.setAttribute('class', 'show-task-list')
    innerP.innerHTML = getTaskName(list.id) || 'No Tasks'
    innerP.setAttribute('class', 'inner-p')
    div2.appendChild(innerP)
    div2.setAttribute('class', 'ui-list-div')
    div2.setAttribute('lname', 'list.listName')
    div2.addEventListener('click', showTaskList)
    div1.appendChild(div2)
    outerP.textContent = list.listName
    outerP.appendChild(liDelete)
    mainDivList.setAttribute('class', 'main-div-display')
    div1.appendChild(outerP)
    mainDivList.appendChild(div1)
}
//Delete List
function deleteListItem(event){
    console.log("5")
    let listId = event.target.parentNode.previousSibling.id
    let index = listItems.findIndex(ele => ele.id === listId)
    listItems.splice(index,1)            
    localStorage.setItem('listItems',JSON.stringify(listItems))
    event.currentTarget.parentNode.parentNode.remove()
}
function getTaskName(lId) {
    console.log("6")
    let tNames = ''
    taskItems.filter(ele => {
        if(Number(ele.listId) === Number(lId)){
            tNames += ele.name +'<br>' 
        }
    })
    return tNames
}
//Filtering  tasks on list id
function getListTasks(listId) {
    console.log("7")
    let listTasks = []
    for (let task of taskItems) {
        if (task.listId === listId) listTasks.push(task)
    }
    return listTasks
}
//Showing task list
function showTaskList(event) {
    console.log("8")
    console.log("From ShowtaskList: List Id:", event.target.parentElement.id)
        currListId = event.target.id || event.target.parentElement.id //ch
        if (currListId) {
            goBackBtn.style.display = 'block'
            listBlock.style.display = 'none'
            taskAddBlock.style.display = 'block'
            newListBtn.style.display = 'none'
            taskList.style.display = 'block'
        } else {
            taskList.style.display = 'none'
            goBackBtn.style.display = 'none'
            taskAddBlock.style.display = 'none'
            listBlock.style.display = 'block'
            newListBtn.style.display = 'block'
        }
        taskDiv2.innerHTML = ''
        let currListTasks = getListTasks(currListId)
        if (currListTasks)  currListTasks.forEach(task => buildTaskItems(task))
}
//go back to list page
goBackBtn.addEventListener('click', (event) => {
    console.log("9")
    event.preventDefault()
    taskList.style.display = 'none'
    taskAddBlock.style.display = 'none'
    goBackBtn.style.display = 'none'
    listForm.style.display = 'none'
    newListBtn.style.display = 'block'
    listBlock.style.display = 'block'
    currListId =''
    loadLists()
})
//Creat and Add Task Details
taskName.addEventListener('keypress', createTask)
function createTask(event) {
    console.log("10")
    if(event.target.value === '') return
    if (event.keyCode === 13 || event.type === "click") {
        event.preventDefault()
        const taskObject = {
            id: taskItems.length === 0 ? 1 : taskItems[taskItems.length - 1].id + 1,
            name: taskName.value,
            listId: currListId,
            notes: taskNotes.value,
            dueDate: dueDate.value,
            taskDone: isTaskDone,
            priority: priority[priority.selectedIndex].value
        }
        taskItems.push(taskObject)
        localStorage.setItem('taskItems', JSON.stringify(taskItems))
        buildTaskItems(taskObject)
        event.target.value = ''
    }
}
//Building Task Info
function buildTaskItems(task) {
    console.log("11")
    console.log("Task From Build Task : ",task)
    const div1 = document.createElement('DIV')
    const checkbox = document.createElement('INPUT')
    const input = document.createElement('INPUT')
    const button = document.createElement('BUTTON')
    const iTag = document.createElement('i')
    iTag.setAttribute('class', 'fa fa-sort-desc')
    button.appendChild(iTag)
    button.setAttribute('class', '.button')
    button.setAttribute('id', 'more-info-btn')
    button.addEventListener('click', addTaskInfo)
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('id', 'selTask')
   // checkbox.addEventListener('change', isCompleted)
    input.setAttribute('type', 'text')
    input.setAttribute('id', 'task-name')
    input.value = task.name
    div1.setAttribute('id',task.id)
    div1.appendChild(checkbox)
    div1.appendChild(input)
    div1.appendChild(button)
    div1.setAttribute('class', 'task-div')
    taskDiv2.appendChild(div1)
}
function updateTask(event){
    console.log("12")
    event.preventDefault()
    for (const task of taskItems) {
        if(task.id === Number(currTaskId)) {
            task.notes = taskNotes.value
            task.dueDate = dueDate.value
            task.taskDone = isTaskDone
            task.priority = priority[priority.selectedIndex].value
        }
    }
    localStorage.setItem('taskItems', JSON.stringify(taskItems))
    moreInfo.style.display = 'none'
}
//adding more task info
function addTaskInfo(event) {
    console.log("13")
    currTaskId = event.target.parentNode.id //|| event.target.parentNode.parentNode.id
    event.preventDefault()
    if (moreInfo.style.display === 'none') {
        // taskList.style.display = 'block'
        moreInfo.style.display = 'block'
        listBlock.style.display = 'none'
        taskList.insertAdjacentElement('afterend', moreInfo)
        // taskDiv2.insertAdjacentElement('afterend', moreInfo)
    } else {
        moreInfo.style.display = 'none'
        listBlock.style.display = 'none'
        // taskList.style.display = 'block'
    }
}
function goToListPage(event) {
    console.log("14")
    event.preventDefault()
    listBlock.style.display = 'block'
    taskAddBlock.style.display = 'none'
}
function deleteTask(event) {
    console.log("15")
    console.log(event)
    event.preventDefault()
    console.log('Need to delete the Task : ', event)
}
