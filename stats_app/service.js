const https = require('https');
const url = require('url');
const fs = require('fs');
const Stat = require('./database_models/stat.js')


function addStat(data){
  var query =  Stat.findOneAndUpdate(
    {"year":data.year, "state":data.state, "bmi":data.bmi, "gender":data.gender},
  data, {
  new: true,
  upsert: true // Make this update into an upsert
});
  query.exec(function(err,resQuery){
  if(err){
    console.log(err);
  }
    });
}



function updateStats(res){

  callback2 = function(response) {
      var str = '';
      response.on('data', function (chunk) {
          str += chunk.toString()

      });

      response.on('end', function () {


        var x = str.split("\n");
        x.forEach(element => {
          var a = element.replace(new RegExp('"', 'g'), '').split(',');
          var genders = ["Male", "Female"];
          if (genders.includes(a[17])){
            addStat({"year": parseInt(a[1]), "state":a[2], "bmi":a[7], "gender":a[17], "sample_size": parseInt(a[16])})
          }

        });
       });
    }

    callback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
          str = chunk.toString().split('"')[1]
      });

      response.on('end', function () {
        console.log(str);
        https.request({host: 'nccd.cdc.gov', path:str}, callback2).end();
      });
    }
  var cat = ["RESP042","RESP041","RESP040", "RESP039"];
  var years = ["2011","2012","2013","2014","2015","2016","2017","2018"];
  for(i = 0; i< cat.length; i++){
    for(j=0;j < years.length; j++){
      var options = {
          host: 'nccd.cdc.gov',
          path: `/BRFSSPrevalence/rdPage.aspx?rdReport=DPH_BRFSS.ExportData&DataType=StatesAndMMSA&ClassCode=CLASS14&TopicCode=TOPIC09&StratTypeCode=CAT2&StratCode=&LocationCode=&IndicatorCode=_BMI5CAT&ResponseCode=${cat[i]}&QueryType=Chart&YearStart=${years[j]}&YearEnd=&DataValueType=Crude&ShowMMSA=&rdReportFormat=CSV&rdExportTableID=dtExport&rdExportFilename=ExportCSV`
      };
        https.request(options, callback).end();

    }
  }
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write("gud");
  res.end();
}


function csvStats(req, res){
  var validUrl = new URL('https://example.org/'+req.url);
  var years = []
  for (i = parseInt(validUrl.searchParams.get('yearStart')); i <= parseInt(validUrl.searchParams.get('yearEnd')); i++){
      years.push(i);
  }
  var data = {
   "state": validUrl.searchParams.get('state').substring(validUrl.searchParams.get('state').length - 2),
   "year":  {$in: years}
  }
  if (validUrl.searchParams.get('male') != validUrl.searchParams.get('female')){
    if(validUrl.searchParams.get('male') == 'true')
        data.gender = 'Female';
    if(validUrl.searchParams.get('female') == 'true')
        data.gender = 'Male';
  }
  var query =  Stat.find(data);
  query.exec(function(err,resQuery){

  if(err){
    console.log(err);
  }
  var bmi = {"Overweight (BMI 25.0-29.9)": 0,
              "Obese (BMI 30.0 - 99.8)": 0,
              "Normal Weight (BMI 18.5-24.9)": 0,
              "Underweight (BMI 12.0-18.4)": 0
            };
  var csv = '';
  for (i=0; i<resQuery.length;i++){
      bmi[resQuery[i].bmi] += resQuery[i].sample_size;
  }
  csv = `Overweight (BMI 25.0-29.9), Obese (BMI 30.0 - 99.8), Normal Weight (BMI 18.5-24.9), Underweight (BMI 12.0-18.4),\n${bmi["Overweight (BMI 25.0-29.9)"]}, ${bmi["Obese (BMI 30.0 - 99.8)"]}, ${bmi["Normal Weight (BMI 18.5-24.9)"]}, ${bmi["Underweight (BMI 12.0-18.4)"]}`;
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write(csv);
  res.end();
  });

}


function error(res, errorCode){
    res.writeHead(errorCode, {'Content-Type':'text/html'});
    res.write('');
    res.end();
  }

exports.updateStats = updateStats;
exports.error = error;
exports.csvStats = csvStats;
