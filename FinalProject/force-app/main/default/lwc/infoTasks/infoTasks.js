import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';
import { LightningElement, wire } from 'lwc';

const columns = [
    {label: 'Name', fieldName:'Name'},
    {label: 'Project Name', fieldName:'Project_Name__c'},
    {label: 'Start Date', fieldName:'StartTask__c', type: 'date-local'},
    {label: 'End Date', fieldName:'EndTask__c', type: 'date-local'},  
]

export default class InfoTasks extends LightningElement {

    columns = columns;

    @wire(getTaskByUser)
    wiredTasks
}