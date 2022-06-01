import { LightningElement, track, wire, api } from 'lwc';
import getRolesByProject from '@salesforce/apex/ProjectDataService.getRolesByProject';
import getUsersByRole from '@salesforce/apex/ProjectDataService.getUsersByRole';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class assignResourses extends LightningElement {

    @api recordId; 

    projectLineItem;
    

    @wire(getRolesByProject, {projectId:'$recordId'})
    wiredProjects({error , data}){
        if(data){
            this.projectLineItem= data;
            console.log('WRAPER: ', data)
        }
        else if (error){}
    }

    // @wire(getUsersByRole, {role: 'Developer'})
    // wrapperUsers ({error, data}){
    //     if(data){
    //         this.users = data
    //         console.log('Users: ' + data)
    //     }
    //     else if(error){
    //         console.log('Error: '+ JSON.stringify(error))
    //     }
    // }

    // handleSubmit(event){
    //     event.preventDefault() //frenamos el envío del form
    //     const fields = event.detail.fields;
    //     fields.start =  this.start;
    //     fields.end = this.end;
    //     this.template.querySelector('lightning-datatable').submit(fields);
    // }

    // handleSuccess(event){
    //     const blockDays = event.detail.id;
    //     console.log( 'dias bloqueados ', blockDays )
    //     this.dispatchEvent (new CustomEvent ( 'bloquearfecharecursos' ));
    //     const ev = new ShowToastEvent({
    //         title: 'Success',
    //         message: 'Fechas Asignadas Correctamente!',
    //         variant: 'success'
    //     });
    //    this.dispatchEvent(ev);
    // }
    // errorCallback (error, stack){
    //     this.error = error;
    //     console.error( 'Error: ', error )
    //     console.error( 'Stack' )
    // }
}