import { api, LightningElement, wire } from 'lwc';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';
import assignResource from '@salesforce/apex/ProjectDataService.assignResource'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
    newProjectResources = []
    draftValues
    
    @wire(getUsersByRole, {role:'$roles.Role__c', projectId:'$recordId'})
    wiredUsers ({error, data}){
        if(data){
            this.users = data
        }
        else if(error){
            console.log(error)
        }
    }

    handleSave(event){
        event.preventDefault()
        this.draftValues = event.detail.draftValues;

        for (let i = 0; i < this.draftValues.length; i++) {
            this.draftValues[i]['ProjecLineItem']= this.roles.Id

            this.newProjectResources.push({
                'Name': '',
                'Resource__c' : this.draftValues[i].Id,
                'StartDateResource__c' : this.draftValues[i].StartDateResource__c,
                'EndDateResource__c' : this.draftValues[i].EndDateResource__c,
                'SquadLead__c' : this.draftValues[i].SquadLead__c,
                'ProjectLineItem__c' : this.draftValues[i].ProjecLineItem
            })           
        }   

        assignResource({resourceToAssign : this.newProjectResources})
        .then(()=>{
            const event = new ShowToastEvent({
                title: 'Assigned!',
                message: 'Successfully Assigned ResourcesT',
                variant: 'succes'
                });
                this.dispatchEvent(event);
        })
        .catch(error=>{
            console.log('CATCH ERROR-->', error)
            const event = new ShowToastEvent({
                title: 'ERROR',
                message: error.body.pageErrors[0].message,
                variant: 'Error'
              });
              this.dispatchEvent(event);
        })
        .finally(() => {
            this.draftValues = []
        });
    }
}