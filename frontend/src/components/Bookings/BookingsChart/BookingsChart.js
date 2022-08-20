import React from "react";
import { Bar as BarChart } from "react-chartjs";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 100000000,
  },
};
const BookingsChart = (props) => {
  let values = [];
  const chartData = { labels: [], datasets: [] };
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      fillColor: "rgba(255, 99, 132, 0.2)",
      strokeColor: "rgba(54, 162, 235, 0.2)",
      highLightFill: "rgba(255, 206, 86, 0.2)",
      highLightStroke: "rgba(75, 192, 192, 0.2)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <BarChart data={chartData} />
    </div>
  );
};

export default BookingsChart;
