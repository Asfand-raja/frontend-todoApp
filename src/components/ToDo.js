import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { MdDone } from "react-icons/md"

const ToDo = ({ text, date, emoji, completed, updateMode, deleteToDo, toggleComplete }) => {
    return (
        <div className={`todo-item ${completed ? 'completed' : ''}`}>
            <div className="todo-content">
                <div className="todo-left">
                    <div className="todo-icon-wrapper" onClick={toggleComplete}>
                        {completed ? <MdDone className="checked" /> : <div className="circle"></div>}
                    </div>
                    <div className="todo-text-group">
                        <div className="todo-title">
                            {text}
                        </div>
                    </div>
                </div>
                <div className="todo-actions">
                    <BiEdit className='icon edit' onClick={updateMode} />
                    <AiFillDelete className='icon delete' onClick={deleteToDo} />
                </div>
            </div>
        </div>
    )
}

export default ToDo
