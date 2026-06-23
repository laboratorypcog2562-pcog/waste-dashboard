const API_URL =
"https://script.google.com/macros/s/AKfycbw7VC81TVJe6pW90ydBku8ecifIPBk3FGo3yhtnpRwFV_SKpNBk4b2bs9X101sw3NUa/exec";

let rawData = [];
let filteredData = [];

fetch(API_URL)
.then(res => res.json())
.then(data => {

// ✅ CLEAN + NORMALIZE DATA
rawData = data.map(item => {

return {
date: item["วันที่บันทึก"] || item["วันที่บันทึก"] || "",
teacher: item["อาจารย์"] || "",
type: item["Waste type"] || "",
amount: Number(item["Amount"] || 0),
liter: Number(item["Total_Liter"] || item["Container"] || 0)
};

});

filteredData = rawData;

renderDashboard(rawData);

});


// ===============================
// DASHBOARD
// ===============================
function renderDashboard(data){

let totalContainer = 0;
let totalLiter = 0;

data.forEach(item => {

totalContainer += item.amount;

// 🔥 สำคัญ: คิดเป็นลิตรจริง
totalLiter += (item.amount * item.liter);

});
// KPI
document.getElementById("totalContainer").innerText =
totalContainer + " ถัง";

document.getElementById("totalLiter").innerText =
totalLiter + " L";

document.getElementById("totalRecord").innerText =
data.length;


// TABLE
let html = "";

data.forEach(item => {

html += `
<tr>
<td>${item.date}</td>
<td>${item.teacher}</td>
<td>${item.type}</td>
<td>${item.amount}</td>
<td>${item.liter}</td>
</tr>
`;

});

document.getElementById("tableData").innerHTML = html;


// CHARTS
function buildCharts(data){

let typeMap = {};
let teacherMap = {};

data.forEach(item => {

if(item.type){
typeMap[item.type] = (typeMap[item.type] || 0) + item.amount;
}

if(item.teacher){
teacherMap[item.teacher] = (teacherMap[item.teacher] || 0) + item.amount;
}

});

let typeLabels = Object.keys(typeMap);
let typeValues = Object.values(typeMap);

let teacherLabels = Object.keys(teacherMap);
let teacherValues = Object.values(teacherMap);

// destroy old chart
if(typeChart) typeChart.destroy();
if(teacherChart) teacherChart.destroy();

// Waste Type
typeChart = new Chart(document.getElementById("typeChart"), {
type: "bar",
data: {
labels: typeLabels,
datasets: [{
label: "Waste (ถัง)",
data: typeValues
}]
}
});

// Teacher
teacherChart = new Chart(document.getElementById("teacherChart"), {
type: "bar",
data: {
labels: teacherLabels,
datasets: [{
label: "Waste (ถัง)",
data: teacherValues
}]
}
});

}

// ===============================
// FILTER (1-3-6 เดือน)
// ===============================
function filterData(days){

if(days === "all"){
renderDashboard(rawData);
return;
}

let now = new Date();

let filtered = rawData.filter(item => {

let d = new Date(item.date);

if(!d.getTime()) return false;

let diff = (now - d) / (1000 * 60 * 60 * 24);

return diff <= days;

});

renderDashboard(filtered);

}
