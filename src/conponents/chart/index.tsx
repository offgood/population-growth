import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { FormattedResult, GroupedByYear } from "@/interface";

const BarChartRace = ({ allData }: { allData: GroupedByYear }) => {
  const chartDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartDiv.current) return;

    const root = am5.Root.new(chartDiv.current);

    root.numberFormatter.setAll({
      numberFormat: "#a",
      bigNumberPrefixes: [
        { number: 1e6, suffix: "M" },
        { number: 1e9, suffix: "B" },
      ],
      smallNumberPrefixes: [],
    });

    const stepDuration = 2000;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    chart.zoomOutButton.set("forceHidden", true);

    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 20,
      inversed: true,
      minorGridEnabled: true,
    });

    yRenderer.grid.template.set("visible", false);

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "Country",
        renderer: yRenderer,
      })
    );

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        strictMinMax: true,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    xAxis.set("interpolationDuration", stepDuration / 10);
    xAxis.set("interpolationEasing", am5.ease.linear);

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "Population",
        categoryYField: "Country",
      })
    );

    series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors")?.getIndex(series.columns.indexOf(target));
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueXWorking.formatNumber('#.# a')}",
          fill: root.interfaceColors.get("alternativeText"),
          centerX: am5.p100,
          centerY: am5.p50,
          populateText: true,
        }),
      });
    });

    const label = chart.plotContainer.children.push(
      am5.Label.new(root, {
        text: "1950",
        fontSize: "8em",
        opacity: 0.2,
        x: am5.p100,
        y: am5.p100,
        centerY: am5.p100,
        centerX: am5.p100,
      })
    );

    const years = Object.keys(allData).sort((a, b) => Number(a) - Number(b));
    let yearIndex = 0;
    let interval: NodeJS.Timeout;

    const updateData = () => {
      const currentYear: number = parseInt(years[yearIndex]);
      const yearData: FormattedResult[] = allData[currentYear];
      yearIndex++;

      yAxis.data.setAll(yearData);
      series.data.setAll(yearData);
      label.set("text", currentYear.toString());

      if (yearIndex < years.length) {
        interval = setTimeout(updateData, stepDuration);
      }
    };

    updateData();

    return () => {
      clearTimeout(interval);
      root.dispose();
    };
  }, [allData]);

  return <div ref={chartDiv} style={{ width: "100%", height: "500px" }}></div>;
};

export default BarChartRace;
