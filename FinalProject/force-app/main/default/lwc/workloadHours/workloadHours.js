import { LightningElement, wire, api } from 'lwc';
import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getFieldDisplayValue, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import STATUS_FIELD from '@salesforce/schema/TaskProject__c.Status__c';
import TASK_ID_FIELD from '@salesforce/schema/TaskProject__c.Id';
import REGISTERHS_FIELD from '@salesforce/schema/TaskProject__c.RegisterHours__c';

export default class WorkloadHours extends LightningElement {
    @api recordId;
    tasksByProject = []
    insertHs
    tasks

    @wire(getTaskByUser)
    wiredTasks(result){
        this.tasks = result
        console.log('RESULT--->', result)
        const {data,error} = result
        if(data){
            for(const projectName in data){
                this.tasksByProject.push({projectName:projectName, tasks:data[projectName]})
            }
            console.log('tasksByProject-->',this.tasksByProject);
        } else if(error){
            console.log(error)
        }
    }

    onClickBegin(event){
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
    }

    handleRegisterHours(event){
        let taskId = event.currentTarget.dataset.id;
        let registerhs = event.currentTarget.dataset.registerhs;
        let task = event.currentTarget.dataset.task;
        console.log('registerhs-->', JSON.stringify(registerhs));
        console.log('TASK-->', JSON.stringify(task));
        const oldRegisterHs = getFieldDisplayValue(task, REGISTERHS_FIELD);
        console.log('OLDregisterHR-->', JSON.stringify(oldRegisterHs) );
            
        const fields = {}
        fields[REGISTERHS_FIELD.fieldApiName] = this.insertHs;
        fields[TASK_ID_FIELD.fieldApiName] = taskId;

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

    handleChange(event){
        this.insertHs = Number(event.target.value)
        console.log('insertHs-->', this.insertHs)
    }  
    
}