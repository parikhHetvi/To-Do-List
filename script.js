const listsContainer = document.querySelector('[data-lists]')

//to add new list in container
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

//to delete 
const deleteListButton = document.querySelector('[data-delete-list-button]')

// big box
const listDisplayContainer = document.querySelector('[data-list-display-container]')

// title of list 
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')


const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')

//add new task in task
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')


//clear complete task
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')



const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)



//for active list 
listsContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li')
    {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input')
    {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find( task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})


//clear completed task
clearCompleteTasksButton.addEventListener('click', e => {
        const  selectedList = lists.find(list => list.id === selectedListId)
        selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
        saveAndRender()
    }
)


deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id != selectedListId)
    selectedListId = null
    saveAndRender()
})

//to add new list 
newListForm.addEventListener('submit', e => {
            e.preventDefault()
            const listName = newListInput.value
            if(listName == null || listName === '') return
            const list = createList(listName)
            newListInput.value = null
            lists.push(list)
            saveAndRender()
        })

//to add new task 
newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    // add task to particular list
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})



// when you add a list it create a list with id name and tasks
function createList(name)
{
  return  {id: Date.now().toString(), name: name , tasks: [] }
}


//it will create a new task
function createTask(name)
{
  return  { id : Date.now().toString(), name: name, complete : false}
}

function saveAndRender() {
    save()
    render()
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedListId)
}


function render()
{
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if(selectedListId == null)
    {
        listDisplayContainer.style.display = 'none'
    }
    else
    {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}


function renderTasks(selectedList) 
{
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label') 
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}
 

function renderTaskCount(selectedList)
{
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete ).length
    const taskString =incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


function renderLists()
{
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if(list.id === selectedListId)
        { 
            listElement.classList.add('active-list')
        } 
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element)
{
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}


render()