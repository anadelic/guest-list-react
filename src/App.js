import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const baseUrl =
    'https://express-guest-list-api-memory-data-store.anadelic.repl.co';

  const [allGuests, setAllGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [refetch, setRefetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // getting all guests
  async function getGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    const guests = await response.json();
    console.log(guests);
    setAllGuests(guests);
    setIsLoading(false);
  }

  // adding a guest
  const addGuest = async function () {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    setAllGuests([...allGuests, createdGuest]);
    setFirstName('');
    setLastName('');
    setRefetch(!refetch);
  };

  // deleting a guest
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = allGuests.filter((guest) => {
      return guest.id !== deletedGuest.id;
    });
    setAllGuests(newGuestList);
    setRefetch(!refetch);
  }

  // toogle attendence
  async function toogleAttendence(id, attending) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    const newUpdatedList = allGuests.filter((guest) => {
      return guest.id !== updatedGuest.id;
    });

    setAllGuests([allGuests], newUpdatedList);
  }

  useEffect(() => {
    getGuests().catch((error) => {
      console.log(error);
    });
  }, [refetch]);

  if (isLoading) {
    return 'Loading...';
  }

  return (
    <div className="mainDiv">
      <h1> My Birthday Party Guest List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          First name
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            disabled={isLoading}
            required
          />
        </label>
        <label>
          Last name
          <input
            value={lastName}
            required
            disabled={isLoading}
            onChange={(e) => setLastName(e.currentTarget.value)}
          />
        </label>
        <button
          onClick={() => {
            addGuest().catch(() => {});
          }}
        >
          Register
        </button>
      </form>

      {allGuests.map((guest) => {
        return (
          <div data-test-id="guest" key={`guests-${guest.id}`}>
            <div>
              {guest.firstName} {guest.lastName}{' '}
            </div>
            <input
              aria-label={`attending status ${guest.firstName} ${guest.lastName}`}
              type="checkbox"
              checked={guest.attending}
              onChange={() => {
                toogleAttendence(guest.id, guest.attending).catch((error) =>
                  console.log(error),
                );
              }}
            />

            <button
              aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
              onClick={() => deleteGuest(guest.id)}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
