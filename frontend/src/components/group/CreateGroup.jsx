import React, { useState } from "react";
import Card from "./card/Card";
import IconButton from "../common/IconButton";
import { PlusCircle } from "lucide-react";
import GroupForm from "./GroupForm";

const CreateGroup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const handleGroupCreated = (name) => {
    setGroups((prev) => [...prev, name]);
  };

  return (
    <>
      <Card.Header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <Card.Title className="text-base sm:text-lg">
              Your Groups
            </Card.Title>
            <Card.Description className="text-sm">
              Click on any group to start collaborating
            </Card.Description>
          </div>
          <IconButton
            icon={PlusCircle}
            isLoading={false}
            onClick={() => setIsOpen(true)}
          >
            Create Group
          </IconButton>
        </div>
      </Card.Header>


      <GroupForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </>
  );
};

export default CreateGroup;
