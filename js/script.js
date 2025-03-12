//Hente DOM elementer
const form = document.getElementById('todo-form');
const dateTime = document.getElementById('todo-tid-dato');
const todoText = document.getElementById('todo-text');
const addTodoBtn = document.getElementById('add-todo'); //submit knap
const rmvChecked = document.getElementById('rmv-checked');
const view = document.getElementById('view');

//Deklaration uden datatype eller værdi af en variable der senere-
//bliver et array med alle todos
let todos;

//Her tjekker vi om der er noget i localStorage
//Hvis der er, så konverter det til et array (JSON.parse())-
//Og assigner data til todos
//Hvis der ikke er noget i localStorage så laves todos til-
//et tomt array
if (localStorage.getItem('todos')) {
	todos = JSON.parse(localStorage.getItem('todos'));
} else {
	todos = [];
}

//Her er der to events vi gerne vil arbejde med
//Submit af form og page load
form.addEventListener('submit', function (event) {
	//Forhindre at sende formen
	event.preventDefault();

	//Tilføj form inputs værdier til arrayet
	let todoData = form.elements.todo.value;
	let selectedDateTime = dateTime.value;

	//Opret nyt todo objekt med tekst og dato
	let newTodo = {
		text: todoData,
		datetime: selectedDateTime || null
	};
	todos.push(newTodo);

	//Opdater localStorage (JSON.stringify() gør det til en tekststreng)
	localStorage.setItem('todos', JSON.stringify(todos));

	//Kald updateView funktionen og reset formen
	updateView();
	form.reset();
});

//Her kalder vi også updateView når siden loader
document.addEventListener('DOMContentLoaded', updateView);

//updateView funktion deklaration
function updateView() {
	//Se om der er data i localStorage
	if (localStorage.getItem('todos')) {
		//Hvis der er, så ryd elementet med id="view"
		view.innerHTML = '';
		//Loop igennem alle todos
		//element peger på hver enkelt todo
		todos.forEach(function (todo, index) {
			let dateTimeHtml = '';

			//Tilføjer kun tid og dato hvis valgt og formatter dato og tid til visning
			if (todo.datetime) {
				let dateObj = new Date(todo.datetime);
				let formattedDate = dateObj.toLocaleDateString();
				let formattedTime = dateObj.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				});
				dateTimeHtml = ` - <span class="datetime">${formattedDate} ${formattedTime}</span>`;
			}

			//Tilføjer til DOM
			view.innerHTML += `
            <div class='todo-item'>    
            <label for="checkBox-${index}" id="label-${index}" class="todo-label">
                    ${todo.text}${dateTimeHtml}
                </label>
            <input type="checkbox" id="checkBox-${index}" class="checkyboxy" data-index="${index}"> 
                <i class="fa fa-trash-o" data-index="${index}"></i>
                <br>
            </div>`;
		});

		//Tilføjer eventListeners for checkboxe så de kan blive overstreget når valgt
		document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
			checkbox.addEventListener('change', function () {
				const index = this.getAttribute('data-index');
				const label = document.getElementById(`label-${index}`);

				if (this.checked) {
					label.style.textDecoration = 'line-through';
					label.style.color = 'red';
				} else {
					label.style.textDecoration = 'none';
					label.style.color = 'black';
				}
			});
		});

		//Tilføjer eventListener til skraldespand ikonet
		document.querySelectorAll('.fa-trash-o').forEach((trashIcon) => {
			trashIcon.addEventListener('click', function () {
				const index = this.getAttribute('data-index');
				removeTodo(index);
			});
		});
	}
}

rmvChecked.addEventListener('click', function () {
	//Hent alle checkboxe der er valgt
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	//Et tomt array til at gemme de valgte checkboxe
	const todosToRemove = [];

	//Et loop til at finde alle valgte checkboxe
	checkboxes.forEach(function (checkbox) {
		if (checkbox.checked) {
			//Hent indekset fra data attributten
			const index = parseInt(checkbox.getAttribute('data-index'));
			todosToRemove.push(index);
		}
	});

	//Sorter de todos der skal fjernes i faldende orden, så det ikke kommer til at-
	//lave rod med splice() metoden når todos bliver fjernet
	todosToRemove.sort((a, b) => b - a);

	//Fjern de valgte items fra todos arrayet ved at loop igennem dem
	todosToRemove.forEach(function (index) {
		todos.splice(index, 1);
	});

	//Opdater localStorage og vores view
	localStorage.setItem('todos', JSON.stringify(todos));
	updateView();
});

//Til at fjerne todos når man klikker på skraldespands ikonnet
function removeTodo(number) {
	todos.splice(number, 1);
	localStorage.setItem('todos', JSON.stringify(todos));
	updateView();
}
