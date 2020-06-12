var chart = [
  "Pie", "Line", "Column"
]
var states = [
"Alabama - AL",
"Alaska - AK",
"Arizona - AZ",
"Arkansas - AR",
"California - CA",
"Colorado - CO",
"Connecticut - CT",
"Delaware - DE",
"Florida - FL",
"Georgia - GA",
"Hawaii - HI",
"Idaho - ID",
"Illinois - IL",
"Indiana - IN",
"Iowa - IA",
"Kansas - KS",
"Kentucky - KY",
"Louisiana - LA",
"Maine - ME",
"Maryland - MD",
"Massachusetts - MA",
"Michigan - MI",
"Minnesota - MN",
"Mississippi - MS",
"Missouri - MO",
"Montana - MT",
"Nebraska - NE",
"Nevada - NV",
"New Hampshire - NH",
"New Jersey - NJ",
"New Mexico - NM",
"New York - NY",
"North Carolina - NC",
"North Dakota - ND",
"Ohio - OH",
"Oklahoma - OK",
"Oregon - OR",
"Pennsylvania - PA",
"Rhode Island - RI",
"South Carolina - SC",
"South Dakota - SD",
"Tennessee - TN",
"Texas - TX",
"Utah - UT",
"Vermont - VT",
"Virginia - VA",
"Washington - WA",
"West Virginia - WV",
"Wisconsin - WI",
"Wyoming - WY",
"American Samoa - AS",
"District of Columbia - DC",
"Federated States of Micronesia - FM",
"Guam - GU",
"Marshall Islands - MH",
"Northern Mariana Islands - MP",
"Palau - PW",
"Puerto Rico - PR",
"Virgin Islands - VI"]




function calculate(){
  xhr = new XMLHttpRequest();
  var yearStartDisplay = document.getElementById("yearStart");
  var yearEndDisplay = document.getElementById("yearEnd");
  var statesList = document.getElementById("statesList");
  var male = document.getElementById("male");
  var female = document.getElementById("female");
  var chartType = document.getElementById("chartList");
  var statsDisplay = document.getElementById("statsDisplay");
  xhr.open('POST', 'stats/?token=' + localStorage.getItem('token') + '&yearStart=' + yearStartDisplay.value
  + '&yearEnd=' + yearEndDisplay.value + '&state=' + states[statesList.value] + '&male=' + String(male.classList.contains('active'))
  + '&female=' + String(female.classList.contains('active')) + '&chart=' + chart[chartList.value]  );
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
      console.log(xhr.status);
      if (xhr.status === 200){
        if(chart[chartList.value] == 'Pie'){
          statsDisplay.innerHTML = '<div id="piechart" style="width: 900px; height: 500px;"></div>';
          google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(drawChart);
          var csv = xhr.responseText;
          var tab = csv.split('\n');
          var title = tab[0].split(',');
          var nr = tab[1].split(',');
          var d = [['type','number']]
          for(i=0;i <title.length-1;i++){
            d.push([title[i], parseInt(nr[i])]);
          }
          function drawChart() {
          var data = google.visualization.arrayToDataTable(d);
          var chart = new google.visualization.PieChart(document.getElementById('piechart'));

          chart.draw(data, {});
        }
        }
        if(chart[chartList.value] == 'Line'){
          statsDisplay.innerHTML = '<div id="curve_chart" style="width: 900px; height: 500px"></div>';
          google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(drawChart);
          var csv = xhr.responseText;
          var tab = csv.split('\n');
          var title = tab[0].split(',');
          var nr = tab[1].split(',');
          var d = [['type','number']]
          for(i=0;i <title.length-1;i++){
            d.push([title[i], parseInt(nr[i])]);
          }
          function drawChart() {
          var data = google.visualization.arrayToDataTable(d);
          var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
          chart.draw(data, {});
        }
        }
        if(chart[chartList.value] == 'Column'){
          statsDisplay.innerHTML = '<div id="columnchart_values" style="width: 900px; height: 300px;"></div>';
          google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(drawChart);
          var csv = xhr.responseText;
          var tab = csv.split('\n');
          var title = tab[0].split(',');
          var nr = tab[1].split(',');
          var d = [['type','number']]
          for(i=0;i <title.length-1;i++){
            d.push([title[i], parseInt(nr[i])]);
          }
          function drawChart() {
          var data = google.visualization.arrayToDataTable(d);
          var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));


          chart.draw(data, {});
        }
        }
      }
  }
  xhr.send(encodeURI(''));
}

window.onload = function(){
    if(localStorage.getItem('token') == null){
        window.location='/login'
    }else{
      xhr = new XMLHttpRequest();
      xhr.open('POST', window.location.pathname + '/?token=' + localStorage.getItem('token'));
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function() {
          console.log(xhr.status);
          if (xhr.status === 200){

            document.getElementById("secret").innerHTML = xhr.responseText;
            run()
          }
          if (xhr.status !== 200) {

              window.location = '/home'
          }
      }
      xhr.send(encodeURI(''));
  }
}

function run(){
  var yearStart = document.getElementById("yearStart");
  var yearStartDisplay = document.getElementById("yearStartDisplay");
  var yearEnd = document.getElementById("yearEnd");
  var yearEndDisplay = document.getElementById("yearEndDisplay");

  yearStart.addEventListener("input", () => {
  yearStartDisplay.innerHTML = `<p>Start year: ${yearStart.value}</p>`;
   if (yearEnd.value < yearStart.value){
     yearEnd.value = yearStart.value;
     yearEndDisplay.innerHTML = `<p>End year: ${yearEnd.value}</p>`;
   }
  });
  yearEnd.addEventListener("input", () => {
  yearEndDisplay.innerHTML = `<p>End year: ${yearEnd.value}</p>`;
   if (yearEnd.value < yearStart.value){
     yearStart.value = yearEnd.value;
     yearStartDisplay.innerHTML = `<p>Start year: ${yearStart.value}</p>`;
   }
  });
var statesList = document.getElementById("statesList");
var statesListDisplay = document.getElementById("statesListDisplay");

  statesList.addEventListener("input", () => {
  statesListDisplay.innerHTML = `<p>${states[statesList.value]}</p>`;
  });

  var chartList = document.getElementById("chartList");
  var chartListDisplay = document.getElementById("chartListDisplay");

    chartList.addEventListener("input", () => {
    chartListDisplay.innerHTML = `<p>${chart[chartList.value]}</p>`;
    });
}

function onOff2(id){
    var btn = document.getElementById(id);
    btn.classList.toggle('active');
  }
