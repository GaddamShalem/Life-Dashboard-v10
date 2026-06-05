// =====================================
// LIFE DASHBOARD V10
// PART 1
// AUTH + INIT + SIDEBAR + CLOCK
// =====================================

// ---------------------------
// HELPERS
// ---------------------------

const $ = (id) => document.getElementById(id);

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback) {
    const data = localStorage.getItem(key);

    if (!data) return fallback;

    try {
        return JSON.parse(data);
    } catch {
        return fallback;
    }
}

// ---------------------------
// REGISTER PAGE
// ---------------------------

const registerForm = $("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            $("registerEmail").value.trim();

        const password =
            $("registerPassword").value.trim();

        if (!email || !password) return;

        const user = {
            email,
            password
        };

        save("v10_user", user);

        alert("Registration Successful");

        window.location.href =
            "index.html";

    });

}

// ---------------------------
// LOGIN PAGE
// ---------------------------

const loginForm = $("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            $("loginEmail").value.trim();

        const password =
            $("loginPassword").value.trim();

        const user =
            load("v10_user", null);

        if (!user) {

            alert(
                "Please register first."
            );

            return;
        }

        if (
            email === user.email &&
            password === user.password
        ) {

            localStorage.setItem(
                "v10_logged_in",
                "true"
            );

            window.location.href =
                "dashboard.html";

        } else {

            alert(
                "Invalid Email or Password"
            );

        }

    });

}

// ---------------------------
// DASHBOARD PROTECTION
// ---------------------------

const isDashboard =
    window.location.pathname
    .includes("dashboard.html");

if (isDashboard) {

    const loggedIn =
        localStorage.getItem(
            "v10_logged_in"
        );

    if (loggedIn !== "true") {

        window.location.href =
            "index.html";

    }

}

// ---------------------------
// LOGOUT
// ---------------------------

const logoutBtn =
    $("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "v10_logged_in"
            );

            window.location.href =
                "index.html";

        }
    );

}

// ---------------------------
// MOBILE SIDEBAR
// ---------------------------

const menuToggle =
    $("menuToggle");

const sidebar =
    $("sidebar");

if (
    menuToggle &&
    sidebar
) {

    menuToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}

// ---------------------------
// SECTION NAVIGATION
// ---------------------------

const menuButtons =
    document.querySelectorAll(
        ".menu-btn"
    );

const sections =
    document.querySelectorAll(
        ".content-section"
    );

menuButtons.forEach((btn) => {

    btn.addEventListener(
        "click",
        () => {

            menuButtons.forEach((b) =>
                b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            const target =
                btn.dataset.section;

            sections.forEach(
                (section) => {

                    section.classList.remove(
                        "active-section"
                    );

                }
            );

            const targetSection =
                document.getElementById(
                    target + "Section"
                );

            if (targetSection) {

                targetSection.classList.add(
                    "active-section"
                );

            }

        }
    );

});

// ---------------------------
// LIVE CLOCK
// ---------------------------

function updateClock() {

    const clock =
        $("liveClock");

    if (!clock) return;

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    clock.textContent =
        time;

}

setInterval(
    updateClock,
    1000
);

updateClock();

// ---------------------------
// PROFILE NAME
// ---------------------------

function loadProfilePreview() {

    const profileName =
        $("profileName");

    if (!profileName)
        return;

    const profile =
        load(
            "v10_profile",
            {}
        );

    const nick =
        profile.nickName;

    const first =
        profile.firstName;

    profileName.textContent =
        nick ||
        first ||
        "User";

}

loadProfilePreview();

// =====================================
// END OF PART 1
// =====================================
// =====================================
// PART 2
// CALENDAR + WEEK + WATER
// =====================================

// ---------------------------
// DATE STATE
// ---------------------------

let selectedDate =
    new Date();

const calendarInput =
    $("calendarDate");

function formatDateInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ---------------------------
// WEEK RENDER
// ---------------------------

function renderWeek() {

    const weekStrip =
        $("weekStrip");

    if (!weekStrip)
        return;

    weekStrip.innerHTML = "";

    const current =
        new Date(selectedDate);

    const dayIndex =
        current.getDay();

    const start =
        new Date(current);

    start.setDate(
        current.getDate() - dayIndex
    );

    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const dayDate =
            new Date(start);

        dayDate.setDate(
            start.getDate() + i
        );

        const btn =
            document.createElement(
                "div"
            );

        btn.className =
            "week-day";

        if (
            dayDate.toDateString() ===
            selectedDate.toDateString()
        ) {

            btn.classList.add(
                "active"
            );

        }

        btn.innerHTML = `
            <div>${days[i]}</div>
            <div>${dayDate.getDate()}</div>
        `;

        btn.addEventListener(
            "click",
            () => {

                selectedDate =
                    new Date(dayDate);

                if (calendarInput) {

                    calendarInput.value =
                        formatDateInput(
                            selectedDate
                        );

                }

                renderWeek();

                loadDateBasedData();

            }
        );

        weekStrip.appendChild(
            btn
        );

    }

}

