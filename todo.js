document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('obj'));
    
    if (!currentUser || !currentUser.email) {
        window.location.href = 'index.html';
        return;
    }
    
    // Unique key for this user's todos
    const todoKey = `todos_${currentUser.email}`;
    
    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem(todoKey)) || [];
    
    // Current filter state
    let currentFilter = 'all';
    
    // Initialize the app
    renderTodos();
    
    // Add new todo
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const todoText = todoInput.value.trim();
        if (!todoText) return;
        
        // Create new todo object
        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        };
        
        // Add to array and save
        todos.push(newTodo);
        saveTodos();
        
        // Clear input and render
        todoInput.value = '';
        renderTodos();
        
        // Show notification
        showNotification('Task added successfully!', 'success');
    });
    
    // Handle todo list clicks (delete and toggle)
    todoList.addEventListener('click', function (e) {
        // Handle delete button click
        if (e.target.classList.contains('todo-delete') || e.target.parentElement.classList.contains('todo-delete')) {
            const todoItem = e.target.closest('.todo-item');
            const todoId = parseInt(todoItem.dataset.id);
            
            // Remove from array
            todos = todos.filter(todo => todo.id !== todoId);
            saveTodos();
            renderTodos();
            
            // Show notification
            showNotification('Task deleted successfully!', 'info');
        }
        
        // Handle checkbox click
        if (e.target.classList.contains('todo-checkbox')) {
            const todoItem = e.target.closest('.todo-item');
            const todoId = parseInt(todoItem.dataset.id);
            
            // Find and toggle the todo
            todos = todos.map(todo => {
                if (todo.id === todoId) {
                    todo.completed = !todo.completed;
                }
                return todo;
            });
            
            saveTodos();
            renderTodos();
            
            // Show notification
            showNotification('Task status updated!', 'success');
        }
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            currentFilter = filter;
            
            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            renderTodos();
        });
    });
    
    // Helper function to render todos
    function renderTodos() {
        // Clear the list
        todoList.innerHTML = '';
        
        // Filter todos based on current filter
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        // Show empty state if no todos
        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
        
        // Render each todo
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;
            
            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <span class="todo-date">${todo.date}</span>
                <button class="todo-delete"><i class="fas fa-trash"></i></button>
            `;
            
            todoList.appendChild(todoItem);
        });
    }
    
    // Helper function to save todos to localStorage
    function saveTodos() {
        localStorage.setItem(todoKey, JSON.stringify(todos));
    }
    
    // Function to show notifications
    function showNotification(message, type) {
        const alertContainer = document.querySelector('.alert-container');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alertContainer.removeChild(alert);
            }, 300);
        }, 5000);
    }
});