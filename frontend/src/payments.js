// payments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = ({ flatData, user }) => {
    const [options, setOptions] = useState([]);
    const [people, setPeople] = useState([]);
    const [selected, setSelected] = useState([]);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [description, setdescription] = useState('');

    useEffect(() => {
        const dataRes = async () => {
            try {
                const response = await axios.get(`http://${endpoint}:8080/flatUsers/${flatData.flatID}`);
                setPeople(response.data);
                const temp = response.data.map((person, i) => (
                    <option key={i} value={i}>
                        {person.firstName} {person.lastName}
                    </option>
                ));
                setOptions(temp);
                setSelected([]);
            } catch (error) {
                console.error('Error fetching flat users:', error);
            }
        };
        dataRes();
    }, [flatData.flatID]);

    function removePerson(index) {
        const person = selected[index];
        const personToAddBack = (
            <option key={person.userID} value={people.findIndex(p => p.userID === person.userID)}>
                {person.firstName} {person.lastName}
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
        setSelected([...selected, person]);
        setOptions(options.filter(a => a.props.value !== value));
    }

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://${endpoint}:8080/payments');
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
        try {
            console.log(description)
            for (const person of selected) {
                const response = await axios.post('http://${endpoint}:8080/payments', {
                    paymentID: null,
                    userID: person.userID,
                    amount,
                    payed: false,
                    description
                });
                if (response.status === 201) {
                    console.log(response.data);
                }
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred while posting the payment');
        }
    };

    return (
        <div>
            <h1>Add a Payment</h1>
            <form onSubmit={handleCreatePayment}>
                <label>Amount: </label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
                <label>Description: </label>
                <input type="text" value={description} onChange={e => setdescription(e.target.value)} required />
                <label>Assign user:</label>
                <select id="assign" onChange={addPerson}>
                    <option value="nan">Select Flat Mate</option>
                    {options}
                </select>
                <button type="submit">Create Payment</button>
            </form>
            <h2>Flat Mate's assigned:</h2>
            <div>
                {selected.map((person, index) => (
                    <div key={person.userID} id ="pay">
                        <h3>{person.firstName + ' ' + person.lastName}</h3>
                        <button onClick={() => removePerson(index)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Payment;
