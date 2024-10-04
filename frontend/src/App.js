// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './welcome';
import Login from './login';
import SignUp from './signup';
import LoginSuccess from './loginSuccess';
import CreateFlat from './createFlat';
import JoinFlat from './joinFlat';
import Calendar from './calendar';
import Navbar from './navbar';
import Tasks from './tasks';
import Payments from './payments';
import Profile from './profile';

function App() {
  const [user, setUser] = useState(null);
  const [flat, setFlat] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load user and flat from local storage on initial render
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedFlat = JSON.parse(localStorage.getItem('flat'));
    if (storedUser) {
      setUser(storedUser);
      if (storedFlat) {
        setFlat(storedFlat);
        fetchTasks(storedFlat.flatID);
      }
    }
  }, []);

  const fetchTasks = async (flatID) => {
    try {
      const response = await axios.get(`http://${endpoint}:8080/tasks/flatID/${flatID}`);
      const tasksWithUsers = await Promise.all(response.data.map(async task => {
        const assignedUsersResponse = await axios.get(`http://${endpoint}:8080/assigned/task/${task.taskID}`);
        const assignedUsersDetails = await Promise.all(assignedUsersResponse.data.map(async assignment => {
          const userResponse = await axios.get(`http://${endpoint}:8080/user/${assignment.userID}`);
          return `${userResponse.data.firstName}`;
        }));
        return { ...task, assignedUsers: assignedUsersDetails.join(', ') };
      }));
      setTasks(tasksWithUsers);
    } catch (error) {
      console.error('Failed to fetch tasks data', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setFlat(null);
    setTasks([]);
    localStorage.removeItem('user');
    localStorage.removeItem('flat');
  };

  return (
    <div className="App">
      <Router>
        <Navbar user={user} onLogout={handleLogout} onShowCalendar={() => fetchTasks(user?.flatID)} />
        <RouterComponent 
          user={user}
          setUser={setUser}
          flat={flat}
          setFlat={setFlat}
          tasks={tasks}
          setTasks={setTasks}
          onFetchTasks={fetchTasks}
        />
      </Router>
    </div>
  );
}

function RouterComponent({ user, setUser, flat, setFlat, tasks, setTasks, onFetchTasks }) {
  const navigate = useNavigate();

  const handleLoginSuccess = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.flatID === null) {
      navigate('/joinFlat');
    } else {
      try {
        const response = await axios.get(`http://${endpoint}:8080/flat/${userData.flatID}`);
        setFlat(response.data);
        localStorage.setItem('flat', JSON.stringify(response.data));
        await onFetchTasks(userData.flatID);
        navigate('/loginSuccess');
      } catch (error) {
        console.error('Failed to fetch flat data', error);
      }
    }
  };

  const handleSignupSuccess = () => navigate('/');

  const handleCreateFlat = (flatData) =>  {
    setFlat(flatData);
    localStorage.setItem('flat', JSON.stringify(flatData));
    const storedUser = JSON.parse(localStorage.getItem('user'));
    storedUser.flatID = flatData.flatID;
    setUser(storedUser)
    localStorage.setItem('user',JSON.stringify(storedUser));
    navigate('/loginSuccess');
  }


  return (
    <Routes>
      <Route path="/" element={<Welcome onShowLogin={() => navigate('/login')} onShowSignup={() => navigate('/signup')} />} />
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<SignUp onSignUpSuccess={handleSignupSuccess} />} />
      <Route path="/loginSuccess" element={user && flat ? <LoginSuccess user={user} /> : <div>Loading...</div>} />
      <Route path="/createFlat" element={<CreateFlat onCreateSuccess={handleCreateFlat} userData={user} />} />
      <Route path="/joinFlat" element={<JoinFlat createFlat={() => navigate('/createFlat')} joinFlat={handleCreateFlat} userData={user} />} />
      <Route path="/calendar" element={flat ? <Calendar tasksData={tasks} /> : <div>Loading...</div>} />
      <Route path="/tasks" element={flat ? <Tasks flatData={flat} /> : <div>Loading...</div>} />
      <Route path="/payments" element={flat && user ? <Payments flatData={flat} user={user} /> : <div>Loading...</div>} />
      <Route path="/profile" element={user ? <Profile user={user} /> : <div>Loading...</div>} />
    </Routes>
  );
}

export default App;
