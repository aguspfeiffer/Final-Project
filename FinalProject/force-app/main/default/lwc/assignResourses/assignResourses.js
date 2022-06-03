import { LightningElement, track, wire, api } from 'lwc';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';


export default class assignResourses extends LightningElement {

    @api recordId; 

    projectLineItemList;    

    @wire(getRolesByProject, {projectId:'$recordId'})
    wiredProjects({error , data}){
        if(data){
            this.projectLineItemList= data;
        }
        else if (error){

        }
    }
}