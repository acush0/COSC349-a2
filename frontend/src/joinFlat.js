import React, { useState } from 'react';
import axios from 'axios';

const JoinFlat = ({createFlat,joinFlat,userData}) => {
  const [flatID,setFlatID] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://backend.myapp.local:8080/flat/'+flatID);
      if (response.data) {
      const userID = userData.userID;
        await axios.put('http://backend.myapp.local:8080/user/'+userID,{
            userID,
            flatID
        });

        joinFlat(response.data);
      }
    } catch (error) {
      setError('Invalid Flat ID');
    }
  };

    return (
        <div>
          <h2>Join or Create a Flat</h2>
            <form onSubmit={handleJoin}>
                <label>Flat Code:
                </label><input required type="text" value={flatID} onChange={e => setFlatID(e.target.value)}/>
                <button type="submit">Join Flat</button>
                {error && <p>{error}</p>}
            </form>
            <button class="create-flat" onClick={createFlat}>Create Flat</button>
        </div>
    );
};
export default JoinFlat;