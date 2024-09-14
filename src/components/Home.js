import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate=useNavigate()
    
    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        if (!email) {
            alert("Please Login")
            navigate('/login')
        }

        getGroups();
    }, [])

    const [groups,setGroups]=useState([''])
    const [users,setUsers]=useState([''])


    const getGroups = async () => {
        const email = localStorage.getItem("userEmail")
        let result = await fetch(`http://localhost:5000/engage/getGroups`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        if (result.status == 404) {
            alert(result.message)
            localStorage.removeItem("userEmail")
            navigate('/')
            window.location.reload();
        } else {
            setGroups(result.data)
        }
    }

    const getUsers = async () => {
        const email = localStorage.getItem("userEmail")
        let result = await fetch(`http://localhost:5000/auth/getUsers`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        if (result.status == 404) {
            alert(result.message)
            localStorage.removeItem("userEmail")
            navigate('/')
            window.location.reload();
        } else {
            setUsers(result.data)
        }
    }
    
    
    function e(index,item){
        <h2>{item.name}</h2>
    }
    return (
    <div>
      <h1>My Teams</h1>
      <p>My Groups</p>
      <div>
        {
            groups.map(e)
        }
      </div>

      <button>Add Group</button>

    </div>
  )
}

export default Home
