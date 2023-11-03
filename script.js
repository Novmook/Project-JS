// Инициализация списка дел
let tasks = [];


// Функция для создания уведомления
function createNotification(text) {
    if ('Notification' in window) {
      // Проверяем, поддерживает ли браузер уведомления
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          // Разрешено
          var notification = new Notification('Напоминание', {
            body: text
          });
        }
      });
    }
  }
  
  // Функция добавления задачи
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const reminderTime = document.getElementById('reminderTime').value;
  
    if (taskText !== '') {
      const task = {
        text: taskText,
        reminderTime: reminderTime,
        selected: false
      };
  
      tasks.push(task);
      saveTasksToLocalStorage();
      taskInput.value = '';
      document.getElementById('reminderTime').value = '';
  
      displayTasks();
  
      // Создаем уведомление на указанное время
      if (task.reminderTime) {
        const currentTime = new Date().getTime();
        const reminderTime = new Date(task.reminderTime).getTime();
        const timeDifference = reminderTime - currentTime;
        if (timeDifference > 0) {
          setTimeout(function () {
            createNotification(task.text);
          }, timeDifference);
        }
      }
    }
  }


    // Обработчик ошибок уведомлений
  Notification.requestPermission().then(function (permission) {
    if (permission === 'granted') {
      var notification = new Notification('Напоминание', {
        body: text
      });
    } else {
      console.error('Разрешение на уведомления было отклонено.');
    }
  }).catch(function(error) {
    console.error('Произошла ошибка при запросе разрешения: ' + error);
  });

// Функция отображения задач
function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox" onchange="toggleTaskSelection(${index})" ${task.selected ? 'checked' : ''}>
            <span>${task.text}</span>
            <input type="datetime-local" id="reminderTime_${index}" value="${task.reminderTime}">
            <button onclick="editTask(${index})">Изменить</button>
        `;
        taskList.appendChild(listItem);
    });
}

// Функция для фильтрации задач
function filterTasks(filterType) {
    let filteredTasks;

    if (filterType === 'completed') {
        filteredTasks = tasks.filter(task => task.selected);
    } else if (filterType === 'active') {
        filteredTasks = tasks.filter(task => !task.selected);
    } else {
        // По умолчанию, показать все задачи
        filteredTasks = tasks;
    }

    displayTasks(filteredTasks);
}



// Функция изменения задачи
function editTask(index) {
    const newText = prompt('Измените текст задачи:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText;
        tasks[index].reminderTime = document.getElementById(`reminderTime_${index}`).value;
        saveTasksToLocalStorage();
        displayTasks();
    }
}



// Функция удаления выбранных задач
function deleteSelectedTasks() {
    tasks = tasks.filter(task => !task.selected);
    saveTasksToLocalStorage();
    displayTasks();
}


// Функция переключения выбора задачи
function toggleTaskSelection(index) {
    tasks[index].selected = !tasks[index].selected;
}

// Функция сохранения задач в localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция загрузки задач из localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
}

// Вызов функции загрузки задач при загрузке страницы
loadTasksFromLocalStorage();
