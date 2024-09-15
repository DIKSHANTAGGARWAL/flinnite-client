import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {CreateGroup} from './CreateGroup'
import '../css/Home.css'

function Home() {
    const navigate=useNavigate()
    
    useEffect(() => {
        const email = localStorage.getItem('userEmail')
        if (!email) {
            // alert("Please Login")
            navigate('/login')
        }

        getGroups();
    }, [])

    const [groups,setGroups]=useState([''])
    const [users,setUsers]=useState([''])


    const getGroups = async () => {
        // console.log("groups ");
        const email = localStorage.getItem("userEmail")
        let result = await fetch(`http://localhost:5000/engage/getGroups`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        result = await result.json();
        console.log(result)

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
    
    function toGroup(id){
        navigate(`/group/${id}`)
    }

    function e(item,index){
        return(
            <div onClick={()=>toGroup(item.group_id)} className='home-group' >
                <h2>{item.name}</h2>
            </div>
        )
    }
    function makeGroup(){
        navigate("createGroup");
    }

    function logout(){
        localStorage.clear()
        window.location.reload()
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

      <button onClick={makeGroup}>Add Group</button>
      <button onClick={logout}>Logout</button>

    </div>
  )
}

export default Home
