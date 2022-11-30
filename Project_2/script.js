// myTable.rows.length ==> ile wierszy
// myTable.rows[0].cells.length ==>ile kolumn

//adding parameters -> rows
const addParameter=()=>{
    const myTable=document.getElementById("DM_table");
    const rowStructure=document.getElementById("row_structure").cloneNode(true);
    myTable.appendChild(rowStructure);
    rowStructure.id = `p_id${myTable.rows.length-2}`;
    }

const addingP=document.getElementById("addP");
addingP.addEventListener("click",()=>addParameter);
    
//adding alternatives -> columns
function addAlternative(){
    let myTable = document.getElementById("DM_table");
    let columns = myTable.rows[1].getElementsByTagName('td').length;
    let pos=columns;
    let rowregex = new RegExp('{ROWINDEX}', 'g');
    let colregex = new RegExp('{COLINDEX}', 'g');

    for (let r=0; r<myTable.rows.length; r++){
      let cell = myTable.rows[r].insertCell(pos);
      if(r==0) 
      {
        p++;
        cell.innerHTML = ('<th id="column_structure"><b>Alternative '+p+'</b><br><input class="alternatives" type="text" /></th>');
      }
      else cell.innerHTML = '<td><input type="number" /><td/>'
        .replace(rowregex, String.fromCharCode(65 + r))
        .replace(colregex, columns + 1); 
    }
  }
    
let p=1;
const addingA=document.getElementById("addA");
addingA.addEventListener("click",()=>addAlternative);

//submition
function submitFunction(event){
    event.preventDefault();
    return false;
}

//CALCULATIONS
//calculation1
function KepnerTregoeMethod(){
  let myTable=document.getElementById('DM_table');
  const answerTable=[];
  
  for(let i=2;i<myTable.rows[0].cells.length;++i){
    let sum=0;
    for(let j=1;j<myTable.rows.length;++j)
    {
      let indicator=myTable.rows[j].cells[1].getElementsByTagName("input")[0].value;
      let current=myTable.rows[j].cells[i].getElementsByTagName("input")[0].value;
      sum=sum+indicator*current;
    }
    answerTable.push(sum);
  }

  let max=Math.max(...answerTable);

  let results=myTable.insertRow(-1);
  results.insertCell();
  results.insertCell();
  for(let i=0;i<answerTable.length;++i){
    var answer=results.insertCell();
    answer.append(answerTable[i]);
    answer.style='font-weight:bolder';
    if(answerTable[i]==max){
      answer.style.backgroundColor='rgba(0, 0, 0, 0.1)';
    }
  }

  document.getElementById('results').style.display='block';

//chart1
  let alternativeNames=[];
  for(let i=2;i<myTable.rows[0].cells.length;++i){
    alternativeNames.push(myTable.rows[0].cells[i].getElementsByTagName("input")[0].value);
  }

	const ctx = document.getElementById('myChart1');
	  
	new Chart(ctx, {
    type: 'bar',
	  data: {
  		labels: alternativeNames,
			datasets: [{
        data: answerTable,
			}]
		},
	  options: {
      elements:{
        bar:{
          backgroundColor: 'orange',
        }
      },
      plugins: {
        legend:{
          display: false
        },
        title: {
            display: true,
            text: 'Alternative comparison',
            font:{
              size: 20,
            }

        }
    },
			scales: {
			  y: {
				beginAtZero: true
			  }
			}
		}
	});

chart2();
 //chart2

}

function chart2(){
  let myTable=document.getElementById('DM_table');
  let parameterWeight=[];
  for(let i=1;i<myTable.rows.length-1;++i){
    let result=0;
    let sum=0;
    let indicator=myTable.rows[i].cells[1].getElementsByTagName("input")[0].value;
    for(let j=2;j<myTable.rows[0].cells.length;++j)
    {
      let current=myTable.rows[i].cells[j].getElementsByTagName("input")[0].value;
      sum=sum+current;
    }
    result=sum*indicator;
    parameterWeight.push(result);
  }

  let parameterNames=[];
  for(let i=1;i<myTable.rows.length-1;++i){
    parameterNames.push(myTable.rows[i].cells[0].getElementsByTagName("input")[0].value);
  }

  const ctx = document.getElementById('myChart2');
	  
	new Chart(ctx, {
    type: 'pie',
	  data: {
  		labels: parameterNames,
			datasets: [{
        data: parameterWeight,
			}]
		},
	  options: {
      plugins: {
        title: {
            display: true,
            text: 'Parameter weight',
            font:{
              size: 20,
            }

        }
      },
		}
	});
}