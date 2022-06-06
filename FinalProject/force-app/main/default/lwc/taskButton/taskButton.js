import { LightningElement } from 'lwc';
import TASK_DESCRIPTION from '@salesforce/schema/TaskProject__c.Description__c';
import TASK_RESUME from '@salesforce/schema/TaskProject__c.Resume__c';
import RESOURCE from '@salesforce/schema/TaskProject__c.ProjectResource__c'
import START_TASK from '@salesforce/schema/TaskProject__c.StartTask__c';
import END_TASK from '@salesforce/schema/TaskProject__c.EndTask__c'

export default class TaskButton extends LightningElement {


    fields = [TASK_DESCRIPTION, TASK_RESUME, START_TASK, END_TASK, RESOURCE];

    createRecord(){
        
    }
}