// ---------------------------
// CALENDAR SYNC
// ---------------------------

if (calendarInput) {

    calendarInput.value =
        formatDateInput(
            selectedDate
        );

    calendarInput.addEventListener(
        "change",
        () => {

            selectedDate =
                new Date(
                    calendarInput.value
                );

            renderWeek();

            loadDateBasedData();

        }
    );

}

// ---------------------------
// DAY NAVIGATION
// ---------------------------

const prevDayBtn =
    $("prevDayBtn");

const nextDayBtn =
    $("nextDayBtn");

if (prevDayBtn) {

    prevDayBtn.addEventListener(
        "click",
        () => {

            selectedDate.setDate(
                selectedDate.getDate() - 1
            );

            if (calendarInput) {

                calendarInput.value =
                    formatDateInput(
                        selectedDate
                    );

            }

            renderWeek();

            loadDateBasedData();

        }
    );

}

if (nextDayBtn) {

    nextDayBtn.addEventListener(
        "click",
        () => {

            selectedDate.setDate(
                selectedDate.getDate() + 1
            );

            if (calendarInput) {

                calendarInput.value =
                    formatDateInput(
                        selectedDate
                    );

            }

            renderWeek();

            loadDateBasedData();

        }
    );

}

// ---------------------------
// WATER TRACKER
// ---------------------------

let waterLevel =
    load(
        "v10_water_level",
        0
    );

const waterFill =
    $("waterFill");

function updateWaterUI() {

    if (!waterFill)
        return;

    const percent =
        (waterLevel / 5) * 100;

    waterFill.style.height =
        percent + "%";

}

const waterTracker =
    $("waterTracker");

if (waterTracker) {

    waterTracker.addEventListener(
        "click",
        () => {

            waterLevel++;

            if (
                waterLevel > 5
            ) {

                waterLevel = 0;

            }

            save(
                "v10_water_level",
                waterLevel
            );

            updateWaterUI();

        }
    );

}

updateWaterUI();

// ---------------------------
// DATE BASED LOADER
// ---------------------------

function loadDateBasedData() {

    if (
        typeof loadTasks ===
        "function"
    ) {

        loadTasks();

    }

    if (
        typeof loadNotes ===
        "function"
    ) {

        loadNotes();

    }

    if (
        typeof loadHighlights ===
        "function"
    ) {

        loadHighlights();

    }

    if (
        typeof loadExpenses ===
        "function"
    ) {

        loadExpenses();

    }

    if (
        typeof loadFoodDiet ===
        "function"
    ) {

        loadFoodDiet();

    }

}

// ---------------------------
// INITIALIZE
// ---------------------------

renderWeek();

// =====================================
// END OF PART 2
// =====================================
// =====================================
// PART 3
// TASKS + NOTES + HIGHLIGHTS
// =====================================

