import React from 'react'
import './BookingsControl.css'
const BookingsControl = props => {
    return (
        <div className='bookings-control'>
          <button className={props.activeType === 'list' ? 'active':''} onClick={()=>props.changeOutputTypeHandler('list')}>List</button>
          <button className={props.activeType === 'chart' ? 'active':''} onClick={()=>props.changeOutputTypeHandler('chart')}>Chart</button>
        </div>
    )
}

export default BookingsControl;