
$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/Organizer/GetSumOfPassengerNumber");
    xhr.onloadend = function () {
        if (xhr.status === 200) {
            // Parse the JSON response
            var responseData = JSON.parse(xhr.responseText);

            // Extract data for ApexCharts
            var dates = responseData.map(item => item.date);
            var passengerNumbers = responseData.map(item => item.totalPassenger);

            // Create ApexCharts
            new ApexCharts(document.querySelector("#reportsChart"), {
                series: [{
                    name: 'Passenger Number',
                    data: passengerNumbers,
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: {
                        show: false
                    },
                },
                markers: {
                    size: 4
                },
                colors: ['#4154f1'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.3,
                        opacityTo: 0.4,
                        stops: [0, 90, 100]
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 2
                },
                xaxis: {
                    type: 'datetime',
                    categories: dates,
                },
                tooltip: {
                    x: {
                        format: 'yyyy-MM-dd'
                    },
                }
            }).render();
        }
    }
    xhr.send();
});

$(document).ready(function() {
    var xhr = new XMLHttpRequest() ; 
    xhr.open("GET" , "http://localhost:8080/Organizer/GetTheTopJourney") ; 
    xhr.onloadend = function(){
        if(xhr.status === 200){
            document.getElementById("topJourney").innerHTML = JSON.parse(xhr.responseText).totalPassenger;
            document.getElementById("nameJourney").innerHTML = JSON.parse(xhr.responseText).journeyName;
        }
    }
    xhr.send() ; 
});