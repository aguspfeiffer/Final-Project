import { LightningElement, track, wire, api } from 'lwc';
import getProjects from '@salesforce/apex/ProjectDataService.getProjects';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import getResoursesByUserId from '@salesforce/apex/ProjectDataService.getResoursesByUserId';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class AlocacionTest extends LightningElement {

   @track showSpinner= true;    
    projects
    resourses
    wraperProject
    usersRoles

    totalHours
    users
    @api recordId; 
    projectId

    
      
    handleLoad (event) {
        this.showSpinner = false;

    }

  

    @wire(getRolesByProject, {projectId:'$recordId'})
    wiredProjects({error , data}){
        if(data){
            this.wraperProject= data;
            console.log('WRAPER: ', data)
        }
        else if (error){}
    }

    @wire(getResoursesByUserId, {userId : '0058a00000Kgt6gAAB'})
    wiredResourses({data, error}){
        if(data){
            this.resourses = data;
            /* console.log('ProjectResourses: '+ JSON.stringify(data)); */
        }
        else if(error){}
    }

      handleSubmit(event){
        event.preventDefault() //frenamos el envío del form
        const fields = event.detail.fields;
        fields.start =  this.start;
        fields.end = this.end;
        this.template.querySelector('lightning-datatable').submit(fields);
    }

    handleSuccess(event){
        const blockDays = event.detail.id;
        console.log( 'dias bloqueados ', blockDays )
        this.dispatchEvent (new CustomEvent ( 'bloquearfecharecursos' ));
        const ev = new ShowToastEvent({
            title: 'Success',
            message: 'Fechas Asignadas Correctamente!',
            variant: 'success'
        });
       this.dispatchEvent(ev);
    }
    errorCallback (error, stack){
        this.error = error;
        console.error( 'Error: ', error )
        console.error( 'Stack' )
    }
}