// ---------------------------
// DATE KEY
// ---------------------------

function getDateKey() {

return formatDateInput(
    selectedDate
);

}

// ---------------------------
// DEFAULT TASKS
// ---------------------------

const DEFAULT_TASKS = [
"Morning Routine",
"Workout",
"Reading",
"Coding",
"Review Day"
];

// ---------------------------
// TASK STORAGE
// ---------------------------

function getTasks() {

const key =
    "tasks_" + getDateKey();

let tasks =
    load(key, null);

if (!tasks) {

    tasks =
        DEFAULT_TASKS.map(
            (task) => ({
                id:
                    Date.now() +
                    Math.random(),
                name: task,
                time: "",
                completed: false
            })
        );

    save(key, tasks);

}

return tasks;

}

function saveTasks(tasks) {

save(
    "tasks_" +
    getDateKey(),
    tasks
);

}

// ---------------------------
// TASK RENDER
// ---------------------------

function loadTasks() {

const taskList =
    $("taskList");

if (!taskList)
    return;

taskList.innerHTML = "";

const tasks =
    getTasks();

tasks.forEach((task) => {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "task-card";

    const statusClass =
        task.completed
            ? "task-done"
            : "task-pending";

    const symbol =
        task.completed
            ? "✓"
            : "✕";

    card.innerHTML = `
    <div class="task-left">

        <div
            class="task-status ${statusClass}"
            data-id="${task.id}">

            ${symbol}

        </div>

        <div>

            <div
                class="task-name"
                data-name-id="${task.id}">

                ${task.name}

            </div>

            <div class="task-time">

                ${task.time || ""}

            </div>

        </div>

    </div>

    <button
        class="delete-task"
        data-delete-id="${task.id}">

        🗑

    </button>
    `;

    taskList.appendChild(
        card
    );

});

attachTaskEvents();

}

// ---------------------------
// TASK EVENTS
// ---------------------------

function attachTaskEvents() {

document
    .querySelectorAll(
        ".task-status"
    )
    .forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                toggleTask(
                    item.dataset.id
                );

            }
        );

    });

document
    .querySelectorAll(
        ".task-name"
    )
    .forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                toggleTask(
                    item.dataset
                        .nameId
                );

            }
        );

    });

document
    .querySelectorAll(
        ".delete-task"
    )
    .forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                deleteTask(
                    item.dataset
                        .deleteId
                );

            }
        );

    });

}

// ---------------------------
// TOGGLE TASK
// ---------------------------

function toggleTask(id) {

const tasks =
    getTasks();

const task =
    tasks.find(
        (t) =>
            String(t.id) ===
            String(id)
    );

if (!task)
    return;

task.completed =
    !task.completed;

saveTasks(tasks);

loadTasks();

}

// ---------------------------
// DELETE TASK
// ---------------------------

function deleteTask(id) {

let tasks =
    getTasks();

tasks =
    tasks.filter(
        (task) =>
            String(task.id) !==
            String(id)
    );

saveTasks(tasks);

loadTasks();

}

// ---------------------------
// TASK MODAL
// ---------------------------

const addTaskBtn =
$("addTaskBtn");

const taskModal =
$("taskModal");

const saveTaskModal =
$("saveTaskModal");

if (
addTaskBtn &&
taskModal
) {

addTaskBtn.addEventListener(
    "click",
    () => {

        taskModal.classList.add(
            "show"
        );

    }
);

}

if (
saveTaskModal
) {

saveTaskModal.addEventListener(
    "click",
    () => {

        const name =
            $("taskNameInput")
            ?.value
            .trim();

        const time =
            $("taskTimeInput")
            ?.value;

        if (!name)
            return;

        const tasks =
            getTasks();

        tasks.push({
            id:
                Date.now(),
            name,
            time,
            completed:false
        });

        saveTasks(tasks);

        loadTasks();

        $("taskNameInput").value =
            "";

        $("taskTimeInput").value =
            "";

        taskModal.classList.remove(
            "show"
        );

    }
);

}

