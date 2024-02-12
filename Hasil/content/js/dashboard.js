/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "Forget Password"], "isController": false}, {"data": [0.2, 500, 1500, "Get Flight Classes"], "isController": false}, {"data": [0.0, 500, 1500, "Pay Order"], "isController": false}, {"data": [0.0, 500, 1500, "Get Order"], "isController": false}, {"data": [0.14, 500, 1500, "Login"], "isController": false}, {"data": [0.27, 500, 1500, "Get Airport"], "isController": false}, {"data": [0.0, 500, 1500, "Get Ticket"], "isController": false}, {"data": [0.07, 500, 1500, "Notification"], "isController": false}, {"data": [0.0, 500, 1500, "Create Order"], "isController": false}, {"data": [0.08, 500, 1500, "Reset Password"], "isController": false}, {"data": [0.11, 500, 1500, "Get User"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Order"], "isController": false}, {"data": [0.0, 500, 1500, "Register"], "isController": false}, {"data": [0.0, 500, 1500, "Order Detail"], "isController": false}, {"data": [0.1, 500, 1500, "Update User"], "isController": false}, {"data": [0.0, 500, 1500, "Update Password"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 0, 0.0, 4014.0725000000043, 451, 9766, 3987.0, 7232.5, 7806.95, 9216.68, 3.2717695365538453, 6.300177250670713, 1.3193714189459995], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Forget Password", 50, 0, 0.0, 2502.08, 1485, 4090, 2325.5, 3672.2999999999997, 4029.2, 4090.0, 0.2483016169401295, 0.14985390553613284, 0.06110547604386], "isController": false}, {"data": ["Get Flight Classes", 50, 0, 0.0, 1653.04, 657, 3502, 1639.5, 2669.8999999999996, 2831.699999999999, 3502.0, 0.2493106560360603, 0.13585483014465005, 0.04455454106894437], "isController": false}, {"data": ["Pay Order", 50, 0, 0.0, 6117.379999999998, 4177, 8118, 6354.0, 7621.3, 7878.099999999999, 8118.0, 0.24322141905104733, 0.12826129520270071, 0.1311115462072052], "isController": false}, {"data": ["Get Order", 50, 0, 0.0, 5798.500000000003, 3829, 7957, 6007.0, 7427.3, 7479.5, 7957.0, 0.2433232110877521, 0.4548433181013003, 0.08958286189461186], "isController": false}, {"data": ["Login", 50, 0, 0.0, 2116.1, 1162, 3592, 2111.5, 3197.1, 3367.75, 3592.0, 0.25195771141771567, 0.17961829036614496, 0.06741837200044344], "isController": false}, {"data": ["Get Airport", 50, 0, 0.0, 1530.4599999999998, 451, 3023, 1597.5, 2689.1, 2946.7999999999993, 3023.0, 0.24856701118054417, 0.18645438733203085, 0.04684905581820803], "isController": false}, {"data": ["Get Ticket", 50, 0, 0.0, 6409.4800000000005, 5455, 8092, 6401.5, 7423.0, 7785.049999999999, 8092.0, 0.2419222171687359, 2.466921483842015, 0.13537249066180243], "isController": false}, {"data": ["Notification", 50, 0, 0.0, 3377.54, 1300, 5256, 3859.5, 4694.8, 4818.45, 5256.0, 0.2490387105771721, 2.2165028925846233, 0.08925508474787322], "isController": false}, {"data": ["Create Order", 50, 0, 0.0, 7951.260000000001, 5887, 9766, 8295.5, 9310.6, 9428.5, 9766.0, 0.24079790794777575, 0.35840793302687785, 0.1862421319283578], "isController": false}, {"data": ["Reset Password", 50, 0, 0.0, 2360.42, 1459, 3983, 2323.5, 3417.2, 3594.85, 3983.0, 0.24843979806813213, 0.18634925791032317, 0.06769014029395397], "isController": false}, {"data": ["Get User", 50, 0, 0.0, 3109.1200000000003, 1284, 5181, 3137.5, 4642.4, 4757.849999999999, 5181.0, 0.24736310925533808, 0.14952906702056082, 0.08648046202481546], "isController": false}, {"data": ["Delete Order", 50, 0, 0.0, 4001.3999999999983, 2104, 5986, 4245.0, 5512.2, 5754.9, 5986.0, 0.24536746231155776, 0.12939299770336055, 0.13466456427646042], "isController": false}, {"data": ["Register", 50, 0, 0.0, 4170.300000000001, 3326, 5471, 4208.0, 4908.0, 5057.599999999999, 5471.0, 0.24972654942837594, 0.1719503862021087, 0.0987688012875901], "isController": false}, {"data": ["Order Detail", 50, 0, 0.0, 6359.100000000001, 4415, 8380, 6712.5, 7872.599999999999, 8356.9, 8380.0, 0.24262422360248448, 0.3710444669545807, 0.09098408385093167], "isController": false}, {"data": ["Update User", 50, 0, 0.0, 3230.6599999999994, 1282, 5711, 3504.0, 4760.3, 4905.95, 5711.0, 0.24825846685501207, 0.15007030369458252, 0.13528146924325854], "isController": false}, {"data": ["Update Password", 50, 0, 0.0, 3538.3200000000006, 1678, 5413, 3820.5, 5141.4, 5279.149999999999, 5413.0, 0.24831518149356616, 0.1270675342799108, 0.12076265662480072], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
