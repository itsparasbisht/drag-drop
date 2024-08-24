import { FormEvent, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newItem = fd.get("new-item");

    if (typeof newItem === "string" && newItem.length > 0) {
      setItems([...items, newItem]);
      (e.target as HTMLFormElement).reset();
    }
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, itemId: string) {
    setIsDragging(itemId);
    e.dataTransfer?.setData("text/plain", itemId);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnd() {
    setIsDragging(null);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const id = event.dataTransfer?.getData("text/plain");
    const element = document.getElementById(id);
    console.log(element);
    if (element) {
      (event.target as HTMLDivElement).appendChild(element);
    }
  }

  return (
    <>
      <form onSubmit={handleAddItem}>
        <input type="text" name="new-item" />
        <button>add item</button>
      </form>

      {items.map((item, i) => (
        <div
          key={i} // should be an actual id
          id={`div-${i}`}
          draggable
          onDragStart={(e) => handleDragStart(e, `div-${i}`)}
          onDragEnd={handleDragEnd}
          className="draggable-div"
          style={{
            border:
              isDragging === `div-${i}`
                ? "2px solid green"
                : "2px solid rgb(255, 225, 0)",
          }}
        >
          {item}
        </div>
      ))}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drop-zone"
      >
        <h3>Drop Zone</h3>
      </div>
    </>
  );
}

export default App;
