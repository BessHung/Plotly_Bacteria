function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(samplesArray);
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(metadataArray);

    //  5. Create a variable that holds the first sample in the array.
    resultSample = samplesArray[0];
    console.log(resultSample);
    // Create a variable that holds the first sample in the metadata array.
    resultMeta = metadataArray[0];
    console.log(resultMeta);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = resultSample.otu_ids;
    var otu_label = resultSample.otu_labels;
    var sample_value = resultSample.sample_values;
    // Create a variable that holds the washing frequency.
    var washingfreq = resultMeta.wfreq;
    console.log(washingfreq);

    // ------bar chart-------

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_id.slice(0,10).map(id => `OTU ${id}`).reverse();
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [
      {x: sample_value.slice(0,10).reverse(),
       y: yticks,
       text: otu_label.slice(0,10).reverse(),
       orientation: 'h',
       type: 'bar',
       marker:{
        color:'teal'
       }
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title:"<b>Top 10 Bacteria Cultures Found</b>",
     plot_bgcolor:'lightcyan',
     paper_bgcolor:'lightcyan',
     font: {
      color: 'darkslategray'
     }     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    
    // ------bubble chart-------

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {   x: otu_id,
          y: sample_value,
          text: otu_label,
          mode: 'markers',
          marker :{
                  size: sample_value,
                  color: otu_id,
                  colorscale:'YlOrRd'}
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      hovermode:'closest',
      plot_bgcolor:'lightcyan',
      paper_bgcolor:'lightcyan',
      font: {
       color: 'darkslategray'
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // ------gauge chart-------
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        type: 'indicator', 
        mode: 'gauge+number',
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "darkslategray" },
          steps: [
            { range: [0, 2], color: "cadetblue" },
            { range: [2, 4], color: "mediumaquamarine" },
            { range: [4, 6], color: "oldlace" },
            { range: [6, 8], color: "navajowhite" },
            { range: [8, 10], color: "tan" }
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },      
      plot_bgcolor:'lightcyan',
      paper_bgcolor:'lightcyan',
      font: {
       color: 'darkslategray'
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });

}


