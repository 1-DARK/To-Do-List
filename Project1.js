// Run the code only after the HTML document is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // Get reference to the input field where user types a task
  const todo_inp = document.getElementById('todo');

  // Get reference to the "Add" button
  const bt_task = document.getElementById('add_task');

  // Get reference to the list (ul) where tasks will be shown
  const todo_list = document.getElementById('todo-list');

  // Load existing tasks from localStorage (or empty array if none exist)
  let tasks = JSON.parse(localStorage.getItem('task')) || [];

  // Render all tasks that were saved previously
  tasks.forEach(task => render(task));

  // When "Add" button is clicked, run this function
  bt_task.addEventListener("click", () => {

    // Get the text from input, and remove any extra spaces
    const taskText = todo_inp.value.trim();

    // If input is empty, stop here (don't add an empty task)
    if (taskText === '') return;

    // Create a new task object with a unique id and the input text
    const new_task = {
      id: Date.now(),         // Unique ID based on current time
      text: taskText,         // Text from the input
      completed: false        // Task is not completed yet
    };

    // Add the new task to the array
    tasks.push(new_task);

    // Save the updated task list to localStorage
    save();

    // Show the new task in the list on the page
    render(new_task);

    // Clear the input field
    todo_inp.value = "";

    // (Optional) Log the tasks to the console for debugging
    console.log(tasks);
  });

  // Function to show a task in the list
  function render(task) {
    // Create a new <li> element for the task
    const li = document.createElement('li');

    // Set a custom attribute to identify the task by its ID
    li.setAttribute('data-id', task.id);

    // If the task is already completed, add the 'completed' class (for strikethrough)
    if (task.completed) li.classList.add('completed');

    // Add the task text and a delete button to the <li>
    li.innerHTML = `
      <span>${task.text}</span>
      <button style="background-color:red; border-radius:30px; color:white; width:70px; height:30px;">Delete</button>
    `;

    // Add click event to the whole task item
    li.addEventListener('click', (e) => {
      // If the clicked element was the button, skip this (button click is handled separately)
      if (e.target.tagName === 'BUTTON') return;

      // Toggle the "completed" state
      task.completed = !task.completed;

      // Toggle the 'completed' class for visual effect (strikethrough)
      li.classList.toggle('completed');

      // Save the change to localStorage
      save();
    });

    // Add click event to the delete button
    li.querySelector('button').addEventListener("click", (e) => {
      // Prevent the event from bubbling up and also toggling the task
      e.stopPropagation();

      // Remove the task from the array (keep only tasks with a different ID)
      tasks = tasks.filter(t => t.id !== task.id); 
      // NOTE: If you used === instead of !==, it would *keep only* the deleted task, which is wrong.

      // Remove the <li> from the page
      li.remove();

      // Save the updated list
      save();
    });

    // Add the finished <li> to the <ul>
    todo_list.appendChild(li);
  }

  // Save the tasks array to localStorage as a string
  function save() {
    localStorage.setItem('task', JSON.stringify(tasks)); 
    // JSON.stringify converts JavaScript array into a string so it can be saved
  }

});
