import React from 'react'
import ReStock from 'react-stockcharts'
import {format} from 'd3'

const {ChartCanvas, Chart, EventCapture} = ReStock;

const {
  CandlestickSeries,
  BarSeries,
  LineSeries,
  BollingerSeries
} = ReStock.series;

const {discontinuousTimeScaleProvider} = ReStock.scale;
const {CrossHairCursor, MouseCoordinateY, CurrentCoordinate} = ReStock.coordinates;
const {EdgeIndicator} = ReStock.coordinates;
const {TooltipContainer, OHLCTooltip, MovingAverageTooltip, BollingerBandTooltip} = ReStock.tooltip;
const {XAxis, YAxis} = ReStock.axes;
const {ema, bollingerBand} = ReStock.indicator;
const {fitWidth} = ReStock.helper;

export default fitWidth(React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    seriesName: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired
  },

  render() {
    const {data, width} = this.props;
    const margin = {
      left: 70,
      right: 70,
      top: 20,
      bottom: 30
    };

    const gridWidth = width - margin.left - margin.right;

    const yGrid = {innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 }

    const ema20 = ema()
      .id(0)
      .windowSize(20)
      .merge((d, c) => { d.ema20 = c })
      .accessor(d => d.ema20);

    const ema50 = ema().id(2)
      .windowSize(50)
      .merge((d, c) => { d.ema50 = c })
      .accessor(d => d.ema50)

    const bb = bollingerBand()

    return (
      <ChartCanvas width={width} height={480} margin={margin} type="svg" seriesName={this.props.seriesName} data={data} calculator={[ema20, ema50, bb]} xAccessor={d => d.date} xScaleProvider={discontinuousTimeScaleProvider} >
        <Chart id={1} height={300} yExtents={d => [d.high, d.low]} padding={{ top: 10, bottom: 20 }}>

          <YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />

          <MouseCoordinateY id={0} at="right" orient="right" displayFormat={format('.8f')} />

          <CandlestickSeries wickStroke={d => d.close > d.open ? '#6BA583' : '#DB0000'} fill={d => d.close > d.open ? '#6BA583' : '#DB0000'} />

          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />

          <BollingerSeries calculator={bb} />

          <CurrentCoordinate id={1} yAccessor={ema20.accessor()} fill={ema20.stroke()} />
          <CurrentCoordinate id={2} yAccessor={ema50.accessor()} fill={ema50.stroke()} />

          <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={d => d.close} fill={d => d.close > d.open ? '#6BA583' : '#DB0000'} />
        </Chart>

        <Chart id={2} yExtents={d => d.volume} height={100} origin={(w, h) => [0, h - 100]}>
          <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('s')} />
          <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? '#6BA583' : '#DB0000'} />
        </Chart>

        <CrossHairCursor />
        <EventCapture mouseMove zoom pan />
        <TooltipContainer>
          <OHLCTooltip forChart={1} origin={[-40, -10]} />
          <MovingAverageTooltip forChart={1} origin={[-38, 10]} calculators={[ema20, ema50]} />
          <BollingerBandTooltip forChart={1} origin={[-38, 60]} calculator={bb} />
        </TooltipContainer>
      </ChartCanvas>
    );
  }
}))
