import { useEffect, useState, useReducer, Children } from "react";
import Gun from "gun";

// initialize gun locally
const gun = Gun({
  peers: ["http://localhost:3030/gun"],
});

const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  };
}

export default function App() {
  const [name, setName] = useState();
  const [message, setMessage] = useState();
  let data = [];
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const msg = gun.get("dataku");
    msg.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const msg = gun.get("dataku");
    msg.set({
      name: name,
      message: message,
      createdAt: Date.now(),
    });
    setName("");
    setMessage("");
    // setForm({
    //   name: '', message: ''
    // })
  }

  return (
    <div className="p-10">
      <div className="flex flex-row">
        <input
          className="border border-2 rounded-md p-3 border-blue-200 mr-3"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          name="name"
          value={name}
        />
        <input
          className="border border-2 rounded-md p-3 border-blue-200 mr-3"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          name="message"
          value={message}
        />

        <button
          className="bg-blue-500 rounded-md text-white p-3 hover:scale-105"
          onClick={saveMessage}
        >
          Send Message
        </button>
      </div>
      <div className="my-5 rounded-xl">
        {Children.toArray(
          state.messages.map((message) => {
            console.log(message);
            return (
              <div className="bg-gray-200 p-5 rounded-md my-2">
                <h2 className="text-lg font-bold text-blue-700">
                  {message.message}
                </h2>
                <h3>From: {message.name}</h3>
                <p>Date: {message.createdAt}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
