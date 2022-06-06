import getProjectResource from '@salesforce/apex/ProjectDataService.getProjectResource';
import { api, LightningElement, wire } from 'lwc';

const columns =[
    { label: 'Resource', fieldName: 'Name' },
    { label: 'StartDate', fieldName: 'StartDateResource__c', type: 'date-local'},
    { label: 'EndDate', fieldName: 'EndDateResource__c', type: 'date-local'}
]

export default class InfoResources extends LightningElement {

    @api recordId;
    columns = columns;

@wire(getProjectResource,{projectId:'$recordId'})
wiredPR
    

    
    

    
}