// ---------------------------
// NOTES
// ---------------------------

const notesBtn =
$("notesBtn");

const notesModal =
$("notesModal");

const saveNotesBtn =
$("saveNotesBtn");

function loadNotes() {

const notes =
    load(
        "notes_" +
        getDateKey(),
        ""
    );

const input =
    $("notesInput");

if (input) {

    input.value =
        notes;

}

}

if (
notesBtn &&
notesModal
) {

notesBtn.addEventListener(
    "click",
    () => {

        loadNotes();

        notesModal.classList.add(
            "show"
        );

    }
);

}

if (
saveNotesBtn
) {

saveNotesBtn.addEventListener(
    "click",
    () => {

        save(
            "notes_" +
            getDateKey(),

            $("notesInput")
                .value
        );

        notesModal.classList.remove(
            "show"
        );

    }
);

}

// ---------------------------
// HIGHLIGHTS
// ---------------------------

const highlightsBtn =
$("highlightsBtn");

const highlightsModal =
$("highlightsModal");

const saveHighlightsBtn =
$("saveHighlightsBtn");

function loadHighlights() {

const text =
    load(
        "highlights_" +
        getDateKey(),
        ""
    );

const input =
    $("highlightsInput");

if (input) {

    input.value =
        text;

}

}

if (
highlightsBtn &&
highlightsModal
) {

highlightsBtn.addEventListener(
    "click",
    () => {

        loadHighlights();

        highlightsModal.classList.add(
            "show"
        );

    }
);

}

if (
saveHighlightsBtn
) {

saveHighlightsBtn.addEventListener(
    "click",
    () => {

        save(
            "highlights_" +
            getDateKey(),

            $("highlightsInput")
                .value
        );

        highlightsModal.classList.remove(
            "show"
        );

    }
);

}

// ---------------------------
// CLOSE MODAL ON OUTSIDE CLICK
// ---------------------------

document
.querySelectorAll(
".modal"
)
.forEach((modal) => {

    modal.addEventListener(
        "click",
        (e) => {

            if (
                e.target ===
                modal
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );

});

// ---------------------------
// INITIAL LOAD
// ---------------------------

loadTasks();
loadNotes();
loadHighlights();

// =====================================
// END OF PART 3
// =====================================
// =====================================
// PART 4
// READING + CODING + EXPENSES
// GOALS + ANALYTICS
// =====================================

// ---------------------------
// READING SUBJECTS
// ---------------------------

function getReadingSubjects() {
    return load(
        "v10_reading_subjects",
        []
    );
}

function saveReadingSubjects(data) {
    save(
        "v10_reading_subjects",
        data
    );
}

function renderReadingSubjects() {

    const container =
        $("readingSubjects");

    if (!container)
        return;

    container.innerHTML = "";

    const subjects =
        getReadingSubjects();

    subjects.forEach(
        (subject, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "task-card";

            card.innerHTML = `
            <div class="task-name">
                ${subject}
            </div>

            <button
                class="delete-task"
                data-reading="${index}">
                🗑
            </button>
            `;

            container.appendChild(
                card
            );

        }
    );

    document
        .querySelectorAll(
            "[data-reading]"
        )
        .forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {

                    const subjects =
                        getReadingSubjects();

                    subjects.splice(
                        btn.dataset.reading,
                        1
                    );

                    saveReadingSubjects(
                        subjects
                    );

                    renderReadingSubjects();

                }
            );

        });

}

const addReadingSubject =
    $("addReadingSubject");

if (addReadingSubject) {

    addReadingSubject.addEventListener(
        "click",
        () => {

            

            const subjects =
                getReadingSubjects();

            subjects.push(subject);

            saveReadingSubjects(
                subjects
            );

            renderReadingSubjects();

        }
    );

}

