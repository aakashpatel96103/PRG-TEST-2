import React, {useEffect, useState} from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [token,setToken]=useState(localStorage.getItem("token")||"");
  const [login,setLogin]=useState({username:"admin",password:"admin123"});
  const [employees,setEmployees]=useState([]);
  const [form,setForm]=useState({name:"",email:"",department:"IT",position:"Developer"});
  const [editing,setEditing]=useState(null);
  const [message,setMessage]=useState("");

  async function doLogin(e){
    e.preventDefault();
    const r=await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(login)});
    const d=await r.json();
    if(r.ok){localStorage.setItem("token",d.access_token);setToken(d.access_token);setMessage("Login successful");}
    else setMessage(d.detail||"Login failed");
  }

  async function load(){
    const r=await fetch(`${API}/employees`,{headers:{Authorization:`Bearer ${token}`}});
    if(r.ok)setEmployees(await r.json());
  }

  useEffect(()=>{if(token)load()},[token]);

  async function save(e){
    e.preventDefault();
    const method=editing?"PUT":"POST";
    const url=editing?`${API}/employees/${editing}`:`${API}/employees`;
    const r=await fetch(url,{method,headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
    const d=await r.json();
    if(r.ok){setMessage(editing?"Employee updated":"Employee added");setEditing(null);setForm({name:"",email:"",department:"IT",position:"Developer"});load();}
    else setMessage(d.detail||"Operation failed");
  }

  async function remove(id){
    if(!confirm("Delete this employee?")) return;
    await fetch(`${API}/employees/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});
    load();
  }

  if(!token) return <div className="login"><form onSubmit={doLogin}><h1>Employee Management</h1><input value={login.username} onChange={e=>setLogin({...login,username:e.target.value})} placeholder="Username"/><input type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} placeholder="Password"/><button>Login</button><p>{message}</p><small>Demo login: admin / admin123</small></form></div>;

  return <div className="container">
    <header><h1>Employee Management System</h1><button onClick={()=>{localStorage.removeItem("token");setToken("")}}>Logout</button></header>
    <p className="message">{message}</p>
    <form className="card" onSubmit={save}><h2>{editing?"Update":"Add"} Employee</h2>
      <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input required placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/>
      <input required placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/>
      <button>{editing?"Update":"Add Employee"}</button>
      {editing && <button type="button" onClick={()=>{setEditing(null);setForm({name:"",email:"",department:"IT",position:"Developer"})}}>Cancel</button>}
    </form>
    <div className="card"><h2>Employees</h2><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Actions</th></tr></thead><tbody>
    {employees.map(x=><tr key={x.id}><td>{x.id}</td><td>{x.name}</td><td>{x.email}</td><td>{x.department}</td><td>{x.position}</td><td><button onClick={()=>{setEditing(x.id);setForm({name:x.name,email:x.email,department:x.department,position:x.position})}}>Edit</button> <button onClick={()=>remove(x.id)}>Delete</button></td></tr>)}
    </tbody></table></div>
  </div>
}
