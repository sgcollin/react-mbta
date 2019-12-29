import React from 'react'
import Box from '@material-ui/core/Box'

class Timestamp extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  convertDate(date) {
    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const weekday = date.getDay()
    const dateString = date.toLocaleDateString("en-US")
    const timeString = date.toLocaleTimeString("en-US")
    return days[weekday] + " " + dateString + " " + timeString
  }

  render() {
    const { date } = this.state

    return (
      <Box display="flex" justifyContent="center" className="Box">
        <div className="Timestamp">{this.convertDate(date)}</div>
      </Box>
    )
  }
}

export default Timestamp
