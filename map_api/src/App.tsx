import SimpleMap from "./components/SimpleMap";
import "./index.css";

function App() {
  return (
    <>
      <div className="pt-18 space-y-6 lg:mx-24 mb-12">
        <div className="text-2xl text-dark font-bold text-center">
          THEE JAY MAPS
        </div>
        <div className="mx-12">
          <SimpleMap />
        </div>
      </div>
    </>
  );
}

export default App;
