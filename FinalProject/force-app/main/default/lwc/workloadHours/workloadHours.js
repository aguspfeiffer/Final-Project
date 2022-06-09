import { LightningElement, wire, api, track } from 'lwc';
import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import STATUS_FIELD from '@salesforce/schema/TaskProject__c.Status__c';
import TASK_ID_FIELD from '@salesforce/schema/TaskProject__c.Id';
import REGISTERHS_FIELD from '@salesforce/schema/TaskProject__c.RegisterHours__c';

export default class WorkloadHours extends LightningElement {
    @api recordId;
    @track tasksByProject = []
    insertHs
    tasks

    @wire(getTaskByUser)
    wiredTasks(result){
        this.tasks = result
        const {data,error} = result

        if(data){
            for(const projectName in data){
                this.tasksByProject.push({projectName:projectName, tasks:data[projectName]})
            }  
        } else if(error){
            console.log(error)
        }
    }

    BeginTask(event){
        let taskId = event.currentTarget.dataset.id;
        let registerhs = Number(event.currentTarget.dataset.registerhs);

        const fields = {};
        fields[TASK_ID_FIELD.fieldApiName] = taskId;
        fields[STATUS_FIELD.fieldApiName] = 'In Progress';
        fields[REGISTERHS_FIELD.fieldApiName] = 0

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {       
                refreshApex(this.tasks);
                this.tasksByProject = [];
                const event = new ShowToastEvent({
                    title: 'Started Task!',
                    message: 'Successfully Started Task',
                    variant: 'success'
                    });
                    this.dispatchEvent(event);           
            }).catch(error=>{
                console.log('ERROR-->', error)
                const event = new ShowToastEvent({
                    title: 'ERROR',
                    message: error.body.pageErrors[0].message,
                    variant: 'Error'
                  });
                  this.dispatchEvent(event);
            })
    }

    CompletedTask(event){
        let taskId = event.currentTarget.dataset.id;

        const fields = {};
        fields[TASK_ID_FIELD.fieldApiName] = taskId;
        fields[STATUS_FIELD.fieldApiName] = 'Completed';

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {       
                refreshApex(this.tasks);
                this.tasksByProject = [];  
                const event = new ShowToastEvent({
                    title: 'Completed Task!',
                    message: 'Successfully Completed Task',
                    variant: 'success'
                    });
                    this.dispatchEvent(event);               
            }).catch(error=>{
                console.log('ERROR-->', error);
                const event = new ShowToastEvent({
                    title: 'ERROR',
                    message: error.body.pageErrors[0].message,
                    variant: 'Error'
                  });
                  this.dispatchEvent(event);
            })
    }

    handleRegisterHours(event){
        let taskId = event.currentTarget.dataset.id;
        let registerhs = Number(event.currentTarget.dataset.registerhs);

        const fields = {}
        fields[TASK_ID_FIELD.fieldApiName] = taskId;
        fields[REGISTERHS_FIELD.fieldApiName] = registerhs + this.insertHs;

        const recordInput = {fields}

        updateRecord(recordInput)
        .then(()=>{
            console.log('RegisterHs Updated!')
            refreshApex(this.tasks);
            this.tasksByProject = [];
            const event = new ShowToastEvent({
                title: 'Charged Hours!',
                message: 'The hours has been Charged',
                variant: 'success'
                });
                this.dispatchEvent(event);      
        })
        .catch(error=>{
            console.log('ERROR-->', error);
            const event = new ShowToastEvent({
                title: 'ERROR',
                message: error.body.pageErrors[0].message,
                variant: 'Error'
              });
              this.dispatchEvent(event);
        })
    }

    handleChange(event){
        this.insertHs = Number(event.target.value)
        console.log('insertHs-->', this.insertHs)
    }  
    
}