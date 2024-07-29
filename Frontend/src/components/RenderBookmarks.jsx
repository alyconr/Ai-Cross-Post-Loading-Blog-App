import Card from "./card";
import styled from "styled-components";
import followerUser from "../assets/follower.png";
import { Link } from "react-router-dom";

const RenderBookmarks = ({ bookmarks }) => (
  <BookmarksContainer>
    {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
      bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <BookmarkItem>
            <BookmarkImage src={bookmark.image} />
            <BookmarkInfo>
              <BookmarkTitle>{bookmark.title}</BookmarkTitle>
              <BookmarkDescription></BookmarkDescription>
              <BookmarkAuthor> By {bookmark.author_fullname}</BookmarkAuthor>
            </BookmarkInfo>
            <Link
              className="btn btn-dark btn-sm btn-block "
              to={`/singlepost/${bookmark.id}/title=${encodeURIComponent(
                bookmark.title.replace(/ /g, "-")
              )}`}
            >
              {" "}
              <Button className="text-white">Read More</Button>
            </Link>
          </BookmarkItem>
        </Card>
      ))
    ) : (
      <p>No bookmarks to display</p>
    )}
  </BookmarksContainer>
);

export default RenderBookmarks;

const BookmarksContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 50px;
  gap: 20px;
`;

const BookmarkItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BookmarkImage = styled.img`
  width: 200px;
  height: 150px;
  border-radius: 8px;
  margin-right: 15px;
  margin: 0 30px;
`;

const BookmarkTitle = styled(Link)`
  font-size: 1.1em;
  margin: 10px 0;
  font-weight: bold;
  color: #333;
  text-decoration: none;
`;

const BookmarkInfo = styled.div`
  display: flex;
  flex-direction: column;
  a {
    font-weight: bold;
    color: #333;
    text-decoration: none;
    margin-bottom: 5px;
  }

  span {
    font-size: 0.9em;
    color: #666;
  }
`;

const BookmarkAuthor = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;

const BookmarkDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
`;

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
