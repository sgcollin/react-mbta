import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box'

class DepartureBoard extends React.Component {

  // Display time in HH:MM XM format
  displayTime(isoDate) {
    let date = new Date(isoDate)
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  // Display destination
  displayDestination(destination) {
    let link = "https://www.mbta.com/schedules/" + destination + "/timetable"
    let display = destination.split('-')[1].toUpperCase()
    return <a href={link} target="_blank" rel="noopener noreferrer">{display}</a>
  }

  // Display track number in ## format
  // If track is null, display TBD
  displayTrack(predictionData) {
    const predictions = this.props.predictions
    let track = "TBD"
    if (predictionData !== null) {
      predictions.forEach(prediction => {
        if (predictionData.id === prediction.id && prediction.relationships.stop.data.id.includes('-')) {
          track = prediction.relationships.stop.data.id.split('-')[1]
        }
      })
    }
    return track
  }

  // Display status
  displayStatus(predictionData) {
    const predictions = this.props.predictions
    let status = "ON TIME"
    if (predictionData !== null) {
      predictions.forEach(prediction => {
        if (predictionData.id === prediction.id && prediction.attributes.status !== null) {
          status = prediction.attributes.status.toUpperCase()
        }
      })
    }
    return status
  }

  // Display estimated departure time in #h #m format
  displayDeparture(predictionData, scheduleTime) {
    const predictions = this.props.predictions
    let departure = "TBD"
    if (predictionData !== null) {
      predictions.forEach(prediction => {
        if (predictionData.id === prediction.id && prediction.attributes.departure_time !== null) {
          departure = this.millisecondsToString(new Date(prediction.attributes.departure_time) - new Date())
        }
      })
    } else {
      departure = this.millisecondsToString(new Date(scheduleTime) - new Date())
    }
    return departure
  }

  // Display estimated departure time color
  // If time is less than 10 minutes, display red, else black
  displayDepartureStyle(predictionData, scheduleTime) {
    const predictions = this.props.predictions
    let time = null
    if (predictionData !== null) {
      predictions.forEach(prediction => {
        if (predictionData.id === prediction.id && prediction.attributes.departure_time !== null) {
          time = new Date(prediction.attributes.departure_time)
        }
      })
    } else {
      time = new Date(scheduleTime)
    }

    let color = (time - new Date() < 600000) ? "red" : "black"
    return {color: color}
  }

  millisecondsToString(milliseconds) {
    let string = "TBD"
    const seconds = Math.ceil(milliseconds/1000)
    const minutes = Math.ceil((seconds/60)%60)
    const hours = Math.floor(seconds/3600)
    if (hours > 0) {
      string = hours + "h " + minutes + "m"
    } else if (minutes > 1 && minutes < 60) {
      string = minutes + "m"
    } else {
      string = "<1m"
    }
    return string
  }

  render() {
    const { schedules, stationTabIndex } = this.props
    const maxRows = 10
    const station = stationTabIndex === 0 ? 'North Station' : 'South Station'

    // Filter board based on station and if either the departure time is greater than
    // the current time, or if the status isn't ON TIME. e.g. DELAYED
    const filterSchedules = schedules.filter(schedule => (
      schedule.relationships.stop.data.id === station &&
      schedule.attributes.departure_time !== null &&
        (new Date(schedule.attributes.departure_time) >= new Date() ||
        this.displayStatus(schedule.relationships.prediction.data) !== "ON TIME")
    ))

    return (
      <Box display="flex" justifyContent="center" className="Box">
        <TableContainer className="BackgroundWhite" style={{width: "860px"}}>
          <Table size="small" aria-label="board">
            <TableHead>
              <TableRow className="TableHead">
                <TableCell>CARRIER</TableCell>
                <TableCell align="right">TIME</TableCell>
                <TableCell>DESTINATION</TableCell>
                <TableCell>TRACK</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>DEPARTURE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterSchedules.splice(0,maxRows).map(schedule => (
                <TableRow key={schedule.id} className="TableRow">
                  <TableCell>MBTA</TableCell>
                  <TableCell align="right">{this.displayTime(schedule.attributes.departure_time)}</TableCell>
                  <TableCell>{this.displayDestination(schedule.relationships.route.data.id)}</TableCell>
                  <TableCell>{this.displayTrack(schedule.relationships.prediction.data)}</TableCell>
                  <TableCell>{this.displayStatus(schedule.relationships.prediction.data)}</TableCell>
                  <TableCell style={this.displayDepartureStyle(schedule.relationships.prediction.data,schedule.attributes.departure_time)}>
                    {this.displayDeparture(schedule.relationships.prediction.data,schedule.attributes.departure_time)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )

  }
}

export default DepartureBoard
