const API_URL =
"https://script.google.com/macros/s/AKfycbw7VC81TVJe6pW90ydBku8ecifIPBk3FGo3yhtnpRwFV_SKpNBk4b2bs9X101sw3NUa/exec";

let rawData = [];
let typeChart;
let teacherChart;

// ===============================
// FETCH DATA
// ===============================
fetch(API_URL)
.then(res => res.json())
.then(data => {

console.log("RAW API:", data);

// safe fallback
if (!Array.isArray(data)) {
data = data.data || [];
}

rawData = data.map(item => ({

date: item["วันที่บันทึก"] || item["ประทับเวลา"] || "",
teacher: item["อาจารย์"] || "",
type: item["Waste type"] || "",
amount: Number(item["Amount"] || 0),
liter: Number(item["Container"] || 0)

}));

renderDashboard(rawData);

})
.catch(err => {
console.error("API ERROR:", err);
document.body.innerHTML =
"<h2 style='color:red'>โหลดข้อมูลไม่สำเร็จ</h2>";
});


// ===============================
// DASHBOARD
// ===============================
function renderDashboard(data){

if (!data || data.length === 0) {
document.getElementById("tableData").innerHTML =
"<tr><td colspan='5'>ไม่มีข้อมูล</td></tr>";
return;
}

let totalContainer = 0;
let totalLiter = 0;

// KPI CALC
data.forEach(item => {
totalContainer += item.amount;
totalLiter += item.amount * item.liter;
});

// KPI DISPLAY
document.getElementById("totalContainer").innerText =
totalContainer + " ถัง";

document.getElementById("totalLiter").innerText =
totalLiter + " L";

document.getElementById("totalRecord").innerText =
data.length;


// ================= TOP 5 TEACHERS =================
let teacherMap = {};

data.forEach(item => {
let name = item.teacher || "ไม่ระบุ";

teacherMap[name] =
(teacherMap[name] || 0) + item.amount;
});

let topTeachers = Object.entries(teacherMap)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);

let topHTML = "<h3>🏆 Top 5 อาจารย์</h3><ol>";

topTeachers.forEach(t => {
topHTML += `<li>${t[0]} - ${t[1]} ถัง</li>`;
});

topHTML += "</ol>";

document.getElementById("topBox").innerHTML = topHTML;


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
buildCharts(data);

}


// ===============================
// CHARTS
// ===============================
function buildCharts(data){

let typeMap = {};
let teacherMap = {};

data.forEach(item => {

if(item.type){
typeMap[item.type] =
(typeMap[item.type] || 0) + item.amount;
}

if(item.teacher){
teacherMap[item.teacher] =
(teacherMap[item.teacher] || 0) + item.amount;
}

});

let typeSorted = Object.entries(typeMap)
.sort((a,b)=>b[1]-a[1]);

let teacherSorted = Object.entries(teacherMap)
.sort((a,b)=>b[1]-a[1]);

if(typeChart) typeChart.destroy();
if(teacherChart) teacherChart.destroy();

typeChart = new Chart(document.getElementById("typeChart"), {
type: "pie",
data: {
labels: typeSorted.map(i=>i[0]),
datasets: [{
data: typeSorted.map(i=>i[1])
}]
}
});

teacherChart = new Chart(document.getElementById("teacherChart"), {
type: "bar",
data: {
labels: teacherSorted.map(i=>i[0]),
datasets: [{
label: "Waste (ถัง)",
data: teacherSorted.map(i=>i[1])
}]
}
});

}


// ===============================
// FILTER SYSTEM
// ===============================
function filterData(days){

if(days === "all"){
renderDashboard(rawData);
return;
}

let now = new Date();

let filtered = rawData.filter(item => {

if(!item.date) return false;

let d = new Date(item.date);

if(isNaN(d)) return false;

let diff = (now - d) / (1000 * 60 * 60 * 24);

return diff <= days;

});

renderDashboard(filtered);

}
