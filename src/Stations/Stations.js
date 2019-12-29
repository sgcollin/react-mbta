import React from 'react'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Stations extends React.Component {

  render() {
    const { stationTabIndex, handleChange } = this.props

    return (
      <div className="BackgroundWhite">
        <div className="Tab">
          <Tabs
          centered
          TabIndicatorProps={{style: {background:'#80276b'}}}
          value={stationTabIndex}
          aria-label="station"
          onChange={handleChange}>
            <Tab label="NORTH STATION"/>
            <Tab label="SOUTH STATION"/>
          </Tabs>
        </div>
      </div>
    )
  }

}

export default Stations
