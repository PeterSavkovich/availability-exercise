import React, { Component } from 'react';
const storage = require('node-persist');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchToday();
    this.fetchAvailability();
    //this.initStorage();
  }

  async fetchToday() {
    try {
      const res = await fetch("http://localhost:4433/today");
      const json = await res.json();
      this.setState({today: json.today});
    } catch (e) {
      console.error("Failed to fetch 'today' data", e);
    }
  }

  async fetchAvailability() {
    try {
      const res = await fetch("http://localhost:4433/availability");
      const json = await res.json();
      this.setState({availability: json});
    } catch (e) {
      console.error("Failed to fetch 'availability' data", e);
    }
  }

  async initStorage() {
    storage.init();
  }

  render() {
    return (
      <div className="App container">
        <h1>Book Time with an Advisor</h1>

        {this.state.today && <span id="today">Today is {this.state.today}.</span>}

        <form id="name-form" className="col-md-6">
          <div className="form-group">
            <label htmlFor="name-field">Your Name</label>
            <input type="text" id="name-field" className="form-control" />
          </div>
        </form>

        <h2>Available Times</h2>
        <table className="advisors table">
          <thead>
            <tr>
              <th>Advisor ID</th>
              <th>Available Times</th>
            </tr>
          </thead>
          {this.state.availability && <AvailabilityTable availability={this.state.availability} />}
        </table>

        <h2>Booked Times</h2>
        <table className="bookings table">
          <thead>
            <tr>
              <th>Advisor ID</th>
              <th>Student Name</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <BookedTimesTable bookings={[{advId:"36232", name:"John Smith", dateTime:"2019-04-03T10:00:00-04:00"}]} />
        </table>
      </div>
    );
  }
}

function BookedItem(props) {
  let date = new Date(props.dateTime);
  return (
      <tr>
        <td>{props.advisorId}</td>
        <td>{props.studentName}</td>
        <td>
          <time dateTime={props.dateTime}>{date.toLocaleString()}</time>
        </td>
      </tr>
  );
}

class BookedTimesTable extends Component {
  renderBooking(advId, name, dateTime) {
    return (
        <BookedItem advisorId={advId} studentName={name} dateTime={dateTime}/>
    )
  }

  createTable() {
    let table = [];
    this.props.bookings.forEach((booking) => {
      table.push(this.renderBooking(booking["advId"], booking["name"], booking["dateTime"]))
    });
    return table;
  }

  render() {
    return (
        <tbody>
          {this.createTable()}
        </tbody>
    )
  }
}

class AvailabilityTable extends Component {
  sortAllByAdvisor(availability) {
    let adv = {};
    Object.keys(availability).forEach((day) => {
      Object.keys(availability[day]).forEach((bookingTime) => {
        let advId = availability[day][bookingTime];
        if (advId in adv) {
          adv[advId].push(bookingTime);
        } else {
          adv[advId] = [bookingTime];
        }
      });
    });
    return adv;
  }

  renderAdvisorAvailability(advId, bTimes) {
    return (
        <AdvisorAvailability advisorId={advId} bookingTimes={bTimes.sort()}/>
    );
  }

  createTable() {
    let table = [];
    let advisorSorted = this.sortAllByAdvisor(this.props.availability);
    Object.keys(advisorSorted).forEach((advisorId) => {
      table.push(this.renderAdvisorAvailability(advisorId, advisorSorted[advisorId]));
    });
    return table;
  }

  render() {
    return (
        <tbody>
          {this.createTable()}
        </tbody>
    );
  }
}

class AdvisorAvailability extends Component {
  handleClick(advId, dateTime) {
    /*
     * Alright, so it's 10pm Friday night and it's pretty apparent I didn't give myself enough time
     * to finish, so I'm just going to write out my thoughts on what I'm missing here since it's the
     * main piece of functionality I don't have.
     *
     * For starters, this function isn't really in the right place. Ideally, I'd have a container
     * component which would hold state on both the availability table and the bookings table. The
     * handleClick function could be defined there and passed down to the Book buttons through props.
     * At that point it's just a matter of removing the available row, updating a state array with the
     * new booking information, and storing that on the server with something like node-persist.
     *
     * I realize most of your applicants are probably going to return actual functioning projects, but
     * in my defense, I'd just like to say that I knew absolutely nothing about Node, React, or Express
     * coming into this, and got to this point in about 6 solid hours across two days of research and
     * coding. Given that you probably want developers who actually have experience with those languages,
     * that might not be the strongest defense in the world, but at least I'm honest about it, huh?
     *
     * Thanks for considering me,
     * -Peter
     */
  }

  listBookings(bookingTimes) {
    let bookings = [];
    bookingTimes.forEach((dateTime) => {
      bookings.push(<AvailableBookingItem dateTime={dateTime} onClick={() => this.handleClick(this.props.advId, dateTime)}/>);
    });
    return bookings;
  }

  render() {
    return (
        <tr>
          <td>{this.props.advisorId}</td>
          <td>
            <ul className="list-unstyled">
              {this.listBookings(this.props.bookingTimes)}
            </ul>
          </td>
        </tr>
    )
  }
}

function AvailableBookingItem(props) {
  let date = new Date(props.dateTime);
  return (
      <li>
        <time dateTime={props.dateTime} className="book-time">{date.toLocaleString()}</time>
        <button className="book btn-small btn-primary" onClick={props.onClick}>Book</button>
      </li>
  );
}

export default App;
