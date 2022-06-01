import { api, LightningElement, wire } from 'lwc';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';

export default class AssignUserRoles extends LightningElement {

    @api 
    roles;
    users
    
    @wire(getUsersByRole, {role: '$roles'})
    wiredUsers ({error, data}){
        if(data){
            this.users = data
            console.log('Users: ' + data)
        }
        else if(error){}
    }
}