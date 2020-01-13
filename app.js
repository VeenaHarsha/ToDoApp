const listBlock = document.querySelector('.list-container')
const listForm = document.getElementById('list-form')
const newListBtn = document.getElementById('newList')
const listName = document.getElementById('list-name')
const mainDivList = document.getElementById('main-div-list')
const goBackBtn = document.getElementById('goback')
const taskAddBlock = document.querySelector('.task-container')
const taskList = document.querySelector('.show-taskList')
const taskDiv2 = document.getElementById('task-div-2')
const taskName = document.getElementById('task-name')
const taskNotes = document.getElementById('task-note')
const dueDate = document.getElementById('due-date')
const priority = document.getElementById('prId')
const moreInfoBtn = document.getElementById('more-info-btn')
const moreInfo = document.querySelector('.show-more-info')
const taskDiv = document.querySelector('.task-div')

let listItems = localStorage.getItem('listItems') ?
    JSON.parse(localStorage.getItem('listItems')) : []
let currListId, currTaskId
let isTaskDone = false

loadLists()
function loadLists() {
    mainDivList.innerHTML = ''
    listItems.forEach(item => buildListItems(JSON.parse(localStorage.getItem(item))))
}

newListBtn.addEventListener('click', () => {
    if (listForm.style.display === 'none') {
        listForm.style.display = 'block'
    } else {
        listForm.style.display = 'none'
    }
})

function createList(event) {
    event.preventDefault()
    const listObject = {
        id: listItems.length === 0 ? 1 : listItems[listItems.length - 1] + 1,
        listName: listName.value,
        tasks: []
    }
    listItems.push(listObject.id)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    localStorage.setItem(listObject.id, JSON.stringify(listObject))
    buildListItems(listObject)
    listName.value = ''
    listForm.style.display = 'none'
}

function buildListItems(list) {
    console.log("List Object is : ", list)
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const outerP = document.createElement('p')
    const innerP = document.createElement('p')

    const imgDelete = document.createElement('img')
    imgDelete.setAttribute('src', 'images/trash_1.png')
    imgDelete.setAttribute('width', '20')
    imgDelete.setAttribute('height', '20')
    imgDelete.addEventListener('click', deleteListItem)
    imgDelete.setAttribute('id', list.id)
    div1.setAttribute('class', 'show-task-list')
    innerP.innerHTML = getTaskName(list) || 'No Tasks'
    innerP.setAttribute('class', 'inner-p')
    div2.appendChild(innerP)
    div2.setAttribute('id', list.id)
    div2.setAttribute('class', 'ui-list-div')
    div2.addEventListener('click', showTaskList)
    div1.appendChild(div2)
    outerP.textContent = list.listName
    outerP.appendChild(imgDelete)
    mainDivList.setAttribute('class', 'main-div-display')
    div1.appendChild(outerP)
    mainDivList.appendChild(div1)
}

function deleteListItem(event) {
    let lId = event.currentTarget.getAttribute('id')
    localStorage.removeItem(lId)
    let index = listItems.findIndex(ele => ele === Number(lId))
    listItems.splice(index, 1)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    event.currentTarget.parentNode.parentNode.remove()
}

taskName.addEventListener('keypress', createTask)
function createTask(event) {
    if (event.target.value === '') return
    if (event.keyCode === 13 || event.type === "click") {
        event.preventDefault()
        let currListItem = JSON.parse(localStorage.getItem(currListId))
        let thingsToDo = currListItem.tasks
        const taskObject = {
            id: thingsToDo.length === 0 ? 1 : thingsToDo[thingsToDo.length - 1].id + 1,
            name: taskName.value,
            notes: taskNotes.value,
            dueDate: dueDate.value,
            taskDone: isTaskDone,
            priority: priority[priority.selectedIndex].value
        }
        thingsToDo.push(taskObject)
        localStorage.setItem(currListId, JSON.stringify(currListItem))
        buildTaskItems(taskObject)
        event.target.value = ''
    }
}

function showTaskList(event) {
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
    let currListTasks = JSON.parse(localStorage.getItem(currListId)).tasks
    if (currListTasks) currListTasks.forEach(task => buildTaskItems(task))
}

function buildTaskItems(task) {
    console.log("Task From Build Task : ", task)
    const div1 = document.createElement('DIV')
    const checkbox = document.createElement('INPUT')
    const input = document.createElement('INPUT')
    const button = document.createElement('BUTTON')
    const img = document.createElement('img')
    img.setAttribute('src', 'images/arrow-down.png')
    img.setAttribute('width', '20')
    img.setAttribute('height', '20')
    img.setAttribute('id', 'more-info-btn')
    img.setAttribute('taskId', task.id)
    img.addEventListener('click', addMoreInfo)
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('id', 'selTask')
    input.setAttribute('type', 'text')
    input.setAttribute('id', 'task-name')
    input.value = task.name
    div1.appendChild(checkbox)
    div1.appendChild(input)
    div1.appendChild(img)
    div1.setAttribute('class', 'task-div')
    taskDiv2.appendChild(div1)
}

function getTaskName(list) {
    let tNames = ''
    list.tasks.forEach(ele => {
        tNames += ele.name + '<br>'
    })
    return tNames
}

function addMoreInfo(event) {
    currTaskId = event.target.getAttribute('taskId')
    let ele = event.target || event.target.parentNode.parentNode.id
    event.preventDefault()
    console.log("More Info : ", event.id)
    if (moreInfo.style.display === 'none') {
        moreInfo.style.display = 'flex'
        listBlock.style.display = 'none'
        ele.insertAdjacentElement('afterend', moreInfo)
    } else {
        moreInfo.style.display = 'none'
        listBlock.style.display = 'none'
    }
    // buildTaskItems(ele)
}

goBackBtn.addEventListener('click', (event) => {
    event.preventDefault()
    taskList.style.display = 'none'
    taskAddBlock.style.display = 'none'
    goBackBtn.style.display = 'none'
    listForm.style.display = 'none'
    newListBtn.style.display = 'block'
    listBlock.style.display = 'block'
    currListId = ''
    loadLists()
})

function tasksFrmList(listId) {
    let listTasks = []
    for (let task of taskItems) {
        if (task.listId === listId) listTasks.push(task)
    }
    return listTasks
}

function updateTask(event) {
    event.preventDefault()
    console.log('Update Task -- Current Task Id : ', currTaskId)
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    curTask.forEach(task => {
        if (task.id === Number(currTaskId)) {
            task.notes = taskNotes.value
            task.dueDate = dueDate.value
            task.taskDone = isTaskDone
            task.priority = priority[priority.selectedIndex].value
        }
    })
   
    localStorage.setItem(currListId, JSON.stringify(currList))
    event.target.value = ''
    moreInfo.style.display = 'none'
}

function deleteTask(event) {
    console.log(event)
    event.preventDefault()
    console.log('Need to delete the Task : ', currTaskId)
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    console.log(curTask)
     let index = curTask.findIndex(ele => ele.id === Number(currTaskId))
     curTask.splice(index, 1)
    localStorage.setItem(currListId, JSON.stringify(currList))
}
