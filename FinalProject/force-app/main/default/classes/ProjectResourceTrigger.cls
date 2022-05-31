public with sharing class ProjectResourceTrigger {

    //public class CustomException extends Exception{}

    public static void onBeforeInsert(List<ProjectResource__c> projectResourses){
        Map<Id, ProjectResource__c> newProjectResourceMap = new Map<Id, ProjectResource__c>();

        //Recorremos la lista que viene por parametro para crear nuestro Mapa newProjectResourceMap, Cada Key del mapa hace referencia a cada Usuario relacionado al NUEVO ProjectResource
        for(ProjectResource__c pr :projectResourses){
            newProjectResourceMap.put(pr.Resource__c, pr);
        }

        //Traemos de la DB los ProjectResource que ya tiene el usuario 
        List<ProjectResource__c> oldProjectResourcesList = [SELECT Id, StartDateResource__c, EndDateResource__c, Resource__c FROM ProjectResource__c WHERE Resource__c IN : newProjectResourceMap.keySet()];

        //Creamos un mapa para ordenar los PR que tiene un mismo usuario
        Map<Id, List<ProjectResource__c>> oldProjectResourceMap = new Map<Id, List<ProjectResource__c>>();

        //Recorremos la Lista oldProjectResourcesList y agregamos al mapa una Lista de PR por cada usuario
        for(ProjectResource__c pr :oldProjectResourcesList){
            if(oldProjectResourceMap.containsKey(pr.Resource__c)){
                oldProjectResourceMap.get(pr.Resource__c).add(pr);
            } else{
                oldProjectResourceMap.put(pr.Resource__c, new List<ProjectResource__c>{pr});
            }
        }    

        //Creamos una nueva lista con los Project Resource disponibles para insertar
        List<ProjectResource__c> readyForInsert = new List<ProjectResource__c>();

        //Recorremos los valores de OldProjectResourceMap que coinciden con los ID de los recursos y comparamos que las nuevas fechas asignadas para un nuevo registro de PR no se interpongan con las fechas de los proyectos asignados anteriormente
        for(Id key :newProjectResourceMap.keySet()){
            if(oldProjectResourceMap.containsKey(key)){
                for(ProjectResource__c pr :oldProjectResourceMap.get(key)){
                    if(newProjectResourceMap.get(key).StartDateResource__c < pr.StartDateResource__c && newProjectResourceMap.get(key).EndDateResource__c < pr.StartDateResource__c || newProjectResourceMap.get(key).StartDateResource__c > pr.EndDateResource__c && newProjectResourceMap.get(key).EndDateResource__c > pr.EndDateResource__c ){
                        readyForInsert.add(newProjectResourceMap.get(key));
                    } else{
                        newProjectResourceMap.get(key).addError('The resource ' + newProjectResourceMap.get(key).Name + ' is not available on these Dates');
                    }
                }
            }
        }        
    }
}