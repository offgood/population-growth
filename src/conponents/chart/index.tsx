"use client";
import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { IGroupedByYear } from "@/interface";
import { getData } from "@/services";
import countryToContinent from "@/util/countryToContinent";
import RangLine from "../rangeLine";
import StartStop from "../startStop";

// Define the regions and their corresponding colors
const regions = [
  { name: "Asia", color: "#5636D0" },
  { name: "Europe", color: "#7B56E3" },
  { name: "Africa", color: "#FF6F8E" },
  { name: "Oceania", color: "#FF9E00" },
  { name: "Americas", color: "#FFB85C" },
];

// Function to get the color for a country based on its continent
const getColorForCountry = (country: any) => {
  const continent = countryToContinent[country];
  const region = regions.find((region) => region.name === continent);
  return region ? am5.color(region.color) : am5.color("#000000"); // Default color if not found
};

const BarChartRace = () => {
  const [allData, setAllData] = useState<IGroupedByYear>({});
  const [yearData, setYearData] = useState<number>(1950);
  const [totalValue, setTotalValue] = useState<number>(0);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const factData = async () => {
    try {
      const dataChart: IGroupedByYear = await getData();
      if (!dataChart || Object.keys(dataChart).length === 0) {
        console.error("No data fetched");
        return;
      }
      setAllData(dataChart);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    factData();
  }, []);

  useEffect(() => {
    if (Object.keys(allData).length === 0) return;

    const stepDuration = 2000;
    const root = am5.Root.new("myChart");

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

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "country",
        renderer: yRenderer,
      })
    );

    let xAxis = chart.xAxes.push(
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
        valueXField: "value",
        categoryYField: "country",
      })
    );

    // var circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      var bulletContainer = am5.Container.new(root, {});
      var circle = bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 15,
          }
          // circleTemplate
        )
      );

      var maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 15 })
      );

      var imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle,
        })
      );

      var image = imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "bulletSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 30,
          height: 30,
        })
      );

      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: bulletContainer,
      });
    });

    series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

    series.columns.template.adapters.add("fill", function (fill, target) {
      const country: any = target.dataItem?.get("categoryY");
      return getColorForCountry(country);
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      const country: any = target.dataItem?.get("categoryY");
      return getColorForCountry(country);
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1.1,
        sprite: am5.Label.new(root, {
          centerY: am5.p50,
          text: "{valueX}",
          populateText: true,
        }),
      });
    });

    let year = 1950;

    const label = chart.plotContainer.children.push(
      am5.Label.new(root, {
        text: String(year),
        fontSize: "4em",
        opacity: 0.5,
        x: am5.p100,
        y: am5.p50,
        centerY: am5.p0,
        centerX: am5.p100,
      })
    );

    const totalLabel = chart.plotContainer.children.push(
      am5.Label.new(root, {
        text: `Total ${totalValue}`,
        fontSize: "4em",
        opacity: 0.5,
        x: am5.p100,
        y: am5.p100,
        centerY: am5.p100,
        centerX: am5.p100,
      })
    );

    function getSeriesItem(category: any) {
      for (let i = 0; i < series.dataItems.length; i++) {
        const dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") === category) {
          return dataItem;
        }
      }
    }

    function sortCategoryAxis() {
      series.dataItems.sort(function (x, y) {
        const xValue = x.get("valueX") || 0;
        const yValue = y.get("valueX") || 0;
        return yValue - xValue;
      });

      am5.array.each(yAxis.dataItems, function (dataItem) {
        const seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          const index = series.dataItems.indexOf(seriesDataItem);
          const deltaPosition =
            (index - dataItem.get("index", 0)) / series.dataItems.length;

          if (dataItem.get("index") != index) {
            dataItem.set("index", index);
            dataItem.set("deltaPosition", -deltaPosition);
            dataItem.animate({
              key: "deltaPosition",
              to: 0,
              duration: stepDuration / 2,
              easing: am5.ease.out(am5.ease.cubic),
            });
          }
        }
      });

      yAxis.dataItems.sort(function (x, y) {
        const xIndex = x.get("index") || 0;
        const yIndex = y.get("index") || 0;
        return xIndex - yIndex;
      });
    }

    var interval = setInterval(function () {
      year++;

      if (year > 2021) {
        clearInterval(interval);
        clearInterval(sortInterval);
      }

      setYearData(year);

      updateData();
    }, stepDuration);

    var sortInterval = setInterval(function () {
      sortCategoryAxis();
    }, 10);

    function setInitialData() {
      const d = allData[year];

      if (!d) {
        console.error(`No data for year ${year}`);
        return;
      }

      for (const n in d) {
        if (n !== "World") {
          series.data.push({
            country: n,
            value: d[n].value,
            bulletSettings: {
              src: d[n].bulletSettings,
            },
          });
          yAxis.data.push({ country: n });
        }
      }
    }

    function updateData() {
      let itemsWithNonZero = 0;
      let total = 0;

      if (allData[year]) {
        label.set("text", year.toString());

        am5.array.each(series.dataItems, (dataItem) => {
          const category = dataItem.get("categoryY");
          if (category && category !== "World") {
            const value = allData[year][category]?.value;
            const image = allData[year][category]?.bulletSettings;
            if (value > 0) {
              itemsWithNonZero++;
            }

            dataItem.animate({
              key: "valueX",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });

            dataItem.animate({
              key: "valueXWorking",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });
          }
        });
        if (allData[year]["World"]) {
          total = allData[year]["World"].value; // get total value 'World'
        }

        const formattedNumber = new Intl.NumberFormat().format(total);
        setTotalValue(total);
        totalLabel.set("text", `Total: ${formattedNumber}`);

        yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
      } else {
        console.error(`No data for year ${year}`);
      }
    }

    setInitialData();
    setTimeout(() => {
      year++;
      updateData();
    }, 10);

    series.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData]);

  return (
    <>
      <div className="w-full">
        <div
          id="myChart"
          ref={chartRef}
          style={{ width: "100%", height: "500px" }}
        />
      </div>
      <div
        className="flex w-full"
        style={{
          padding: "8px",
        }}
      >
        <div className="p-10">
          <StartStop onStart={() => {}} onStop={() => {}} />
        </div>
        <div
          style={{
            paddingLeft: "25px",
          }}
        >
          <RangLine val={yearData} />
        </div>
      </div>
    </>
  );
};

export default BarChartRace;
