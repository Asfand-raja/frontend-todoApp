import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";

const ToDo = ({
  id,
  text,
  ongoingDate,
  lastDate,
  emoji,
  completed,
  priority,
  updateMode,
  deleteToDo,
  toggleComplete,
}) => {
  const getPriorityColor = (level) => {
    if (level === "High") return "#ff5252";
    if (level === "Medium") return "#ffca28";
    if (level === "Low") return "#00aaff";
    return "#ccc";
  };

  return (
    <div
      className="todo-item"
      style={{
        background: completed ? "#e0e0e0" : "#b0b0b0", // light grey if done, grey if not
        border: completed ? "2px solid #28a745" : "2px solid #b0b0b0", // green border if done
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "16px",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
    >
      {/* Top row: Done checkbox + Task name + Priority */}
      <div
        className="todo-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleComplete();
            }}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: completed ? "none" : "2px solid #1e272e",
              background: completed ? "#28a745" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transition: "all 0.3s",
            }}
          >
            {completed && <MdDone />}
          </div>

          <div
            style={{
              fontWeight: "700",
              fontSize: "1rem",
              textDecoration: completed ? "line-through" : "none",
              color: completed ? "#555" : "#1e272e",
            }}
          >
            {emoji} {text}
          </div>
        </div>

        {priority && (
          <div
            style={{
              background: getPriorityColor(priority),
              color: "#fff",
              fontSize: "0.75rem",
              padding: "4px 8px",
              borderRadius: "12px",
              fontWeight: "700",
            }}
          >
            {priority}
          </div>
        )}
      </div>

      {/* Bottom row: Dates + Edit/Delete icons */}
      <div
        className="todo-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
          color: "#5d6d7e",
        }}
      >
        <div>
          <span>Start: {ongoingDate || "—"}</span> |{" "}
          <span>Due: {lastDate || "—"}</span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <BiEdit
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              updateMode();
            }}
          />
          <AiFillDelete
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              deleteToDo();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToDo;
