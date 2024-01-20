const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-PT-SF/events";

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");

async function render() {
  await getEvents();
  renderEvents();
}

render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No Events</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <p>${event.date}</p>
            <p>${event.location}</p>
            <button id="deleteBtn" data-id="${event.id}">Delete Event</button>
        `;
    return li;
  });

  eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: new Date(addEventForm.date.value).toISOString(),
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to Create Event");
    }
    console.log(response);
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-FSA-ET-PT-SF/events/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error(error);
  }
}

addEventForm.addEventListener("submit", addEvent);

document.addEventListener("click", async function (event) {
  if (event.target && event.target.id === "deleteBtn") {
    const eventId = event.target.getAttribute("data-id");

    if (eventId) {
      await deleteEvent(eventId);
      render();
    }
  }
});
