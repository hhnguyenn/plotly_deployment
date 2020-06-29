function init() {
    var selector = d3.select("#selDataset");
    // gets data from json file  
    d3.json("samples.json").then((data) => {
    //check in console
        console.log(data);
    // retrieve sample names
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample); 
        });
      // Default values
      optionChanged(sampleNames[0]);

})}

init();
  
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};

    function buildMetadata(sample) {
        d3.json("samples.json").then((data) => {
            var metadata = data.metadata;
            var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
            var result = resultArray[0];
            var PANEL = d3.select("#sample-metadata");
            
            PANEL.html("");
            PANEL.append("h6").text(`ID: ${result.id}`);
            PANEL.append("h6").text(`ETHNICITY: ${result.ethnicity}`);
            PANEL.append("h6").text(`GENDER: ${result.gender}`);
            PANEL.append("h6").text(`AGE: ${result.age}`);
            PANEL.append("h6").text(`LOCATION: ${result.location}`);
            PANEL.append("h6").text(`BBTYPE: ${result.bbtype}`);
            PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);
    });
}

  function buildCharts(newSample) {
    d3.json("samples.json").then((data) => {
        var sampledata = data.samples;
        var metadata1 = data.metadata;
        var resultArray = sampledata.filter(sampleObj => sampleObj.id == newSample);
        var result = resultArray[0];
    

        //Bar Chart
        var ids = result.otu_ids.map(id=>`OTUid ${id}`).slice(0,10).reverse();
        var sample_values = result.sample_values.slice(0,10).reverse();
        var labels1 = result.otu_labels.slice(0,10).reverse();
      
        var trace = {
            x: sample_values,
            y: ids,
            type: "bar",
            orientation: 'h',
            text: labels1,
        };
        var data = [trace];
        var layout = {
            title: "Top 10 Bacterial Species (OTUs)",
            height: 500,
            width: 500,
            xaxis: { title: "Count" },
            yaxis: { title: "Bacterial IDs"},
        };
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var Bubids = result.otu_ids
        var sample = result.sample_values
        var labels = result.otu_labels
        
        var trace1 = {
            x: Bubids,
            y: sample,
            text: labels,
            mode: 'markers',
            marker: {
            size: sample,
            color: Bubids,
            colorscale: "RdBu"
          }
        };
        
        var data = [trace1];

        var layout = {
            title: 'Type and Size of Bacteria in Belly Button',
            xaxis: { title: "OTU IDs" },
            showlegend: false,
            height: 600,
            width: 1200
        };
        
        Plotly.newPlot('bubble', data, layout);
      
        
        // Gauge
        var resultArray1 = metadata1.filter(sampleObj => sampleObj.id == newSample);        
        var result1 = resultArray1[0];
        var freq = result1.wfreq
            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: freq,
                    title: "Belly Button Washing Frequency <br>Scrubs per Week" ,
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 10] },
                        steps: [
                            { range: [0, 1], color: "lightseagreen"},
                            { range: [1, 2], color: "mintcream"},
                            { range: [2, 3], color: "lightseagreen"},
                            { range: [3, 4], color: "mintcream"},
                            { range: [4, 5], color: "lightseagreen"},
                            { range: [5, 6], color: "mintcream"},
                            { range: [6, 7], color: "lightseagreen"},
                            { range: [7, 8], color: "mintcream"},
                            { range: [8, 9], color: "lightseagreen"},
                            { range: [9, 10], color: "mintcream"},
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 0.75,
                            value: freq
                        }
                    }
                }
            ];
          
            var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          
            Plotly.newPlot('gauge', data, layout);
    });
}

