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
  }
  editTodo(id, updatedText) {
    this.todos = this.todos.map(todo => 
      todo.id === id? {id: id, text: updatedText, complete: todo.complete} : todo
    )
  }
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id)
  }
  toggleTodo(id) {
    this.todos = this.todos.map(todo => 
      todo.id === id ? {id, text: todo.text, complete: !todo.complete} : todo
    )
  }
}

class View {
  constructor() {
    //root element
    this.root = this.getElement("#root")

    //app title
    this.heading = this.createElement("h1")
    this.heading.textContent = "Todos"

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
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
}

const app = new Controller(new Model(), new View())