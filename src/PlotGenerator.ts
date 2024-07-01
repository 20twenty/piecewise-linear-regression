
export class PlotGenerator {
    private x1: number[];
    private y1: number[];
    private x2: number[];
    private y2: number[];

    constructor(x1: number[], y1: number[], x2: number[], y2: number[]) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public getHtml(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                <title>Scatter and Line Plot</title>
                <style>
                    body, html {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    #plot-container {
                        width: 100%;
                        max-width: 1200px;
                        height: 50vw; /* Set height to half of the viewport width */
                        max-height: 800px; /* Optional: Cap the max height */
                    }
                    #plot {
                        width: 100%;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <div id="plot-container">
                    <div id="plot"></div>
                </div>
                <script>
                    var traceOrig = {
                        x: ${JSON.stringify(this.x1)},
                        y: ${JSON.stringify(this.y1)},
                        mode: 'lines+markers',
                        type: 'scatter',
                        name: 'Original Data',
                        line: {
                            dash: 'dot',
                            width: 1,
                            color: 'rgb(31, 119, 180)'
                        },
                        marker: {
                            size: 14,
                            color: 'rgb(31, 119, 180)'
                        }
                    };

                    var traceFit = {
                        x: ${JSON.stringify(this.x2)},
                        y: ${JSON.stringify(this.y2)},
                        mode: 'lines',
                        type: 'scatter',
                        name: 'PLR Fit',
                        line: {
                            dash: 'solid',
                            width: 3,
                            color: 'rgb(255, 127, 14)'
                        }
                    };

                    var data = [traceOrig, traceFit];

                    var layout = {
                        title: 'Scatter and Line Plot',
                        xaxis: {
                            title: 'X Axis'
                        },
                        yaxis: {
                            title: 'Y Axis'
                        },
                        autosize: true
                    };

                    Plotly.newPlot('plot', data, layout, {responsive: true});
                </script>
            </body>
            </html>
        `.replace(/\n\s{12}/g, '\n');
    }
}

