import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            navigate('/login');
        }
        getGroups();
    }, []);

    const [groups, setGroups] = useState([]);

    const getGroups = async () => {
        const email = localStorage.getItem("userEmail");
        let result = await fetch(`${process.env.REACT_APP_server_url}/engage/getGroups`, {
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
            setGroups(result.data);
        }
    };

    const toGroup = (id) => {
        navigate(`/group/${id}`);
    };

    const renderGroup = (item) => (
        <div key={item.group_id} onClick={() => toGroup(item.group_id)} className='home-group'>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
        </div>
    );

    const makeGroup = () => {
        navigate("createGroup");
    };

    const logout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to My Teams</h1>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </header>

            <section className="group-section">
                <h2>My Groups</h2>
                <div className="group-grid">
                    {groups.length > 0 ? (
                        groups.map(renderGroup)
                    ) : (
                        <p className="no-groups">No groups available. Create a new one!</p>
                    )}
                </div>
                <button className="add-group-btn" onClick={makeGroup}>+ Create New Group</button>
            </section>
        </div>
    );
}

export default Home;
