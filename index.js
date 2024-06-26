class Model {
  constructor() {
    this.todos = [
      {id: 1, text: 'Run a marathon', complete: false},
      {id: 2, text: 'Plant a garden', complete: false},
    ]
  }
  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length-1].id+1 : 1,
      text: todoText,
      complete: false
    }
    this.todos.push(todo)
    this.onTodoListChanged(this.todos)
  }
  editTodo(id, updatedText) {
    this.todos = this.todos.map(todo => 
      todo.id === id? {id: id, text: updatedText, complete: todo.complete} : todo
    )
    this.onTodoListChanged(this.todos)
  }
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)
    this.onTodoListChanged(this.todos)
  }
  toggleTodo(id) {
    this.todos = this.todos.map(todo => 
      todo.id === id ? {id, text: todo.text, complete: !todo.complete} : todo
    )
    this.onTodoListChanged(this.todos)
  }

  bindOnTodoListChanged(callback) {
    this.onTodoListChanged = callback
  }
}

class View {
  constructor() {
    //root element
    this.app = this.getElement("#root")

    //app title
    this.title = this.createElement("h1")
    this.title.textContent = "Todos"

    //the input form
    this.form = this.createElement("form")

    this.input = this.createElement("input")
    this.input.type = "text"
    this.input.placeholder = "Add todo"
    this.input.name = 'todo'

    this.submitButton = this.createElement("button")
    this.submitButton.textContent = "Submit" 

    //visual representation of todo list
    this.todoList = this.createElement('ul', 'todo-list')

    //append input and submit button to form
    this.form.append(this.input, this.submitButton)

    //append title, form and todolist to the app
    this.app.append(this.title, this.form, this.todoList)

  }
  createElement(tag, className) {
    const element = document.createElement(tag)
    if(className) element.classList.add(className)
    return element
  }
  getElement(selector) {
    const element = document.querySelector(selector)
    return element
  }

  get _todoText() {
    return this.input.value
  }

  _resetInput() {
    this.input.value = ''
  }

  displayTodos(todos) {
    //Delete all the existing nodes
    while(this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }

    //show default message if no todos
    if(todos.length === 0){
      const p = this.createElement('p')
      p.textContent = 'Nothing to do! Add a task?'
      this.todoList.append(p)
    }
    else {
      todos.forEach(todo => {
        const li = this.createElement('li')
        li.id = todo.id

        //checkbox to toggle which indicates the completion of task
        const checkbox = this.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.complete 

        //todo text which can be editable
        const span = this.createElement('span')
        span.contentEditable = true
        span.classList.add('editable')
        //adding a strike through to the text if the task is completed
        if(todo.complete) {
          const strike = this.createElement('s')
          strike.textContent = todo.text
          span.append(strike)
        } else {
          span.textContent = todo.text
        }

        //delete button for each todo
        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Delete'
        li.append(checkbox, span, deleteButton)

        this.todoList.append(li)

      })
    }
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if(this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    })
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', event => {
      if(event.target.className === 'delete'){
        const id = parseInt(event.target.parentElement.id)
        handler(id)
      }
    })
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', event => {
      if(event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id)
        handler(id)
      }
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    //display initial todos
    this.onTodoListChanged(this.model.todos)

    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindDeleteTodo(this.handleDeleteTodo)
    this.view.bindToggleTodo(this.handleToggleTodo)
    // this.view.bindEditTodo(this.handleEditTodo)

    this.model.bindOnTodoListChanged(this.onTodoListChanged)
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos)
  }

  handleAddTodo = (todo) => this.model.addTodo(todo)

  handleDeleteTodo = (id) => this.model.deleteTodo(id)

  handleEditTodo = (id, text) => this.model.editTodo(id, text)

  handleToggleTodo = (id) => this.model.toggleTodo(id)


}

const app = new Controller(new Model(), new View())
// app.view.displayTodos(app.model.todos)