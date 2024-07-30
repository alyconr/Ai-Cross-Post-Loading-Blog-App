import styled from "styled-components";
import Card from "../components/card";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

const ApiKeys = () => {
  const { currentUser } = useContext(AuthContext);
  const [getapiKeys, setGetApiKeys] = useState([]);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/v1/user/apikeys/${currentUser?.user.id}`,
          {
            withCredentials: true,
            credentials: "include",
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
          <p>{getapiKeys[0]?.DevToToken}</p>
        </Card>
      ) : (
        <Card title="Devto Token">No Devto Api Keys configured yet</Card>
      )}
      {getapiKeys[0]?.MediumToken ? (
        <Card title="Medium Token">
          <p>{getapiKeys[0]?.MediumToken}</p>
        </Card>
      ) : (
        <Card title="Medium Token">No Medium Api Keys configured yet</Card>
      )}

      {getapiKeys[0]?.HashNodeToken ? (
        <Card title="Hashnode Token">
          <p>{getapiKeys[0]?.HashNodeToken}</p>
          <p>{getapiKeys[0]?.HashnodePublicationId}</p>
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
  width: 50%;
  justify-content: center;
  margin: 0 auto;
  gap: 20px;

  h1 {
    font-size: 1.5em;

    color: #333;
  }
`;
