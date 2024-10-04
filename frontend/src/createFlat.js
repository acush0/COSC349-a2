import React, { useState } from 'react';
import axios from 'axios';
import endpoint from './key';

const CreateFlat = ({ onCreateSuccess,userData }) => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    const handleCreateFlat = async (e) => {
        e.preventDefault();
        try {
            const userID = userData.userID;
            const response = await axios.post(`http://${endpoint}:8080/flat/create`, {
                flatID:null,
                address,
                host:userID,
                name
            });
            if (response.status === 201) {
                onCreateSuccess(response.data);
            }
        } catch (error) {
            console.log(error)
            setError('An error occurred while creating the flat');
        }
    };
    return (
        <div>
            <h2>Create Flat</h2>
            <form onSubmit={handleCreateFlat}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <button type="submit">Create Flat</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default CreateFlat;