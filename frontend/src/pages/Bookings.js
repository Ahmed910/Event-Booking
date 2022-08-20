import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/Bookinglist";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControl from "../components/BookingsControl/BookingsControl";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [outputType, setOutputType] = useState('list');
  const context = useContext(AuthContext);
  const token = context.token;

  useEffect(() => {
    setIsLoading(true);
    let requestBody = {
      query: `
          query{
            bookings{
                  _id
                  event{
                    _id
                    title
                    date
                    price
                  }
                  createdAt
                  
              }
          }
          `,
    };
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        const { bookings } = res.data;
       
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);
  const deleteBookingHandler = bookingId => {
    setIsLoading(true);
    const requestBody = {
        query: `
            mutation CancelBooking($id:ID!){
                cancelBooking(bookingId:$id){
                    _id
                    title
                    
                }
            }
            `,
            variables :{
              id:bookingId
            }
      };
      fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed");
          }
          return res.json();
        })
        .then((res) => {
           const updatedBookings = bookings.filter(booking => booking._id !== bookingId) 
          setBookings(updatedBookings);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
  }
  const changeOutputTypeHandler = outputType => {
    if(outputType === 'list'){
       setOutputType('list');
    }else{
      setOutputType('chart')
    }
  }

  let content = <Spinner/>;
  if(!isLoading){
    content = (
      <React.Fragment>
         <BookingsControl changeOutputTypeHandler={changeOutputTypeHandler} activeType={outputType}/>
        <div>
          {outputType == 'list' ? <BookingList bookings={bookings} onDelete={deleteBookingHandler}/>: <BookingsChart bookings={bookings} />}
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {content}

    </React.Fragment>
  );
};
export default BookingsPage;
{/*       
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler}/>
      )} */}
