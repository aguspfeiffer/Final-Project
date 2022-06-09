import { LightningElement, track, wire, api } from 'lwc';

import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import { refreshApex } from'@salesforce/apex';

export default class assignResourses extends LightningElement {

    @api recordId; 
    projectLineItemList
    isProfitable

    @wire(getRolesByProject, {projectId:'$recordId'})
   wiredProjectLineItemList(result){
    this.projectLineItemList = result;
    const {data,error} = result
       if(data){
           console.log('ESTO ES DATA: ', data)
           this.isProfitable = data[0].Project__r.ActualTotalAmount__c
           console.log('ISPROFITABLE: ', this.isProfitable )
       } else if(error){
            console.log('ERROR-->', error)
       }
   }

    refresh(){
        refreshApex(this.projectLineItemList)
    }
}



