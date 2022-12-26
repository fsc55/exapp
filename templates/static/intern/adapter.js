/* jshint esversion: 6 */
/* jshint -W069 */

function nameContents(createdict,renderdict)
{

    createdict["HeatMapDemo"] = createHeatMapChart;
    renderdict["HeatMapDemo"] = renderHeatMapChart;

    return [
        "HeatMapDemo",
    ];
}

