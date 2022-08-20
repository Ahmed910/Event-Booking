import React, { useState, useRef, useContext, useEffect } from "react";
import "./Events.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";

const EventsPage = () => {
  const context = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const titleRef = useRef("");
  const priceRef = useRef("");
  const dateRef = useRef("");
  const descriptionRef = useRef("");
  const token = context.token;
  const [creating, setCreating] = useState(false);
  
  const startCreateEventHandler = () => {
    setCreating(true);
  };
  let modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null)
  };

  useEffect(() => {
    setIsLoading(true);
    let requestBody = {
      query: `
      query{
          events{
              _id
              title
              price
              date
              description
              creator{
                _id
                email
              }
          }
      }
      `,
    };
    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        const events = res.data.events;
        setEvents(events);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  let modalConfirmHandler = () => {
    setCreating(true);
    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price, date, description };
    let requestBody = {
      query: `
      mutation{
          createEvent(eventInput:{title:"${title}",price:${price},date:"${date}",description:"${description}"}){
              _id
              title
              price
              date
              description
             
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
        // const {createEvent} = res.data
        // events.push(createEvent)
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: res.data.createEvent._id,
          title: res.data.createEvent.title,
          description: res.data.createEvent.description,
          date: res.data.createEvent.date,
          price: res.data.createEvent.price,
          creator: {
            _id: context.userId,
          },
        });
        setEvents(updatedEvents);
        // setEvents(events)
        modalCancelHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showDetailHandler = eventId => {
       const selectedEvent =  events.find(e=> e._id === eventId);
       console.log(selectedEvent)
       setSelectedEvent(selectedEvent);
  }
  const bookEventHandler = () => {
    if(!context.token){
      setSelectedEvent(null);
      return;
    }
    let requestBody = {
      query: `
      mutation{
        bookEvent(eventId:"${selectedEvent._id}"){
              _id
             createdAt
             updatedAt
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
        console.log(res);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText={context.token ? 'Book':'Confirm'}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionRef}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent &&  <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText='Book'
        >
          <h1>{selectedEvent.title}</h1>
          <h2>{selectedEvent.price}$ - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
          <p>{selectedEvent.description}</p>
        </Modal>}
      {context.token && (
        <div className="events-control">
          <p>Share Your Own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList events={events} authUserId={context.userId} onViewDetail={showDetailHandler}/>
      )}
    </React.Fragment>
  );
};
export default EventsPage;
