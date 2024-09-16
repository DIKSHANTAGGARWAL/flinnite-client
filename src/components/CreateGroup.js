import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/createGroup.css";
import toast from "react-hot-toast";


const GroupForm = () => {
  const [formData, setFormData] = useState({
    groupName: "",
    members: [] 
  });
  const [users, setUsers] = useState([]); 
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const email = localStorage.getItem("userEmail");
      let result = await fetch(`${process.env.REACT_APP_server_url}/auth/getUsers`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      result = await result.json();

      if (result.status === 404) {
        alert(result.message);
        localStorage.removeItem("userEmail");
        navigate('/');
        window.location.reload();
      } else {
        const fetchedUsers = result.data;
        setUsers(fetchedUsers);

        const loggedInUser = fetchedUsers.find(user => user.email === email);
        setLoggedInUser(loggedInUser);

        setFormData(prevFormData => ({
          ...prevFormData,
          members: loggedInUser ? [{ userId: loggedInUser.user_id, userName: loggedInUser.name }] : []
        }));
      }
    };

    fetchUsers();
  }, [navigate]);

  const changeHandler = (event) => {
    const { name, options } = event.target;
  
    if (name === "members") {
      const selectedUserIds = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
  
      setFormData(prevFormData => {
        let updatedMembers = [...prevFormData.members];
  
        selectedUserIds.forEach(userId => {
          const isAlreadySelected = updatedMembers.some(member => member.userId === userId);
          if (isAlreadySelected) {
            updatedMembers = updatedMembers.filter(member => member.userId !== userId);
          } else {
            const newUser = users.find(user => user.user_id === userId);
            if (newUser) {
              updatedMembers.push({ userId: newUser.user_id, userName: newUser.name });
            }
          }
        });
  
        return {
          ...prevFormData,
          members: updatedMembers 
        };
      });
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: event.target.value
      }));
    }
  };
  
  const createGroupToast = () =>
    toast.promise(createGroup(), {
        loading: "Creating New Group...",
        success: (result) => result.message,
        error: (result) => result.message,
    });

  const createGroup = async () => {
    const email = localStorage.getItem("userEmail");
    let result = await fetch(`${process.env.REACT_APP_server_url}/engage/addGroup`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        groupName: formData.groupName,
        members: formData.members.map(member => member.userId) 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    result = await result.json();

    if (result.status === 404) {
      console.log("Error happened");
      throw new Error(result.message);
    } else {
      console.log("Group created successfully");
      navigate('/')
    }
    return result;

  }

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
    await createGroupToast();
    setFormData({
      groupName: "",
      members: loggedInUser ? [{ userId: loggedInUser.user_id, userName: loggedInUser.name }] : []
    });
  }

  return (
    <form onSubmit={submitHandler} className="group-form">
      <label htmlFor="groupName" className="group-form__label">Group Name:</label>
      <input
        type="text"
        id="groupName"
        name="groupName"
        required
        value={formData.groupName}
        onChange={changeHandler}
        className="group-form__input"
      />

      <h4 className="group-form__title">Select Members:</h4>
      <select
        name="members"
        multiple
        required
        value={formData.members.map(member => member.userId)}
        onChange={changeHandler}
        className="group-form__select"
      >
        {users.map((user) => (
          user.email !== localStorage.getItem("userEmail") && (
            <option
              key={user.user_id}
              value={user.user_id}
              user_name={user.name}
              disabled={loggedInUser && user.user_id === loggedInUser.user_id}
            >
              {user.name} ({user.email})
            </option>
          )
        ))}
      </select>

      <div>
        <h4 className="group-form__selected-title">Selected Members:</h4>
        <ul className="group-form__selected-list">
          {formData.members.map((member, index) => (
            <li key={index} className="group-form__selected-item">
              {member.userName}
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" className="group-form__button">Submit</button>
    </form>
  );
};

export default GroupForm;
