import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";

import "./Asset.css";

type ChartValue = [number, number];
type ValuesSchema = [number, number, number, number, number, number];

interface Chart {
  timeSeries: {
    data: {
      values: Array<ChartValue>;
    };
  };
  metrics: {
    data: {
      name: string;
      slug: string;
    };
  };
}

function Asset() {
  const { asset } = useParams<{ asset: string }>();
  const [chartData, setChartData] = useState<Chart | undefined>();
  const [tokenId, setTokenId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [values, setValues] = useState<Array<ChartValue>>();
  const [avgVolume, setAvgVolume] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/asset/${asset}`)
      .then((data) => data.json())
      .then((data) => {
        setLoading(false);
        setChartData(data);
        setTokenId(data.metrics.data.id);
        setValues(
          data.timeSeries.data.values.map((val: ValuesSchema) => [
            val[0],
            val[4],
          ])
        );
        let avgVolume = 0;
        let avgPrice = 0;
        data.timeSeries.data.values.forEach((val: ValuesSchema) => {
          avgPrice += val[4];
          avgVolume += val[5];
        });
        setAvgVolume(
          Math.floor(avgVolume / data.timeSeries.data.values.length)
        );
        setAvgPrice(avgPrice / data.timeSeries.data.values.length);
      });
  }, [asset]);

  if (loading) {
    return (
      <div className={"spinner"}>
        {" "}
        <Loader
          type="Hearts"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={15000}
        />
      </div>
    );
  }

  return (
    <div className="Asset">
      <header className="Asset-header">
        <img src={`https://messari.io/asset-images/${tokenId}/32.png?v=2`} />{" "}
        Daily closing prices
      </header>

      <div className={"charts-assets"}>
        <ul className={"asset-list"}>
          <li>
            <NavLink to={"/asset/btc"}>Bitcoin</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/eth"}>Ethereum</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/sol"}>Solana</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/ada"}>Cardano</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/bnb"}>BNB</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/fun"}>FUN</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/ray"}>Ray</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/cake"}>Cake</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/dot"}>Dot</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/luna"}>Luna</NavLink>
          </li>
          <li>
            <NavLink to={"/asset/vet"}>Vechain</NavLink>
          </li>
        </ul>

        <HighchartsReact
          highcharts={Highcharts}
          className={"test"}
          options={{
            title: {
              text: chartData?.metrics.data.name,
            },
            xAxis: {
              type: "datetime",
              labels: {
                formatter: function (): any {
                  // @ts-ignore
                  return Highcharts.dateFormat("%e. %b", this.value);
                },
              },
            },
            series: [
              {
                type: "line",
                name: chartData?.metrics.data.slug,
                data: values,
              },
            ],
          }}
        />
      </div>
      <div>
        <div className={"averages"}>
          <div>
            Average price:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 3,
              maximumFractionDigits: 6,
            }).format(avgPrice)}
          </div>
          <div>
            Average trading volume:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(avgVolume)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asset;
