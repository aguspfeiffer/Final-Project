import { LightningElement, track, wire, api } from 'lwc';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import { refreshApex } from'@salesforce/apex';

export default class assignResourses extends LightningElement {

    @api recordId; 
 

    @wire(getRolesByProject, {projectId:'$recordId'})
    projectLineItemList
     

    refresh(){
        refreshApex(this.projectLineItemList)
    }
}