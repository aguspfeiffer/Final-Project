import { LightningElement, wire } from 'lwc';
import getProjects from '@salesforce/apex/ProjectDataService.getProjects';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import getResoursesByUserId from '@salesforce/apex/ProjectDataService.getResoursesByUserId';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';

export default class Testeando extends LightningElement {

    projects
    resourses
    projectRoles
    usersRoles

    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'Project Manager', fieldName: 'PM__c'},
        {label: 'Start Project', fieldName: 'StartProject__c'},
        {label: 'End Project', fieldName: 'EndProject__c'},
        {label: 'Amount Opp', fieldName: 'AmountOpp__c', type: 'currency'},
        {label: 'Total Hours', fieldName: 'QuantityTotalHours__c', type: 'number'},
        {label: 'Status', fieldName: 'Status__c'},
        {label: 'Customer', fieldName: 'Customer__c'}
    ]

    @wire(getProjects)
    wiredProjects({error , data}){
        if(data){
            this.projects = data;
        }
        else if (error){}
    }

    @wire(getResoursesByUserId, {userId : '0058a00000LoNMEAA3'})
    wiredResourses({data, error}){
        if(data){
            this.resourses = data;
            console.log('ProjectResourses: '+ JSON.stringify(data));
        }
        else if(error){}
    }

    @wire(getUsersByRole, {role : 'Developer'})
    wiredroles({data, error}){
        if(data){
            this.userRoles = data;
            console.log('Roles: '+JSON.stringify(data));
        }
        else if(error){
            console.log(error)
        }
    }

    @wire(getRolesByProject, {projectId : 'a038a00000Qp2PhAAJ'})
    wiredProles({data, error}){
        if(data){
            this.projectRoles = data;
            console.log('Project Roles: '+JSON.stringify(data));
        }
        else if(error){}
    }
}