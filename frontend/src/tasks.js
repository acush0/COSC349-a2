import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tasks = ({ flatData }) => {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [people, setPeople] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [requestedDate, setRequestedDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const dataRes = async () => {
            try {
                const response = await axios.get('http://backend.myapp.local:8080/flatUsers/' + flatData.flatID);
                console.log(response.data);
                setPeople(response.data);
                const temp = response.data.map((person, i) => (
                    <option key={i} value={i}>
                        {person.firstName + ' ' + person.lastName}
                    </option>
                ));
                setOptions(temp);
                setSelected([]);
            } catch (error) {
                console.error('Error fetching flat users:', error);
                setError('Failed to load flat users.');
            }
        };
        dataRes();
    }, [flatData.flatID]);

    function removePerson(index) {
        const personIndex = selected[index];
        const person = people[personIndex];
        const personToAddBack = (
            <option key={person.userID} value={personIndex}>
                {person.firstName + ' ' + person.lastName}
            </option>
        );

        setOptions(prevOptions => [...prevOptions, personToAddBack]);
        setSelected(selected.filter((_, i) => i !== index));
    }

    function addPerson(event) {
        const value = parseInt(event.target.value);
        event.target.value = 'nan';
        if (isNaN(value)) {
            return;
        }

        const person = people[value];
        setSelected([...selected, value]);
        setOptions(options.filter(option => parseInt(option.props.value) !== value));
    }

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://backend.myapp.local:8080/tasks', {
                taskID: null,
                taskName,
                description,
                requestedDate: requestedDate + "T00:00",
                flatID: flatData.flatID,
                completed: false
            });
            if (response.status === 201) {
                for (const index of selected) {
                    const person = people[index];
                    await axios.post('http://backend.myapp.local:8080/assigned', {
                        taskID: response.data.taskID,
                        userID: person.userID
                    });
                }
                // Clear the form and selections after task creation
                setTaskName('');
                setDescription('');
                setRequestedDate('');
                setSelected([]);
                // Optionally, refetch people to reset options
                const peopleResponse = await axios.get('http://backend.myapp.local:8080/flatUsers/' + flatData.flatID);
                setPeople(peopleResponse.data);
                const temp = peopleResponse.data.map((person, i) => (
                    <option key={i} value={i}>
                        {person.firstName + ' ' + person.lastName}
                    </option>
                ));
                setOptions(temp);
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred while creating the task');
        }
    };

    return (
        <div>
            <h1>Add a Task</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCreateTask}>
                <label>Name: </label>
                <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} required />
                <label>Description: </label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                <label>Date: </label>
                <input type="date" value={requestedDate} onChange={e => setRequestedDate(e.target.value)} required />
                <label>Assign task:</label>
                <select id="assign" onChange={addPerson}>
                    <option value="nan">Select Flat Mate</option>
                    {options}
                </select>
                <button type="submit">Create Task</button>
            </form>
            <h2>Flat Mate's assigned:</h2>
            <div>
                {selected.map((index) => {
                    const person = people[index];
                    return (
                        <div key={person.userID} id = "pay">
                            <h3>{person.firstName + ' ' + person.lastName}</h3>
                            <button onClick={() => removePerson(index)}>Remove</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Tasks;
