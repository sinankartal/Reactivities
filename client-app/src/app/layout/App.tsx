import React, { useState, useEffect, Fragment } from "react";
import { Container, Header, Icon, List, ListItem } from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import { act } from "react-dom/test-utils";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  const handlerSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handlerOpenCreateForm = () =>{
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity : IActivity) =>{
    setActivities([...activities,activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleEditActivity = (activity : IActivity) =>{
    setActivities([...activities.filter(res=>res.id !== activity.id),activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id : string) =>{
    setActivities([...activities.filter(res=>res.id !== id)]);
  }

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        let activities : IActivity[] = [];
        response.data.forEach(activity =>{
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handlerOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handlerSelectActivity}
          selectedActivity = {selectedActivity}
          editMode = {editMode}
          setEditMode = {setEditMode}
          setSelectedActivity = {setSelectedActivity}
          createActivity = {handleCreateActivity}
          editActivity = {handleEditActivity}
          deleteActivity = {handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;