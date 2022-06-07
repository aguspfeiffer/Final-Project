import { LightningElement, wire, api } from 'lwc';
import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';

const columns = [
    { label: 'Task', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Estimated Hours', fieldName: 'EstimatedHours__c', type: 'number'},
    { label: 'Resgister Hours', fieldName: 'RegisterHours__c', type: 'number' },
    { label: 'Insert Hours', fieldName: 'RegisterHours__c', type: 'number', editable : true},
    {type: "button", typeAttributes: {
        label: 'Begin',
        name: 'Begin',
        title: 'Begin', 
        disabled: false,
        value: 'edit',
        iconPosition: 'left'
    }}]

export default class WorkloadHours extends LightningElement {
    @api recordId;
    tasksByProject = []
    nonStartTask = []
    columns = columns
    //@api objectApiName;


    @wire(getTaskByUser)
    wiredTasks({data,error}){
        if(data){
            for(let key in data){
                this.tasksByProject.push({value:data[key], key:key})
            }

        } else if(error){
            console.log(error)
        }
    }

    
}