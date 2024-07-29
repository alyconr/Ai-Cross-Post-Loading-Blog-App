import styled from "styled-components";
import Card from "../components/card";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

const ApiKeys = () => {
  const { currentUser } = useContext(AuthContext);
  const [getapiKeys, setGetApiKeys] = useState([]);
  console.log("apikeys", getapiKeys);
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
      <Card title="Devto Token">
        {getapiKeys &&
          getapiKeys.map((getapiKeys) => <p>{getapiKeys?.DevToToken}</p>)}
      </Card>
      <Card title="Medium Token">
        {getapiKeys &&
          getapiKeys.map((getapiKeys) => <p>{getapiKeys?.MediumToken}</p>)}
      </Card>

      <Card title="Hashnode Token">
        {getapiKeys &&
          getapiKeys.map((getapiKeys) => (
            <div>
              <p>{getapiKeys?.HashNodeToken}</p>
              <p>{getapiKeys?.HashnodePublicationId}</p>
            </div>
          ))}
      </Card>
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
