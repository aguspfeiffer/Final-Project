import { api, LightningElement, wire } from 'lwc';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';


const columns = [
    { label: 'Resource', fieldName: 'Name' },
    { label: 'Rate Per Hour', fieldName: 'RatePerHour__c', type: 'currency' },
    { label: 'StartDate', fieldName: 'StartDateResource__c', type: 'date', editable : true },
    { label: 'EndDate', fieldName: 'EndDateResource__c', type: 'date', editable : true },
    { label: 'SquadLead', fieldName: 'SquadLead__c', type: 'boolean', editable: true}
];

export default class AssignUserRoles extends LightningElement {

    columns = columns;
    @api roles;
    @api recordId;
    users
    
    @wire(getUsersByRole, {role:'$roles', projectId:'$recordId'})
    wiredUsers ({error, data}){
        if(data){
            this.users = data
            console.log('USERS-->', this.users);
        }
        else if(error){
            console.log(error)
        }
    }

    handleSave(event){
        console.log('DraftValues-->', JSON.stringify(event.detail.draftValues));
    }
}