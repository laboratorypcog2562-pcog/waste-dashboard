const API_URL =
"ใส่ URL Google Apps Script ของคุณตรงนี้";

let rawData = [];

fetch(API_URL)
.then(res => res.json())
.then(data => {

rawData = data;

renderDashboard(data);

});


function renderDashboard(data){

let totalContainer = 0;
let totalLiter = 0;

// รวมค่า
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


// ทำกราฟ
buildCharts(data);
  function buildCharts(data){

// ===== Waste Type =====
let typeMap = {};

data.forEach(item => {

let type = item["Waste type"];
let amount = Number(item.Amount || 0);

typeMap[type] = (typeMap[type] || 0) + amount;

});

let typeLabels = Object.keys(typeMap);
let typeValues = Object.values(typeMap);


// ===== Teacher =====
let teacherMap = {};

data.forEach(item => {

let t = item["อาจารย์"];
let amount = Number(item.Amount || 0);

teacherMap[t] = (teacherMap[t] || 0) + amount;

});

let teacherLabels = Object.keys(teacherMap);
let teacherValues = Object.values(teacherMap);


// ===== Charts =====

// Waste Type Chart
new Chart(document.getElementById("typeChart"), {
type: "bar",
data: {
labels: typeLabels,
datasets: [{
label: "Waste (ถัง)",
data: typeValues
}]
}
});


// Teacher Chart
new Chart(document.getElementById("teacherChart"), {
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

}
