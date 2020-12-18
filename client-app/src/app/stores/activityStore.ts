import { makeAutoObservable, runInAction, configure } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: 'always' });

class ActivityStore {
    activityRegistry = new Map();
    activities: IActivity[] = [];
    loadingInitial = false;
    selectedActivity: IActivity | undefined;
    editMode = false;
    submitting = false;
    target = '';

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date)).reverse();
    }

    loadAcitivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            })
        }
    }

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            })
        }
    }

    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
        }
    }

    openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    cancelFormOpen = () => {
        this.editMode = false;
    }

    constructor() {
        makeAutoObservable(this);
    }
}

export default createContext(new ActivityStore());