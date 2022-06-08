import { LightningElement, wire, api } from 'lwc';
import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import STATUS_FIELD from '@salesforce/schema/TaskProject__c.Status__c';
import TASK_ID_FIELD from '@salesforce/schema/TaskProject__c.Id';
import INSERTHS_FIELD from '@salesforce/schema/TaskProject__c.InsertHs__c';

export default class WorkloadHours extends LightningElement {
    @api recordId;
    tasksByProject = []
    nonStartTask = []
    insertHs
    tasks

    @wire(getTaskByUser)
    wiredTasks(result){
        this.tasks = result
        const {data,error} = result
        if(data){
            for(const key in data){
                this.tasksByProject.push({value:data[key], key:key})
            }
            console.log('tasksByProject-->',this.tasksByProject);
        } else if(error){
            console.log(error)
        }
    }

   /*  onClickBegin(event){
        console.log('click');
        let taskId = event.currentTarget.dataset.id;

        const fields = {};
        fields[TASK_ID_FIELD.fieldApiName] = taskId;
        fields[STATUS_FIELD.fieldApiName] = 'In Progress';

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {       
                    refreshApex(this.tasks);                 
                })
    } */

    handleRegisterHours(event){
        let taskId = event.currentTarget.dataset.id
            
        const fields = {}
        fields[INSERTHS_FIELD.fieldApiName] = this.insertHs
        fields[TASK_ID_FIELD.fieldApiName] = taskId

        console.log('fields antes del Update-->',fields);

        const recordInput = {fields}

        console.log(('recordInput-->', recordInput));

        updateRecord(recordInput)
        .then(()=>{
            console.log('RegisterHs Updated!')
            refreshApex(this.tasks)           
        })
        .catch(error=>{
            console.log('ERROR-->', error)
        })
    }

    handleChage(event){
        this.insertHs = Number(event.target.value)
        console.log('insertHs-->', this.insertHs)
    }  
    
}