import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { Link, RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    submitting,
    editActivity,
    activity,
    loadActivity,
    clearActivity
  } = activityStore;

  useEffect(() => {
    if (match.params.id) {
      loadActivity(match.params.id).then(
        () => activity && setActivity(activity)
      );
    }
    return () => {
      clearActivity()
    }
  }, [loadActivity, clearActivity, match.params.id, activity]);

  const handleSubmit = () => {
    if (activityForm.id.length === 0) {
      let newActivity = {
        ...activityForm,
        id: uuid(),
      };
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
    } else {
      editActivity(activityForm).then(()=>history.push(`/activities/${activityForm.id}`));
    }
  };

  const [activityForm, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activityForm, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name="title"
          onChange={handleInputChange}
          placeholder="Title"
          value={activityForm.title}
        />
        <Form.TextArea
          rows={2}
          placeholder="Description"
          value={activityForm.description}
          name="description"
          onChange={handleInputChange}
        />
        <Form.Input
          name="category"
          onChange={handleInputChange}
          placeholder="Category"
          value={activityForm.category}
        />
        <Form.Input
          name="date"
          onChange={handleInputChange}
          type="Datetime-local"
          placeholder="Date"
          value={activityForm.date}
        />
        <Form.Input
          name="city"
          onChange={handleInputChange}
          placeholder="City"
          value={activityForm.city}
        />
        <Form.Input
          name="venue"
          onChange={handleInputChange}
          placeholder="Venue"
          value={activityForm.venue}
        />
        <Button
          loading={submitting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          as={Link} to={'/activities'}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
