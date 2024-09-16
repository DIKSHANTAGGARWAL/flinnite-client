import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/tasks.css';

function Tasks() {
  const [taskData, setTaskData] = useState({
    taskTitle: "",
    taskDetails: ""
  });
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState('all');
  const { id } = useParams();

  const addTaskHandler = async () => {
    try {
      const result = await fetch(`${process.env.REACT_APP_server_url}/engage/createTasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskData.taskTitle,
          taskDetails: taskData.taskDetails,
          group: id
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      if (result.status !== 201) {
        console.log("Error happened");
      } else {
        console.log("Task added successfully");
        const newTask = {
          task_id: data.task_id, 
          title: taskData.taskTitle,
          taskDetails: taskData.taskDetails,
          isComplete: false,
        };
        setAllTasks((prevTasks) => [...prevTasks, newTask]);
        setShowPopup(false); 
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const getAllTasks = async () => {
    try {
      const result = await fetch(`${process.env.REACT_APP_server_url}/engage/getTasks`, {
        method: 'POST',
        body: JSON.stringify({ groupId: id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      if (result.status !== 200) {
        console.log("Error happened in finding tasks");
      } else {
        setAllTasks(data.tasks || []);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const filterTasks = (tasks) => {
    switch (filter) {
      case 'completed':
        setFilteredTasks(tasks.filter(task => task.isComplete));
        break;
      case 'noncompleted':
        setFilteredTasks(tasks.filter(task => !task.isComplete));
        break;
      default:
        setFilteredTasks(tasks);
    }
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    await addTaskHandler();
    setTaskData({
      taskTitle: "",
      taskDetails: ""
    });
  };

  const markTaskComplete = async (taskId) => {
    try {
      const result = await fetch(`${process.env.REACT_APP_server_url}/engage/markComplete`, {
        method: 'POST',
        body: JSON.stringify({ taskId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.status === 200) {
        console.log("Task marked as complete");
        setAllTasks(prevTasks =>
          prevTasks.map(task =>
            task.task_id === taskId ? { ...task, isComplete: true } : task
          )
        );
      } else {
        console.log("Error marking task as complete");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    filterTasks(allTasks); 
  }, [filter, allTasks]);

  return (
    <div className="group-container">
      <h1 className="group-header">All Tasks</h1>
      <button className="add-task-btn" onClick={() => setShowPopup(true)}>Add Another Task</button>
      
      <div className="filter-buttons">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>All</button>
        <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => handleFilterChange('completed')}>Completed</button>
        <button className={`filter-btn ${filter === 'noncompleted' ? 'active' : ''}`} onClick={() => handleFilterChange('noncompleted')}>InCompleted</button>
      </div>

      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div key={task.task_id} className={`task-card ${task.isComplete ? 'task-completed' : 'task-pending'}`}>
            <h3 className="task-title">{task.title}</h3>
            <p className="task-details">{task.taskDetails}</p>
            {!task.isComplete && (
              <button
                className="task-complete-btn"
                onClick={() => markTaskComplete(task.task_id)}
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="task-popup-overlay">
          <div className="task-popup">
            <h3 className="popup-header">Add New Task</h3>
            <form onSubmit={submitHandler} className="task-form">
              <input
                type="text"
                name="taskTitle"
                className="task-input-title"
                required
                placeholder="Title"
                onChange={changeHandler}
                value={taskData.taskTitle}
              />
              <textarea
                name="taskDetails"
                className="task-input-details"
                required
                placeholder="Details"
                onChange={changeHandler}
                value={taskData.taskDetails}
              />
              <button type="submit" className="task-submit-btn">Add Task</button>
              <button type="button" className="task-popup-close-btn" onClick={() => setShowPopup(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
