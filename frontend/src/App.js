import "./App.css";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Booking King</h1>
      </header>
      <section>
        <ChatRoom />
      </section>
    </div>
  );
}

export default App;
