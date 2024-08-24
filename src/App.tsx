import { FormEvent, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [items, setItems] = useState<{ id: string; value: string }[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dropZoneItems, setDropZoneItems] = useState<
    { id: string; value: string }[]
  >([]);

  function handleAddItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newItem = fd.get("new-item");

    if (typeof newItem === "string" && newItem.length > 0) {
      const data = {
        id: uuidv4() as string,
        value: newItem,
      };

      setItems([...items, data]);
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

    if (element) {
      const itemId = id.replace("div-", "");

      const item = items.find((item) => item.id === itemId);

      if (item) {
        setDropZoneItems((prevItems) => [...prevItems, item]);
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    }
  }

  function handleCancel(itemId: string) {
    const item = dropZoneItems.find((item) => item.id === itemId);
    if (item) {
      setItems((prevItems) => [...prevItems, item]);
      setDropZoneItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      setIsDragging(null);
    }
  }

  return (
    <>
      <form onSubmit={handleAddItem}>
        <input type="text" name="new-item" />
        <button>add item</button>
      </form>

      {items.map((item) => (
        <div
          key={item.id}
          id={`div-${item.id}`}
          draggable
          onDragStart={(e) => handleDragStart(e, `div-${item.id}`)}
          onDragEnd={handleDragEnd}
          className="draggable-div"
          style={{
            border:
              isDragging === `div-${item.id}`
                ? "2px solid green"
                : "2px solid rgb(255, 225, 0)",
            opacity: isDragging === `div-${item.id}` ? 0.5 : 1, // Make the item semi-transparent while dragging
          }}
        >
          {item.value}
        </div>
      ))}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drop-zone"
      >
        <h2>Drop Zone</h2>
        {dropZoneItems.map((item) => (
          <div key={item.id} className="drop-zone-item">
            {item.value}
            <button
              onClick={() => handleCancel(item.id)}
              className="cancel-btn"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
