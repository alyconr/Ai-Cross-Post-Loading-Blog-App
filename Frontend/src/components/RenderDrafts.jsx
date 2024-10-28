import Card from "./card";
import styled from "styled-components";
import { Link } from "react-router-dom";

const RenderDrafts = ({ drafts }) => {
  return (
    <DraftPostsContainer>
      {drafts.length > 0 ? (
        drafts.map((draft) => (
          <Card key={draft.draft_id}>
            <DraftPostItem>
              <DraftPostTitle>{draft.title}</DraftPostTitle>
              {draft.image && (
                <DraftPostImage src={draft.image} alt={draft.image} />
              )}
              <DraftPostDescription>{draft.description}</DraftPostDescription>
              <Button>
                <Link to={`/write?draftId=${draft.draft_id}`}>
                  Continue Writing
                </Link>
              </Button>
            </DraftPostItem>
          </Card>
        ))
      ) : (
        <p>No   Draft posts to display</p>
      )}
    </DraftPostsContainer>
  );
};

export default RenderDrafts;

const Button = styled.button`
  background: radial-gradient(
    circle at 12.3% 19.3%,
    rgb(85, 88, 218) 0%,
    rgb(95, 209, 249) 100.2%
  );
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 20px;

  a {
    color: white;
    text-decoration: none;
  }
`;

const DraftPostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const DraftPostItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const DraftPostImage = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const DraftPostTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const DraftPostDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;
