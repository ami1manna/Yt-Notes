// components/groupdetails/GroupDetailsBody.jsx
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Card from "../common/Card";

const GroupDetailsBody = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const handleNavigate = (subRoute) => {
    navigate(`/groups/${groupId}/${subRoute}`);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="flex gap-4 px-4 py-2">
        <button onClick={() => handleNavigate("overview")}>Overview</button>
        <button onClick={() => handleNavigate("activity")}>Activity</button>
        <button onClick={() => handleNavigate("playlists")}>Playlists</button>
        <button onClick={() => handleNavigate("members")}>Members</button>
        <button onClick={() => handleNavigate("notes")}>Notes</button>
      </Card>

      <Outlet />
    </div>
  );
};

export default GroupDetailsBody;
