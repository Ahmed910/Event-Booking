import React from "react";
import './BookingList.css';

const BookingList = (props) => {
 return <ul className="bookings__list">
    {props.bookings.map((booking, index) => (
      <React.Fragment key={index}>
        <li className="booking__item">
          <div className="bookings__item-data">
            {booking.event.title} -{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={props.onDelete.bind(this,booking._id)}>Cancel</button>
          </div>
        </li>
      </React.Fragment>
    ))}
  </ul>;
};
export default BookingList
