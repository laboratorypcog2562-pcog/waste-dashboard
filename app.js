const API_URL =
"https://script.google.com/macros/s/AKfycbw7VC81TVJe6pW90ydBku8ecifIPBk3FGo3yhtnpRwFV_SKpNBk4b2bs9X101sw3NUa/exec";

let rawData = [];
let filteredData = [];

fetch(API_URL)
.then(res => res.json())
.then(data => {

rawData = data.map(item => {

return {
date: item["วันที่บันทึก"] || item[" วันที่บันทึก  "] || "",
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
// RENDER DASHBOARD
// ===============================
function renderDashboard(data){

let totalContainer = 0;
let totalLiter = 0;

data.forEach(item => {

let amount = Number(item.Amount || 0);
let liter = Number(item.Total_Liter || 0);

totalContainer += amount;
totalLiter += liter;

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
<td>${item["วันที่บันทึก"]}</td>
<td>${item["อาจารย์"]}</td>
<td>${item["Waste type"]}</td>
<td>${item.Amount}</td>
<td>${item.Total_Liter}</td>
</tr>
`;

});

document.getElementById("tableData").innerHTML = html;

// CHARTS
buildCharts(data);

}


// ===============================
// CHARTS
// ===============================
let typeChart;
let teacherChart;

function buildCharts(data){

// ---- Waste Type ----
let typeMap = {};

data.forEach(item => {

let type = item["Waste type"];
let amount = Number(item.Amount || 0);

typeMap[type] = (typeMap[type] || 0) + amount;

});

let typeLabels = Object.keys(typeMap);
let typeValues = Object.values(typeMap);


// ---- Teacher ----
let teacherMap = {};

data.forEach(item => {

let t = item["อาจารย์"];
let amount = Number(item.Amount || 0);

teacherMap[t] = (teacherMap[t] || 0) + amount;

});

let teacherLabels = Object.keys(teacherMap);
let teacherValues = Object.values(teacherMap);


// ---- Destroy old chart (กัน error) ----
if(typeChart) typeChart.destroy();
if(teacherChart) teacherChart.destroy();


// ---- Waste Type Chart ----
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


// ---- Teacher Chart ----
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
// FILTER SYSTEM (1-3-6 เดือน)
// ===============================
function filterData(days){

if(days === "all"){
renderDashboard(rawData);
return;
}

let now = new Date();

let filtered = rawData.filter(item => {

let d = new Date(item["วันที่บันทึก"]);

let diff = (now - d) / (1000 * 60 * 60 * 24);

return diff <= days;

});

renderDashboard(filtered);

}
