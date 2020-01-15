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
const searchBtn = document.getElementById('searchBtn')
const searchForm = document.getElementById('search-form')
const searchName = document.getElementById('search-name')
const selectedTask = document.getElementById('selTask')
const renameDiv = document.getElementById('rename-list')
const todayNav = document.getElementById('today-id')
const listNav = document.getElementById('list-id')
const schNav = document.getElementById('sch-id')
const filterBtn = document.getElementById('filterBtn')
const todayBlock = document.querySelector('.today-container')
const todayDiv = document.getElementById('today-task')
const schBlock = document.querySelector('.sch-container')
const schDiv = document.getElementById('sch-task')

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
        searchForm.style.display = 'none'
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
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const innerP = document.createElement('p')
    const imgDelete = document.createElement('img')
    const newName = document.createElement('INPUT')
    newName.setAttribute('type', 'text')
    newName.setAttribute('class', 'new-name')
    imgDelete.setAttribute('src', 'images/trash_1.png')
    imgDelete.setAttribute('width', '20')
    imgDelete.setAttribute('height', '20')
    imgDelete.setAttribute('id', list.id)
    imgDelete.addEventListener('click', deleteListItem)
    div1.setAttribute('class', 'show-task-list')
    innerP.innerHTML = getTaskName(list) || 'No Tasks'
    innerP.setAttribute('class', 'inner-p')
    div2.appendChild(innerP)
    div2.setAttribute('id', list.id)
    div2.setAttribute('class', 'ui-list-div')
    div2.addEventListener('click', showTaskList)
    div1.appendChild(div2)
    newName.value = list.listName
    newName.addEventListener('keyup', renameList)
    div1.appendChild(imgDelete)
    mainDivList.setAttribute('class', 'main-div-display')
    div1.appendChild(newName)
    mainDivList.appendChild(div1)
}
function renameList(event) {
    let newName = event.currentTarget.value
    let lId = event.target.parentNode.firstChild.id
    let list = JSON.parse(localStorage.getItem(lId))
    list.listName = newName
    localStorage.setItem(lId, JSON.stringify(list))
}
function deleteListItem(event) {
    let lId = event.currentTarget.getAttribute('id')
    localStorage.removeItem(lId)
    let index = listItems.findIndex(ele => ele === Number(lId))
    listItems.splice(index, 1)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    event.currentTarget.parentNode.remove()
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
    currListId = event.target.parentElement.id
    if (currListId) {
        goBackBtn.style.display = 'block'
        listBlock.style.display = 'none'
        taskAddBlock.style.display = 'block'
        newListBtn.style.display = 'none'
        taskList.style.display = 'block'
        filterBtn.style.display = 'block'
        searchBtn.style.display = 'none'
        listNav.style.display = 'none'
        todayNav.style.display = 'none'
        schNav.style.display = 'none'
    } else {
        taskList.style.display = 'none'
        goBackBtn.style.display = 'none'
        taskAddBlock.style.display = 'none'
        listBlock.style.display = 'block'
        newListBtn.style.display = 'block'
        searchBtn.style.display = 'block'
        filterBtn.style.display = 'none'
        listNav.style.display = 'block'
        todayNav.style.display = 'block'
        schNav.style.display = 'block'
    }
    taskDiv2.innerHTML = ''
    let currListTasks = JSON.parse(localStorage.getItem(currListId)).tasks
    if (currListTasks) currListTasks.forEach(task => buildTaskItems(task))
}
function buildTaskItems(task) {
    const div1 = document.createElement('DIV')
    const checkbox = document.createElement('INPUT')
    const input = document.createElement('INPUT')
    const button = document.createElement('BUTTON')
    const img = document.createElement('img')
    img.setAttribute('src', 'images/arrow-down.png')
    img.setAttribute('width', '20')
    img.setAttribute('height', '20')
    img.setAttribute('id', 'more-info-btn')
    div1.setAttribute('taskId', task.id)
    img.addEventListener('click', addMoreInfo)
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('id', 'selTask')
    checkbox.addEventListener('change', isCompleted)
    checkbox.checked = task.taskDone
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
function setMoreInfoDetails(task) {
    console.log("Task to set details :", task)
    let tasks = JSON.parse(localStorage.getItem(currListId)).tasks
    for (let t of tasks) {
        if (t.id === Number(task)) {
            taskNotes.value = t.notes
            priority.value = t.priority
            dueDate.value = t.dueDate
        }
    }
}
function addMoreInfo(event) {
    currTaskId = event.target.parentNode.getAttribute('taskId')
    let ele = event.target
    event.preventDefault()
    if (moreInfo.style.display === 'none') {
        moreInfo.style.display = 'flex'
        setMoreInfoDetails(currTaskId)
        listBlock.style.display = 'none'
        ele.insertAdjacentElement('afterend', moreInfo)
    } else {
        moreInfo.style.display = 'none'
        listBlock.style.display = 'none'
    }
}
function isCompleted(event) {
    event.preventDefault()
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    let tID = event.target.parentNode.getAttribute('taskId')
    for (let t of curTask) {
        if (t.id === Number(tID)) {
            if (event.target.checked) t.taskDone = true
            else t.taskDone = false
        }
    }
    localStorage.setItem(currListId, JSON.stringify(currList))
    taskDiv2.innerHTML = ''
    curTask.forEach(task => buildTaskItems(task))
}
goBackBtn.addEventListener('click', (event) => {
    event.preventDefault()
    taskList.style.display = 'none'
    taskAddBlock.style.display = 'none'
    goBackBtn.style.display = 'none'
    listForm.style.display = 'none'
    searchForm.style.display = 'none'
    newListBtn.style.display = 'block'
    listBlock.style.display = 'block'
    listNav.style.display = 'block'
    todayNav.style.display = 'block'
    schNav.style.display = 'block'
    filterBtn.style.display = 'none'
    searchBtn.style.display = 'block'
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
    moreInfo.style.display = 'none'
}
function deleteTask(event) {
    event.preventDefault()
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    let index = curTask.findIndex(ele => ele.id === Number(currTaskId))
    curTask.splice(index, 1)
    localStorage.setItem(currListId, JSON.stringify(currList))
    taskDiv2.innerHTML = ''
    curTask.forEach(task => buildTaskItems(task))
}
searchBtn.addEventListener('click', () => {
    if (searchForm.style.display === 'none') {
        listForm.style.display = 'none'
        searchForm.style.display = 'block'
    } else {
        searchForm.style.display = 'none'
    }
})
function searchList(event) {
    event.preventDefault()
    mainDivList.innerHTML = ''
    for (let li in listItems) {
        let lName = JSON.parse(localStorage.getItem(listItems[li])).listName.toLowerCase()
        if (lName.includes(searchName.value.toLowerCase())) {
            buildListItems(JSON.parse(localStorage.getItem(listItems[li])))
        }
    }
    searchName.value = ''
    searchForm.style.display = 'none'
}
filterBtn.addEventListener('click', clearCompleted)
function clearCompleted(event) {
    event.preventDefault()
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    curTask = curTask.filter(ele => !ele.taskDone)
    currList.tasks = curTask
    localStorage.setItem(currListId, JSON.stringify(currList))
    taskDiv2.innerHTML = ''
    curTask.forEach(task => buildTaskItems(task))
}
function buildScheduledTasks(taskName, sDate,listName, sDiv, sBlock) {
    const div = document.createElement('div')
    const sp1 = document.createElement('span')
    const sp2 = document.createElement('span')
    const sp3 = document.createElement('span')
    sp1.innerText = taskName
    sp2.innerText = sDate
    sp3.innerText = listName
    sp2.setAttribute('style', 'margin-left:20px;padding:5px;')
    sp3.setAttribute('style', 'float:right;')
    div.appendChild(sp1)
    div.appendChild(sp2)
    div.appendChild(sp3)
    div.setAttribute('style', 'border-style: inset;padding:5px;')
    sDiv.appendChild(div)
    sBlock.appendChild(sDiv)
}
listNav.addEventListener('click', () => {
    if (mainDivList.style.display === 'none') {
        mainDivList.style.display = 'grid'
        searchBtn.style.display = 'block'
        todayBlock.style.display = 'none'
        schBlock.style.display = 'none'
    }
})
schNav.addEventListener('click', () => {
    if (schBlock.style.display === 'none') {
        mainDivList.style.display = 'none'
        todayBlock.style.display = 'none'
        schBlock.style.display = 'block'
        searchBtn.style.display = 'none'
    } else {
        schBlock.style.display = 'none'
    }
})
todayNav.addEventListener('click', () => {
    if (todayBlock.style.display === 'none') {
        mainDivList.style.display = 'none'
        todayBlock.style.display = 'block'
        schBlock.style.display = 'none'
        searchBtn.style.display = 'none'
    } else {
        todayBlock.style.display = 'none'
    }
})
function getAllListItems() {
    let allLiItems = []
    listItems.forEach(ele => {
        allLiItems.push(JSON.parse(localStorage.getItem(ele)))
    })
    return allLiItems;
}
schNav.addEventListener('click', getScheduledTasks)
function getScheduledTasks(event) {
    const allLiItems = getAllListItems()
    schDiv.innerHTML = ''
    allLiItems.forEach(item => {
        let allTasks = item.tasks
        allTasks.forEach(task => {
            if (task.dueDate) {
              buildScheduledTasks(task.name, task.dueDate , item.listName, schDiv, schBlock)
            }
        })
    })
}

todayNav.addEventListener('click', getTodayTasks)
function getTodayTasks(event) {
    const today = new Date(Date.now()).toISOString().split('T')[0]
    const allLiItems = getAllListItems()
    todayDiv.innerHTML = ''
    allLiItems.forEach(item => {
        let allTasks = item.tasks
        allTasks.filter(task => {
            if (task.dueDate === today) {
                buildScheduledTasks(task.name, task.dueDate , item.listName, todayDiv, todayBlock)
            }
        })
    })
}

const header = document.getElementById("myDIV");
const btns = header.getElementsByClassName("block-2");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}