const STORAGE_KEY = "task-manager-tasks";

const taskForm = document.querySelector( ".task-form" );
const taskInput = document.querySelector( "#task-input" );
const taskList = document.querySelector( "#task-list" );
const taskCount = document.querySelector( "#task-count" );
const clearCompletedBtn = document.querySelector( "#clear-completed" );
const filtersContainer = document.querySelector( ".filters" );

let tasks = loadTasks();
let currentFilter = "all";

// --- Storage ---

function loadTasks () {
  try {
    const data = localStorage.getItem( STORAGE_KEY );
    return data ? JSON.parse( data ) : [];
  } catch {
    return [];
  }
}

function saveTasks () {
  localStorage.setItem( STORAGE_KEY, JSON.stringify( tasks ) );
}

// --- Task CRUD ---

function addTask ( text ) {
  const task = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push( task );
  saveTasks();
  render();
}

function deleteTask ( id ) {
  tasks = tasks.filter( ( task ) => task.id !== id );
  saveTasks();
  render();
}

function toggleTask ( id ) {
  const task = tasks.find( ( task ) => task.id === id );
  if ( task ) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function clearCompleted () {
  tasks = tasks.filter( ( task ) => !task.completed );
  saveTasks();
  render();
}

// --- Filtering ---

function getFilteredTasks () {
  switch ( currentFilter ) {
    case "active":
      return tasks.filter( ( task ) => !task.completed );
    case "completed":
      return tasks.filter( ( task ) => task.completed );
    default:
      return tasks;
  }
}

function setFilter ( filter ) {
  currentFilter = filter;

  document.querySelectorAll( ".filters__button" ).forEach( ( btn ) => {
    btn.classList.toggle( "filters__button--active", btn.dataset.filter === filter );
  } );

  render();
}

// --- Rendering ---

function createTaskHTML ( task ) {
  const escapedText = task.text
    .replace( /&/g, "&amp;" )
    .replace( /</g, "&lt;" )
    .replace( />/g, "&gt;" )
    .replace( /"/g, "&quot;" );

  return `<li class="task-item ${ task.completed ? "task-item--completed" : "" }" data-id="${ task.id }">
        <input
            type="checkbox"
            class="task-item__checkbox"
            ${ task.completed ? "checked" : "" }
            aria-label="Mark task as ${ task.completed ? "incomplete" : "complete" }"
        >
        <span class="task-item__text">${ escapedText }</span>
        <button class="task-item__delete" aria-label="Delete task">✕</button>
    </li>`;
}

function render () {
  const filtered = getFilteredTasks();
  taskList.innerHTML = filtered.map( createTaskHTML ).join( "" );

  const activeCount = tasks.filter( ( task ) => !task.completed ).length;
  taskCount.textContent = `${ activeCount } task${ activeCount !== 1 ? "s" : "" } remaining`;

  const hasCompleted = tasks.some( ( task ) => task.completed );
  clearCompletedBtn.style.display = hasCompleted ? "inline-block" : "none";
}

// --- Event Listeners ---

taskForm.addEventListener( "submit", ( e ) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if ( text ) {
    addTask( text );
    taskInput.value = "";
    taskInput.focus();
  }
} );

// Event delegation for task list
taskList.addEventListener( "click", ( e ) => {
  const taskItem = e.target.closest( ".task-item" );
  if ( !taskItem ) return;

  const id = taskItem.dataset.id;

  if ( e.target.classList.contains( "task-item__checkbox" ) ) {
    toggleTask( id );
  } else if ( e.target.classList.contains( "task-item__delete" ) ) {
    deleteTask( id );
  }
} );

taskList.addEventListener( "change", ( e ) => {
  if ( e.target.classList.contains( "task-item__checkbox" ) ) {
    const taskItem = e.target.closest( ".task-item" );
    if ( taskItem ) {
      toggleTask( taskItem.dataset.id );
    }
  }
} );

filtersContainer.addEventListener( "click", ( e ) => {
  if ( e.target.classList.contains( "filters__button" ) ) {
    setFilter( e.target.dataset.filter );
  }
} );

clearCompletedBtn.addEventListener( "click", clearCompleted );

// --- Init ---

render();
