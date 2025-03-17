// 禁用复制
document.addEventListener('copy', function(e) {
    e.preventDefault(); // 阻止默认复制行为
    alert('复制功能已禁用');
});

// 其他 JavaScript 代码（如任务栏逻辑）
document.getElementById('addTaskBtn').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = '';
        saveTasks();
    }
});

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    }
});

function addTask(taskText, isCompleted = false) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.textContent = taskText;

    if (isCompleted) {
        li.classList.add('completed');
    }

    // 短按：标记任务为完成（划线效果）或移动到最前面
    let isClick = false; // 标记是否为点击事件
    li.addEventListener('click', function() {
        if (!isClick) return; // 如果不是点击事件，直接返回
        li.classList.toggle('completed');
        if (li.classList.contains('completed')) {
            taskList.appendChild(li);
        } else {
            taskList.insertBefore(li, taskList.firstChild);
        }
        saveTasks();
    });

    // 长按删除任务
    let pressTimer;
    li.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(function() {
            taskList.removeChild(li);
            saveTasks();
        }, 1000); // 长按 1 秒后删除
    });

    li.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
        isClick = true; // 标记为点击事件
        setTimeout(function() {
            isClick = false; // 重置标记
        }, 100); // 延迟 100 毫秒触发点击事件
    });

    li.addEventListener('touchcancel', function(e) {
        clearTimeout(pressTimer);
    });

    // 将新任务插入到列表的最前面
    taskList.insertBefore(li, taskList.firstChild);
}

// 保存任务到 LocalStorage
function saveTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 从 LocalStorage 加载任务
function loadTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // 按保存时的顺序添加任务
    tasks.reverse().forEach(task => {
        addTask(task.text, task.completed);
    });
}

// 页面加载时加载任务
window.addEventListener('load', loadTasks);
