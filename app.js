// Initialize PocketBase
const pb = new PocketBase('https://training-pocketbase.g5amlv.easypanel.host');

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
        console.error('Error details:', error.response);
        const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        alert('Signup failed: ' + errorMsg);
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
    document.getElementById('user-info-footer').classList.remove('hidden');
    
    // Display logged in user email
    const userEmail = pb.authStore.model?.email || 'Unknown User';
    document.getElementById('user-email').textContent = userEmail;
}

function showAuthSection() {
    document.getElementById('todo-section').classList.add('hidden');
    document.getElementById('user-info-footer').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
}

// Todo Functions
async function loadTodos() {
    try {
        const records = await pb.collection('todos').getFullList({
            sort: '-created',
            filter: `user = "${pb.authStore.model.id}"`
        });
        
        console.log('Loaded todos:', records);
        console.log('Number of todos:', records.length);
        renderTodos(records);
    } catch (error) {
        console.error('Error loading todos:', error);
        console.error('Error details:', error.response);
        
        // Try without sorting if that's the issue
        try {
            console.log('Retrying without sort...');
            const records = await pb.collection('todos').getFullList({
                filter: `user = "${pb.authStore.model.id}"`
            });
            console.log('Loaded todos (no sort):', records);
            renderTodos(records);
        } catch (retryError) {
            console.error('Retry also failed:', retryError);
            // If collection doesn't exist, show helpful message
            if (error.status === 404) {
                alert('The "todos" collection does not exist in PocketBase. Please create it first.');
            }
        }
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    
    console.log('Rendering todos:', todos);
    console.log('Todo list element:', todoList);
    
    if (!todoList) {
        console.error('Todo list element not found!');
        return;
    }
    
    if (todos.length === 0) {
        todoList.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No todos yet. Add one above!</td></tr>';
        return;
    }
    
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const tr = document.createElement('tr');
        tr.className = todo.completed ? 'completed' : '';
        tr.innerHTML = `
            <td class="todo-text ${todo.completed ? 'strikethrough' : ''}">${todo.text}</td>
            <td class="todo-actions">
                <button class="complete-btn" onclick="toggleTodo('${todo.id}', ${!todo.completed})" title="${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    ${todo.completed ? '↩️' : '✓'}
                </button>
            </td>
            <td class="todo-actions">
                <button class="delete-btn" onclick="deleteTodo('${todo.id}')" title="Delete todo">
                    🗑️
                </button>
            </td>
        `;
        todoList.appendChild(tr);
    });
    
    console.log('Rendered', todos.length, 'todos');
}

async function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    
    if (!text) {
        console.log('Empty input, not adding todo');
        return;
    }
    
    console.log('Auth store model:', pb.authStore.model);
    console.log('User ID:', pb.authStore.model?.id);
    
    try {
        const data = {
            text: text,
            completed: false,
            user: pb.authStore.model.id
        };
        
        console.log('Creating todo with data:', data);
        const newTodo = await pb.collection('todos').create(data);
        console.log('Todo created successfully:', newTodo);
        
        input.value = '';
        console.log('Cleared input, now loading todos...');
        
        await loadTodos();
        console.log('Todos reloaded');
    } catch (error) {
        console.error('Error adding todo:', error);
        console.error('Error details:', error.response);
        console.error('Error data:', error.response?.data);
        alert('Failed to add todo: ' + (error.response?.message || error.message || 'Unknown error'));
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

// Setup event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (pb.authStore.isValid) {
        showTodoSection();
        loadTodos();
    }
    
    // Allow Enter key to submit
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
