import React, { FormEvent, useContext, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

interface IProps {
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({
  activity,
}) => {
  const activityStore = useContext(ActivityStore);
  const {createActivity,submitting,editActivity,cancelFormOpen} = activityStore;
  const initializeForm = () => {
    if (activity) {
      return activity;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const handleSubmit = () => {
    if (activityForm.id.length === 0) {
      let newActivity = {
        ...activityForm,
        id: uuid(),
      };
      createActivity(newActivity);
    } else {
      editActivity(activityForm);
    }
  };

  const [activityForm, setActivity] = useState<IActivity>(initializeForm);

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
          onClick={cancelFormOpen}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);