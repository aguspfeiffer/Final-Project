import getTaskByUser from '@salesforce/apex/ProjectDataService.getTaskByUser';
import { LightningElement, wire } from 'lwc';

export default class WorkloadHours extends LightningElement {

    @wire(getTaskByUser)
    wiredTask({error, data}){
        if(data){
            console.log(data)
        }
    }
}