import getGlobalVars from './global-var.js'

const {listBlock,taskName,taskList,taskDiv2,taskNotes,dueDate,priority,moreInfo,schNav,mainDivList,nav1,nav2,
       filterBtn,todayBlock,todayDiv,schBlock,schDiv,listNav,todayNav,upTaskBtn,delTaskBtn,newListBtn} = getGlobalVars()
 
let currListId, currTaskId ,isTaskDone = false

let listItems = localStorage.getItem('listItems') ?
    JSON.parse(localStorage.getItem('listItems')) : []
   
function createDOM(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child !== "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}

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

const getTaskName = function (list) {
    let tNames = ''
    list.tasks.forEach(ele => tNames += ele.name + '<br>')
    return tNames
}

function showTaskList(event) {
    currListId = event.target.parentElement.id
    if (currListId) {
        nav1.style.display = 'none'
        nav2.style.display = 'block'
        listBlock.style.display = 'none'
        taskList.style.display = 'block'
    }
    taskDiv2.innerHTML = ''
    let currListTasks = JSON.parse(localStorage.getItem(currListId)).tasks
    if (currListTasks) currListTasks.forEach(task => buildTaskItems(task))
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
    currTaskId = event.target.parentNode.getAttribute('id')
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
    let tID = event.target.parentNode.getAttribute('id')
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

function deleteTask (event) {
    event.preventDefault()
    let currList = JSON.parse(localStorage.getItem(currListId))
    let curTask = currList.tasks
    let index = curTask.findIndex(ele => ele.id === Number(currTaskId))
    curTask.splice(index, 1)
    localStorage.setItem(currListId, JSON.stringify(currList))
    taskDiv2.innerHTML = ''
    curTask.forEach(task => buildTaskItems(task))
}


listNav.addEventListener('click', () => {
    if (mainDivList.style.display === 'none') {
        mainDivList.style.display = 'grid'
        searchBtn.style.display = 'block'
        todayBlock.style.display = 'none'
        schBlock.style.display = 'none'
        newListBtn.style.visibility = 'visible'
    }
})

schNav.addEventListener('click', () => {
    if (schBlock.style.display === 'none') {
        mainDivList.style.display = 'none'
        todayBlock.style.display = 'none'
        schBlock.style.display = 'block'
        searchBtn.style.display = 'none'
        newListBtn.style.visibility = 'hidden'
    } 
})

todayNav.addEventListener('click', () => {
    if (todayBlock.style.display === 'none') {
        mainDivList.style.display = 'none'
        todayBlock.style.display = 'block'
        schBlock.style.display = 'none'
        searchBtn.style.display = 'none'
        newListBtn.style.visibility = 'hidden'
    } 
})

function getAllListItems() {
    let allLiItems = []
    listItems.forEach(ele => {
        allLiItems.push(JSON.parse(localStorage.getItem(ele)))
    })
    return allLiItems;
}

function getScheduledTasks(event) {
    const allLiItems = getAllListItems()
    schDiv.innerHTML = ''
    allLiItems.forEach(item => {
        let allTasks = item.tasks
        allTasks.forEach(task => {
            if (task.dueDate && !task.taskDone) {
              buildScheduledTasks(task.name, task.dueDate , item.listName, schDiv, schBlock)
            }
        })
    })
}

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

schNav.addEventListener('click', getScheduledTasks)
todayNav.addEventListener('click', getTodayTasks)
filterBtn.addEventListener('click', clearCompleted)
upTaskBtn.addEventListener('click',updateTask)
delTaskBtn.addEventListener('click',deleteTask)
taskName.addEventListener('keypress', createTask)

function buildTaskItems(task){
  taskDiv2.appendChild(
      createDOM('div',
                  { 
                      id:task.id,
                      className:'task-div'
                  },
                  createDOM( 'input',
                      {
                          type: 'checkbox',
                          id:'selTask',
                          onclick: isCompleted ,
                          checked:task.taskDone
                      }),
                      createDOM( 'input',
                      {
                          type: 'text',
                          id:'task-name',
                          value:task.name
                      }),
                      createDOM(  'img',
                      {
                          id:'more-info-btn',
                          src:'images/arrow-down.png',
                          width:15,
                          height:15,
                          onclick:addMoreInfo
                      }
                  )
                  )
  );
}

function buildScheduledTasks(taskName, sDate,listName, sDiv, sBlock){
    sDiv.appendChild(
        createDOM('div',
                    {
                       className:'sch-div-style'     
                    },
                    createDOM( 'span',
                            {
                                innerText:taskName
                            }
                        ),
                        createDOM('span',
                            {
                                innerText:sDate,
                                className:'span-2',
                            }
                        ),
                        createDOM('span',
                            {
                                innerText:listName,
                                className:'span-3',
                            }
                        )
                )
    );
    sBlock.appendChild(sDiv)
}

export {showTaskList,createDOM,getTaskName,listItems}
