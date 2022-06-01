import { LightningElement, wire, api } from 'lwc';
import getProjects from '@salesforce/apex/ProjectDataService.getProjects';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import getResoursesByUserId from '@salesforce/apex/ProjectDataService.getResoursesByUserId';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';

export default class Testeando extends LightningElement {

    @api recordId
    //projects
    //resourses
    projectLineItems
    //usersRoles
    roles = {}

    columns = [
        { label: 'Resource', fieldName: 'Resource__r.Name', editable: false },
        { label: 'Rate Per Hour', fieldName: 'Resource__r.RatePerHour__c', editable: false },
        { label: 'StartDateResource', fieldName: 'StartDateResource__c', type: 'date', editable: true },
        { label: 'EndDateResource', fieldName: 'EndDateResource__c', type: 'date', editable: true },
    ]

 
    /* @wire(getProjects)
    wiredProjects({error , data}){
        if(data){   
            this.projects = data;
            console.log('PROJECTS-->', data);
        }
        else if (error){}
    } */
    
    @wire(getRolesByProject, {projectId : '$recordId'})
    wiredProles({data, error}){
        if(data){
            this.projectLineItems = data;
            this.projectLineItems.map(pr=>{
                this.roles.put(pr.Role__c, getUsersByRole(pr.Role__c)
                .then(res))
            })
            console.log('ROLES ARRAY-->', this.roles);
            console.log('PROJECTLINEITEMS-->', JSON.stringify(data));
        }
        else if(error){
            console.log('ERROR-->', error);
        }
    }

    /* @wire(getUsersByRole, {role : 'Developer'})
    wiredroles({data, error}){
        if(data){
            this.userRoles = data;
            console.log('Roles: '+JSON.stringify(data));
        }
        else if(error){
            console.log(error)
        }
    } */

     /* @wire(getResoursesByUserId, {userId : '0058a00000LoNMEAA3'})
    wiredResourses({data, error}){
        if(data){
            this.resourses = data;
            console.log('ProjectResourses: '+ JSON.stringify(data));
        }
        else if(error){}
    } */

    
}