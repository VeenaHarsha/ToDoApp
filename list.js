import getGlobalVars from './global-var.js'
import {showTaskList,createDOM,getTaskName,listItems} from './task.js'

const {listBlock,taskList,listForm,newListBtn,goBackBtn,listName,searchBtn,
    searchForm,crListItem,srListItem,searchName,mainDivList,nav1,nav2} = getGlobalVars()

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

searchBtn.addEventListener('click', () => {
    if (searchForm.style.display === 'none') {
        listForm.style.display = 'none'
        searchForm.style.display = 'block'
    } else {
        searchForm.style.display = 'none'
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
crListItem.addEventListener('click',createList)

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
srListItem.addEventListener('click',searchList)

function buildListItems(list){
    mainDivList.appendChild(
        createDOM('div',
                    {
                        className:'show-task-list'
                    },
                    createDOM( 'div',
                        {
                            id:list.id,
                            className:'ui-list-div',
                            onclick:showTaskList
                        },
                        createDOM('p',
                            {
                                className:'inner-p',
                                innerHTML:getTaskName(list) || 'No Tasks'
                            }
                        )
                    ),                
                    createDOM('img',
                        {
                            id:list.id,
                            src:'images/delete-small.png',
                            width:15,
                            height:15,
                            onclick:deleteListItem
                        }
                    ),
                    createDOM('input', 
                        {
                            className: 'new-name',
                            type: 'text',
                            value: list.listName,
                            onclick: renameList
                        }
                    )
                )
    );
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

goBackBtn.addEventListener('click', (event) => {
    event.preventDefault()
    nav1.style.display = 'grid'
    nav2.style.display = 'none'
    taskList.style.display = 'none'
    listBlock.style.display = 'block'
    loadLists()
})
