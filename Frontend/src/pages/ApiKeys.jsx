import styled from 'styled-components';
import Card from '../components/card';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { IoMdEyeOff } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
const ApiKeys = () => {
  const { currentUser } = useContext(AuthContext);
  const [getapiKeys, setGetApiKeys] = useState([]);
  const [showApiKeysDevto, setShowApiKeysDevto] = useState(false);
  const [showApiKeysMedium, setShowApiKeysMedium] = useState(false);
  const [showApiKeysHashnode, setShowApiKeysHashnode] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/user/apikeys/${
            currentUser?.user.id
          }`,
          {
            withCredentials: true,
            credentials: 'include',
          }
        );

        setGetApiKeys(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchApiKeys();
  }, [currentUser?.user.id]);

  return (
    <ApiKeysContainer>
      <h1>Api Keys</h1>
      {getapiKeys[0]?.DevToToken ? (
        <Card title="Devto Token">
          <Button onClick={() => setShowApiKeysDevto(!showApiKeysDevto)}>
            {' '}
            {showApiKeysDevto ? <IoMdEyeOff /> : <FaEye />}
          </Button>
          {showApiKeysDevto && <p>{getapiKeys[0]?.DevToToken}</p>}
        </Card>
      ) : (
        <Card title="Devto Token">No Devto Api Keys configured yet</Card>
      )}
      {getapiKeys[0]?.MediumToken ? (
        <Card title="Medium Token">
          <Button onClick={() => setShowApiKeysMedium(!showApiKeysMedium)}>
            {' '}
            {showApiKeysMedium ? <IoMdEyeOff /> : <FaEye />}
          </Button>
          {showApiKeysMedium && <p>{getapiKeys[0]?.MediumToken}</p>}
        </Card>
      ) : (
        <Card title="Medium Token">No Medium Api Keys configured yet</Card>
      )}

      {getapiKeys[0]?.HashNodeToken ? (
        <Card title="Hashnode Token">
          <Button onClick={() => setShowApiKeysHashnode(!showApiKeysHashnode)}>
            {' '}
            {showApiKeysHashnode ? <IoMdEyeOff /> : <FaEye />}
          </Button>
          {showApiKeysHashnode && <p>Token: {getapiKeys[0]?.HashNodeToken}</p>}
          {showApiKeysHashnode && (
            <p>Publication Id: {getapiKeys[0]?.HashnodePublicationId}</p>
          )}
        </Card>
      ) : (
        <Card title="Hashnode Token">No Hashnode Api Keys configured yet</Card>
      )}
    </ApiKeysContainer>
  );
};

export default ApiKeys;

const ApiKeysContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  justify-content: center;
  margin: 0 auto;
  gap: 20px;

  h1 {
    font-size: 1.5em;

    color: #333;
  }

  p {
    font-size: 1em;
    color: #666;
    margin-top: 5px;
  }
`;
