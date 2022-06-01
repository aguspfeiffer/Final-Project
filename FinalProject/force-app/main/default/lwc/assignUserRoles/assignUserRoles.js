import { api, LightningElement, wire } from 'lwc';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';

export default class AssignUserRoles extends LightningElement {

    @api 
    roles;
    @api recordId;
    
    users
    
    @wire(getUsersByRole, {role:'$roles', projectId:'$recordId'})
    wiredUsers ({error, data}){
        if(data){
            this.users = data
            console.log('Users: ' + JSON.stringify(data))
        }
        else if(error){
            console.log(error)
        }
    }
}