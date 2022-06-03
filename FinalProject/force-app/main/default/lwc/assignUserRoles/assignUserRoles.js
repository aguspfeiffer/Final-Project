import { api, LightningElement, wire } from 'lwc';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';
import assignResource from '@salesforce/apex/ProjectDataService.assignResource'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from'@salesforce/apex';

const columns = [
    { label: 'Resource', fieldName: 'Name' },
    { label: 'Rate Per Hour', fieldName: 'RatePerHour__c', type: 'currency' },
    { label: 'StartDate', fieldName: 'StartDateResource__c', type: 'date-local', editable : true },
    { label: 'EndDate', fieldName: 'EndDateResource__c', type: 'date-local', editable : true },
    { label: 'SquadLead', fieldName: 'SquadLead__c', type: 'boolean', editable: true}
];

export default class AssignUserRoles extends LightningElement {

    columns = columns;
    @api rolesToCover;
    @api recordId;
    newProjectResources = []
    changedFields = []
    
    @wire(getUsersByRole, {role:'$rolesToCover.Role__c', projectId:'$recordId'})
    users

    handleSave(event){
        event.preventDefault()
        this.changedFields = event.detail.draftValues;

        for (let i = 0; i < this.changedFields.length; i++) {
            this.changedFields[i]['ProjecLineItem']= this.rolesToCover.Id

            this.newProjectResources.push({
                'Name': '',
                'Resource__c' : this.changedFields[i].Id,
                'StartDateResource__c' : this.changedFields[i].StartDateResource__c,
                'EndDateResource__c' : this.changedFields[i].EndDateResource__c,
                'SquadLead__c' : this.changedFields[i].SquadLead__c,
                'ProjectLineItem__c' : this.changedFields[i].ProjecLineItem
            })           
        }   

        assignResource({resourceToAssign : this.newProjectResources})
        .then(()=>{
            const event = new ShowToastEvent({
                title: 'Assigned!',
                message: 'Successfully Assigned Resources',
                variant: 'success'
                });
                this.dispatchEvent(event);
                this.template.querySelector("lightning-datatable").draftValues = [];
                const actualTotalHours = new CustomEvent('actualtotalhours')
                this.dispatchEvent(actualTotalHours)            
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
            this.changedFields = []
            refreshApex(this.users);            
        });
    }
}