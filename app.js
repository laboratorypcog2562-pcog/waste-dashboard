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

}
