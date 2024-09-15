import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/group.css'
function Group() {
  const [taskData, settaskData] = useState({
    taskTittle: "",
    taskDetails: ""
  });
  const [allTask, setAllTask] = useState([]);
  const { id } = useParams();

  async function addTaskHandler() {
    try {
      const result = await fetch(`http://localhost:5000/engage/createTasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: taskData.taskTittle,
          taskDetails: taskData.taskDetails,
          group: id
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      console.log(data);
      if (result.status != 201) {
        console.log("Error happened");
      } else {
        console.log("Task added successfully");
        await getAllTask();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function getAllTask() {
    try {
      const result = await fetch(`http://localhost:5000/engage/getTasks`, {
        method: 'POST',
        body: JSON.stringify({ groupId:id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      if (result.status!=200) {
         console.log("Error happend in finding task")
      } else {
        setAllTask(data.tasks || []);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const changeHandler = (event) => {
    const { name, value } = event.target;
    settaskData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  async function submitHandler(event) {
    event.preventDefault();
    await addTaskHandler();
    settaskData({
      taskTittle: "",
      taskDetails: ""
    });
  }

  useEffect(() => {
    // Fetch all tasks when the component mounts
    getAllTask();
  }, []);

  return (
    <div className="container">
    <h1>All Tasks</h1>
    <div>
      {allTask.map(task => (
        <div key={task.task_id} className="task">
          <h3>{task.title}</h3>
          <p>{task.taskDetails}</p>
        </div>
      ))}
    </div>
    <form onSubmit={submitHandler}>
      <input
        type="text"
        name="taskTittle"
        required
        placeholder="Title"
        onChange={changeHandler}
        value={taskData.taskTittle}
      />
      <textarea
        name="taskDetails"
        required
        placeholder="Details"
        onChange={changeHandler}
        value={taskData.taskDetails}
      />
      <button type="submit">Add Task</button>
    </form>
  </div>
  );
}

export default Group;
