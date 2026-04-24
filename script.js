let questions = JSON.parse(localStorage.getItem("questions")) || [];

// Add Question
function addQuestion() {
  let name = document.getElementById("question").value;
  let difficulty = document.getElementById("difficulty").value;

  if (name === "") {
    alert("Enter question name");
    return;
  }

  let q = {
    name: name,
    difficulty: difficulty,
    date: new Date().toLocaleDateString()
  };

  questions.push(q);
  localStorage.setItem("questions", JSON.stringify(questions));

  document.getElementById("question").value = "";

  display();
}

// Delete Question
function deleteQuestion(index) {
  questions.splice(index, 1);
  localStorage.setItem("questions", JSON.stringify(questions));
  display();
}

// Filter Questions
function filterQuestions() {
  let filter = document.getElementById("filter").value;

  if (filter === "All") {
    display(questions);
  } else {
    let filtered = questions.filter(q => q.difficulty === filter);
    display(filtered);
  }
}

// Display
function display(data = questions) {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let easy = 0, medium = 0, hard = 0;

  data.forEach((q, index) => {
    let li = document.createElement("li");

    let text = document.createElement("span");
    text.innerText = q.name + " - " + q.difficulty;

    let btn = document.createElement("button");
    btn.innerText = "❌";

    btn.onclick = function () {
      deleteQuestion(index);
    };

    li.appendChild(text);
    li.appendChild(btn);

    list.appendChild(li);

    if (q.difficulty === "Easy") easy++;
    else if (q.difficulty === "Medium") medium++;
    else hard++;
  });

  document.getElementById("total").innerText = "Total: " + data.length;
  document.getElementById("easy").innerText = "Easy: " + easy;
  document.getElementById("medium").innerText = "Medium: " + medium;
  document.getElementById("hard").innerText = "Hard: " + hard;

  calculateStreak();
  showChart();
}

// Streak Logic
function calculateStreak() {
  if (questions.length === 0) {
    document.getElementById("streak").innerText = "Streak: 0";
    return;
  }

  let dates = questions.map(q => q.date);
  dates = [...new Set(dates)].sort();

  let streak = 1;

  for (let i = dates.length - 1; i > 0; i--) {
    let d1 = new Date(dates[i]);
    let d2 = new Date(dates[i - 1]);

    let diff = (d1 - d2) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }

  document.getElementById("streak").innerText = "Streak: " + streak;
}

// Graph (Chart.js)
function showChart() {
  let easy = 0, medium = 0, hard = 0;

  questions.forEach(q => {
    if (q.difficulty === "Easy") easy++;
    else if (q.difficulty === "Medium") medium++;
    else hard++;
  });

  // Reset canvas (important to avoid duplicate charts)
  document.getElementById("chart").remove();
  let canvas = document.createElement("canvas");
  canvas.id = "chart";
  document.body.appendChild(canvas);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Easy", "Medium", "Hard"],
      datasets: [{
        label: "Questions Solved",
        data: [easy, medium, hard]
      }]
    }
  });
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Load on start
display();

