import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupForm = () => {
    const [formData, setFormData] = useState({
        groupName: "",
        members: [] // Holds selected member IDs
    });
    const [users, setUsers] = useState([]); // Holds fetched users
    const[email,setEmail]=useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const email = localStorage.getItem("userEmail");
            setEmail(email)
            if(!email){
                navigate('/login')
            }
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
                .map(option => option.value);
    
            // Ensure members array includes all selected users
            setFormData(prevFormData => {
                const newMembers = new Set([...prevFormData.members, ...selectedUsers]);
                return {
                    ...prevFormData,
                    members: Array.from(newMembers)
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
                body: JSON.stringify({ email,groupName:formData.groupName,members:formData.members }),
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
        await createGroup();
    }
    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="groupName">Group Name:</label>
            <input
                type="text"
                id="groupName"
                name="groupName"
                value={formData.groupName}
                onChange={changeHandler}
            />

            <h4>Select Members:</h4>
            <select
                name="members"
                multiple={true}
                value={formData.members}
                onChange={changeHandler}
                style={{ width: '200px', height: '100px' }}
            >
                {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                        {user.name} ({user.email})
                    </option>
                ))}
            </select>

            <div>
                <h4>Selected Members:</h4>
                <ul>
                    {formData.members.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            </div>

            <button type='submit'>Submit</button>
        </form>
    );
};

export default GroupForm;