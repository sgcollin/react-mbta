import React from 'react';
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

import Stations from './Stations/Stations'
import DepartureBoard from './DepartureBoard/DepartureBoard'
import Timestamp from './Timestamp/Timestamp'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      schedules: [],
      predictions: [],
      stationTabIndex: 0,
      loading: true
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetchSchedules()

    // Fetch every 15 seconds
    this.interval = setInterval(() => this.fetchSchedules(), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchSchedules() {
    const url = 'https://api-v3.mbta.com/schedules?filter[stop]=North%20Station,South%20Station&include=prediction&sort=departure_time,arrival_time'
    fetch(url)
      .then(response => response.json())
      .then((data, included) => this.setState({
        schedules: data.data,
        predictions: data.included,
        loading: false
      }))
  }

  handleChange(event, value) {
    this.setState({ stationTabIndex: value })
  }

  render() {
    const { schedules, predictions, stationTabIndex, loading } = this.state

    return (
      <div>
        <Stations stationTabIndex={stationTabIndex} handleChange={this.handleChange}/>
        {loading ?
          <Box display="flex" justifyContent="center" className="Box">
            <CircularProgress/>
          </Box> :
          <div>
            <DepartureBoard schedules={schedules} predictions={predictions} stationTabIndex={stationTabIndex}/>
            <Timestamp/>
          </div>
        }
      </div>
    )
  }


}

export default App;
