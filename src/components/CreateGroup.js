import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "../css/createGroup.css"

const GroupForm = () => {
    const [formData, setFormData] = useState({
        groupName: "",
        members: [] // Holds selected member IDs
    });
    const [users, setUsers] = useState([]); // Holds fetched users
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const email = localStorage.getItem("userEmail");
            let result = await fetch(`http://localhost:5000/auth/getUsers`, {
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
                setUsers(result.data); // Set fetched users
            }
        };

        fetchUsers();
    }, [navigate]);

    const changeHandler = (event) => {
        const { name, options } = event.target;
    
        if (name === "members") {
            const selectedUsers = Array.from(options)
                .filter(option => option.selected)
                .map(option => ({
                    userId: option.value,
                    userName: option.getAttribute('user_name')
                }));
    
            // Combine new selections with the existing members
            setFormData(prevFormData => {
                // Merge the new selected users with the previous members
                const newMembers = [...prevFormData.members, ...selectedUsers]
                    .reduce((acc, curr) => {
                        // Remove duplicates by ensuring unique userId in the final list
                        if (!acc.some(user => user.userId === curr.userId)) {
                            acc.push(curr);
                        }
                        return acc;
                    }, []);
                    
                return {
                    ...prevFormData,
                    members: newMembers // Now contains objects with userId and userName
                };
            });
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: event.target.value
            }));
        }
    };
    
    const createGroup =async ()=>{
        const email = localStorage.getItem("userEmail");
            let result = await fetch(`http://localhost:5000/engage/addGroup`, {
                method: 'POST',
                body: JSON.stringify({ email,groupName:formData.groupName,members:formData.members.userId }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            result = await result.json();

            if (result.status === 404) {
                console.log("Error happened");
            } else {
               console.log("Group created successfully")
            }
    }
    const submitHandler =async(event)=>{
        event.preventDefault();
        console.log(formData);
        await createGroup();
    }
    return (
        <form onSubmit={submitHandler} className="group-form">
        <label htmlFor="groupName" className="group-form__label">Group Name:</label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={formData.groupName}
          onChange={changeHandler}
          className="group-form__input"
        />
  
        <h4 className="group-form__title">Select Members:</h4>
        <select
          name="members"
          multiple={true}
          value={formData.members.map(member => member.userId)}
          onChange={changeHandler}
          className="group-form__select"
        >
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id} user_name={user.name}>
              {user.name} ({user.email})
            </option>
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