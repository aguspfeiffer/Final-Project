import { LightningElement, wire, api } from 'lwc';
import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';

export default class WorkloadHours extends LightningElement {
    @api recordId;
    tasksByProject = []
    nonStartTask = []

    @wire(getTaskByUser)
    wiredTasks({data,error}){
        if(data){
            for(let key in data){
                this.tasksByProject.push({value:data[key], key:key})
            }
            console.log('tasksByProject-->',this.tasksByProject);
        } else if(error){
            console.log(error)
        }
    }

    handleRegisterHours(event){
        console.log('EVENT-->',JSON.stringify(event))
    }

    taskCompleted(event){
        console.log('EVENT taskCompleted', event)
    }
    
}