// ---------------------------
// CODING SUBJECTS
// ---------------------------

function getCodingSubjects() {
    return load(
        "v10_coding_subjects",
        []
    );
}

function saveCodingSubjects(data) {
    save(
        "v10_coding_subjects",
        data
    );
}

function renderCodingSubjects() {

    const container =
        $("codingSubjects");

    if (!container)
        return;

    container.innerHTML = "";

    const subjects =
        getCodingSubjects();

    subjects.forEach(
        (subject, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "task-card";

            card.innerHTML = `
            <div class="task-name">
                ${subject}
            </div>

            <button
                class="delete-task"
                data-coding="${index}">
                🗑
            </button>
            `;

            container.appendChild(
                card
            );

        }
    );

    document
        .querySelectorAll(
            "[data-coding]"
        )
        .forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {

                    const subjects =
                        getCodingSubjects();

                    subjects.splice(
                        btn.dataset.coding,
                        1
                    );

                    saveCodingSubjects(
                        subjects
                    );

                    renderCodingSubjects();

                }
            );

        });

}

const addCodingSubject =
    $("addCodingSubject");

if (addCodingSubject) {

    addCodingSubject.addEventListener(
        "click",
        () => {

           

            const subjects =
                getCodingSubjects();

            subjects.push(subject);

            saveCodingSubjects(
                subjects
            );

            renderCodingSubjects();

        }
    );

}

// ---------------------------
// EXPENSES
// ---------------------------

function expenseKey() {

    return (
        "expenses_" +
        getDateKey()
    );

}

function getExpenses() {

    return load(
        expenseKey(),
        []
    );

}

function saveExpenses(data) {

    save(
        expenseKey(),
        data
    );

}

function loadExpenses() {

    const container =
        $("expenseContainer");

    if (!container)
        return;

    container.innerHTML = "";

    const expenses =
        getExpenses();

    let total = 0;

    expenses.forEach(
        (expense, index) => {

            total +=
                Number(
                    expense.amount
                );

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "task-card";

            card.innerHTML = `
            <div>

                <div class="task-name">
                    ${expense.title}
                </div>

                <div class="task-time">
                    ₹${expense.amount}
                </div>

            </div>

            <button
                class="delete-task"
                data-expense="${index}">
                🗑
            </button>
            `;

            container.appendChild(
                card
            );

        }
    );

    const totalCard =
        document.createElement(
            "div"
        );

    totalCard.className =
        "task-card";

    totalCard.innerHTML = `
        <strong>
            Total: ₹${total}
        </strong>
    `;

    container.appendChild(
        totalCard
    );

    document
        .querySelectorAll(
            "[data-expense]"
        )
        .forEach((btn) => {

            btn.addEventListener(
                "click",
                () => {

                    const expenses =
                        getExpenses();

                    expenses.splice(
                        btn.dataset.expense,
                        1
                    );

                    saveExpenses(
                        expenses
                    );

                    loadExpenses();

                }
            );

        });

}

// ---------------------------
// EXPENSE MODAL
// ---------------------------

const addExpenseBtn =
    $("addExpenseBtn");

const expenseModal =
    $("expenseModal");

const saveExpenseBtn =
    $("saveExpenseBtn");

if (
    addExpenseBtn &&
    expenseModal
) {

    addExpenseBtn.addEventListener(
        "click",
        () => {

            expenseModal.classList.add(
                "show"
            );

        }
    );

}

if (saveExpenseBtn) {

    saveExpenseBtn.addEventListener(
        "click",
        () => {

            const title =
                $("expenseTitleInput")
                ?.value
                .trim();

            const amount =
                $("expenseAmountInput")
                ?.value;

            if (
                !title ||
                !amount
            ) return;

            const expenses =
                getExpenses();

            expenses.push({
                title,
                amount
            });

            saveExpenses(
                expenses
            );

            loadExpenses();

            $("expenseTitleInput").value =
                "";

            $("expenseAmountInput").value =
                "";

            expenseModal.classList.remove(
                "show"
            );

        }
    );

}

