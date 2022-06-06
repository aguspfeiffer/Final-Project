public with sharing class ProjectDataService {
   
    //Obtiene los projectLineItem de un project 
    @AuraEnabled(cacheable = true)
    public static List<ProjectLineItem__c> getRolesByProject (String projectId){
        return [SELECT Id, Role__c, QuantityHours__c, Project__c, AssignedHours__c, ActualTotalHours__c FROM ProjectLineItem__c WHERE Project__c =: projectId];
    }
    
    @AuraEnabled(cacheable = true)
    public static List<Object> getProjectResource(String projectId){
        
        List<ProjectLineItem__c> PLI = [SELECT Id, Project__c FROM ProjectLineItem__c WHERE Project__c =: projectId];
        
        return [SELECT Name, StartDateResource__c, EndDateResource__c, ProjectLineItem__c FROM ProjectResource__c WHERE ProjectLineItem__c IN : PLI ];
    }

    //Obtiene los usuarios de x Rol
    @AuraEnabled(cacheable = true)
    public static List<User> getUsersByRole (String role, String projectId){
        Boolean assign = true;
        //Buscamos en la DB el proyecto actual
        Project__c project =[SELECT Id, Name, StartProject__c, EndProject__c FROM Project__c WHERE Id =: projectId];
       
        Date startProject = project.StartProject__c;
        Date endProject = project.EndProject__c;
        
        //Buscamos en la DB todos los usuarios con un mismo rol
        List<User> usersListByRole =[SELECT Id, Name, UserRole.Name, RatePerHour__c, ( SELECT StartDateResource__c, EndDateResource__c, ProjectLineItem__r.Project__c FROM ProjectResources__r WHERE  (StartDateResource__c >=:startProject AND StartDateResource__c <=: endProject) OR (EndDateResource__c >=:startProject AND EndDateResource__c <=: endProject )) FROM User WHERE UserRole.Name =: role ];

        //Creamos una List para popular los usuarios disponibles para el proyecto
        List<User> availableUsers = new List<User>();
        //Filtramos los usuarios y populamos la lista
        for(User user : usersListByRole){
            if(user.ProjectResources__r.isEmpty()){
                availableUsers.add(user);
            } else {
                for(ProjectResource__c pr : user.ProjectResources__r){
                if(pr.ProjectLineItem__r.Project__c != project.Id){
                    assign = false;
                }
            }
            if(assign){
                availableUsers.add(user);
            }
            }
        }   
        return availableUsers;
    }  
    
    @AuraEnabled(cacheable = true)
    public static List<TaskProject__c> getTaskByUser (){
        return [SELECT Description__c, Status__c, EstimatedHours__c, RegisterHours__c, ProjectResource__r.Resource__c, Project__c FROM TaskProject__c WHERE ProjectResource__r.Resource__c =: UserInfo.getUserId() ];
    }
    
    @AuraEnabled
    public static void assignResource (List<ProjectResource__c> resourceToAssign){
     
        insert resourceToAssign;
    }
    
}