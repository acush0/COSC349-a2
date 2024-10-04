import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoginSuccess = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [tasksDisplay, setTasksDisplay] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.userID) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://${endpoint}:8080/user/${user.userID}`);
          setUserData(response.data);

          await fetchTasks(user.userID);  // Fetch tasks here
        } catch (error) {
          setError('Failed to fetch user data: ' + error);
        }
      };

      const fetchPaymentData = async () => {
        try {
          const response = await axios.get(`http://${endpoint}:8080/payments/userID/${user.userID}`);
          const updatedPayments = await Promise.all(response.data.map(async (payment) => {
            const userDetail = await fetchUserDetails(payment.userID);
            if (userDetail) {
              return { ...payment, userDetails: userDetail };
            }
            return payment;
          }));
          setPayments(updatedPayments);
        } catch (error) {
          console.log(error);
          setError('Failed to fetch payment data');
        }
      };

      const fetchUserDetails = async (userID) => {
        try {
          const response = await axios.get(`http://${endpoint}:8080/user/${userID}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching user details:", error);
          return null;
        }
      };

      const fetchData = async () => {
        setLoading(true);
        await fetchUserData();
        await fetchPaymentData();
        setLoading(false);
      };

      fetchData();
    }
  }, [user]);

  const fetchTasks = async (userID) => {
    try {
      const tasksResponse = await axios.get(`http://${endpoint}:8080/tasks/userID/${userID}`);
      const temp = tasksResponse.data
        .filter(task => !task.completed)  // Filter out completed tasks
        .map((task) => (
          <div key={task.taskID}>
            <h2>{task.taskName}: <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskCheckboxChange(task.taskID, task.completed)}
            /></h2>
            <h3>{task.description}</h3>
            <h3>by: {task.requestedDate.substring(0, 10)}</h3>
          </div>
        ));
      setTasksDisplay(temp);
    } catch (error) {
      setError('Failed to fetch tasks data: ' + error);
    }
  };

  const handleCheckboxChange = async (paymentID, currentStatus) => {
    try {
      await axios.put(`http://${endpoint}:8080/payments/${paymentID}`, !currentStatus, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPayments(payments.filter(payment =>
        payment.paymentID !== paymentID
      ));
    } catch (error) {
      console.error('Error updating payment status', error);
      setError('An error occurred while updating the payment status');
    }
  };

  const handleTaskCheckboxChange = async (taskID, currentStatus) => {
    try {
      // Fetch the current task details
      const taskResponse = await axios.get(`http://${endpoint}:8080/tasks/${taskID}`);
      const task = taskResponse.data;
  
      // Update the completed status
      const updatedTask = { ...task, completed: !currentStatus };
  
      // Send the PUT request with the updated task object
      await axios.put(`http://${endpoint}:8080/tasks/${taskID}`, updatedTask, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Re-fetch tasks after updating
      await fetchTasks(user.userID);
    } catch (error) {
      console.error('Error updating task status', error);
      setError('An error occurred while updating the task status');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {userData ? (
            <>
              <h1>Welcome back, {userData.firstName} {userData.lastName}!</h1>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
          {error && <p>{error}</p>}
          <h1 id="pad">Current tasks:</h1>
          {tasksDisplay}
          <h1 id="pad">Payments:</h1>
          <div>
            {payments.filter(payment => !payment.payed).map(payment => (
              <div key={payment.paymentID} id="pay">
                <span>Amount: ${payment.amount} </span>
                <span>- {payment.description}</span>
                <input
                  type="checkbox"
                  checked={payment.payed}
                  onChange={() => handleCheckboxChange(payment.paymentID, payment.payed)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSuccess;