// ---------------------------
// GOALS
// ---------------------------

const goalsContainer =
    $("goalsContainer");

if (goalsContainer) {

    goalsContainer.innerHTML = `
        <div class="task-card">
            Set your personal goals here.
        </div>
    `;

}

// ---------------------------
// ANALYTICS
// ---------------------------

const analyticsSection =
    $("analyticsSection");

function loadAnalytics() {

    if (!analyticsSection)
        return;

    const tasks =
        getTasks();

    const completed =
        tasks.filter(
            t => t.completed
        ).length;

    const expenses =
        getExpenses();

    let totalExpense = 0;

    expenses.forEach(
        e => {

            totalExpense +=
                Number(e.amount);

        }
    );

    analyticsSection.innerHTML = `
        <div class="task-card">
            <strong>
            Tasks Completed:
            ${completed}
            </strong>
        </div>

        <br>

        <div class="task-card">
            <strong>
            Total Expenses:
            ₹${totalExpense}
            </strong>
        </div>
    `;

}

// ---------------------------
// INITIALIZE
// ---------------------------

renderReadingSubjects();
renderCodingSubjects();

loadExpenses();
loadAnalytics();

// =====================================
// END OF PART 4
// =====================================
// =====================================
// PART 5
// FOOD DIET + PROFILE
// READING/CODING MODAL FIX
// =====================================

// ---------------------------
// READING MODAL FIX
// ---------------------------

const readingModal =
$("readingModal");

const saveReadingSubjectBtn =
$("saveReadingSubjectBtn");

if (
addReadingSubject &&
readingModal
) {

addReadingSubject.onclick =
    () => {

        readingModal.classList.add(
            "show"
        );

    };

}

if (
saveReadingSubjectBtn
) {

saveReadingSubjectBtn.onclick =
    () => {

        const subject =
            $("readingSubjectInput")
            ?.value
            .trim();

        if (!subject)
            return;

        const subjects =
            getReadingSubjects();

        subjects.push(subject);

        saveReadingSubjects(
            subjects
        );

        renderReadingSubjects();

        $("readingSubjectInput").value =
            "";

        readingModal.classList.remove(
            "show"
        );

    };

}

// ---------------------------
// CODING MODAL FIX
// ---------------------------

const codingModal =
$("codingModal");

const saveCodingSubjectBtn =
$("saveCodingSubjectBtn");

if (
addCodingSubject &&
codingModal
) {

addCodingSubject.onclick =
    () => {

        codingModal.classList.add(
            "show"
        );

    };

}

if (
saveCodingSubjectBtn
) {

saveCodingSubjectBtn.onclick =
    () => {

        const subject =
            $("codingSubjectInput")
            ?.value
            .trim();

        if (!subject)
            return;

        const subjects =
            getCodingSubjects();

        subjects.push(subject);

        saveCodingSubjects(
            subjects
        );

        renderCodingSubjects();

        $("codingSubjectInput").value =
            "";

        codingModal.classList.remove(
            "show"
        );

    };

}

// ---------------------------
// FOOD DIET
// ---------------------------

const foodDays = [
"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"
];

function getFoodKey() {

const current =
    new Date(selectedDate);

const year =
    current.getFullYear();

const month =
    current.getMonth();

const week =
    Math.floor(
        current.getDate() / 7
    );

return
    `food_${year}_${month}_${week}`;

}

