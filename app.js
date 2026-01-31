// Initialize PocketBase
const pb = new PocketBase('https://training-pocketbase.g5amlv.easypanel.host');

// Check if user is already logged in
if (pb.authStore.isValid) {
    showTodoSection();
    loadTodos();
}

// Auth Functions
function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

async function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const data = {
            email: email,
            password: password,
            passwordConfirm: passwordConfirm
        };
        
        await pb.collection('users').create(data);
        alert('Account created successfully! Please sign in.');
        showLogin();
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + (error.message || 'Unknown error'));
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await pb.collection('users').authWithPassword(email, password);
        showTodoSection();
        loadTodos();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + (error.message || 'Invalid credentials'));
    }
}

function logout() {
    pb.authStore.clear();
    showAuthSection();
    document.getElementById('todo-list').innerHTML = '';
}

function showTodoSection() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('todo-section').classList.remove('hidden');
}

function showAuthSection() {
    document.getElementById('todo-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
}

// Todo Functions
async function loadTodos() {
    try {
        const records = await pb.collection('todos').getFullList({
            sort: '-created',
            filter: `user = "${pb.authStore.model.id}"`
        });
        
        renderTodos(records);
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo('${todo.id}', ${!todo.completed})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    try {
        const data = {
            text: text,
            completed: false,
            user: pb.authStore.model.id
        };
        
        await pb.collection('todos').create(data);
        input.value = '';
        loadTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
        alert('Failed to add todo');
    }
}

async function toggleTodo(id, completed) {
    try {
        await pb.collection('todos').update(id, { completed });
        loadTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        await pb.collection('todos').delete(id);
        loadTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('todo-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    document.getElementById('login-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
    
    document.getElementById('signup-password-confirm')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') signup();
    });
});
