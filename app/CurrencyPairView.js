import React from 'react';
import PureRendererMixin from 'react-addons-pure-render-mixin'
import plnx from 'plnx';
import LoadingView from './LoadingView'
import Chart from './Chart'
import {Pane, Header, Body} from './Pane'

export default React.createClass({
  propTypes: {
    currencyPair: React.PropTypes.object.isRequired,
    navigation: React.PropTypes.object
  },

  mixins: [PureRendererMixin],

  getInitialState() {
    return {
      isLoading: true,
      data: []
    }
  },

  componentWillMount() {
    const params = {
      currencyPair: this.props.currencyPair.key,
      start: Math.floor((Date.now() / 1000) - 60 * 60 * 24 * 7),
      end: Math.floor(Date.now() / 1000),
      period: 14400
    }

    plnx.returnChartData(params, (err, data) => {
      if (err) { throw err }
      this.setState({
        isLoading: false,
        data: data.map((d) => {
          d.date = new Date(d.date * 1000)
          return d
        })
      })
    })
  },

  onClickBack() {
    this.props.navigation.pop()
  },

  renderChart() {
    if (this.state.isLoading) {
      return <LoadingView />
    }
    return <Chart seriesName={this.props.currencyPair.name} data={this.state.data} />
  },

  render() {
    return (
      <Pane>
        <Header onClick={this.onClickBack}>
          <i className="fa fa-chevron-left" style={{marginRight: 8}} />
          <strong>{this.props.currencyPair.name}</strong>
        </Header>
        <Body style={{display: "flex", padding: 25}}>{this.renderChart()}</Body>
      </Pane>
    );
  }
})