function loadFoodDiet() {

const table =
    $("foodDietTable");

if (!table)
    return;

const data =
    load(
        getFoodKey(),
        {}
    );

let html = `
<table style="
width:100%;
border-collapse:collapse;">
<tr>
<th>Day</th>
<th>Morning</th>
<th>Afternoon</th>
<th>Dinner</th>
</tr>
`;

foodDays.forEach(
    (day) => {

        const row =
            data[day] || {};

        html += `
        <tr>

        <td>${day}</td>

        <td>
        <input
        data-food="${day}"
        data-type="morning"
        value="${
            row.morning || ""
        }">
        </td>

        <td>
        <input
        data-food="${day}"
        data-type="afternoon"
        value="${
            row.afternoon || ""
        }">
        </td>

        <td>
        <input
        data-food="${day}"
        data-type="dinner"
        value="${
            row.dinner || ""
        }">
        </td>

        </tr>
        `;

    }
);

html += "</table>";

table.innerHTML =
    html;

attachFoodEvents();

}

function attachFoodEvents() {

document
    .querySelectorAll(
        "[data-food]"
    )
    .forEach((input) => {

        input.addEventListener(
            "change",
            saveFoodDiet
        );

    });

}

function saveFoodDiet() {

const data = {};

document
    .querySelectorAll(
        "[data-food]"
    )
    .forEach((input) => {

        const day =
            input.dataset.food;

        const type =
            input.dataset.type;

        if (!data[day]) {

            data[day] = {};

        }

        data[day][type] =
            input.value;

    });

save(
    getFoodKey(),
    data
);

}

// ---------------------------
// PROFILE
// ---------------------------

const profileBtn =
$("profileBtn");

const profileModal =
$("profileModal");

if (
profileBtn &&
profileModal
) {

profileBtn.addEventListener(
    "click",
    () => {

        loadProfile();

        profileModal.classList.add(
            "show"
        );

    }
);

}

function loadProfile() {

const profile =
    load(
        "v10_profile",
        {}
    );

if ($("firstName"))
    $("firstName").value =
        profile.firstName || "";

if ($("lastName"))
    $("lastName").value =
        profile.lastName || "";

if ($("nickName"))
    $("nickName").value =
        profile.nickName || "";

if ($("profileEmail"))
    $("profileEmail").value =
        profile.email || "";

}

const saveProfileBtn =
$("saveProfileBtn");

if (
saveProfileBtn
) {

saveProfileBtn.addEventListener(
    "click",
    () => {

        const profile = {

            firstName:
                $("firstName")
                ?.value,

            lastName:
                $("lastName")
                ?.value,

            nickName:
                $("nickName")
                ?.value,

            email:
                $("profileEmail")
                ?.value

        };

        save(
            "v10_profile",
            profile
        );

        const picInput =
            $("profileImageInput");

        if (
            picInput &&
            picInput.files[0]
        ) {

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    localStorage.setItem(
                        "v10_profile_pic",
                        e.target.result
                    );

                    applyProfilePic();

                };

            reader.readAsDataURL(
                picInput.files[0]
            );

        }

        const bgInput =
            $("backgroundImageInput");

        if (
            bgInput &&
            bgInput.files[0]
        ) {

            const reader =
                new FileReader();

            reader.onload =
                function (e) {

                    localStorage.setItem(
                        "v10_bg",
                        e.target.result
                    );

                    applyBackground();

                };

            reader.readAsDataURL(
                bgInput.files[0]
            );

        }

        loadProfilePreview();

        profileModal.classList.remove(
            "show"
        );

    }
);

}

// ---------------------------
// PROFILE PIC
// ---------------------------

function applyProfilePic() {

const pic =
    localStorage.getItem(
        "v10_profile_pic"
    );

if (
    pic &&
    $("profilePic")
) {

    $("profilePic").src =
        pic;

}

}

applyProfilePic();

// ---------------------------
// BACKGROUND IMAGE
// ---------------------------

function applyBackground() {

const bg =
    localStorage.getItem(
        "v10_bg"
    );

if (bg) {

    document.body.style.backgroundImage =
        `url(${bg})`;

}

}

applyBackground();

// ---------------------------
// FINAL LOAD
// ---------------------------

loadFoodDiet();

// =====================================
// END OF PART 5
// =====================================