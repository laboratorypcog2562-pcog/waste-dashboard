const API_URL =
"ใส่ URL Apps Script ของคุณตรงนี้";


fetch(API_URL)


.then(res=>res.json())


.then(data=>{


console.log(data);



let totalLiter = 0;

let totalContainer = 0;



data.forEach(item=>{


let amount =
Number(item.Amount || 0);



let liter =
Number(item.Total_Liter || 0);



totalContainer += amount;


totalLiter += liter;



});



document.getElementById(
"totalLiter"
).innerHTML =
totalLiter+" L";



document.getElementById(
"totalContainer"
).innerHTML =
totalContainer+" ถัง";



document.getElementById(
"totalRecord"
).innerHTML =
data.length;



let html="";


data.forEach(item=>{


html += `

<tr>

<td>
${item["วันที่บันทึก"]}
</td>

<td>
${item["อาจารย์"]}
</td>


<td>
${item["Waste type"]}
</td>


<td>
${item.Amount}
</td>


<td>
${item.Total_Liter} L
</td>


</tr>

`;


});


document.getElementById(
"tableData"
).innerHTML = html;



});
