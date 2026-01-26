import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { MdDone } from "react-icons/md"

const ToDo = ({ id, text, date, emoji, completed, updateMode, deleteToDo, toggleComplete }) => {
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-left">
          <div className="todo-icon-wrapper" onClick={() => toggleComplete(id)}>
            {completed ? <MdDone className="checked" /> : <div className="circle"></div>}
          </div>
          <div className="todo-text-group">
            <div className="todo-title">{text}</div>
            {date && <div className="todo-date">{date}</div>}
          </div>
        </div>
        <div className="todo-actions">
          <BiEdit className="icon edit" onClick={() => updateMode(id)} />
          <AiFillDelete className="icon delete" onClick={() => deleteToDo(id)} />
        </div>
      </div>
    </div>
  );
};
export default ToDo;
