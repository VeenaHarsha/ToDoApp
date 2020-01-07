//Creating List (Category)
const listId = document.getElementById('listId') 
const listForm = document.getElementById('list-form')
const listBlock = document.querySelector('.list-container')
const taskAddBlock = document.querySelector('.task-container')
const listName = document.getElementById('list-name')
const mainDivList = document.getElementById('main-div-list')
const uiDiv = document.querySelector('.ui-list-div') // For building UI list
const taskList = document.querySelector('.show-taskList-container')
const taskNotes = document.getElementById('task-note')
const dueDate = document.getElementById('due-date')
const priority = document.getElementById('prId')
const moreInfoBtn = document.querySelector('.more-info-btn')
const moreInfo = document.querySelector('.show-more-info')
const taskDiv = document.querySelector('.task-div') // For building UI tasks
const newListBtn = document.getElementById('listId')
const goBackBtn = document.getElementById('goback')
const taskDiv2 = document.querySelector('.task-div-2') 
const taskName = document.getElementById('task-name')
const selectTask = document.getElementById('selTask')

let currListId 
let listItems = localStorage.getItem('listItems') ?
    JSON.parse(localStorage.getItem('listItems')) : []

let taskItems = localStorage.getItem('taskItems') ?
    JSON.parse(localStorage.getItem('taskItems')) : []

//Display Add List form on clicking List button
listId.addEventListener('click',()=>{
    if (listForm.style.display === 'none'){
        listForm.style.display = 'block'
    }
})
//On submit of List
function createList(event){
    event.preventDefault()
    const liCategoryObj = {
        id : listItems.length === 0 ? 1:listItems[listItems.length-1].id+1 ,
        liName:listName.value
    }
    listItems.push(liCategoryObj)
    localStorage.setItem('listItems', JSON.stringify(listItems))
    localStorage.setItem(liCategoryObj.id,JSON.stringify(liCategoryObj))
    buildListItems(liCategoryObj)
    listName.value = ''
}
//building list dynamically
function buildListItems(list) {
    console.log("List to build : "+list.id +":"+list.liName)
    const div1 = document.createElement('DIV')
    const div2 = document.createElement('DIV')
    const outerP = document.createElement('P')
    const innerP = document.createElement('P')
    console.log(div1)
    div2.setAttribute('id',list.id)
    div1.setAttribute('class','show-task-list')
    // div1.setAttribute('ondblclick','selectList()')
    innerP.textContent = 'No Tasks'
    innerP.style ='text-align: center;'
    div2.appendChild(innerP)
    div2.setAttribute('class','ui-list-div') 
    div2.setAttribute('lname','list.liName')
    div2.onclick = showTaskList
   // div2.addEventListener('click', showTaskList(event,`${list}`))
    div1.appendChild(div2)
    outerP.textContent = list.liName
    mainDivList.setAttribute('class','main-div-display')
    div1.appendChild(outerP)
    mainDivList.appendChild(div1)
}
//Showing task list
function showTaskList(event){
    console.log("From Show Task List: " ,event.target.id)
    currListId = event.target.id
    if (taskList.style.display === 'none'){
        taskList.style.display = 'block'
        listBlock.style.display = 'none'
        newListBtn.style.visibility= 'hidden'
        goBackBtn.style.visibility ='visible'
    }
}
//Adding Task Details
function createTask(event){
    event.preventDefault()
    console.log("Current List id : ",currListId)
    //if(event.key.value !== 13) return;
    console.log("Task Getting Printed",event.target.value)
    const taskObject = {
        id : taskItems.length === 0 ? 1:taskItems[taskItems.length-1].id+1 ,
        name : 'Get Task Name',
        listCatId : currListId ,
        notes : taskNotes.value,
        dueDate : dueDate.value,
        priority : priority[priority.selectedIndex].value
    }
    taskItems.push(taskObject)
    localStorage.setItem('taskItems', JSON.stringify(taskItems))
    localStorage.setItem(taskObject.id,JSON.stringify(taskObject))
    console.log(taskObject)
    buildTaskItems(taskObject)

}
//Building Task Info
function buildTaskItems(task){
    console.log("Tasks r : "+task)
    const checkbox = document.createElement('INPUT')
    const input = document.createElement('INPUT')
    // const textNode = document.createTextNode(task.name)
    const button = document.createElement('BUTTON')
    const iTag = document.createElement('i')
    iTag.setAttribute('class','fa fa-sort-desc')
    button.appendChild(iTag)
    button.onclick = addTaskInfo
    button.setAttribute('class','.button')
    checkbox.setAttribute('type','checkbox')
    // button.setAttribute('style','display:none')
    input.setAttribute('type','text')
    input.setAttribute('placeholder','New Task...')
    input.onclick = createTask
    // textNode.onclick = createTask
    input.setAttribute('class','task-div-2')
    taskDiv2.appendChild(checkbox)
    taskDiv2.appendChild(input)
    // taskDiv2.appendChild(textNode)
    taskDiv2.appendChild(button)
}
//adding more task info
function addTaskInfo(event){
    event.preventDefault()
    console.log("Add more Task Details...")
    if(moreInfo.style.display === 'none') {
        // moreInfoBtn.style.display = 'block'
        taskList.style.display = 'block'
        moreInfo.style.display = 'block'
        taskList.insertAdjacentElement("afterend",moreInfo)
        listBlock.style.display='none'
    } else {
        moreInfo.style.display = 'none'
         listBlock.style.display='none'
         taskList.style.display = 'block'
    }
}
function completeTask(event){
    if(selectTask.checked){
        taskName.style.setProperty('text-decoration','line-through')
    }else{
        taskName.style.setProperty('text-decoration','none')
    }
}
function goToListPage(event){
    event.preventDefault()
    listBlock.style.display='block'
    taskAddBlock.style.display = 'none'
}
function deleteTask(event){
    event.preventDefault()
    console.log('Need to delete the Task : '+event.target.id , )
}
displayTasks()

function displayTasks() {
    listItems.forEach(ele => buildListItems(ele))
}
